'use client';

import { useSyncExternalStore } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useCurrentUser } from '@/providers/AuthProvider';

export function UserGreeting() {
  const user = useCurrentUser();
  const greeting = useTimeOfDayGreeting();

  return (
    <p className="text-muted-foreground">
      {greeting}, {user?.name} — {user?.role} · {user?.branch}
    </p>
  );
}

const noop = () => {
  return () => {};
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function useTimeOfDayGreeting() {
  return useSyncExternalStore(noop, getGreeting, () => {
    return 'Welcome';
  });
}

export function UserGreetingSkeleton() {
  return <Skeleton className="h-6 w-64" />;
}
