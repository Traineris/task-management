import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';
import { api } from '../api/apiClient';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => Promise<void>;
  updateUser: (updatedUser: User) => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('task_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('task_token');
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { showToast } = useToast();

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem('task_token', newToken);
    localStorage.setItem('task_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = async () => {
    try {
      if (token) {
        await api.post('/auth/logout');
      }
    } catch {
      // Abaikan error jaringan saat logout
    } finally {
      localStorage.removeItem('task_token');
      localStorage.removeItem('task_user');
      setToken(null);
      setUser(null);
      showToast('Sesi telah diakhiri. Anda berhasil logout.', 'info');
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('task_user', JSON.stringify(updatedUser));
  };

  const refreshProfile = async () => {
    if (!token) return;
    try {
      const res = await api.get<User>('/auth/me');
      if (res.success && res.data) {
        updateUser(res.data);
      }
    } catch (err) {
      console.error('Gagal mengambil profil terbaru:', err);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        await refreshProfile();
      }
      setIsLoading(false);
    };

    initAuth();

    const handleUnauthorized = () => {
      setToken(null);
      setUser(null);
      showToast('Sesi login Anda telah berakhir. Silakan login kembali.', 'error');
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        logout,
        updateUser,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
