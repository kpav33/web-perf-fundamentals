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
