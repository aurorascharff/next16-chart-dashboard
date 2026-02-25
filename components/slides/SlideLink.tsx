import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { Route } from 'next';

type SlideLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'ghost';
};

export function SlideLink({ href, children, className, variant = 'primary' }: SlideLinkProps) {
  return (
    <Link
      href={href as Route}
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
