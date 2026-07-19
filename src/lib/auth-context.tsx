'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from './apiClient';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: any;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (name: string, email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => null,
  register: async () => null,
  logout: async () => {},
  refreshUser: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const data = await apiClient.get('/api/auth/me');
      setUser(data.user || null);
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await apiClient.post('/api/auth/login', { email, password });
      if (data.token) {
        localStorage.setItem('vestra_session_token', data.token);
      }
      setUser(data.user);
      toast.success(`Welcome back, ${data.user.name}!`);
      return data.user;
    } catch (error) {
      toast.error(error.message || 'Login failed');
      throw error;
    }
  };

  const register = async (name, email, password) => {
    try {
      const data = await apiClient.post('/api/auth/register', { name, email, password });
      // Automatically login user after registration
      return await login(email, password);
    } catch (error) {
      toast.error(error.message || 'Registration failed');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiClient.post('/api/auth/logout');
      localStorage.removeItem('vestra_session_token');
      setUser(null);
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Logout error');
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
