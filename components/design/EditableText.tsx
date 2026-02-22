'use client';

import { Check, Pencil, X } from 'lucide-react';
import { useOptimistic, useState, useTransition } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Spinner } from '../ui/spinner';

type EditableTextProps = {
  value: string;
  action: (value: string) => void | Promise<void>;
  placeholder?: string;
  prefix?: string;
  type?: React.HTMLInputTypeAttribute;
  className?: string;
};

export function EditableText({
  value,
  action,
  placeholder = 'Click to edit...',
  prefix,
  type = 'text',
  className,
}: EditableTextProps) {
  const [isPending, startTransition] = useTransition();
  const [optimisticValue, setOptimisticValue] = useOptimistic(value);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  function handleCommit() {
    setIsEditing(false);
    if (draft === optimisticValue) return;
    startTransition(async () => {
      setOptimisticValue(draft);
      await action(draft);
    });
  }

  function handleCancel() {
    setDraft(optimisticValue);
    setIsEditing(false);
  }

  const displayValue = optimisticValue ? `${prefix ?? ''}${optimisticValue}` : null;

  return (
    <div className={cn('flex h-8 items-center gap-1', className)}>
      {isEditing ? (
        <>
          <div className="relative flex-1">
            {prefix && (
              <span className="text-muted-foreground pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-sm">
                {prefix}
              </span>
            )}
            <input
              type={type}
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleCommit();
                if (e.key === 'Escape') handleCancel();
              }}
              placeholder={placeholder}
              autoFocus
              className={cn(
                'dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring/50',
                'h-8 w-full min-w-0 rounded-md border bg-transparent px-2.5 py-1 text-sm shadow-xs',
                'transition-[color,box-shadow] outline-none focus-visible:ring-[3px]',
                prefix && 'pl-6',
              )}
            />
          </div>
          <Button className="ml-2" size="icon-xs" variant="ghost" onClick={handleCommit} aria-label="Save">
            <Check />
          </Button>
          <Button size="icon-xs" variant="ghost" onClick={handleCancel} aria-label="Cancel">
            <X />
          </Button>
        </>
      ) : (
        <>
          <p className={cn('text-sm', !displayValue && 'text-muted-foreground italic')}>
            {displayValue || placeholder}
          </p>
          <Button
            size="icon-xs"
            variant="ghost"
            className="transition-colors"
            onClick={() => {
              setDraft(optimisticValue);
              setIsEditing(true);
            }}
            aria-label="Edit"
          >
            <Pencil />
          </Button>
          {isPending && <Spinner className="size-3" />}
        </>
      )}
    </div>
  );
}
