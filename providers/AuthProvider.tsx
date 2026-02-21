'use client';

import { createContext, use } from 'react';
import type { User } from '@/data/queries/user';

const AuthContext = createContext<Promise<User | null> | null>(null);

export function AuthProvider({ children, value }: { children: React.ReactNode; value: Promise<User | null> }) {
  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useCurrentUser(): User | null {
  const promise = use(AuthContext);
  if (!promise) {
    throw new Error('useCurrentUser must be used within an AuthProvider');
  }
  return use(promise);
}
