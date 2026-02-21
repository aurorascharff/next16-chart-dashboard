import { cache } from 'react';
import { slow } from '@/utils/slow';

export type User = {
  id: string;
  name: string;
  email: string;
  branch: string;
  role: string;
};

export const getCurrentUser = cache(async (): Promise<User> => {
  await slow(500);

  return {
    branch: 'Oslo HQ',
    email: 'aurora@acme.com',
    id: '1',
    name: 'Aurora Scharff',
    role: 'Branch Manager',
  };
});
