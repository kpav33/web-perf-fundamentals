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
