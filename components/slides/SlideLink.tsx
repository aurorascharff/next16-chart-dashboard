'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { addTransitionType, useTransition } from 'react';
import { cn } from '@/lib/utils';

type SlideLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'ghost';
  exit?: boolean;
  back?: boolean;
};

export function SlideLink({
  href,
  children,
  className,
  variant = 'primary',
  exit = false,
  back = false,
}: SlideLinkProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    startTransition(() => {
      if (back) {
        addTransitionType('slide-back');
      }
      router.push(href as never);
    });
  }

  return (
    <Link
      href={href as never}
      onClick={exit || back ? handleClick : undefined}
      className={cn(
        'mt-2 inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-medium tracking-wide transition-opacity hover:opacity-80',
        variant === 'primary' && 'bg-foreground text-background',
        variant === 'ghost' && 'border-border text-muted-foreground border',
        className,
      )}
    >
      {children}
    </Link>
  );
}
