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
