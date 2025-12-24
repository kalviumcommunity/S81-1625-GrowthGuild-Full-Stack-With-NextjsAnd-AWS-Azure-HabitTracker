
# 1. Habit Tracker – Rendering Strategies in Next.js (App Router)

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



## 2. Multi-Environment Deployment Setup

This project is configured with three environments:
- Development
- Staging
- Production

Each environment has its own configuration using environment variables.

### Environment Files
- `.env.development` → local development
- `.env.staging` → staging deployment
- `.env.production` → production deployment

Only `.env.example` is committed to GitHub to prevent exposing sensitive data.

### Secure Secret Management
All real secrets such as database credentials and API URLs are stored securely using GitHub Secrets. These values are injected during build or runtime and are never hardcoded in the application.

### Build Verification
Separate build commands were used to verify each environment:
- `npm run build:staging`
- `npm run build:production`

Each build points to the correct backend and configuration.

### Security Measures
- `.env` files are ignored via `.gitignore`
- No secrets are committed to version control
- Frontend access is limited to `NEXT_PUBLIC_*` variables only

### Reflection
Multi-environment setups reduce deployment risk by isolating development, testing, and production. This prevents accidental production failures and improves CI/CD reliability by catching issues earlier in staging environments.


## 3. Cloud Deployment Overview

This project demonstrates a modern cloud deployment workflow using Docker, CI/CD, and cloud platforms like AWS or Azure.

### Docker
The application is containerized using Docker to ensure consistency across development and production environments.

### CI/CD Pipeline
GitHub Actions is used to automate the build process whenever code is pushed to the main branch. This ensures early detection of build failures and enforces consistent deployments.

### Cloud Deployment
In a production setup, the Docker image would be pushed to a cloud container registry and deployed using AWS ECS or Azure App Service.

### Benefits
- Consistent environments using Docker
- Automated builds with CI/CD
- Scalable and reliable cloud hosting

### Reflection
Using Docker and CI/CD reduces deployment errors and enables faster iteration. Cloud platforms further improve scalability and availability, making this approach suitable for production-grade applications.

### Environment Configuration

Environment variables are managed using `.env` files located at the project root.  
Only `.env.example` is committed to version control, while actual environment-specific files are ignored for security.

This approach follows industry best practices and ensures safe configuration across development, staging, and production environments.

## 4 🧹 Code Quality & Consistency

### Strict TypeScript
The project uses TypeScript strict mode to catch potential errors at compile time, such as implicit `any` types, unused variables, and casing mismatches. This reduces runtime bugs and improves reliability.

### ESLint & Prettier
ESLint enforces best practices and Next.js standards, while Prettier ensures consistent code formatting across the codebase. Conflicting rules are disabled to allow seamless integration.

### Pre-Commit Hooks
Pre-commit hooks are configured using Husky and lint-staged to automatically run ESLint and Prettier on staged files. This guarantees that only clean, consistent code is committed to the repository.

This setup improves maintainability, enforces team-wide coding standards, and supports scalable development.

## 5 🔐 Environment Variables & Secrets Management

This project uses environment variables to manage configuration securely.

### Environment Files
- `.env.local`: Stores real credentials and is ignored by Git.
- `.env.example`: Template file listing all required variables with placeholder values.

### Server-side Variables
- `DATABASE_URL`
  - Used for database connections
  - Available only on the server
  - Never exposed to the client

### Client-side Variables
- `NEXT_PUBLIC_API_BASE_URL`
  - Safe to expose to the frontend
  - Used for API requests
- `NEXT_PUBLIC_APP_ENV`
  - Indicates the current environment

### Security Practices
- Only variables prefixed with `NEXT_PUBLIC_` are accessible in client-side code.
- `.env.local` is ignored using `.gitignore` to prevent accidental commits.
- Sensitive variables are never accessed inside client components.

### Setup Instructions
To replicate the setup:
1. Copy `.env.example` to `.env.local`
2. Replace placeholder values with real credentials


## 6 🌿 Branching & Pull Request Workflow

### Branch Naming Convention
We follow a consistent branch naming strategy:
- `feature/<feature-name>`
- `fix/<bug-name>`
- `chore/<task-name>`
- `docs/<update-name>`

This improves clarity, traceability, and collaboration.

### Pull Request Template
All PRs use a standardized template to clearly communicate intent, changes, and validation steps.

### Code Review Process
Every PR is reviewed using a checklist covering:
- Code quality
- Functionality
- Linting and formatting
- Security and secret management

### Branch Protection
The `main` branch is protected with:
- Mandatory pull request reviews
- Required status checks
- Disabled direct pushes

### Reflection
This workflow ensures consistent code quality, prevents accidental breaking changes, and enables faster, safer collaboration within the team.
