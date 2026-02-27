import {
  Slide,
  SlideBadge,
  SlideCode,
  SlideHeaderBadge,
  SlideLink,
  SlideSpeaker,
  SlideSplitLayout,
  SlideStatement,
  SlideStatementList,
  SlideSubtitle,
  SlideTitle,
} from 'nextjs-slides';

export const slides: React.ReactNode[] = [
  // 1 — Title
  <Slide key="title">
    <SlideBadge>Next.js 16 · React 19</SlideBadge>
    <SlideTitle>Building Performant Dynamic Apps in Next.js with Cache Components</SlideTitle>
    <SlideSpeaker name="Speaker Name" title="Title"/>
  </Slide>,

  // 2 — The problem
  <Slide key="problem">
    <SlideBadge>The Problem</SlideBadge>
    <SlideTitle>Dashboards Are Slow</SlideTitle>
    <SlideSubtitle>
      Fetch everything, then render everything. The user waits for the slowest query.
    </SlideSubtitle>
  </Slide>,

  // 3 — Challenges
  <Slide key="questions" align="left">
    <SlideHeaderBadge>Challenges</SlideHeaderBadge>
    <SlideTitle>Questions We Need to Solve</SlideTitle>
    <SlideStatementList>
      <SlideStatement title="How do we show content as it arrives?" />
      <SlideStatement title="How do we make filters feel instant?" />
      <SlideStatement title="How do we cache shared data but still check auth?" />
      <SlideStatement title="How do we avoid flashing skeletons on re-filter?" />
    </SlideStatementList>
  </Slide>,

  // 4 — What we're building
  <Slide key="what" align="left">
    <SlideHeaderBadge>Overview</SlideHeaderBadge>
    <SlideTitle>What We&apos;re Building</SlideTitle>
    <SlideStatementList>
      <SlideStatement title="Sales dashboard with cascading filters" />
      <SlideStatement title="Multiple charts and summary cards" />
      <SlideStatement title="User-specific data + shared cached data" />
      <SlideStatement title="Starting from the slow version" />
    </SlideStatementList>
  </Slide>,

  // 5 — Suspense
  <Slide key="suspense" align="left">
    <SlideSplitLayout
      left={
        <>
          <SlideHeaderBadge>React 19</SlideHeaderBadge>
          <SlideTitle>Suspense</SlideTitle>
          <SlideSubtitle>Declarative loading boundaries</SlideSubtitle>
        </>
      }
      right={
        <SlideCode title="example.tsx">{`<Suspense fallback={<ChartSkeleton />}>
  <SlowChart />
</Suspense>
<Suspense fallback={<TableSkeleton />}>
  <FastTable />
</Suspense>`}</SlideCode>
      }
    />
  </Slide>,

  // 6 — useTransition
  <Slide key="use-transition" align="left">
    <SlideSplitLayout
      left={
        <>
          <SlideHeaderBadge>React 19</SlideHeaderBadge>
          <SlideTitle>Actions</SlideTitle>
          <SlideSubtitle>Track async work with useTransition</SlideSubtitle>
        </>
      }
      right={
        <SlideCode title="example.tsx">{`const [isPending, startTransition] = useTransition();

function filterAction(value: string) {
  startTransition(() => {
    router.replace(\`?filter=\${value}\`);
  });
}`}</SlideCode>
      }
    />
  </Slide>,

  // 7 — useOptimistic
  <Slide key="use-optimistic" align="left">
    <SlideSplitLayout
      left={
        <>
          <SlideHeaderBadge>React 19</SlideHeaderBadge>
          <SlideTitle>useOptimistic</SlideTitle>
          <SlideSubtitle>Instant feedback, automatic rollback</SlideSubtitle>
        </>
      }
      right={
        <SlideCode title="example.tsx">{`const [optimistic, setOptimistic] =
  useOptimistic(confirmed);

startTransition(async () => {
  setOptimistic(next);
  await saveToServer(next);
});`}</SlideCode>
      }
    />
  </Slide>,

  // 8 — use()
  <Slide key="use" align="left">
    <SlideSplitLayout
      left={
        <>
          <SlideHeaderBadge>React 19</SlideHeaderBadge>
          <SlideTitle>use()</SlideTitle>
          <SlideSubtitle>Read promises during render</SlideSubtitle>
        </>
      }
      right={
        <SlideCode title="example.tsx">{`async function Wrapper() {
  const dataPromise = fetchData();
  return <Chart data={dataPromise} />;
}

'use client';
function Chart({ data }: { data: Promise<Data> }) {
  const resolved = use(data);
  return <BarChart data={resolved} />;
}`}</SlideCode>
      }
    />
  </Slide>,

  // 9 — cacheComponents
  <Slide key="cache-components">
    <SlideBadge>Next.js 16</SlideBadge>
    <SlideTitle>cacheComponents</SlideTitle>
    <SlideSubtitle>Instant static shell for components without dynamic data</SlideSubtitle>
  </Slide>,

  // 10 — 'use cache'
  <Slide key="use-cache">
    <SlideBadge>Next.js 16</SlideBadge>
    <SlideTitle>&apos;use cache&apos;</SlideTitle>
    <SlideSubtitle>Cache function results across requests and deployments</SlideSubtitle>
  </Slide>,

  // 11 — SWR
  <Slide key="swr" align="left">
    <SlideSplitLayout
      left={
        <>
          <SlideHeaderBadge>Client Data</SlideHeaderBadge>
          <SlideTitle>SWR</SlideTitle>
          <SlideSubtitle>Client-side fetching for cascading data</SlideSubtitle>
        </>
      }
      right={
        <SlideCode title="example.tsx">{`const { data: regions } =
  useSWR('/api/regions', fetcher);

const { data: countries } = useSWR(
  region
    ? \`/api/countries?region=\${region}\`
    : null,
  fetcher,
);`}</SlideCode>
      }
    />
  </Slide>,

  // 12 — Let's go
  <Slide key="demo">
    <SlideBadge>Demo</SlideBadge>
    <SlideTitle>Let&apos;s Build It</SlideTitle>
    <SlideLink href="/">Open Dashboard</SlideLink>
  </Slide>,
];
