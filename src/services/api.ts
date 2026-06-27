// ─── Base API Service (Supabase-ready) ──────────────────────────────────────
// To connect Supabase, replace the mock implementations below with:
//   import { createClient } from '@supabase/supabase-js';
//   const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
};

export function simulateDelay(ms = 400): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export class ApiError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}
