'use client';

import { createContext, use } from 'react';
import type { User } from '@/data/queries/user';

const AuthContext = createContext<Promise<User> | null>(null);

export function AuthProvider({ children, value }: { children: React.ReactNode; value: Promise<User> }) {
  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useCurrentUser(): User {
  const promise = use(AuthContext);
  if (!promise) {
    throw new Error('useCurrentUser must be used within an AuthProvider');
  }
  return use(promise);
}
