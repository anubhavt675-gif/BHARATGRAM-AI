import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthService } from '../services/apiService';

interface AuthContextType {
  user: any | null;
  login: (credentials: any) => Promise<void>;
  signup: (userData: any) => Promise<void>;
  guestLogin: () => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('bharatgram_user');
    if (savedUser) setUser(JSON.parse(savedUser));
    setIsLoading(false);
  }, []);

  const login = async (credentials: any) => {
    try {
      const { data } = await AuthService.login(credentials);
      setUser(data.user);
      localStorage.setItem('bharatgram_token', data.token);
      localStorage.setItem('bharatgram_user', JSON.stringify(data.user));
    } catch (error) {
      console.error('Login Failed', error);
      throw error;
    }
  };

  const guestLogin = () => {
    const demoUser = {
      id: 'demo_user_123',
      username: 'bharat_guest',
      fullName: 'Atithi Devo Bhava',
      avatar: 'https://picsum.photos/id/64/200/200',
      bio: 'Exploring Bharatgram in Demo Mode! 🇮🇳',
      followers: 1200,
      following: 450,
      posts: 12
    };
    setUser(demoUser);
    localStorage.setItem('bharatgram_token', 'demo_token_xyz');
    localStorage.setItem('bharatgram_user', JSON.stringify(demoUser));
  };

  const signup = async (userData: any) => {
    try {
      const { data } = await AuthService.signup(userData);
      // In production, we wait for OTP. In this flow we just handle the redirection in the component.
    } catch (error) {
      console.error('Signup Failed', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('bharatgram_user');
    localStorage.removeItem('bharatgram_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, guestLogin, logout, isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
