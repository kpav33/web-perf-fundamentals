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

---

## Exploring Network Conditions

- Use **Network throttling** to simulate users on slow/mobile connections.

- **Latency vs Bandwidth:**

  - Even with fast download speeds, high latency delays initial response.
  - Latency affects how fast resources like CSS/JS are fetched, increasing LCP.

- **Solution: Use a CDN (Content Delivery Network):**
  - Reduces latency by serving static assets from geographically distributed servers.
  - Offloads traffic from the origin server.
  - Critical for improving TTFB and LCP.

---

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
