'use client';

import { Target } from 'lucide-react';
import { use } from 'react';
import { saveRevenueGoal } from '@/data/actions/preferences';
import { formatCurrency } from '@/lib/utils';
import { EditableText } from './design/EditableText';
import { Skeleton } from './ui/skeleton';

type Props = {
  goalPromise: Promise<number | null>;
};

export function RevenueGoal({ goalPromise }: Props) {
  const goal = use(goalPromise);
  const goalStr = goal?.toString() ?? '';

  return (
    <div className="flex items-center gap-2">
      <Target className="text-muted-foreground size-4 shrink-0" />
      <span className="text-sm font-medium whitespace-nowrap">Monthly Revenue Goal</span>
      <EditableText
        value={goalStr}
        action={saveRevenueGoal}
        displayValue={value => {
          const num = Number(value);
          if (Number.isNaN(num) || num === 0) return value;
          return formatCurrency(num);
        }}
        prefix="$"
        type="number"
        min={0}
        max={10000000}
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
