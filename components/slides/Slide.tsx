import { highlight } from 'sugar-high';
import { cn } from '@/lib/utils';
import { SlideDemoContent } from './SlideDemoContent';

export function Slide({
  children,
  align = 'center',
  className,
}: {
  children: React.ReactNode;
  align?: 'center' | 'left';
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex h-dvh w-dvw flex-col justify-center gap-8 px-12 py-20 sm:px-24 md:px-32 lg:px-40',
        align === 'center' && 'items-center text-center',
        align === 'left' && 'items-start text-left',
        className,
      )}
    >
      <div
        className={cn(
          'flex max-w-4xl flex-col gap-6',
          align === 'center' && 'items-center',
          align === 'left' && 'items-start',
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function SlideTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h1
      className={cn('text-foreground text-4xl font-semibold sm:text-5xl md:text-6xl lg:text-7xl', className)}
      style={{ letterSpacing: '-0.05em' }}
    >
      {children}
    </h1>
  );
}

export function SlideSubtitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn('text-muted-foreground text-lg sm:text-xl md:text-2xl', className)}>{children}</p>;
}

export function SlideBadge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'border-border bg-muted text-muted-foreground inline-block rounded-full border px-3 py-1 text-xs font-medium tracking-widest uppercase',
        className,
      )}
    >
      {children}
    </span>
  );
}

export function SlideCode({ children, className, title }: { children: string; className?: string; title?: string }) {
  const html = highlight(children);

  return (
    <div className={cn('w-full max-w-2xl', className)}>
      {title && <div className="text-muted-foreground mb-2 text-xs font-medium tracking-wider uppercase">{title}</div>}
      <pre className="border-code-border bg-code-bg text-code-text overflow-x-auto rounded-xl border p-6 text-left font-mono text-[13px] leading-[1.7] sm:text-sm">
        <code dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    </div>
  );
}

export function SlideList({ children, className }: { children: React.ReactNode; className?: string }) {
  return <ul className={cn('flex flex-col gap-4 text-left', className)}>{children}</ul>;
}

export function SlideListItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <li className={cn('text-foreground/70 flex items-start gap-3 text-lg sm:text-xl', className)}>
      <span className="bg-foreground/40 mt-2 block h-1.5 w-1.5 shrink-0 rounded-full" aria-hidden />
      <span>{children}</span>
    </li>
  );
}

export function SlideNote({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn('text-muted-foreground/50 mt-4 text-sm', className)}>{children}</p>;
}

export function SlideDemo({
  children,
  className,
  label,
}: {
  children: React.ReactNode;
  className?: string;
  label?: string;
}) {
  return (
    <div data-slide-interactive className={cn('w-full max-w-2xl', className)}>
      {label && <div className="text-muted-foreground mb-2 text-xs font-medium tracking-wider uppercase">{label}</div>}
      <div className="border-border bg-card rounded-xl border p-6">
        <SlideDemoContent>{children}</SlideDemoContent>
      </div>
    </div>
  );
}
