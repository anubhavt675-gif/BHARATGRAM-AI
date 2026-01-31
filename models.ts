import mongoose, { Schema } from 'mongoose';

// --- USER MODEL ---
const UserSchema = new Schema({
  username: { type: String, required: true, unique: true, index: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, unique: true, sparse: true }, // Added for OTP verification
  password: { type: String, required: true },
  avatar: { type: String, default: 'https://picsum.photos/id/64/200/200' },
  bio: { type: String, default: 'Proud Indian 🇮🇳' },
  followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  isVerified: { type: Boolean, default: false },
  otp: { type: String }, // For verification
  otpExpires: { type: Date },
}, { timestamps: true });

export const User = mongoose.model('User', UserSchema);

// --- POST MODEL ---
const PostSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  mediaUrl: { type: String, required: true },
  mediaType: { type: String, enum: ['image', 'video', 'reel'], default: 'image' },
  caption: { type: String },
  location: { type: String },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export const Post = mongoose.model('Post', PostSchema);

// --- NOTIFICATION MODEL ---
const NotificationSchema = new Schema({
  recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['like', 'comment', 'follow', 'mention'], required: true },
  post: { type: Schema.Types.ObjectId, ref: 'Post' },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

export const Notification = mongoose.model('Notification', NotificationSchema);

// --- CHAT MODEL ---
const ChatSchema = new Schema({
  participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  lastMessage: { type: String },
}, { timestamps: true });

export const Chat = mongoose.model('Chat', ChatSchema);

// --- MESSAGE MODEL ---
const MessageSchema = new Schema({
  chat: { type: Schema.Types.ObjectId, ref: 'Chat', required: true, index: true },
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  readBy: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

export const Message = mongoose.model('Message', MessageSchema);
