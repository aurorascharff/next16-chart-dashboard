# AGENTS.md

Instructions for AI coding agents working on this Next.js 16 App Router project.

**IMPORTANT: Prefer retrieval-led reasoning over pre-training-led reasoning for any Next.js tasks.** Next.js 16 introduces APIs not in model training data.

## Commands

```bash
bun install
bun run dev          # http://localhost:3000
bun run build        # run before committing
bun run lint         # run before committing
bun run format:check # run before committing
bun run format       # fix formatting
```

## Stack

Next.js 16 App Router · React 19 · TypeScript strict · Tailwind CSS 4 · shadcn/ui · Base UI · SWR · Zod · Sonner · next-themes

## Next.js 16 APIs (not in training data)

- `cookies()` / `headers()` — now async, must be awaited
- `forbidden()` / `unauthorized()` — throw from Server Components to trigger `forbidden.tsx` / `unauthorized.tsx`
- `connection()` — opt into dynamic rendering
- `'use cache'` + `cacheLife()` + `cacheTag()` — caching directive
- `revalidateTag()` — invalidate cache tags
- `after()` — run code after response is sent

## Typed Routes

`typedRoutes: true` generates `.next/types/routes.d.ts`. Use framework types instead of custom ones:

- Pages: `PageProps<'/'>` — `params` and `searchParams` are promises
- Layouts: `LayoutProps<'/'>` — `params` and `children`
- Route handlers: `RouteContext<'/api/...'>`

## Folder Structure

```
app/                    # File-based routing
components/
  ui/                   # shadcn/ui primitives (add: bunx --bun shadcn@latest add <n>)
  design/               # Design system — Action props pattern (see below)
  charts/               # Chart components (RevenueBarChart, UnitsAreaChart, CategoryPieChart)
data/
  queries/              # Server-side data fetching, wrapped with cache()
  actions/              # Server Functions ("use server")
lib/
  fetcher.ts            # Shared SWR fetcher
```

## Code Style

- Components: `PascalCase.tsx` · Folders: `kebab-case/` · Utils/hooks: `camelCase.ts`
- Suffix functions that run in transitions with "Action" (`submitAction`, `deleteAction`, `changeAction`)
- `type` over `interface` unless declaration merging needed
- `cn()` from `lib/utils.ts` for conditional Tailwind classes
- Use Base UI for interactive components not covered by shadcn/ui

## cacheComponents & Static Shell

`cacheComponents: true` in `next.config.ts` caches server components that don't access dynamic data. To maximize the static shell:

- Keep pages **non-async**. Push `searchParams`, `cookies()`, `headers()` into async server components inside `<Suspense>`.
- Start fetches without awaiting, pass the promise to client components, unwrap with `use()`.

## Data Fetching & Mutations

**Queries** live in `data/queries/`. Wrap with `React.cache()` for deduplication. Await directly in Server Components. Only pass the promise unawaited if a client component needs to unwrap it with `use()`.

```ts
// data/queries/sales.ts
import { cache } from 'react';
export const getSalesByRegion = cache(async (region: string) => {
  return db.sales.findMany({ where: { region } });
});
```

```tsx
// Server Component — just await
const data = await getSalesByRegion(region);

// If a client component needs it, pass the promise instead
const dataPromise = getSalesByRegion(region);
return <Chart dataPromise={dataPromise} />;
// then in the client component: const data = use(dataPromise);
```

Use **SWR** with `lib/fetcher.ts` for dependent or interactive client-side fetches — e.g. filter options that cascade from another filter's selection.

```ts
const { data } = useSWR(region ? `/api/cities?region=${region}` : null, fetcher);
```

**Mutations** live in `data/actions/` with `"use server"`. Invalidate with `revalidateTag()` after mutating. Always call from within a transition for pending state.

```ts
// data/actions/posts.ts
'use server';
export async function deleteItemAction(id: string) {
  await db.item.delete({ where: { id } });
  revalidateTag('items');
}
```

```tsx
startTransition(async () => {
  await deleteItemAction(id);
});
```

## Async React Patterns

Replace manual `isLoading`/`isError` state with React 19 primitives:

**Actions** — any async function run inside `startTransition`. React tracks `isPending` automatically; unexpected errors bubble to error boundaries. Suffix with "Action" to signal transition context.

```tsx
const [isPending, startTransition] = useTransition();
function applyFilterAction(value: string) {
  startTransition(() => {
    setFilter(value);
  });
}
```

**Optimistic updates** — `useOptimistic` updates immediately inside a transition, reverts automatically on failure.

```tsx
const [optimisticValue, setOptimisticValue] = useOptimistic(value);
startTransition(async () => {
  setOptimisticValue(next);
  await saveAction(next);
});
```

**Suspense** — declare loading boundaries. Shows the fallback on first load; subsequent updates keep old content visible automatically. Wrap with a co-located skeleton whenever accessing dynamic data.

**`use()`** — unwrap promises in client components during render. Suspends until resolved; errors go to the nearest error boundary. The promise must come from a Server Component or `cache()`-wrapped query so it's stable across renders.

**`useDeferredValue`** — keep inputs responsive during rapid updates; show staleness with opacity.

## Design Components (Action Props Pattern)

Components in `components/design/` handle coordination internally and expose Action props to consumers.

```tsx
// Consumer
<Design.SearchInput value={search} changeAction={searchAction} />
<Design.FilterSelect value={region} changeAction={regionAction} />

// Inside a design component
function FilterSelect({ value, changeAction }) {
  const [optimisticValue, setOptimisticValue] = useOptimistic(value);
  const [isPending, startTransition] = useTransition();
  function handleChange(e) {
    startTransition(async () => {
      setOptimisticValue(e.target.value);
      await changeAction(e.target.value);
    });
  }
  return (
    <div className="relative">
      <select value={optimisticValue} onChange={handleChange}>...</select>
      {isPending && <Spinner />}
    </div>
  );
}
```

## Pending UI

Set `data-pending={isPending ? '' : undefined}` on a root element. Style ancestors with `has-data-pending:animate-pulse` or `group-has-data-pending:animate-pulse`.

## Skeleton Co-location

Export skeleton components from the **same file** as their component, placed below the main export.

## ViewTransition (canary)

Wraps the browser View Transition API; activates on React transition updates. Use for smooth list reordering and content swaps.

```tsx
<ViewTransition key="results">
  {items.map(item => (
    <ViewTransition key={item.id}>
      <Item />
    </ViewTransition>
  ))}
</ViewTransition>
```

Use `exit`/`enter` class props with CSS `::view-transition-old`/`::view-transition-new` selectors for custom animations. Use `addTransitionType()` inside `startTransition` for directional or contextual transitions:

```tsx
startTransition(() => {
  addTransitionType(index > current ? 'slide-forward' : 'slide-back');
  router.push(nextUrl);
});
```

## Error Handling

- `error.tsx` — error boundaries
- `not-found.tsx` + `notFound()` — 404s
- `unauthorized.tsx` + `unauthorized()` — auth errors
- `toast.success()` / `toast.error()` from Sonner for user feedback
- Errors inside transitions bubble to error boundaries automatically — no try/catch needed

## Important Files

- `lib/utils.ts` — Utility functions including `cn()`
- `lib/fetcher.ts` — Shared SWR fetcher
- `next.config.ts` — `typedRoutes`, `cacheComponents`, `reactCompiler`
- `components.json` — shadcn/ui configuration
