# Next 16 Chart Dashboard

A sales dashboard exploring Async React and dynamic data fetching with Next.js 16's Cache Components. Features cascading filters (Region → Country + City in parallel, Category → Subcategory), streaming, URL-driven filter state, and optimistic updates with pending UI.

Built with Next.js 16, React 19, TailwindCSS v4, and shadcn/ui (Base UI).

## Getting Started

```bash
bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```plaintext
app/                      # Pages and layouts
components/
  dashboard/              # Dashboard charts, wrappers, filters
  design/                 # Action prop components
  ui/                     # shadcn/ui primitives
data/
  actions/                # Server Actions
  queries/                # Data fetching with cache()
lib/
  fetcher.ts              # Shared SWR fetcher
```

- **components/ui** — [shadcn/ui](https://ui.shadcn.com/) components. Add with `bunx shadcn@latest add <component-name>`
- **components/design** — Components that expose [Action props](https://react.dev/reference/react/useTransition#exposing-action-props-from-components) and handle async coordination internally

Every page folder should contain everything it needs. Components and functions live at the nearest shared space in the hierarchy.

**Naming:** PascalCase for components, kebab-case for files/folders, camelCase for functions/hooks. Suffix transition-based functions with "Action".

## Key Patterns

**Cache Components:** Uses [`cacheComponents: true`](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents) for static shell rendering and [`"use cache"`](https://nextjs.org/docs/app/api-reference/directives/use-cache) for explicit caching. Keep pages non-async — push dynamic data access into Suspense boundaries as deep as possible.

**Async React:** Replace manual `isLoading`/`isError` state with React 19's coordination primitives — `useTransition` for tracking async work, `useOptimistic` for instant feedback, `Suspense` for loading boundaries, and `use()` for reading promises during render. See `AGENTS.md` for detailed patterns and examples.

## Development Flow

- **Fetching data** — Queries in `data/queries/`, wrapped with `cache()`. Await in Server Components directly, or pass the promise to a client component and unwrap with `use()`. Use SWR with `lib/fetcher.ts` for dependent or interactive client-side fetches (e.g. cascading filter options).
- **Mutating data** — Server Actions in `data/actions/` with `"use server"`. Invalidate with `revalidateTag()`. Use `useTransition` + `useOptimistic` for pending state and instant feedback.
- **Navigation** — Wrap route changes in `useTransition` to get `isPending` for loading UI.
- **Caching** — Add `"use cache"` with `cacheLife()` to pages, components, or functions to include them in the static shell.
- **Errors** — `error.tsx` for boundaries, `not-found.tsx` + `notFound()` for 404s. Errors thrown inside transitions automatically reach the nearest error boundary.

## Development Tools

Uses [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) with format-on-save in VS Code. Configuration in `eslint.config.mjs` and `.prettierrc`. Open the `.code-workspace` file to ensure correct extensions are set.

## Deployment

```bash
bun run build
```

Deploy to [Vercel](https://vercel.com) for the easiest experience.

See the [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
