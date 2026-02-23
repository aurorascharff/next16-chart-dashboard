'use server';

import { cookies } from 'next/headers';

export async function saveRevenueGoal(value: string) {
  const cookieStore = await cookies();
  const numValue = value.trim() ? Number(value) : null;
  if (numValue != null && !Number.isNaN(numValue)) {
    cookieStore.set('revenue-goal', String(numValue), { maxAge: 60 * 60 * 24 * 365 });
  } else {
    cookieStore.delete('revenue-goal');
  }
}
