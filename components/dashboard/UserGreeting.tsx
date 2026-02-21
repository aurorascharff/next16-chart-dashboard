'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { useLocalTime } from '@/hooks/useLocalTime';
import { useCurrentUser } from '@/providers/AuthProvider';

export function UserGreeting() {
  const user = useCurrentUser();
  const time = useLocalTime();

  return (
    <p className="text-muted-foreground">
      Welcome, {user?.name} — {user?.role} · {user?.branch}
      {time && <span className="ml-2">· {time}</span>}
    </p>
  );
}

export function UserGreetingSkeleton() {
  return <Skeleton className="h-5 w-64" />;
}
