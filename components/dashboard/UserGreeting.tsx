'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { useLocalTime } from '@/hooks/useLocalTime';
import { useCurrentUser } from '@/providers/AuthProvider';

export function UserGreeting() {
  const user = useCurrentUser();
  const time = useLocalTime();

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">{user?.branch} Dashboard</h1>
      <p className="text-muted-foreground">
        Welcome, {user?.name} — {user?.role}
        {time && <span className="ml-2">· {time}</span>}
      </p>
    </div>
  );
}

export function UserGreetingSkeleton() {
  return (
    <div>
      <Skeleton className="h-9 w-64" />
      <Skeleton className="mt-1 h-5 w-48" />
    </div>
  );
}
