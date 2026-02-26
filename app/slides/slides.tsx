import { Counter } from '@/app/slides/_components/Counter';
import {
  Slide,
  SlideBadge,
  SlideCode,
  SlideHeaderBadge,
  SlideDemo,
  SlideLink,
  SlideNote,
  SlideSpeaker,
  SlideSpeakerGrid,
  SlideSpeakerList,
  SlideSplitLayout,
  SlideStatement,
  SlideStatementList,
  SlideSubtitle,
  SlideTitle,
} from '@/components/slides/Slide';

export const slides: React.ReactNode[] = [
  <Slide key="welcome" align="left">
    <SlideHeaderBadge>Slide Deck</SlideHeaderBadge>
    <SlideTitle className="font-pixel">Code Your Slides</SlideTitle>
    <SlideSubtitle>A composable slide system built with React, ViewTransitions, and Geist</SlideSubtitle>
    <SlideSpeakerGrid className="mt-8">
      <SlideSpeaker name="First & Last Name" title="Title / Company" />
      <SlideSpeaker name="First & Last Name" title="Title / Company" />
    </SlideSpeakerGrid>
  </Slide>,

  <Slide key="getting-started" align="left">
    <SlideBadge>Setup</SlideBadge>
    <SlideTitle className="text-3xl sm:text-4xl md:text-5xl">Getting Started</SlideTitle>
    <SlideCode title="app/slides/[page]/page.tsx">{`import { slides } from '@/app/slides/slides';

export default async function SlidePage({ params }) {
  const { page } = await params;
  return slides[Number(page) - 1];
}`}</SlideCode>
    <SlideNote>Each slide is a page — /slides/1, /slides/2, etc.</SlideNote>
  </Slide>,

  <SlideSplitLayout
    key="primitives"
    left={
      <>
        <SlideBadge>Primitives</SlideBadge>
        <SlideTitle className="mt-6 text-3xl sm:text-4xl md:text-5xl">Building Blocks</SlideTitle>
      </>
    }
    right={
      <SlideStatementList>
        <SlideStatement title="Slide & SlideSplitLayout" description="Full-screen containers with border frames" />
        <SlideStatement title="SlideTitle & SlideSubtitle" description="Typography primitives for headings" />
        <SlideStatement title="SlideCode & SlideDemo" description="Syntax-highlighted code and interactive content" />
      </SlideStatementList>
    }
  />,

  <Slide key="interactive">
    <SlideBadge>Interactive</SlideBadge>
    <SlideTitle className="text-3xl sm:text-4xl md:text-5xl">React Components</SlideTitle>
    <SlideSubtitle>Drop any component into a slide — it just works</SlideSubtitle>
    <SlideDemo label="Live demo">
      <Counter />
    </SlideDemo>
    <SlideNote>Wrap interactive content in SlideDemo — clicks and keys won&apos;t navigate</SlideNote>
  </Slide>,

  <Slide key="routing" align="left">
    <SlideBadge>Routing</SlideBadge>
    <SlideTitle className="text-3xl sm:text-4xl md:text-5xl">Breakout Routes</SlideTitle>
    <SlideSubtitle>Navigate to a full page inside /slides — deck chrome hides automatically</SlideSubtitle>
    <SlideCode title="Link to a sub-route and back">{`// In slides.tsx — link out
<SlideLink href="/slides/demo1">Open Demo →</SlideLink>

// In /slides/demo1/page.tsx — link back
<SlideLink href="/slides/5">← Back to slides</SlideLink>`}</SlideCode>
    <SlideLink href="/slides/demo1">Open Demo →</SlideLink>
  </Slide>,

  <SlideSplitLayout
    key="navigation"
    left={
      <>
        <SlideBadge>Navigation</SlideBadge>
        <SlideTitle className="mt-6 text-3xl sm:text-4xl md:text-5xl">How to Navigate</SlideTitle>
      </>
    }
    right={
      <SlideStatementList>
        <SlideStatement title="→ / Space" description="Next slide" />
        <SlideStatement title="←" description="Previous slide" />
        <SlideStatement title="Progress dots" description="Track your position" />
      </SlideStatementList>
    }
  />,

  <Slide key="code">
    <SlideBadge>Code</SlideBadge>
    <SlideTitle className="text-3xl sm:text-4xl md:text-5xl">Syntax Highlighting</SlideTitle>
    <SlideCode title="example.ts">{`const name = 'Vercel';
const items = [1, 2, 3];

async function greet(user: string) {
  const message = \`Hello, \${user}!\`;
  console.log(message);
  return { ok: true };
}`}</SlideCode>
    <SlideNote>Powered by sugar-high · Themed with CSS variables · Vercel dark/light</SlideNote>
  </Slide>,

  <Slide key="view-transitions">
    <SlideBadge>Animations</SlideBadge>
    <SlideTitle className="text-3xl sm:text-4xl md:text-5xl">ViewTransitions</SlideTitle>
    <SlideCode title="How slide animations work">{`<ViewTransition key={\`slide-\${current}\`}>
  <div>{slides[current]}</div>
</ViewTransition>`}</SlideCode>
    <SlideSubtitle>
      State changes inside startTransition trigger CSS view-transition animations automatically
    </SlideSubtitle>
  </Slide>,

  <SlideSplitLayout
    key="theme-links"
    left={
      <>
        <SlideBadge>Features</SlideBadge>
        <SlideTitle className="mt-6 text-3xl sm:text-4xl md:text-5xl">Theme & Links</SlideTitle>
        <SlideSubtitle className="mt-4">
          Slides follow your app theme. Use SlideLink to connect slides to your app.
        </SlideSubtitle>
      </>
    }
    right={
      <SlideStatementList>
        <SlideStatement title="Theme Toggle" description="Light and dark mode supported" />
        <SlideStatement title="SlideLink" description="Navigate between slides and your app" />
        <SlideStatement title="ViewTransition" description="All animations are automatic" />
      </SlideStatementList>
    }
  />,

  <Slide key="qa">
    <SlideBadge>Q&A</SlideBadge>
    <SlideSpeakerList className="mt-12">
      <SlideSpeaker name="First & Last Name" title="Title / Company" />
      <SlideSpeaker name="First & Last Name" title="Title / Company" />
      <SlideSpeaker name="First & Last Name" title="Title / Company" />
      <SlideSpeaker name="First & Last Name" title="Title / Company" />
    </SlideSpeakerList>
  </Slide>,

  <Slide key="end">
    <SlideTitle className="font-pixel">Now go build something.</SlideTitle>
    <SlideSubtitle>Navigate back to the demo or start creating your own slides.</SlideSubtitle>
    <div className="mt-4 flex items-center gap-4">
      <SlideLink href="/">Exit Slides →</SlideLink>
      <SlideLink href="https://github.com/aurorascharff/nextjs-demo-kit" variant="ghost">
        GitHub
      </SlideLink>
    </div>
  </Slide>,
];
