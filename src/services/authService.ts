import { simulateDelay } from './api';
import { mockUser } from '@/data/mock';
import type { User } from '@/types';

const ADMIN_CREDENTIALS = { email: 'admin@stockiq.com', password: 'admin123' };

const mockAdmin: User = {
  id: 'admin-001',
  name: 'Admin',
  email: 'admin@stockiq.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
  phone: '+1 (000) 000-0000',
  joinedAt: '2023-01-01',
  plan: 'Enterprise',
  role: 'admin',
  notifications: { email: true, push: true, priceAlerts: true, newsAlerts: true },
};

export async function login(email: string, _password: string): Promise<User> {
  await simulateDelay(800);
  if (!email) throw new Error('Email is required');
  return mockUser;
}

export async function loginAsAdmin(email: string, password: string): Promise<User> {
  await simulateDelay(800);
  if (email !== ADMIN_CREDENTIALS.email || password !== ADMIN_CREDENTIALS.password) {
    throw new Error('Invalid admin credentials');
  }
  return mockAdmin;
}

export async function signup(name: string, email: string, _password: string): Promise<User> {
  await simulateDelay(1000);
  return { ...mockUser, name, email, id: `u${Date.now()}` };
}

export async function logout(): Promise<void> {
  await simulateDelay(300);
}

export async function resetPassword(_email: string): Promise<void> {
  await simulateDelay(600);
}

export async function getCurrentUser(): Promise<User | null> {
  await simulateDelay(200);
  const stored = localStorage.getItem('mock_user');
  if (stored) return JSON.parse(stored) as User;
  return null;
}

export async function updateProfile(updates: Partial<User>): Promise<User> {
  await simulateDelay(500);
  return { ...mockUser, ...updates };
}
