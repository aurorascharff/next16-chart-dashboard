'use client';

import { Check, Pencil, X } from 'lucide-react';
import { useOptimistic, useState, useTransition } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Spinner } from '../ui/spinner';

type EditableTextProps = Omit<React.ComponentProps<'input'>, 'value' | 'action'> & {
  value: string;
  action: (value: string) => void | Promise<void>;
  prefix?: string;
  displayValue?: (optimisticValue: string) => React.ReactNode;
};

export function EditableText({
  value,
  action,
  placeholder = 'Click to edit...',
  prefix,
  displayValue: renderDisplay,
  className,
  ...inputProps
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

  const displayValue = optimisticValue
    ? (renderDisplay ? renderDisplay(optimisticValue) : `${prefix ?? ''}${optimisticValue}`)
    : null;

  return (
    <div className={cn('flex h-8 items-center gap-1', className)}>
      {isEditing ? (
        <>
          <div className="relative flex-1">
            {prefix && (
              <span className="text-muted-foreground pointer-events-none absolute top-1/2 left-2 -translate-y-1/2 text-sm">
                {prefix}
              </span>
            )}
            <Input
              {...inputProps}
              value={draft}
              onChange={e => {
                return setDraft(e.target.value);
              }}
              onKeyDown={e => {
                if (e.key === 'Enter') handleCommit();
                if (e.key === 'Escape') handleCancel();
              }}
              placeholder={placeholder}
              autoFocus
              className={cn('h-8 text-sm', prefix && 'pl-6')}
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
          <button
            type="button"
            className="hover:bg-muted flex h-8 cursor-pointer items-center gap-1 rounded-md px-2 transition-colors"
            onClick={() => {
              setDraft(optimisticValue);
              setIsEditing(true);
            }}
          >
            <span className={cn('text-sm', !displayValue && 'text-muted-foreground italic')}>
              {displayValue || placeholder}
            </span>
            <Pencil className="text-muted-foreground size-3 shrink-0" />
          </button>
          {isPending && <Spinner className="size-3" />}
        </>
      )}
    </div>
  );
}
