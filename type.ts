export interface User {
  id: string;
  username: string;
  fullName: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  posts: number;
  isVerified?: boolean;
}

export interface Post {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  imageUrl: string;
  caption: string;
  likes: number;
  comments: number;
  location?: string;
  timestamp: string;
  isLiked?: boolean;
  type: 'image' | 'video' | 'reel';
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export interface Chat {
  id: string;
  participants: User[];
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}
