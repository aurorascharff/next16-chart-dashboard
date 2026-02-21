# next16-chart-dashboard

A [Next.js 16](https://nextjs.org/) sales analytics dashboard with cascading filters (Region → Country → City), built with [Prisma](https://www.prisma.io/), [Tailwind CSS](https://tailwindcss.com/), and [shadcn/ui](https://ui.shadcn.com/) (built on [Base UI](https://base-ui.com/)).

Demonstrates modern patterns: static shell with async wrappers, `use()` for streaming data to client components, [nuqs](https://nuqs.47ng.com/) for URL state, `useTransition` for pending UI, and Partial Pre-Rendering via [`cacheComponents`](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents).

## Getting Started

```bash
bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Prisma Setup

This project uses SQLite with a local database file (`dev.db`). No environment configuration needed.

```bash
bun run prisma.generate   # Generate the Prisma client
bun run prisma.push       # Push schema to database
bun run prisma.seed       # Seed initial data
bun run prisma.studio     # View data in Prisma Studio
```

**Using Prisma Postgres instead:** Change the provider in `prisma/schema.prisma` to `postgresql`, update `db.ts` to use `@prisma/adapter-pg`, and set your connection string in `.env`:

```env
DATABASE_URL="postgres://..."
```

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
  searchParams.ts         # nuqs parsers and cache
```

- **components/ui** — [shadcn/ui](https://ui.shadcn.com/) components. Add with `bunx shadcn@latest add <component-name>`
- **components/design** — Components that expose [Action props](https://react.dev/reference/react/useTransition#exposing-action-props-from-components) and handle async coordination internally

Every page folder should contain everything it needs. Components and functions live at the nearest shared space in the hierarchy.

**Naming:** PascalCase for components, kebab-case for files/folders, camelCase for functions/hooks.

## Development Flow

This project uses [`cacheComponents: true`](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents) — data fetching is **dynamic by default**. Push dynamic data access (`searchParams`, `cookies()`, `headers()`, uncached fetches) as deep as possible in the component tree to maximize static content. Async components accessing dynamic data must be wrapped in `<Suspense>` with skeleton fallbacks.

- **Fetching data** — Create queries in `data/queries/`, call in Server Components. Wrap with `cache()` for deduplication.
- **Mutating data** — Create Server Actions in `data/actions/` with `"use server"`. Invalidate with `updateTag()` or `revalidateTag()`. Use `useTransition` or `useFormStatus` for pending states, `useOptimistic` for instant feedback.
- **Navigation** — Wrap state changes in `useTransition` to keep old content visible while loading.
- **Caching** — Add [`"use cache"`](https://nextjs.org/docs/app/api-reference/directives/use-cache) to pages, components, or functions you want to pre-render or cache.

## Development Tools

Uses [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) with format-on-save in VS Code. Configuration in `eslint.config.mjs` and `.prettierrc`. Open the `.code-workspace` file to ensure correct extensions are set.

## Deployment

```bash
bun run build
```

Deploy to [Vercel](https://vercel.com) for the easiest experience. Use a production database instead of SQLite.

See the [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
