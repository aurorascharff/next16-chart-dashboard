import { cookies } from 'next/headers';
import { unauthorized } from 'next/navigation';
import { cache } from 'react';
import { slow } from '@/utils/slow';

export type User = {
  id: string;
  name: string;
  email: string;
  branch: string;
  role: string;
};

export const getCurrentUser = cache(async (): Promise<User | null> => {
  await slow(500);
  await cookies();

  return {
    branch: 'Oslo HQ',
    email: 'aurora@acme.com',
    id: '1',
    name: 'Aurora Scharff',
    role: 'Branch Manager',
  };
});

export async function checkAuth(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    unauthorized();
  }
  return user;
}
