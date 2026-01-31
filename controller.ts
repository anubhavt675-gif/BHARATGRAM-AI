import { User, Post, Chat, Message, Notification } from './models';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'desi_secret_key';

// Mock OTP sender (Log to console)
const sendOtpToPhone = (phone: string, otp: string) => {
  console.log(`[SIMULATION] Sending OTP ${otp} to Indian phone number ${phone} via Bharatgram SMS Gateway...`);
};

export const AuthController = {
  signup: async (req: any, res: any) => {
    try {
      const { username, fullName, email, password, phone } = req.body;
      // Fix: corrected typo in variable name to match usage below
      const hashedPassword = await bcrypt.hash(password, 10);
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

      const user = await User.create({ 
        username, fullName, email, phone,
        password: hashedPassword, otp, otpExpires, isVerified: false 
      });

      sendOtpToPhone(phone || email, otp);
      res.status(201).json({ message: "Verification OTP sent!", userId: user._id });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  login: async (req: any, res: any) => {
    try {
      const { emailOrPhone, password } = req.body;
      const user = await User.findOne({
        $or: [{ email: emailOrPhone }, { phone: emailOrPhone }, { username: emailOrPhone }]
      });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '30d' });
      res.json({ user, token });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  verifyOtp: async (req: any, res: any) => {
    try {
      const { userId, otp } = req.body;
      const user = await User.findById(userId);
      if (!user || user.otp !== otp) return res.status(400).json({ error: 'Invalid OTP' });
      user.isVerified = true;
      user.otp = undefined;
      await user.save();
      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '30d' });
      res.json({ message: "Success", user, token });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
};

export const PostController = {
  getFeed: async (req: any, res: any) => {
    try {
      const posts = await Post.find()
        .populate('user', 'username avatar isVerified')
        .sort('-createdAt')
        .limit(20);
      res.json(posts);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },

  createPost: async (req: any, res: any) => {
    try {
      const post = await Post.create({ ...req.body, user: req.userId });
      res.status(201).json(post);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
};

export const ChatController = {
  getChats: async (req: any, res: any) => {
    try {
      const chats = await Chat.find({ participants: req.userId })
        .populate('participants', 'username avatar fullName')
        .sort('-updatedAt');
      res.json(chats);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },

  initiateChat: async (req: any, res: any) => {
    try {
      const { recipientId } = req.body;
      let chat = await Chat.findOne({
        participants: { $all: [req.userId, recipientId] }
      });

      if (!chat) {
        chat = await Chat.create({
          participants: [req.userId, recipientId],
          lastMessage: "Starting a new Desi conversation..."
        });
      }
      res.json(chat);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
};

export const MessageController = {
  getMessages: async (req: any, res: any) => {
    try {
      const messages = await Message.find({ chat: req.params.chatId })
        .sort('createdAt')
        .limit(50);
      res.json(messages);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
};

export const UserController = {
  getProfile: async (req: any, res: any) => {
    try {
      const user = await User.findById(req.params.id || req.userId);
      const posts = await Post.find({ user: user?._id }).sort('-createdAt');
      res.json({ user, posts });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
};

export const NotificationController = {
  getNotifications: async (req: any, res: any) => {
    try {
      const notifications = await Notification.find({ recipient: req.userId })
        .populate('sender', 'username avatar')
        .sort('-createdAt');
      res.json(notifications);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
};
