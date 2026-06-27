import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, AuthState } from '@/types';
import {
  login as loginService,
  signup as signupService,
  logout as logoutService,
  getCurrentUser,
  loginAsAdmin as loginAsAdminService,
} from '@/services/authService';
import { toast } from 'sonner';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  loginAsAdmin: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Check admin session first, then regular user
    const adminStored = localStorage.getItem('mock_admin');
    if (adminStored) {
      setState({ user: JSON.parse(adminStored) as User, isAuthenticated: true, isLoading: false });
      return;
    }
    getCurrentUser().then(user => {
      setState({ user, isAuthenticated: !!user, isLoading: false });
    });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setState(s => ({ ...s, isLoading: true }));
    try {
      const user = await loginService(email, password);
      localStorage.setItem('mock_user', JSON.stringify(user));
      setState({ user, isAuthenticated: true, isLoading: false });
      toast.success('Welcome back, ' + user.name + '!');
    } catch (err) {
      setState(s => ({ ...s, isLoading: false }));
      toast.error('Login failed. Please try again.');
      throw err;
    }
  }, []);

  const loginAsAdmin = useCallback(async (email: string, password: string) => {
    setState(s => ({ ...s, isLoading: true }));
    try {
      const user = await loginAsAdminService(email, password);
      localStorage.setItem('mock_admin', JSON.stringify(user));
      setState({ user, isAuthenticated: true, isLoading: false });
      toast.success('Admin access granted. Welcome, ' + user.name + '!');
    } catch (err) {
      setState(s => ({ ...s, isLoading: false }));
      toast.error('Invalid admin credentials.');
      throw err;
    }
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    setState(s => ({ ...s, isLoading: true }));
    try {
      const user = await signupService(name, email, password);
      localStorage.setItem('mock_user', JSON.stringify(user));
      setState({ user, isAuthenticated: true, isLoading: false });
      toast.success('Account created! Welcome, ' + user.name + '!');
    } catch (err) {
      setState(s => ({ ...s, isLoading: false }));
      toast.error('Signup failed. Please try again.');
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    await logoutService();
    localStorage.removeItem('mock_user');
    localStorage.removeItem('mock_admin');
    setState({ user: null, isAuthenticated: false, isLoading: false });
    toast.success('Logged out successfully');
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, loginAsAdmin, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
