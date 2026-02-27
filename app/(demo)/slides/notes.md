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

---

Open the dashboard. Show the slow version — everything blocks on the slowest query. Point out how filters are not interactive until all charts finish loading. Show the network tab: all requests fire, nothing streams.

---

Add Suspense boundaries around each chart and summary cards. Show how they now stream independently — fast data appears first. Filters are accessible immediately. Point out: no skeleton re-flash on re-filter because Suspense preserves revealed content.

---

Add useOptimistic to filters. Show instant filter feedback — the select updates before the server responds. Show the data-pending pattern: set data-pending on the filter panel, use group-has-data-pending:animate-pulse on the chart area. One attribute drives the whole pending UI.

---

Show the action props pattern in design/Select. The component owns useOptimistic + useTransition internally. Consumer just passes value and action. Show the EditableText component with displayValue render prop for formatCurrency — optimistic formatting.

---

Add 'use cache: remote' to queries. Show checkAuth() outside the cache boundary, data inside. Reload — first load is slow, second is instant. Hard refresh to purge cache and show the slow version again. Explain cacheLife('hours').

---

Show SWR cascading filters. Open the filter panel — regions load client-side. Select a region, countries fetch. Select a country, cities fetch. Show null key skipping in the code. Show the thin API route handlers that wrap the same server queries.

---

Open the network tab. Walk through what happens on a filter change: optimistic UI updates, router.replace triggers server render, RSC payload streams in chunks per Suspense boundary, SWR fetches new filter options from API routes. Show server function calls, API calls, and cached query hits all visible.

---

Show use() pattern. Server wrapper starts the fetch, passes promise to client chart component. Client unwraps with use(). Show the AuthProvider pattern — user promise started once in root layout, passed via context, unwrapped with use() in any client component. No duplicate fetches, no prop drilling.

---

Wrap up. Recap what we solved: streaming, instant filters, caching with auth, no skeleton re-flash. Show the Performance tab or cacheComponents static shell if time allows.
