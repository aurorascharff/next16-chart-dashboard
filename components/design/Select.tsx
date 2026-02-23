'use client';

import { useOptimistic, useTransition } from 'react';
import { Select as BaseSelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '../ui/spinner';

type Option = { name: string };

type SelectProps = {
  label: string;
  value: string | null;
  options: Option[] | undefined;
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  action: (value: string | null) => void | Promise<void>;
};

export function Select({
  label,
  value,
  options,
  isLoading = false,
  disabled = false,
  placeholder = `Select ${label.toLowerCase()}`,
  action,
}: SelectProps) {
  const [, startTransition] = useTransition();
  const [optimisticValue, setOptimisticValue] = useOptimistic(value);
  const isDisabled = disabled || isLoading;

  async function handleChange(next: string | null) {
    startTransition(async () => {
      setOptimisticValue(next);
      await action(next);
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">{label}</label>
      <BaseSelect value={optimisticValue ?? ''} onValueChange={handleChange} disabled={isDisabled}>
        <SelectTrigger className="w-full" disabled={isDisabled}>
          <SelectValue placeholder={placeholder} />
          {isLoading && <Spinner />}
        </SelectTrigger>
        <SelectContent>
          {options?.map(o => {
            return (
              <SelectItem key={o.name} value={o.name}>
                {o.name}
              </SelectItem>
            );
          })}
        </SelectContent>
      </BaseSelect>
    </div>
  );
}
