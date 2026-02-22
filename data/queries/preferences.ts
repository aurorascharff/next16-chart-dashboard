import 'server-only';

import { cache } from 'react';
import { cookies } from 'next/headers';

export const getRevenueGoal = cache(async () => {
  const cookieStore = await cookies();
  const raw = cookieStore.get('revenue-goal')?.value;
  return raw ? Number(raw) : null;
});
