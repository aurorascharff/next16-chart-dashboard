import 'server-only';

import { cookies } from 'next/headers';
import { cache } from 'react';

export const getRevenueGoal = cache(async () => {
  const cookieStore = await cookies();
  const raw = cookieStore.get('revenue-goal')?.value;
  return raw ? Number(raw) : null;
});
