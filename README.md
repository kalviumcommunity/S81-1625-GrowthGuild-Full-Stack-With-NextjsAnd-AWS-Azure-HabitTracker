
# Habit Tracker – Rendering Strategies in Next.js (App Router)

This project demonstrates how Next.js App Router supports multiple rendering strategies — Static Site Generation (SSG), Server-Side Rendering (SSR), and Hybrid Rendering using Incremental Static Regeneration (ISR).

The goal is to understand when to use each strategy and how it impacts performance, scalability, and user experience in a real-world application.

---

## Rendering Strategies Used

### 1. Static Rendering (SSG)

**Page:** `/about`

**Rendering Type:** Static Site Generation (SSG)

**Why this approach was chosen:**
The About page contains informational content that does not change frequently. Since it is the same for all users, it is ideal to generate this page at build time.

**Caching Behavior:**
- Page is generated once during build
- Served as static HTML for every request
- No server computation on page load

**Performance Benefit:**
This results in the fastest possible load time and zero server cost per request, improving Time to First Byte (TTFB).

---

### 2. Dynamic Rendering (SSR)

**Page:** `/dashboard`

**Rendering Type:** Server-Side Rendering (SSR)

**Why this approach was chosen:**
The Dashboard displays user-specific and real-time data such as habit completion count and timestamps. This data must always be fresh and accurate.

**Caching Behavior:**
- Page is rendered on every request
- Caching is disabled using `cache: 'no-store'`
- Data is fetched at request time

**Performance Trade-off:**
While SSR is slightly slower than static pages and increases server load, it guarantees real-time accuracy and personalization.

---

### 3. Hybrid Rendering (ISR)

**Page:** `/habits`

**Rendering Type:** Incremental Static Regeneration (ISR)

**Why this approach was chosen:**
The Habits page shows commonly used or popular habits that change occasionally but not in real time. It benefits from being fast while still staying up to date.

**Caching & Revalidation Behavior:**
- Page is generated at build time
- Revalidated every 60 seconds
- Next.js regenerates the page in the background

**Performance Benefit:**
This provides near-static performance while keeping content reasonably fresh without rebuilding the entire app.

---

## Evidence of Rendering Modes

Screenshots and logs from the deployed application show:
- Static pages loading instantly without network re-fetch
- Dynamic pages making server requests on every refresh
- ISR pages updating only after the revalidation interval

(Attach screenshots of Network tab and console logs here)

---

## Reflection: Scaling to 10x Users

If the application had 10x more users, using Server-Side Rendering for all pages would significantly increase server cost and response time.

To scale efficiently:
- Static pages would remain fully static
- Many SSR pages would be converted to ISR
- SSR would be limited only to pages requiring real-time or user-specific data

By using static caching and revalidation wisely, the application would handle higher traffic with lower cost and better performance.

---

## Conclusion

Choosing the correct rendering strategy is a critical architectural decision. Static rendering improves speed and scalability, SSR ensures accuracy, and ISR provides the best balance for production applications.
=======
# Habit-Tracker
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started !!!!

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


