import { Target } from 'lucide-react';
import { cookies } from 'next/headers';
import { saveGoal } from '@/data/actions/goal';
import { Skeleton } from './ui/skeleton';
import { EditableText } from './design/EditableText';

export async function RevenueGoal() {
  const cookieStore = await cookies();
  const goal = cookieStore.get('revenue-goal')?.value ?? '';
  return (
    <div className="flex items-center gap-2">
      <Target className="text-muted-foreground size-4 shrink-0" />
      <span className="text-sm font-medium whitespace-nowrap">Monthly Revenue Goal</span>
      <EditableText
        value={goal}
        action={saveGoal}
        prefix="$"
        type="number"
        placeholder="Set a target..."
        className="w-52"
      />
    </div>
  );
}

export function RevenueGoalSkeleton() {
  return (
    <div className="flex h-8 items-center gap-2">
      <Skeleton className="size-4 rounded" />
      <Skeleton className="h-4 w-36" />
      <Skeleton className="h-4 w-20" />
    </div>
  );
}
