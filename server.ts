import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import { connectDB } from './db';
import { Message, Chat, User } from './models';
import { AuthController, PostController, ChatController, UserController, NotificationController, MessageController } from './controllers';

const app = express();
const server = http.createServer(app);
const io = new Server(server, { 
  cors: { origin: "*", methods: ["GET", "POST"] } 
});

// Initialize DB Connection
connectDB();

// Security & Middleware
// Fix: Use 'as any' to satisfy TypeScript's strict RequestHandler typing for external middleware
app.use(helmet() as any);
app.use(cors() as any);
app.use(express.json() as any);

// Rate Limiting for API Protection
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again in 15 minutes."
});
// Fix: Use 'as any' for rate limiter middleware compatibility
app.use('/api/', apiLimiter as any);

// JWT Middleware
const authMiddleware = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized: No token provided' });
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'desi_secret_key');
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// --- REST API ENDPOINTS ---
// Auth
app.post('/api/auth/signup', AuthController.signup);
app.post('/api/auth/login', AuthController.login);
app.post('/api/auth/verify-otp', AuthController.verifyOtp);

// Social Core
app.get('/api/posts/feed', authMiddleware, PostController.getFeed);
app.post('/api/posts/create', authMiddleware, PostController.createPost);
app.get('/api/users/profile/:id?', authMiddleware, UserController.getProfile);

// Messaging Core
app.get('/api/chats', authMiddleware, ChatController.getChats);
app.get('/api/chats/:chatId/messages', authMiddleware, MessageController.getMessages);
app.post('/api/chats/initiate', authMiddleware, ChatController.initiateChat);

// --- REAL-TIME ENGINE (SOCKET.IO) ---
const userSockets = new Map<string, string>(); // userId -> socketId

io.on('connection', (socket) => {
  console.log(`📡 New peer connected: ${socket.id}`);

  // User Registration
  socket.on('register', (userId) => {
    userSockets.set(userId, socket.id);
    console.log(`✅ User ${userId} is now online on socket ${socket.id}`);
    io.emit('user_status_change', { userId, status: 'online' });
  });

  // Persistent Real-time Messaging
  socket.on('send_message', async (data) => {
    try {
      const { chatId, recipientId, text, senderId } = data;
      
      // 1. Save to Database
      const newMessage = await Message.create({
        chat: chatId,
        sender: senderId,
        text: text
      });

      // 2. Update Chat Metadata
      await Chat.findByIdAndUpdate(chatId, { 
        lastMessage: text,
        updatedAt: new Date()
      });

      // 3. Relay to Recipient if online
      const recipientSocket = userSockets.get(recipientId);
      if (recipientSocket) {
        io.to(recipientSocket).emit('receive_message', {
          chatId,
          senderId,
          text,
          _id: newMessage._id,
          createdAt: newMessage.createdAt
        });
      }
    } catch (err) {
      console.error("❌ Message relay failed:", err);
    }
  });

  // WebRTC Signaling for Video & Voice Calls
  socket.on('call_user', (data) => {
    const { to, from, name, offer } = data;
    const recipientSocket = userSockets.get(to);
    if (recipientSocket) {
      console.log(`📞 Calling user ${to} from ${from}`);
      io.to(recipientSocket).emit('incoming_call', { from, offer, name });
    }
  });

  socket.on('answer_call', (data) => {
    const { to, answer } = data;
    const recipientSocket = userSockets.get(to);
    if (recipientSocket) {
      console.log(`🤙 Call answered by ${socket.id} for ${to}`);
      io.to(recipientSocket).emit('call_accepted', { answer });
    }
  });

  socket.on('ice_candidate', (data) => {
    const { to, candidate } = data;
    const recipientSocket = userSockets.get(to);
    if (recipientSocket) {
      io.to(recipientSocket).emit('ice_candidate', { candidate });
    }
  });

  socket.on('end_call', (data) => {
    const { to } = data;
    const recipientSocket = userSockets.get(to);
    if (recipientSocket) {
      io.to(recipientSocket).emit('call_ended');
    }
  });

  // Typing Indicators
  socket.on('typing_start', (data) => {
    const recipientSocket = userSockets.get(data.recipientId);
    if (recipientSocket) {
      io.to(recipientSocket).emit('user_typing', { chatId: data.chatId, isTyping: true });
    }
  });

  socket.on('typing_stop', (data) => {
    const recipientSocket = userSockets.get(data.recipientId);
    if (recipientSocket) {
      io.to(recipientSocket).emit('user_typing', { chatId: data.chatId, isTyping: false });
    }
  });

  socket.on('disconnect', () => {
    let disconnectedUserId = null;
    for (const [userId, socketId] of userSockets.entries()) {
      if (socketId === socket.id) {
        disconnectedUserId = userId;
        userSockets.delete(userId);
        break;
      }
    }
    if (disconnectedUserId) {
      console.log(`❌ User ${disconnectedUserId} went offline`);
      io.emit('user_status_change', { userId: disconnectedUserId, status: 'offline' });
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Bharatgram Server v1.0 running on http://localhost:${PORT}`);
});
