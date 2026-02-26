'use client';

import { usePathname, useRouter } from 'next/navigation';
import { addTransitionType, useEffect, useTransition, ViewTransition } from 'react';
import { cn } from '@/lib/utils';
import { slides } from './slides';
import type { Route } from 'next';

type SlidesLayoutProps = {
  children: React.ReactNode;
};

export default function SlidesLayout({ children }: SlidesLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const total = slides.length;

  const isSlideRoute = /\/slides\/\d+$/.test(pathname);

  const current = (() => {
    const match = pathname.match(/\/slides\/(\d+)/);
    return match ? Number(match[1]) - 1 : 0;
  })();

  useEffect(() => {
    if (!isSlideRoute) return;
    if (current > 0) {
      router.prefetch(`/slides/${current}` as Route);
    }
    if (current < total - 1) {
      router.prefetch(`/slides/${current + 2}` as Route);
    }
  }, [current, isSlideRoute, router, total]);

  function goTo(index: number) {
    const clamped = Math.max(0, Math.min(index, total - 1));
    if (clamped === current) return;
    startTransition(() => {
      addTransitionType(clamped > current ? 'slide-forward' : 'slide-back');
      router.push(`/slides/${clamped + 1}` as Route);
    });
  }

  function next() {
    goTo(current + 1);
  }

  function prev() {
    goTo(current - 1);
  }

  useEffect(() => {
    if (!isSlideRoute) return;
    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (
        target.closest('[data-slide-interactive]') ||
        target.matches('input, textarea, select, [contenteditable="true"]')
      ) {
        return;
      }
      switch (e.key) {
        case 'ArrowRight':
        case ' ':
          e.preventDefault();
          next();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          prev();
          break;
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  });

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  function handleClick(e: React.MouseEvent) {
    if (!isSlideRoute) return;
    if (
      (e.target as HTMLElement).closest(
        'a, button, input, select, textarea, label, [data-slide-interactive], [contenteditable]',
      )
    )
      return;
    const x = e.clientX;
    const width = window.innerWidth;
    if (x < width / 3) {
      prev();
    } else {
      next();
    }
  }

  return (
    <ViewTransition exit="deck-unveil">
      <div
        id="slide-deck"
        className={cn(
          'bg-background text-foreground fixed inset-0 z-50 overflow-hidden font-sans select-none',
          isSlideRoute && 'cursor-pointer',
        )}
        data-pending={isPending ? '' : undefined}
        onClick={handleClick}
        role="presentation"
      >
        <ViewTransition
          key={pathname}
          enter={{
            default: 'slide-from-right',
            'slide-back': 'slide-from-left',
            'slide-forward': 'slide-from-right',
          }}
          exit={{
            default: 'slide-to-left',
            'slide-back': 'slide-to-right',
            'slide-forward': 'slide-to-left',
          }}
        >
          <div>{children}</div>
        </ViewTransition>

        {isSlideRoute && (
          <div
            className="fixed bottom-8 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2"
            aria-label="Slide progress"
          >
            {Array.from({ length: total }).map((_, i) => {
              return (
                <div
                  key={i}
                  className={cn(
                    'h-1.5 rounded-full transition-all duration-300',
                    i === current ? 'bg-foreground w-6' : 'bg-foreground/25 w-1.5',
                  )}
                />
              );
            })}
          </div>
        )}

        {isSlideRoute && (
          <>
            <div className="text-muted-foreground/50 fixed right-8 bottom-8 z-50 font-mono text-xs">
              {current + 1} / {total}
            </div>
            <div className="text-muted-foreground/30 fixed bottom-8 left-8 z-50 font-mono text-[10px]">← → space</div>
          </>
        )}
      </div>
    </ViewTransition>
  );
}
