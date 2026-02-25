import { Slide, SlideBadge, SlideNote, SlideSubtitle, SlideTitle } from '@/components/slides/Slide';
import { SlideLink } from '@/components/slides/SlideLink';

export const slides: React.ReactNode[] = [
  <Slide key="welcome">
    <SlideBadge>Next.js 16</SlideBadge>
    <SlideTitle className="font-pixel">Sales Dashboard</SlideTitle>
    <SlideSubtitle>Cascading filters · Async React · Next.js 16</SlideSubtitle>
    <SlideNote>Press → or Space to continue · ← to go back · Click anywhere</SlideNote>
  </Slide>,

  // TODO: Add slides here

  <Slide key="end">
    <SlideTitle className="font-pixel">Try It</SlideTitle>
    <SlideSubtitle>Open the dashboard and explore the patterns in action.</SlideSubtitle>
    <div className="mt-4 flex items-center gap-4">
      <SlideLink href="/" exit>
        Open Dashboard →
      </SlideLink>
      <SlideLink href="https://github.com/aurorascharff/next16-chart-dashboard" variant="ghost">
        GitHub
      </SlideLink>
    </div>
  </Slide>,
];
