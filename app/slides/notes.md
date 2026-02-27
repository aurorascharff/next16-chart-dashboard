Building Performant Dynamic Apps in Next.js with Cache Components. Next.js 16, React 19.

---

Traditional dashboards fetch everything, then render everything. The user stares at a spinner until the slowest query finishes. Filters feel laggy because each change triggers a full round-trip with no immediate feedback. This isn't a performance problem — it's a coordination problem.

---

Four questions we'll answer during the demo: How do we stream content as it arrives instead of blocking on the slowest query? How do we make filters feel instant even when the server takes seconds? How do we cache data that's the same for everyone but still check that the current user is allowed to see it? And how do we avoid re-flashing skeletons when content is already on screen?

---

We're building a sales dashboard with cascading filters — Region to Country to City, Category to Subcategory. Multiple charts and summary cards, each with different query times. User-specific greeting and preferences alongside publicly cacheable data. We start from the slow version that has all these problems, then fix them one by one.

---

Suspense lets you declare loading boundaries instead of managing loading state. Each boundary streams independently — the fastest data appears first. On subsequent updates like re-filtering, already-revealed content stays visible instead of re-showing fallbacks. This is key: filters shouldn't blow away charts already on screen.

---

Actions — any async function wrapped in startTransition. React tracks the pending state automatically via isPending. No manual isLoading/setIsLoading. The current UI stays interactive while the update processes in the background. Errors bubble to error boundaries. Suffix with "Action" to signal it runs in a transition.

---

useOptimistic shows the expected result immediately before the server confirms. If the async work fails, React reverts automatically. Unlike useState which defers updates inside transitions, useOptimistic updates right away. Compare optimistic !== confirmed to detect pending state without a separate boolean.

---

use() reads a promise directly during render. The server starts the fetch, passes the promise to a client component, and the client calls use() to unwrap it. It suspends until resolved, errors go to error boundaries. No useEffect, no loading state, no race conditions.

---

cacheComponents is stable in Next.js 16. Server components that don't access dynamic data — cookies, headers, searchParams — are cached and served instantly. The page shell renders without waiting for any data. Keep pages non-async, push dynamic work into Suspense children to maximize what gets cached.

---

'use cache' is a directive that caches function results across requests. 'use cache: remote' shares the cache across deployments. cacheLife() controls duration. The pattern: run checkAuth() outside the cache boundary so it runs every request, cache the actual data query inside so it's shared across users.

---

Not everything belongs on the server. Cascading filter options — where each dropdown depends on the previous selection — are a natural fit for client-side fetching with SWR. Pass null as the key to skip a fetch until its dependency is ready. SWR calls thin API Route Handlers that wrap the same server query functions used for rendering.

---

Starting from the slow version. We'll solve each problem one at a time.
