# Let's Talk About Performance

- **Website performance directly impacts user behavior.**  
  Faster sites lead to better funnel progression, higher page views, lower bounce rates, and improved conversion rates. Performance isn't just a technical metric—it's a business metric.

- **CrUX (Chrome User Experience Report):**

  - A dataset collected by Google from real-world Chrome users who have opted in.
  - Focuses on **Core Web Vitals** (Largest Contentful Paint, First Input Delay, Cumulative Layout Shift).
  - Only includes **public websites** and **eligible Chrome users**, which makes the dataset **incomplete** and sometimes **not representative**.
  - Useful for high-level benchmarking but **limited in granularity** or business-specific insights.

- **Real User Monitoring (RUM):**

  - Tracks actual user interactions on your website in real-time.
  - Requires integration with a tool (e.g., Google Analytics, Sentry, DataDog, New Relic).
  - Offers **fine-grained**, site-specific performance data, tailored to your audience and context.
  - More actionable than CrUX for day-to-day performance improvements.

- **Performance Workflow:**

  1. **Monitor** real-world performance over time.
  2. **Identify** bottlenecks or regressions.
  3. **Diagnose** root causes (e.g., third-party scripts, large payloads, layout shifts).
  4. **Fix** the issues locally in your codebase or infrastructure.
  5. **Validate** improvements through continued monitoring.

- **Note:**  
  Tools like **Lighthouse** or **WebPageTest** offer lab data (simulated environments) and are good for testing during development, but RUM gives the true picture of what your users actually experience.

---

# Intro to Initial Load Performance

## Initial Load Performance Metrics

- **Time to First Byte (TTFB):**  
  The time between when a request is sent and when the first byte of the response is received. It reflects the responsiveness of the server.

- Once the HTML is received, the browser starts building the page as quickly as possible.

- **Critical Rendering Path:**  
  The browser prioritizes rendering the minimal, most essential content visible to the user. To do this, it needs:

  - Initial HTML (to construct the DOM)
  - Critical CSS (to style visible elements)
  - Essential JavaScript (to modify layout or interactivity synchronously)

- The browser begins parsing the HTML, discovers external resources (CSS/JS), and requests them. These resources are needed to complete the first visual rendering.

- **Render-blocking resources:**
  - Resources that block rendering until they are downloaded and parsed.
  - Most CSS files are render-blocking (especially those included via `<link>`).
  - JS files in the `<head>` block rendering unless marked with `async`, `defer`, or `type="module"`.

## Key Paint Metrics

- **First Paint (FP):**  
  When the browser first renders any pixels to the screen.

- **First Contentful Paint (FCP):**  
  When meaningful content (text, image, SVG, etc.) is rendered.

  - A blank div counts as FP but not FCP.
  - Google recommends FCP to be under **1.8 seconds** for a good experience.

- **Largest Contentful Paint (LCP):**  
  Marks the time when the largest visible content element (e.g., main image or text block) is rendered.
  - Indicates when the primary content becomes visible.
  - Should occur within **2.5 seconds**.
  - Part of **Core Web Vitals**, tracked by Google.

## Web Performance Tools

- **Disable cache** in DevTools Network tab to simulate a first-time visitor experience.

- **Lighthouse:**

  - Good for quick audits and high-level feedback.
  - Doesn’t simulate varying network/CPU conditions.
  - Useful for tracking changes over time, but lacks depth.

- **Performance Panel:**
  - Shows detailed metrics including LCP, CLS (Cumulative Layout Shift), and INP (Interaction to Next Paint).
  - Allows simulation of slow network and CPU.
  - Record and reload to capture a detailed profile of the initial load process.

### Key Sections in the Performance Panel:

- **Timeline Overview:**  
  Shows screenshots of the page over time.

- **Network Panel:**  
  Lists all resources.

  - Red-cornered resources are render-blocking.

- **Frames Panel:**  
  Displays what was rendered and when.

  - FCP and LCP markers appear here.

- **Main Thread:**  
  Shows parsing, scripting, rendering, and other key operations over time.

> Tip: View both **Network** and **Main** panels together to trace delays and identify bottlenecks.

## Localhost vs Real-World Conditions

- Local development is usually much faster than real production environments.
- Use throttling tools to simulate slow connections and CPU constraints.
- Remember: servers perform tasks (auth, data fetching, logic), so TTFB may vary significantly from localhost to live.

## Exploring Network Conditions

- Use **Network throttling** to simulate users on slow/mobile connections.

- **Latency vs Bandwidth:**

  - Even with fast download speeds, high latency delays initial response.
  - Latency affects how fast resources like CSS/JS are fetched, increasing LCP.

- **Solution: Use a CDN (Content Delivery Network):**
  - Reduces latency by serving static assets from geographically distributed servers.
  - Offloads traffic from the origin server.
  - Critical for improving TTFB and LCP.

## Repeat Visit Performance (Caching)

- Returning users can benefit from caching static assets like CSS, JS, and images.

- **HTTP 304 (Not Modified):**

  - Indicates the cached version is still valid.
  - The browser reuses the cached asset, saving time and bandwidth.

- **Cache-Control Header:**  
  Controls caching behavior. Key directives:

  - `max-age`: How long the resource is considered fresh.
  - `must-revalidate`: Forces the browser to check if the cache is stale before using it.

- A good caching strategy depends on your site:

  - Static assets (CSS/JS/images) should be cached aggressively.
  - Dynamic or sensitive content may require stricter validation.

- **Cache Busting with Build Tools (e.g., Vite, Webpack):**
  - Output filenames include a hash of the content (`main.abc123.js`).
  - Any change to the file results in a new filename.
  - Ensures browsers always fetch updated files after a deployment.

> Summary: Caching improves repeat load performance, but must be configured thoughtfully to balance freshness and speed.

---

# Client-Side Rendering and Flame Graphs

## Client-Side Rendering (CSR)

- In Client-Side Rendering, JavaScript is responsible for rendering the initial UI in the browser.
- React, for example, finds the root DOM node (usually an element with `id="root"`), and mounts your component tree onto it using the `createRoot` method.
- React generates the full DOM tree in memory and injects it into an otherwise empty HTML page using standard DOM APIs.
- The page remains blank until JavaScript is downloaded and executed. Only then does meaningful content appear—this marks the **First Contentful Paint (FCP)** and **Largest Contentful Paint (LCP)**.

### Downsides of CSR

- **Delayed initial render:** FCP and LCP are delayed until JavaScript executes.
- **Poor experience without JS:** Disabling JavaScript results in a blank page.
- **Performance cost:** Even with cached JS files, execution time still delays rendering.
- **Layout and paint are deferred:** Unlike server-rendered apps, the browser doesn't start painting meaningful content right after HTML parsing.

### Why Use CSR?

- Simpler deployment: just serve static files (HTML, JS, CSS).
- Cost-effective and scalable for many use cases.
- While CSR hurts LCP and initial load, it can offer **excellent runtime performance**—especially important for interactive apps.

## Flame Graphs / Flame Charts

- A **Flame Graph** (also called a Flame Chart in Chrome DevTools) visualizes the **JavaScript call stack** over time.
- It shows which functions were executed, how long they took, and which functions called them.

### Key Concepts

- **Call Stack:** A record of functions invoked and their execution order.
- **Total Time:** How long a function and all its child functions took to execute.
- **Self Time:** How long the function itself took, excluding child function calls.

Knowing both values helps identify slow functions and where optimizations will be effective.

## Analyzing Flame Graphs in DevTools

- Use the **Performance tab** in Chrome DevTools with **"Record and Reload"**.
- The **Main section** displays the flame graph:
  - Initial HTML parsing
  - JavaScript execution
  - Subsequent FCP and LCP markers

### Key Observations

- Look for a **purple "Layout" block** after JavaScript execution.  
  This indicates layout calculations—how elements are positioned and sized. In large apps, this step can be costly.

- Each bar in the graph represents a function call.
  - Click to inspect:
    - Function name
    - Total time
    - Self time
    - Call hierarchy

### Troubleshooting with Flame Graphs

- Identify which functions are taking the most time.
- Look for unexpectedly long execution chains.
- Watch out for third-party plugins or browser extensions—they may appear in the call stack and inflate execution time.
  - **Tip:** Use **Incognito Mode** to eliminate browser extensions from the test environment.

## CSR vs Non-CSR in the Performance Panel

- **Non-CSR websites:**

  - After HTML is parsed, layout and painting happen immediately.
  - JavaScript runs _after_ meaningful content is already displayed.

- **CSR websites:**
  - Layout and paint are deferred until after JavaScript execution.
  - There’s no visible content during HTML parsing.
  - LCP occurs only after the JS has finished building the DOM and triggering paint.

> This delay is why CSR often has **worse LCP metrics**, even when JS is cached.

## Summary

- **Client-Side Rendering** provides a low-cost, scalable way to build rich apps.
- But it shifts the rendering burden to the browser, increasing initial load time.
- Use **Flame Graphs** in the Performance panel to:
  - Inspect execution flow
  - Pinpoint performance bottlenecks
  - Distinguish between app-related slowdowns and third-party issues

CSR isn’t always the right choice—especially for content-heavy sites—but it can be the best tradeoff for highly interactive apps where runtime experience matters more than initial load.

---

# SPAs and Introducing INP

## Single-Page Applications (SPAs)

- A **Single-Page Application** is a client-side rendered app where routing and navigation are handled entirely in the browser without full-page reloads.
- Instead of traditional `<a>` tags that trigger full page loads, SPAs use `window.history.pushState()` to update the URL. This does not reload the page but instead triggers a custom event to handle the navigation logic.
- An event listener watches for URL changes and renders the appropriate content based on the new route.
- Modern frameworks like **Next.js**, **Remix**, or **TanStack Router** abstract this mechanism behind components like `<Link>`, simplifying client-side routing.
- When a route changes in a SPA:
  - No network request is made to fetch a new HTML page.
  - Instead, JavaScript tears down the current view and renders the new one using code already in memory.
  - You won’t see any activity in the **Network panel**, but there will be a spike in JavaScript activity in the **Performance Timeline**.
  - Since the browser doesn’t recognize this as a page load, **FCP/LCP metrics are not re-triggered**.

### Pros and Cons of SPAs

**Pros:**

- Fast, smooth transitions between pages.
- No page reloads or flickers.
- Efficient reuse of assets (no need to refetch CSS, JS, etc. on each page).

**Cons:**

- No content without JavaScript (bad for SEO and accessibility).
- Initial load can be heavy.
- FCP/LCP only measured on the first load—makes monitoring harder.

## Introducing Interaction to Next Paint (INP)

- Since SPAs don't trigger FCP or LCP on internal navigation, a different performance metric is needed: **Interaction to Next Paint (INP)**.
- INP measures how responsive your app feels during real user interactions—how long it takes from the moment a user interacts until the UI updates visually.

### What INP Measures

- INP is one of the three **Core Web Vitals**, alongside LCP and CLS.
- Where **LCP** measures the speed of the _first impression_, **INP** evaluates the _ongoing experience_—how smooth interactions are after the page loads.
- It reflects **the longest interaction delay** observed during a session.

### Interpreting INP

| INP Value  | Performance       |
| ---------- | ----------------- |
| ≤ 200 ms   | Good              |
| 200–500 ms | Needs Improvement |
| > 500 ms   | Poor              |

- INP can be measured using **Lighthouse**:

  - Use the **Timespan mode** to simulate user interaction within a SPA.
  - Navigate between several internal pages.
  - The report will highlight the highest INP recorded.

- INP is also visible in the **Performance Panel**:
  - While recording, navigate your SPA.
  - The **Interactions** section will log input events, their origins, and durations.
  - The **Main thread** section will show what the browser did in response—e.g., recalculating styles, layout, paint, etc.

### Debugging INP

- The **Interactions block** highlights:

  - What user interaction occurred (e.g., click, tap).
  - How long it took for the next paint to occur.
  - What caused the delay (e.g., heavy JS, layout thrashing).

- By combining **Main** and **Interactions** in the Performance Panel:
  - You can trace exactly what happened after a route change.
  - See what tasks were queued (style recalculation, painting, script execution).
  - Identify bottlenecks affecting interaction responsiveness.

## Summary

- SPAs handle routing on the client side using the History API and dynamic rendering.
- They feel fast because of reduced network overhead, but suffer from:

  - No rendering without JavaScript.
  - Poor initial load performance.
  - Limited visibility into performance using traditional metrics.

- **INP** is a key metric for SPAs, capturing how fast the UI reacts to user input post-initial load.
- Use **Lighthouse (Timespan)** and the **Performance Panel** to measure and debug high INP values.

> Pro tip: In a SPA, your bottlenecks will often show up during route transitions—watch the JavaScript execution time, layout recalculations, and interaction latency.

---

# Server-Side Rendering (SSR) and Pre-rendering

## Why No-JavaScript Environments Matter

- Many clients — **search engine crawlers**, **social media previews**, **messaging apps** — do **not execute JavaScript**.
- These clients:
  - Fetch the HTML directly from a URL.
  - Parse static content: `<title>`, `<meta>`, headings, etc.
  - Skip JS execution due to resource/time costs.
- Google and some others use a **two-step crawl**:
  1. Parse static HTML for metadata.
  2. Queue the page for full JS rendering via a headless browser (can take hours/days).
- For fast discoverability and previewing, your site must work **without JavaScript** — SPAs break in these contexts.

## Server Pre-rendering

- A workaround is **server pre-rendering** — sending pre-built HTML from the server.
- Mechanism:
  - Server reads the built `index.html`, renders it as a string.
  - Returns modified HTML (e.g., dynamic `<title>`, `<meta>`) based on the requested route.
- Tradeoffs:
  - **Adds complexity**: Requires a server (vs. static file hosting).
  - **Higher cost**: Serverless functions or managed SSR (like Vercel/Netlify) can get expensive under high traffic.
  - **Performance hit**: Requests now depend on a live server response; not just CDN delivery.
    - Serverless functions at the edge help mitigate this, but add complexity.

## SSR with React

- React provides `renderToString()` — renders your app to a plain HTML string.
- Makes the app usable for:
  - **Crawlers**
  - **Users with JS disabled**
  - **Faster first paint in some cases**
- SSR **improves discoverability and accessibility**.

## Performance Caveats

- **SSR can worsen LCP**:
  - For users with **slow networks but fast devices**, downloading large HTML blocks takes longer.
  - HTML becomes the bottleneck before JS can hydrate the page.

## Hydration

- React renders client-side UI on top of SSR HTML using **hydration**:
  - Instead of replacing the DOM, React **reuses existing HTML nodes**.
  - Adds event listeners and internal state — no re-rendering from scratch.
- You implement hydration with `hydrateRoot()` instead of `createRoot()`.

### Performance Timeline

- In DevTools:
  - After CSS loads, SSR content triggers a large **Layout**.
  - Then React loads, **clears the root**, and injects its output.
  - With hydration, there's no root clearing — just enhanced DOM.

## SSR Implementation Notes

- **Don't write your own SSR logic** — use a framework (e.g., **Next.js**, **Remix**).
- **Frontend changes required**:

  - No `window`, `document`, or browser-specific APIs in SSR context.
  - These will be `undefined` on the server and crash the app.
  - Add guards like `if (typeof window !== "undefined")`.

- SSR-safe hooks:

  - React does **not run** `useEffect` or `useLayoutEffect` on the server.
  - Safe to use browser-only logic inside these hooks.

- **Avoid conditional SSR rendering**:

  - React expects server HTML to match client output exactly.
  - Mismatch will cause React to **fallback to CSR** and replace the entire DOM.
  - This breaks hydration and may cause layout flickers or bugs.

- Instead, use a **mounted state flag** to delay browser-only rendering until after hydration.

- **Third-party libraries**:
  - Not all libraries support SSR.
  - Some may rely on browser APIs and fail during server build.
  - Use dynamic imports (`import('...')`) to defer loading until after JS loads.

## Static Site Generation (SSG)

- If page content is **fully static**, you can pre-render it at **build time** using `renderToString`.
- This generates HTML files ready to be served from a CDN.
- Most frameworks (e.g., Next.js, Astro, Hugo) support SSG for performance + SEO.

## Summary

- **SSR makes your site visible and usable without JavaScript**.
- It improves SEO, link previews, and accessibility.
- Comes with **cost, complexity, and performance tradeoffs**.
- Use established frameworks — don’t build SSR by hand.
- Always test hydration and SSR compatibility, especially with third-party tools.

---

# Bundle Size and What to Do About It

## Bundle Size and the Network

- Larger bundles take longer to download, directly impacting page load speed.
- Production builds are usually compressed (e.g., **gzip**, **brotli**) to reduce transfer size.
- Most CDNs and hosts enable compression by default—verify it's active.
- When evaluating bundle size impact, always consider compressed size, not raw output.

## Bundle Size and JavaScript Evaluation Time

- After downloading, the browser evaluates all JavaScript before executing it.
- Larger bundles = longer **"Evaluate Script"** tasks in the main thread.
- This evaluation cost is **paid on every visit**, even if the file is cached.
- Unused JavaScript inflates evaluation time unnecessarily.

## Bundle Size and SSR

- SSR flow: HTML loads → CSS/JS download → LCP → hydration.
- Until hydration finishes, the page looks interactive but isn’t—clicks, forms, etc. won’t work.
- On slow networks/CPUs, large bundles delay hydration, hurting usability.
- **Time to Interactive (TTI)** is the key metric to measure this delay.

## Reducing Bundle Size with Code Splitting

- **Code splitting** breaks large bundles into smaller, independently loadable chunks.
- Browsers download chunks in parallel → faster initial load.
- Requires modular, dependency-isolated structure.

### Vendor vs. App Code

- Separate **vendor** code (dependencies) from your **app** code:
  - Enables long-term caching for rarely changing vendor code.
  - Prevents cache busting for the entire app on small changes.
  - Improves chunk reuse and reduces overall payload.

### Benefits of Splitting

- Better parallelism during download.
- Improved cache efficiency.
- Shorter compile/build times—only changed chunks are rebuilt.

### Chunking Gotchas

- Manual chunks are treated as **critical** and preloaded via `<link rel="modulepreload">`.
- Under **HTTP/1**, browser limits concurrent downloads (e.g., 6 per domain in Chrome).
  - Excessive chunking here can hurt performance.
- Most CDNs use **HTTP/2 or HTTP/3** (which multiplex requests), but **local dev servers** (e.g., Next.js, Express) often use HTTP/1.
  - This means chunking may reduce performance **locally**, but help **in production**.
- Over-chunking reduces compression ratio—smaller files = worse gzip/brotli efficiency.
- Use **dynamic imports** (`import()` syntax) to load code only when needed—but introduces complexity.

## Analyzing Bundle Size

- Use tools like **Rollup Plugin Visualizer** to inspect the output:
  - Generates a visual HTML report of your dependency tree.
  - Helps identify large packages bloating the bundle.

### Debugging Steps

1. Identify large packages.
2. Understand what the package does.
3. Check where and how it's used.
4. Confirm if it's the cause of the bloat.
5. Refactor or remove if possible.

## Tree Shaking and Dead Code Elimination

- Bundlers remove unused code via **tree shaking**:
  - Build a dependency tree and prune unused "branches."
- Works best with **ES Modules (ESM)**:
  - Syntax: `import`, `export`.
- Some patterns (e.g., dynamic access) prevent tree shaking from working.

## ES Modules and Non-Treeshakable Libraries

- Module formats: **ESM**, **CJS**, **AMD**, **UMD**.
  - Only **ESM** is reliably tree-shakeable.
- Use `npx is-esm [package]` to check if a dependency supports ESM.
- Some libraries expose smaller entry points:
  - ✅ `import trim from "lodash/trim"`
  - ❌ `import _ from "lodash"`

## Common Sense and Repeated Libraries

- Avoid importing multiple libraries for the same task (e.g., date manipulation).
- Pick one:
  - Supports tree shaking.
  - Well-maintained.
  - Suitable API.
- Refactor to consolidate and reduce duplication.

## Transitive Dependencies

- If you didn’t install a package directly but it’s in your bundle, it came from a **transitive dependency**, which means it is used by another library that we use somewhere in our code.
- Use `npx npm-why [package-name]` to find where it's used.
  - Example: `npx npm-why @emotion/styled`

## Summary

- **Large bundles hurt twice**:
  - **Network cost** on first visit (download time).
  - **Evaluation cost** on every visit (long “Evaluate Script” tasks).
- In **SSR** flows, oversized bundles postpone hydration, inflating **Time To Interactive (TTI)**.
- **Compression (gzip/brotli)** is mandatory but not a silver bullet—focus on shipped bytes, not just raw size.
- **Code splitting** + **vendor/app separation** improves caching and parallel downloads, but:
  - Excessive chunks cut compression efficiency and can stall under **HTTP/1** limits.
  - Use **dynamic imports** for truly non‑critical code paths.
- **Tree shaking** removes dead code; it’s most effective with **ES Modules**. Prefer ESM‑friendly libraries or fine‑grained imports (e.g., `lodash/trim`).
- Continuously audit bundles with visualizers, locate heavy or duplicate dependencies, and clean up transitive bloat.

> **Pro tip:** The biggest performance gains often come from **deleting** unused libraries, not from tweaking your chunk strategy. Start with elimination, then optimize what’s left.

---

# Intro to Lazy Loading and Suspense

## Lazy Loading and Code Splitting

- Lazy loading is useful for features that are **not visible on initial load** but are **heavy in performance**. The idea is to **defer loading** them until needed.
- This involves extracting the code into a **separate chunk**, away from the vendor code, and loading it **after critical resources** have finished loading.
- In React, implementing lazy loading requires four key steps:
  1. **Mark part of the code as unnecessary** on initial load.
  2. **Extract** that code into its own chunk.
  3. **Control** when the download starts.
  4. **Control** what happens during the download process.

> The exact implementation depends on the bundler or framework. Some setups (e.g., Vite) support lazy loading by default, others may need plugin/config changes.

## Marking Code as Lazy

Use React's `lazy()` function with a **dynamic import** to mark components as non-critical:

**Before:**

```jsx
import { MessageEditor } from "@fe/patterns/messageeditor";

{
  clickedMessage ? (
    <MessageEditor onClose={() => setClickedMessage(null)} />
  ) : null;
}
```

**After:**

```jsx
import { lazy } from "react";

const MessageEditorLazy = lazy(async () => {
  return {
    default: (await import("@fe/patterns/messageeditor")).MessageEditor,
  };
});

{
  clickedMessage ? (
    <MessageEditorLazy onClose={() => setClickedMessage(null)} />
  ) : null;
}
```

- The component is now lazy-loaded and **only downloaded when mounted**.
- Lazy returns a regular component, but the import only triggers when the component is rendered.

## Lazy Chunk Behavior

- In most bundlers (e.g., **Vite**), lazy-loaded components are automatically extracted into their **own chunk**.
- These chunks are **not injected** into `index.html` and are **not preloaded** during the initial render.
- When the lazy component mounts, a script tag is dynamically appended to `document.head`, triggering download.

> You can verify this by inspecting the `dist/index.html` and checking the **Network tab** for when the chunk loads.

## Control the Start of Download

- Lazy chunks download only when their components are **mounted**.
- If a lazy component is conditionally rendered (`null` or component), download is deferred until it becomes visible.
- But if it mounts immediately, the lazy chunk is still downloaded **after** critical assets—delaying the render.
- In this case, the **browser waits silently**, hurting metrics like **FCP** and **LCP**.

> This is why you must manage what happens **while the lazy download is in progress**. Enter `Suspense`.

## Suspense: What It Is

React’s `Suspense` component wraps lazy-loaded components and handles loading states. It:

- Detects lazy-loaded children that are still loading.
- **Skips rendering** those children and shows a fallback UI instead.
- Proceeds to render the rest of the app.
- Once the lazy chunk is ready, React renders it in place.

**Example:**

```jsx
const Button = () => <button>Button</button>;

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

const LazyButton = lazy(async () => {
  await sleep(3000);
  return { default: Button };
});

const Parent = () => (
  <>
    <h1>Welcome!</h1>
    <Suspense fallback={<div>Loading...</div>}>
      <LazyButton />
    </Suspense>
  </>
);
```

> Without `Suspense`, React blocks rendering until the chunk is ready. With it, you get early render + loading fallback.

## Applying Suspense in Practice

Wrap your lazy component in `Suspense` with a fallback:

```jsx
<Suspense
  fallback={
    <div className="w-full h-full fixed top-0 left-0 opacity-50 bg-blinkNeutral300 z-50" />
  }
>
  <MessageEditorLazy onClose={() => setClickedMessage(null)} />
</Suspense>
```

- This improves **FCP/LCP** because React no longer waits for lazy chunks to finish.
- Fallback UI is shown while the lazy component loads.

## Suspense Fallback Strategy

- If a lazy-loaded component is conditionally rendered **after interaction**, a fallback is mandatory.
- If it's immediately rendered, fallback is optional—but still good UX.
- Without a fallback, the user sees **nothing** during lazy chunk load.

## Summary

- **Lazy loading** is ideal for heavy components not needed on initial render.
- To implement lazy loading in React:

  - Replace direct imports with `React.lazy` + dynamic imports.
  - Ensure the bundler (e.g., **Vite**) extracts the lazy code into a separate chunk.
  - Use **conditional rendering** to defer mounting—and downloading—of the component.
  - Use **React.Suspense** to provide a fallback UI while loading occurs.

- **React.lazy** loads a component only when it's rendered for the first time.
- Lazy-loaded chunks are **not preloaded**; they're injected dynamically via script tags once needed.
- Without `Suspense`, React waits to finish downloading lazy chunks before completing initial render—hurting **LCP**.
- With `Suspense`, React **defers** the lazy component and proceeds to render critical parts, improving user-perceived performance.
- Always provide a **fallback** inside `Suspense`, especially for conditionally-rendered components—users otherwise see nothing while chunks load.

> **Pro tip:** Lazy loading without `Suspense` often makes things worse. You must **control the UX** during the loading phase to benefit from deferred code execution.

---

# Advanced Lazy Loading

## Manual Code Splitting Per Route

- By default, **all code is bundled** and linked in `index.html`, even if not immediately needed.
- In a CSR (Client-Side Rendered) app with multiple pages, we can split code **per page** using **manual chunks** in `vite.config.ts`.
- However, splitting into more chunks can hurt performance due to:
  - Increased number of parallel downloads.
  - **Connection limits in HTTP/1** (e.g., 6 per domain in Chrome).
  - This issue doesn’t exist in **HTTP/2 or HTTP/3**, which are used in most production environments.

> Key Point: Even if performance doesn't improve much due to vendor chunk bottlenecks, **chunking is still useful for managing cache behavior**.

- **First-time visitors** pay the full download cost. Later visits are faster due to caching.
- If a page rarely changes, code splitting doesn’t help much—cache will cover it.
- If updates are frequent, splitting can be valuable to **avoid redownloading everything** on each deployment.

## Lazy Loading Per Route

- An alternative to manual chunking: **lazy load components per route**.
- On initial render:
  - Only **critical chunks** (e.g., index + vendor) are downloaded.
  - React mounts the base structure.
  - Lazy-loaded route component gets mounted → triggers chunk download.
  - Once chunks are ready, React renders the lazy component.

> Downside: **LCP can increase**, because the page is rendered in two steps—first without lazy-loaded content, then with it.

- Lazy loading per route introduces more control over the **critical rendering path**, even if it introduces some overhead.

## Loading Critical Elements First

- Use the **Performance panel** in DevTools to inspect LCP:
  - Click the LCP label to locate the associated DOM node.
  - Once identified, **move this element out of lazy-loaded components**.
  - This ensures it is part of the initial critical render and not delayed.

> This technique gives you precision over which elements are prioritized during page load.

## Preloading Lazy Chunks Manually

- Problem: Lazy-loaded routes may result in a **blank screen** during navigation.
- Solution 1: Use a proper **fallback UI** in `<Suspense>`.
- Solution 2: **Preload** chunks **after** critical resources finish loading.

### Manual Preload Example (Vite)

```js
import("./settings"); // triggers preload without rendering
```

- This triggers the download of the chunk but doesn't mount it.
- Ensures it’s ready by the time the user navigates there.

> In large projects, manual preloading can become repetitive and hard to maintain.

## Preloading With a Link Component

- Many frameworks provide a custom `<Link>` component that automatically handles **preloading** of destination route chunks.
- These components:
  - Trigger chunk downloads **on hover** or when in viewport.
  - Avoid blocking LCP but **reduce blank states during navigation**.

> Use your framework’s official `<Link>` or navigation components—they often come with smart preloading built-in.

## Lazy Loading and Frameworks

- Framework choice matters less than understanding the **fundamentals** of lazy loading and code splitting.
- Once you grasp chunking, hydration, preload behavior, and route-based rendering, switching between frameworks is straightforward.

## Lazy Loading and SSR

- In SSR, HTML renders before JavaScript loads.
- Lazy-loaded parts will not be interactive until their JS is downloaded and hydrated.
- Page appears fast, but initially non-functional—**just static HTML** with links and native behaviors working.
- Lazy loading in SSR still helps by prioritizing **critical UI** and deferring non-essential features.

## Summary

- **Manual route-level chunking** is possible in Vite but comes with trade-offs—use with awareness of HTTP/1 limits and caching implications.
- **Lazy loading per route** gives better control over the critical render path, but can hurt **LCP** unless fallback and preload strategies are applied.
- Use the **Performance panel** to identify and prioritize LCP-critical elements.
- Preload lazy chunks:
  - **Manually** with `import()` for key routes.
  - **Automatically** via your framework's `<Link>` component.
- With SSR, lazy loading speeds up perceived render at the cost of initial interactivity—but the tradeoff can still be worth it.

> **Pro tip:** Use lazy loading to define your critical rendering path. Pair it with preloading and Suspense to control when and how the rest of your app shows up.

---

# Data Fetching and React Server Components

## Data Fetching on the Client

- **Default pattern in SPAs**: Fetch data after components mount.

  - First, critical assets load.
  - Then, lazy-loaded components download.
  - Then, dynamic data is fetched (e.g., via `useEffect`).
  - Finally, data-dependent UI renders.

- **Downside**: LCP suffers due to delayed fetch initiation.
- **Optimization**: Trigger fetch outside of components to **start early**.

```js
const preloadPromise = fetch("http://localhost:5432/api/sidebar");
```

- This starts the fetch **before** component is mounted but still waits for lazy bundles to be parsed.
- A better way: trigger fetch early and cache the promise.

```js
let sidebarCache = undefined;
let tableCache = undefined;

export const prefetch = () => {
  if (!sidebarCache) {
    sidebarCache = fetch("http://localhost:5432/api/sidebar");
  }
  if (!tableCache) {
    tableCache = fetch("http://localhost:5432/api/statistics");
  }
  return {
    sidebar: sidebarCache,
    table: tableCache,
  };
};
```

### Prefetching in HTML

- You can inject the fetch directly into `index.html` to kick off loading before React loads:

```html
<script>
  window.__PREFETCH_PROMISES = {
    sidebar: fetch("http://localhost:5432/api/sidebar"),
    table: fetch("http://localhost:5432/api/statistics"),
  };
</script>
```

- Use in React like this:

```js
let sidebarCache = window.__PREFETCH_PROMISES?.sidebar;
let tableCache = window.__PREFETCH_PROMISES?.table;
```

- **Tradeoff**: Slower initial render (hurts LCP), but faster data availability post-mount.
- **Caveat**: You may be fetching unused data on the homepage.

### Libraries for Client-Side Fetching

- Use **TanStack Query** or **SWR** for caching, retries, background sync, and stale data handling.
- They abstract boilerplate, but still rely on JS fundamentals—bound by the same browser/network constraints.

## Data Fetching and SSR

- On the server, data is fetched before HTML is sent.
- Data is passed to the React app (usually via props).
- Hydration on the client reuses the SSR-rendered DOM.
  - React attaches event listeners to preexisting DOM.
  - If hydration fails or props/data are missing, React discards DOM and re-renders from scratch (bad).

> 🔥 **Critical**: Data must be passed to both `renderToString` (server) and `hydrateRoot` (client) to avoid mismatches.

- Inject server data into the browser via `<script>`:

```html
<script>
  window.__SSR_DATA__ = {
    sidebar: "...",
    statistics: "...",
  };
</script>
```

- This lets React pick up pre-fetched data on client without redundant fetches.

> ✅ Benefit: No loading states or spinners needed—data is already there.
> ❌ Drawback: Slower total page load if server fetches are slow.

### Use Frameworks with SSR Built-In

- **Don't roll your own SSR**—use established solutions:

  - **Next.js**
  - **TanStack Router**
  - **React Router**

- Example: `window.__NEXT_DATA__` in Next.js holds SSR data for hydration.

## Streaming and React Server Components

- **Problem with SSR**: Doesn't reduce bundle size—everything is still sent to the browser.
- **Server Components** fix this by:
  - Running **only on the server**.
  - Sending **HTML + metadata**, not JavaScript.
  - Reducing client bundle size.
  - Supporting **filesystem/database access** in components.

### Client vs Server Components

- **Server component** = default. Never sent to browser.
- **Client component** = use `"use client"` directive at top.

```js
// Client component
"use client";

export default function Button() {
  return <button>Click me</button>;
}
```

- A **client component makes all its children client components**, even if they don’t have `"use client"`.

### `use server` Directive

- Used to define **server functions callable from the client**.
- Basically just a **custom RPC mechanism**—an alternative to REST APIs.

### What is a React Element?

- It’s just an object like this:

```js
{
  type: Button,
  props: {
    children: "I'm a button"
  }
}
```

- React walks the component tree and builds these objects.
- Then it builds real DOM nodes from the objects.

### Server Components + Tree Pre-Rendering

- RSC lets us **precompute the React tree** and send that to client.
- Client renders from that object, not from JS components.

```html
<script>
  window.__SERVER_COMPONENTS = JSON.stringify(...);
</script>
```

> 💡 This skips React's initial render pass on the client = **faster render**.

### Server Component Benefits

- Smaller client bundles.
- Server-only logic (DB, FS access).
- Asynchronous components can fetch their own data directly.
- No prop drilling needed.
- Best suited for dynamic data-heavy apps.

### Next.js and Streaming

- Next.js aggressively prebuilds and caches everything.
- To **opt out** (e.g., for CMS-driven content), use:

```js
export const dynamic = "force-dynamic";
```

- This disables pre-rendering and enables **live SSR**.

### Streaming

- Node streams HTML **in chunks** as data becomes available.
- Use `<Suspense>` to define chunk boundaries.

```js
<Suspense fallback={<Spinner />}>
  <UserData />
</Suspense>
```

- Nested `<Suspense>` can define more granular streaming.
- Streaming helps show content **incrementally**, improving perceived performance.

## Summary

| Approach          | Pros                                            | Cons                                                 |
| ----------------- | ----------------------------------------------- | ---------------------------------------------------- |
| Client Fetching   | Simpler to reason about, async control          | Worse LCP, depends on JS                             |
| SSR               | Fast visible page, good SEO                     | Bigger payload, hydration needed                     |
| Server Components | Smallest bundles, direct data access, best perf | Complex infra, limited support (only in Next.js now) |

> ✅ Server Components tend to **outperform** both client fetching and classic SSR if used properly.

---

# Interaction Performance

## Chrome DevTools for Interactions

- When optimizing **initial load performance**, **production builds** are necessary:
  - Dev builds don’t bundle, minify, or tree-shake correctly.
  - This skews performance metrics and leads to misleading conclusions.
- For **interaction performance**, the situation is reversed:
  - Production builds are minified and hard to trace.
  - Use **development mode** to debug, so function names remain readable.
  - Production builds are only useful to **detect bottlenecks**, not debug them.

### Understanding the React "Blob"

- During initial load, React can be treated as a single "blob"—size matters most.
- For interaction performance, you must **dig into what React is doing** internally:
  - Which components are rendering?
  - What JavaScript is being executed?
  - Where is time being spent?

### Profiling Setup

- Throttle the CPU to **simulate low-end mobile** conditions:
  - Use **20x CPU throttling** to surface potential performance issues.
- Open the **Performance Panel** in Chrome DevTools:
  - Press Record → Perform the interaction → Stop recording.
  - The **Main** and **Interactions** tracks will become your primary tools.

### Reading the Performance Panel

- **Main Thread** shows JavaScript execution timeline.
  - Tasks covered in **red** are **Long Tasks**—they block the browser.
- **Interactions Panel** shows:
  - Each user interaction (e.g., keypress, click).
  - How long each interaction took to trigger the next paint.
- In dev mode, function names are visible and traceable.
  - Helps differentiate between:
    - **Non-React code** causing long tasks (e.g., utility functions).
    - **React component re-renders** due to state updates.

## The Long Tasks Problem

### What Is a Long Task?

- The browser treats all JavaScript as discrete **tasks**.
- While a task is running, the browser is **completely unresponsive**.
- Long tasks can come from:
  - Initial synchronous JS execution.
  - Async operations like callbacks.
- A "long" task is typically any task >50 ms.

### Diagnosing the Source

- If a **named function** shows up in the flame graph:
  - It’s likely **user-defined code** (non-React).
- If the function name is a **React component**, the cause is likely:
  - **Too many renders** or excessive React reactivity.

## Fixing Long Tasks

### 1. **Split or Shorten Tasks**

- Breaking up a large task into smaller chunks improves responsiveness.
- This allows the browser to **yield** and handle user input between chunks.

### 2. **Yield to Main Thread**

- Splitting tasks is often called **"yielding to main"**.
- When chaining multiple operations, yield between them to unblock UI rendering.

#### Using the Scheduler API

```ts
const sleep = (ms: number) => {
  const start = Date.now();
  while (Date.now() - start < ms) {
    // busy wait
  }
};

for (let i = 0; i < 10; i++) {
  sleep(10);
  await scheduler.yield(); // explicitly yield to main thread
}
```

- `scheduler.yield()` is modern and **not yet supported in all browsers**.

#### Fallback with `setTimeout`

```ts
const yieldToMainThread = () => {
  return new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
};
```

- This mimics yielding behavior and works in all modern environments.

> Note: In React apps, you rarely need this. Most expensive tasks are wrapped in React’s internal scheduler (e.g., via `useState`, `useEffect`).

## React DevTools for Interactions

- Install **React DevTools** for two new tabs:
  - **Profiler**
  - **Components**
- Only available in **development mode**.

### Profiler Features

- In **Settings**, enable:
  - ✅ "Highlight updates when components render"
- This highlights components **every time they re-render**—great for spotting unnecessary renders.
- Profiler allows you to:
  - Record performance traces (similar to Chrome DevTools).
  - View a **component flame graph** showing render hierarchy and timing.

> The Profiler’s flame graph is typically **more readable** than Chrome's for React-specific performance.

---

## Summary

- Debug **interaction performance in dev mode**, not production.
- Use **CPU throttling** and the **Performance Panel** to spot long tasks.
- Identify if long tasks come from:
  - Custom functions (non-React logic)
  - React components (excessive re-renders)
- Split tasks or **yield to main** to unblock the browser.
- Use **React DevTools Profiler** to trace and fix unnecessary component renders.

> Pro tip: Interaction bottlenecks are often caused by long tasks or excessive rendering—start by inspecting those red blocks in the Main thread.

---

# Getting Rid of Unnecessary Re-renders

## Re-renders Basics

- A React app initially **mounts** on first render:
  - Components are created.
  - Lifecycle hooks run.
  - DOM nodes are hydrated or created.
- After mounting, any state change triggers **re-renders**, not remounts.
- Re-renders are faster than mounts—React reuses existing DOM.
- The **only** way to cause a re-render is to **update state**:
  - This includes `useState`, `useReducer`, `useSyncExternalStore`, or any external state management library.
- Once a component re-renders:
  - All **child components** will re-render too, unless explicitly memoized.

### How Props Affect Re-rendering

- **Props alone do not cause re-renders**.
  - The only time props matter is when they are **derived from updated state**.
- For **memoized components**, React checks if **any prop changed**:
  - If so, the component re-renders.
  - If not, it skips rendering.

> To skip re-renders reliably, memoize **both the component** and **all its props**.

### Re-render Hierarchy and Component Positioning

#### Component Tree Behavior

- Re-renders flow **top-down**, never bottom-up.
  - State updates cause children to re-render.
  - Parent components are unaffected by child state.
- Creating components **inside other components** is discouraged:
  - This causes **remounting** on each re-render.
  - Leads to performance issues and subtle bugs.

#### When to Re-mount on Purpose

- Use the `key` prop to **force remounts** or **preserve sibling state**.

  - Provide a stable `key` to control lifecycle behavior intentionally.

## Re-renders Situation in the Search Field

- If a state update triggers many components to re-render:
  - **Move the state "down"** to the smallest component that needs it.
- Alternatively, use **debouncing** for controlled inputs to limit re-render frequency.

### Passing Components via Props

- If you **can’t move state down**, use this trick:
  - Wrap state logic in a component.
  - Pass that component as a **prop** (e.g., `content`) to isolate updates.

```jsx
const LayoutWithSearch = ({ content }) => {
  const [search, setSearch] = useState("");
  return (
    <AppLayoutLazySidebar search={search} setSearch={setSearch}>
      {content}
      <div>Search results for {search}</div>
    </AppLayoutLazySidebar>
  );
};

export default function App() {
  return <LayoutWithSearch content={<DashboardPage />} />;
}
```

- You can simplify by renaming the prop to `children`:
  - This allows JSX nesting and syntactic sugar.

```jsx
export default function App() {
  return (
    <LayoutWithSearch>
      <DashboardPage />
    </LayoutWithSearch>
  );
}
```

## Avoiding Props Drilling

- To share state **without drilling** through props:
  - Use **React Context**.
  - Create a provider at the top level, and consume state wherever needed.

> Context helps avoid unnecessary renders **only if** used with memoization correctly.

## Memoization

### Three React Memoization Tools

- `useMemo`: Memoize objects/arrays.
- `useCallback`: Memoize functions.
- `memo`: Memoize components.

```jsx
const App = () => {
  const dataMemo = useMemo(() => [{ id: 1 }, { id: 2 }], []);
};

const App = () => {
  const onClickMemo = useCallback(() => {
    console.log("Button clicked");
  }, []);
};

const App = () => <div>...</div>;
const AppMemo = memo(App);
```

### Memoizing Everything

- Wrap all props passed to `memo`ized components:
  - Arrays → `useMemo`
  - Functions → `useCallback`
  - Components → `memo`
- Forgetting to memoize **even one prop** breaks memoization.

```jsx
// wrapped in memo to prevent re-renders
const DashboardPageMemo = memo(DashboardPage);
export default function App() {
  // state here
  // wrap objects and arrays in useMemo
  const dataMemo = useMemo(() => [{ id: 1 }, { id: 2 }], []);
  // wrap functions in useCallback
  const onClickMemo = useCallback(() => {
    console.log("Button clicked");
  }, []);

  return (
    <AppLayoutLazySidebar search={search} setSearch={setSearch}>
      {/* don't forget to memoize ALL the props! */}
      <DashboardPageMemo data={dataMemo} onClickMemo={onClickMemo} />
      <div>Search results for {search}</div>
    </AppLayoutLazySidebar>
  );
}
```

### Memoizing Children Properly

- When passing components via `children`, memoizing the parent isn't enough.
- Children in JSX are **React elements**, not components:
  - Memoizing them requires `useMemo`, not `memo`.

```jsx
export default function App() {
  // state here
  const memoChild = useMemo(() => {
    return <ChildComponentMemo />;
  }, []);
  return (
    <AppLayoutLazySidebar search={search} setSearch={setSearch}>
      <DashboardPageMemo>{memoChild}</DashboardPageMemo>
    </AppLayoutLazySidebar>
  );
}
```

## Summary

- State updates always trigger re-renders—optimize where that state lives.
- Avoid remounting by not defining components inline.
- Memoization works only when **everything passed** is memoized.
- Use context to avoid props drilling, but memoize context consumers too.
- Debounce input and isolate re-renders to keep interactions responsive.

> Pro tip: The best optimization is not rendering at all—structure state and components so that updates affect the smallest possible subtree.

---

# React Compiler

## What Is React Compiler

- React Compiler is **not part of the React library**—it’s a separate tool implemented as a **Babel plugin**.
- It runs during the build step and transforms your React code into a more optimized form.
- It’s **not yet considered production-ready** for all use cases.

## What the Compiler Does

- Like any Babel plugin, it **rewrites code** before it reaches the browser.
- The primary goal is to **automatically apply memoization**:
  - It doesn't wrap components in `memo`, `useMemo`, or `useCallback`.
  - Instead, it transforms the code to behave as if it were memoized.
- Think of the compiler as an **auto-memoization layer** that tries to reduce unnecessary re-renders.

## The Performance Impact of the Compiler

- Interaction performance often **improves significantly** with the compiler:
  - Reduces unnecessary re-renders → better INP (Interaction to Next Paint).
- But it introduces trade-offs:
  - Bundle size can increase.
  - Initial load performance (e.g., LCP) may worsen due to more JavaScript.
  - The "main" thread may have **larger initial tasks** from heavier compiled code.
- When React Compiler is active, components will show a **"Memo" label** in React DevTools.
- This helps identify components that were optimized by the compiler.

## Not Everything Can Be Caught by the Compiler

- **Not all code can be optimized**:
  - If the code is too complex or written in unusual patterns, the compiler may bail out.
  - Bugs or anti-patterns in your code can still trigger unnecessary re-renders.
- External libraries are **not transformed** unless they are compiled with React Compiler themselves.
- So performance gains may be **limited by dependencies** you don’t control.

## Is It Worth It?

- React Compiler can offer **substantial interaction performance gains**, especially in large apps.
- However:
  - It doesn’t catch _every_ re-render.
  - It adds a layer of abstraction—**harder to reason about render behavior** just by reading the source code.
  - **Debugging becomes more complex** due to auto-transformed logic.

## Summary

- React Compiler automates memoization and reduces interaction-triggered re-renders.
- Helps improve **INP**, but may slightly degrade **LCP** due to more compiled JS.
- Not all code is optimizable—complex or third-party code can limit effectiveness.
- Makes render behavior less obvious—be cautious when debugging.
- Best results come from **clean, predictable component structure**.

> Pro tip: Use the compiler when you're optimizing for interactivity at scale, but keep profiling tools close—automation doesn't mean infallibility.
