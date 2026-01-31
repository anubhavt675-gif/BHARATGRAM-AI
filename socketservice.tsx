import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.VITE_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  private socket: Socket | null = null;

  connect(userId: string) {
    if (this.socket?.connected) return;
    
    this.socket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('✅ Connected to Bharatgram Real-Time Engine');
      this.socket?.emit('register', userId);
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Socket Connection Error:', error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  sendMessage(chatId: string, recipientId: string, text: string, senderId: string) {
    this.socket?.emit('send_message', { chatId, recipientId, text, senderId });
  }

  onMessage(callback: (data: any) => void) {
    this.socket?.on('receive_message', callback);
  }

  // Typing logic
  emitTyping(chatId: string, recipientId: string, isTyping: boolean) {
    this.socket?.emit(isTyping ? 'typing_start' : 'typing_stop', { chatId, recipientId });
  }

  onTyping(callback: (data: { chatId: string, isTyping: boolean }) => void) {
    this.socket?.on('user_typing', callback);
  }

  // WebRTC logic
  emitCall(to: string, from: string, name: string, offer: any) {
    this.socket?.emit('call_user', { to, from, name, offer });
  }

  emitAnswer(to: string, answer: any) {
    this.socket?.emit('answer_call', { to, answer });
  }

  emitIceCandidate(to: string, candidate: any) {
    this.socket?.emit('ice_candidate', { to, candidate });
  }

  emitEndCall(to: string) {
    this.socket?.emit('end_call', { to });
  }

  onIncomingCall(callback: (data: any) => void) {
    this.socket?.on('incoming_call', callback);
  }

  onCallAccepted(callback: (data: any) => void) {
    this.socket?.on('call_accepted', callback);
  }

  onIceCandidate(callback: (data: any) => void) {
    this.socket?.on('ice_candidate', callback);
  }

  onCallEnded(callback: () => void) {
    this.socket?.on('call_ended', callback);
  }
}

export const socketService = new SocketService();
