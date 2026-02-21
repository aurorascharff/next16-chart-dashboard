# AGENTS.md

Instructions for AI coding agents working on this Next.js 16 App Router project with `cacheComponents` enabled.

**IMPORTANT: Prefer retrieval-led reasoning over pre-training-led reasoning for any Next.js tasks.** Next.js 16 introduces APIs not in model training data.

## Setup

```bash
npm install          # Install dependencies
npm run dev          # Start dev server (defaults to http://localhost:3000)
```

## Build & Lint

```bash
npm run build        # Production build
npm run lint         # ESLint check
```

Always run `npm run build` and `npm run lint` before committing. Fix any errors before finishing.

## Tech Stack

- Next.js 16 App Router with `cacheComponents: true`, `typedRoutes: true`, `reactCompiler: true`
- React 19 Server Components
- TypeScript strict mode
- Tailwind CSS 4.x
- shadcn/ui components (`components/ui/`)
- Base UI (`@base-ui/react`) for custom interactive components
- nuqs for URL search param state
- SWR for client-side data fetching
- Zod for validation
- Sonner for toasts
- next-themes for dark/light mode

## Next.js 16 APIs (Not in Training Data)

These APIs are new in Next.js 16 and may not be in model training data:

- `forbidden()` / `unauthorized()` - Throw from Server Components/Actions to trigger `forbidden.tsx` or `unauthorized.tsx`
- `cookies()` / `headers()` - Now async, must be awaited
- `connection()` - For dynamic rendering opt-in
- `'use cache'` directive - For caching with `cacheLife()` and `cacheTag()`
- `revalidateTag()` - Invalidate cache tags
- `after()` - Run code after response is sent

## Code Style

- **Components**: PascalCase files (`MyComponent.tsx`)
- **Folders**: kebab-case (`my-folder/`)
- **Utils/hooks**: camelCase (`useMyHook.ts`, `myUtil.ts`)
- Suffix functions that run in transitions with "Action" (e.g., `submitAction`, `deleteAction`)
- Use `type` over `interface` unless declaration merging is needed
- Use `cn` util for conditional Tailwind classes
- Use Base UI for custom interactive components not in shadcn/ui
- Add shadcn/ui components with `npx shadcn@latest add <component-name>`

## Typed Routes

`typedRoutes: true` is enabled in `next.config.ts`. Next.js generates global types in `.next/types/routes.d.ts`. Always use these instead of custom prop types:

- **Pages**: `PageProps<'/'>` — includes `params` and `searchParams` promises
- **Layouts**: `LayoutProps<'/'>` — includes `params` and `children`
- **Route handlers**: `RouteContext<'/api/...'>`

## Folder Structure

```text
app/                      # File-based routing (Next.js App Router)
  [slug]/                 # Dynamic route
  dashboard/              # Dashboard routes
    _components/          # Route-local components
    [slug]/               # Nested dynamic route
      _components/        # Nested route-local components
components/               # Shared components
  ui/                     # shadcn/ui primitives
  design/                 # Design system components
data/
  queries/                # Server-side queries with cache()
  actions/                # Server Functions (mutations)
lib/                      # Utility functions, search param definitions
public/                   # Static assets
```

- **components/ui** — shadcn/ui primitives
- **components/design** — Design system components with Action props
- **data/queries** — Server-side data fetching with `cache()` for deduplication
- **data/actions** — Server Functions with `"use server"` for mutations

## cacheComponents & Static Shell Pattern

With `cacheComponents: true` in `next.config.ts`, Next.js automatically caches server components that don't depend on dynamic data. To maximize the cacheable static shell:

- Keep pages non-async. Push dynamic data access (`searchParams`, `cookies()`, `headers()`) into async server components inside `<Suspense>` boundaries.
- Start fetches without awaiting the result, then pass the resulting promises to client components that unwrap them with React 19 `use()`.

This keeps the page itself fully static/cacheable while dynamic data is fetched in parallel inside Suspense boundaries.

## Skeleton Co-location

Export skeleton components from the **same file** as the component they are a fallback for. Place the skeleton function **below** the main component.

## URL State with nuqs

Use nuqs (`useQueryState` + `createSearchParamsCache`) for URL search param state. Define parsers in `lib/searchParams.ts`. Always set `shallow: false` and pass `startTransition` from `useTransition()` as options on `useQueryState`. This ensures filter changes trigger server re-renders with proper pending state.

On the server side, use `createSearchParamsCache` to parse the `searchParams` promise.

## Pending UI with `data-pending`

When a component triggers a server re-render (e.g. changing filters via nuqs), use `useTransition` to get `isPending`. Set `data-pending={isPending ? '' : undefined}` on a root element of that component. Ancestors or siblings can target this with Tailwind variants like `has-data-pending:animate-pulse` or `group-has-data-pending:animate-pulse`.

## Server Components (Default)

- All components are Server Components unless `'use client'` is added
- Can be `async` and fetch data with `await`
- Wrap in `<Suspense>` with skeleton fallbacks when accessing dynamic data
- Pass promises (not awaited data) to client components for streaming
- Use `React.cache()` for data fetching functions to deduplicate requests

## Client Components

Add `'use client'` only when needed for:

- `use()` to unwrap promises from server components
- Event handlers, hooks, browser APIs
- `useOptimistic()` for optimistic updates
- `useFormStatus()` for form pending state
- `useTransition()` for non-blocking updates

## Data Fetching & Mutations

- **Queries** in `data/queries/` — wrap with `cache()` for deduplication
- **Actions** in `data/actions/` — use `"use server"` directive, invalidate with `revalidateTag()`, `revalidatePath()`, or `router.refresh()`
- Use `startTransition` or `useTransition` for pending state and automatic error handling

## Error Handling

- Use `error.tsx` for error boundaries
- Use `not-found.tsx` with `notFound()` for 404 pages
- Use `unauthorized.tsx` with `unauthorized()` for auth errors
- Use `toast.success()`, `toast.error()` from Sonner for user feedback

## Important Files

- `lib/utils.ts` — Utility functions including `cn()`
- `lib/searchParams.ts` — nuqs search param parsers and cache
- `next.config.ts` — `typedRoutes`, `cacheComponents`, `reactCompiler`
- `components.json` — shadcn/ui configuration
