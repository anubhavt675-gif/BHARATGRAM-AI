import axios from 'axios';

const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('bharatgram_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('bharatgram_token');
      localStorage.removeItem('bharatgram_user');
      window.location.href = '#/login';
    }
    return Promise.reject(error);
  }
);

export const PostService = {
  getFeed: () => apiClient.get('/posts/feed'),
  createPost: (postData: any) => apiClient.post('/posts/create', postData),
  toggleLike: (postId: string) => apiClient.post(`/posts/${postId}/like`),
  addComment: (postId: string, text: string) => apiClient.post(`/posts/${postId}/comment`, { text })
};

export const AuthService = {
  login: (credentials: { emailOrPhone: string; password: string }) => 
    apiClient.post('/auth/login', credentials),
  signup: (userData: any) => 
    apiClient.post('/auth/signup', userData),
  verifyOtp: (data: { userId: string; otp: string }) => 
    apiClient.post('/auth/verify-otp', data),
  resendOtp: (data: { userId: string }) => 
    apiClient.post('/auth/resend-otp', data)
};

export const UserService = {
  getProfile: (userId?: string) => apiClient.get(`/users/profile${userId ? '/' + userId : ''}`),
  followUser: (userId: string) => apiClient.post(`/users/${userId}/follow`),
};

export const NotificationController = {
  getNotifications: () => apiClient.get('/notifications'),
};

export const ChatService = {
  getChats: () => apiClient.get('/chats'),
  getMessages: (chatId: string) => apiClient.get(`/chats/${chatId}/messages`),
  initiateChat: (recipientId: string) => apiClient.post('/chats/initiate', { recipientId })
};

export default apiClient;
