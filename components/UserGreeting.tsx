'use client';

import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useCurrentUser } from '@/providers/AuthProvider';

export function UserGreeting() {
  const user = useCurrentUser();
  const greeting = useTimeOfDayGreeting();

  return (
    <p className="text-muted-foreground">
      {greeting ?? 'Welcome'}, {user?.name} — {user?.role} · {user?.branch}
    </p>
  );
}

function useTimeOfDayGreeting() {
  const [greeting, setGreeting] = useState<string | null>(null);
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);
  return greeting;
}

export function UserGreetingSkeleton() {
  return <Skeleton className="h-6 w-64" />;
}
