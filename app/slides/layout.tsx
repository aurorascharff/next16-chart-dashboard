'use client';

import { SlideDeck } from 'nextjs-slides';
import { slides } from './slides';

export default function SlidesLayout({ children }: LayoutProps<'/slides'>) {
  return <SlideDeck slides={slides}>{children}</SlideDeck>;
}
