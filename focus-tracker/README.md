# 🎯 HabitFlow - Full-Stack Habit Tracker

A modern, full-stack habit tracking application built with Next.js 15, TypeScript, Prisma, and PostgreSQL. Features secure authentication, real-time updates, cloud file uploads using AWS S3 pre-signed URLs, and transactional emails via AWS SES.

## 🚀 Features

- **User Authentication** - JWT-based secure login/signup with bcrypt password hashing
- **Habit Management** - Create, update, delete, and track daily habits
- **Dashboard Analytics** - Visual progress tracking and statistics
- **Cloud File Uploads** - Secure file uploads using AWS S3 pre-signed URLs
- **Transactional Emails** - Welcome emails, password resets, and notifications via AWS SES
- **Redis Caching** - Optional Redis caching for improved performance
- **Modern UI** - Responsive design with Tailwind CSS and glass-morphism effects
- **Dark/Light Theme** - Theme switching with localStorage persistence and system preference detection
- **App Router** - Next.js 13+ file-based routing with dynamic routes

---

## 🎨 Responsive Design & Theming

### Tailwind CSS v4 Configuration

This project uses **Tailwind CSS v4** with CSS-based configuration in `globals.css`. The theme is configured using the `@theme` directive and CSS custom properties.

#### Custom Breakpoints

| Breakpoint | Min Width | Description |
|------------|-----------|-------------|
| `xs` | 475px | Extra small devices |
| `sm` | 640px | Small devices (mobile landscape) |
| `md` | 768px | Medium devices (tablets) |
| `lg` | 1024px | Large devices (desktops) |
| `xl` | 1280px | Extra large screens |
| `2xl` | 1536px | Wide screens |

#### Brand Color Palette

```css
/* Primary (Cyan/Teal) */
--color-brand-500: #06b6d4;  /* Main brand color */
--color-brand-600: #0891b2;  /* Hover states */

/* Accent (Fuchsia/Purple) */
--color-accent-500: #d946ef;
--color-accent-600: #c026d3;

/* Status Colors */
--color-success-500: #10b981;  /* Green */
--color-warning-500: #f59e0b;  /* Amber */
--color-danger-500: #ef4444;   /* Red */
```

### Theme System

#### Light/Dark Mode Implementation

The theme system uses CSS custom properties that change based on the `light` or `dark` class on the `<html>` element:

```css
/* Dark theme (default) */
:root, html.dark {
  --background: #0d0d0d;
  --foreground: #f0f0f0;
  --primary: #00e5ff;
  --card-bg: #1a1a1a;
}

/* Light theme */
html.light {
  --background: #f8fafc;
  --foreground: #1e293b;
  --primary: #0891b2;
  --card-bg: #ffffff;
}
```

#### Theme Toggle Implementation

Located in `src/components/layout/Sidebar.tsx`:

```tsx
const { isDarkMode, toggleTheme, setTheme } = useTheme();

// Toggle between dark/light
<button onClick={toggleTheme}>
  {isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
</button>

// Set specific theme
setTheme("light");   // Force light
setTheme("dark");    // Force dark
setTheme("system");  // Follow system preference
```

#### Features:
- ✅ **localStorage Persistence** - Theme choice survives page refresh
- ✅ **System Preference Detection** - Respects `prefers-color-scheme`
- ✅ **Smooth Transitions** - 300ms fade between themes
- ✅ **Accessible** - ARIA labels for toggle button

### Responsive Design Patterns

#### Mobile-First Approach

All styles are written mobile-first, then enhanced for larger screens:

```tsx
// Typography scales up on larger screens
<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
  Responsive Heading
</h1>

// Grid columns increase with screen size
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  {items.map(item => <Card key={item.id} />)}
</div>

// Padding increases with screen size
<div className="p-4 md:p-6 lg:p-8">
  Content
</div>
```

#### Responsive Grid Layout

```tsx
// Stats cards: 1 → 2 → 4 columns
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">

// Main content: full width → sidebar layout
<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
```

#### Flex Direction Changes

```tsx
// Stack vertically on mobile, horizontal on larger screens
<div className="flex flex-col md:flex-row gap-4">
```

### Color Contrast & Accessibility

#### WCAG Compliance

| Element | Light Mode | Dark Mode | Contrast Ratio |
|---------|------------|-----------|----------------|
| Body text | #1e293b on #f8fafc | #f0f0f0 on #0d0d0d | ≥7:1 (AAA) |
| Primary buttons | White on #0891b2 | White on #00e5ff | ≥4.5:1 (AA) |
| Muted text | #94a3b8 on #ffffff | #888888 on #1a1a1a | ≥4.5:1 (AA) |

#### Focus Indicators

```css
:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}
```

#### Reduced Motion Support

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Demo Pages

- `/responsive-demo` - Interactive demo of responsive breakpoints and theme switching
- `/state-demo` - Theme state management examples

### Testing Responsiveness

1. Open Chrome DevTools → Device Toolbar (Ctrl+Shift+M)
2. Test with presets: iPhone SE, iPad, Laptop
3. Verify:
   - [ ] Text remains readable at all sizes
   - [ ] Grid layouts adapt correctly
   - [ ] Touch targets are ≥44px on mobile
   - [ ] No horizontal scrolling

---

## 🛣️ Routing Architecture

### Route Map

```
app/
├── page.tsx               → / (Home - Public)
├── login/
│   └── page.tsx           → /login (Public)
├── signup/
│   └── page.tsx           → /signup (Public)
├── about/
│   └── page.tsx           → /about (Public)
├── dashboard/
│   └── page.tsx           → /dashboard (Protected)
├── habits/
│   └── page.tsx           → /habits (Protected)
├── users/
│   ├── page.tsx           → /users (Protected - List all users)
│   └── [id]/
│       └── page.tsx       → /users/:id (Protected - Dynamic route)
├── uploads/
│   └── page.tsx           → /uploads (Protected)
├── not-found.tsx          → Custom 404 page
├── error.tsx              → Error boundary
├── layout.tsx             → Root layout with Navbar
└── middleware.ts          → Route protection
```

### Route Types

| Route | Type | Description |
|-------|------|-------------|
| `/` | Public | Landing page with features showcase |
| `/login` | Public | User authentication |
| `/signup` | Public | New user registration |
| `/about` | Public | About the application |
| `/dashboard` | Protected | User's habit tracking dashboard |
| `/habits` | Protected | Manage personal habits |
| `/users` | Protected | Browse all users directory |
| `/users/[id]` | Protected + Dynamic | View individual user profiles |
| `/uploads` | Protected | File upload management |

### Key Routing Concepts

#### 1. File-Based Routing
```
app/
├── page.tsx          → Defines route at /
├── users/
│   └── page.tsx      → Defines route at /users
```

#### 2. Dynamic Routes
```
app/users/[id]/page.tsx → Matches /users/1, /users/42, etc.
```

The `[id]` folder creates a dynamic segment that captures any value.

#### 3. Layout Wrapping
```tsx
// app/layout.tsx wraps ALL pages with shared UI
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
```

#### 4. Middleware Protection
```typescript
// middleware.ts
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Public routes bypass auth
  if (["/", "/login", "/signup", "/about"].includes(pathname)) {
    return NextResponse.next();
  }
  
  // Protected routes check for JWT
  // Client-side: ProtectedRoute component
  // API: Authorization header validation
}
```

### Breadcrumbs Navigation

Dynamic breadcrumbs are implemented for SEO and UX:

```tsx
// Example: /users/42 shows:
// Home > Users > John Doe
<Breadcrumbs items={[
  { label: "Home", href: "/" },
  { label: "Users", href: "/users" },
  { label: "John Doe", href: "/users/42" },
]} />
```

### Error Handling

| File | Purpose |
|------|---------|
| `not-found.tsx` | Custom 404 page for missing routes |
| `error.tsx` | Error boundary for runtime errors |

### SEO Benefits

1. **Clean URLs** - `/users/42` instead of `/users?id=42`
2. **Semantic Structure** - Route hierarchy reflects content hierarchy
3. **Breadcrumbs** - Schema.org structured data for search engines
4. **Static Metadata** - Each page can define its own meta tags

---

## 📁 Project Structure

```
focus-tracker/
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── migrations/          # Database migrations
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/        # Login & Signup endpoints
│   │   │   ├── habits/      # Habit CRUD operations
│   │   │   ├── dashboard/   # Dashboard stats API
│   │   │   ├── upload/      # Pre-signed URL generation
│   │   │   ├── files/       # File metadata storage
│   │   │   ├── email/       # Transactional email API
│   │   │   └── users/       # User management
│   │   ├── dashboard/       # User dashboard (Protected)
│   │   ├── habits/          # Habits page (Protected)
│   │   ├── users/           # Users list (Protected)
│   │   │   └── [id]/        # Dynamic user profile
│   │   ├── uploads/         # File uploads page (Protected)
│   │   ├── login/           # Login page (Public)
│   │   ├── signup/          # Signup page (Public)
│   │   ├── about/           # About page (Public)
│   │   ├── not-found.tsx    # Custom 404 page
│   │   ├── error.tsx        # Error boundary
│   │   └── middleware.ts    # Route protection
│   ├── components/
│   │   ├── FileUpload.tsx   # Drag & drop file upload
│   │   ├── Breadcrumbs.tsx  # SEO-friendly navigation
│   │   ├── Navbar.tsx       # Navigation with auth state
│   │   └── ProtectedRoute.tsx
│   ├── context/
│   │   └── AuthContext.tsx  # Global auth state
│   └── lib/
│       ├── prisma.ts        # Database client
│       ├── redis.ts         # Redis client (optional)
│       ├── s3.ts            # AWS S3 utilities
│       ├── email.ts         # AWS SES email client
│       └── emailTemplates.ts # HTML email templates
└── .env.example             # Environment template
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Redis (optional)
- AWS S3 bucket (for file uploads)

### Installation

1. **Clone and install dependencies:**
   ```bash
   cd focus-tracker
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

3. **Run database migrations:**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open** [http://localhost:3000](http://localhost:3000)

---

## ☁️ File Uploads with Pre-Signed URLs

### Why Pre-Signed URLs?

Direct file uploads through your backend can overload your server and expose credentials. Pre-signed URLs offer:

| Advantage | Description |
|-----------|-------------|
| **Security** | AWS credentials stay hidden; uploads go directly to S3 |
| **Scalability** | Backend only generates URLs, not handle file streams |
| **Performance** | Upload latency decreases since files bypass the app server |

### Upload Flow Diagram

```
┌─────────────┐     1. Request URL      ┌─────────────┐
│   Client    │ ──────────────────────► │   Server    │
│  (Browser)  │                         │  (Next.js)  │
└─────────────┘                         └─────────────┘
       │                                       │
       │                                       │ 2. Validate & Generate
       │                                       │    Pre-signed URL
       │      3. Return signed URL             │
       │ ◄─────────────────────────────────────│
       │
       │      4. Direct Upload (PUT)     ┌─────────────┐
       │ ─────────────────────────────► │   AWS S3    │
       │                                 │   Bucket    │
       │      5. Upload Success         └─────────────┘
       │ ◄─────────────────────────────
       │
       │      6. Store metadata          ┌─────────────┐
       │ ─────────────────────────────► │  Database   │
       │                                 │ (PostgreSQL)│
       └─────────────────────────────── └─────────────┘
```

### API Endpoints

#### 1. Generate Pre-Signed URL
```http
POST /api/upload
Content-Type: application/json

{
  "filename": "document.pdf",
  "fileType": "application/pdf",
  "fileSize": 1024000,
  "userId": 1
}
```

**Response:**
```json
{
  "success": true,
  "uploadUrl": "https://bucket.s3.region.amazonaws.com/...",
  "key": "users/1/1705123456789-abc123-document.pdf",
  "fileUrl": "https://bucket.s3.region.amazonaws.com/users/1/...",
  "expiresIn": 60
}
```

#### 2. Upload File to S3
```http
PUT {uploadUrl}
Content-Type: application/pdf

[Binary file data]
```

#### 3. Store File Metadata
```http
POST /api/files
Content-Type: application/json

{
  "name": "document.pdf",
  "key": "users/1/1705123456789-abc123-document.pdf",
  "url": "https://bucket.s3.region.amazonaws.com/...",
  "fileType": "application/pdf",
  "size": 1024000,
  "uploadedBy": 1
}
```

### AWS S3 Setup

1. **Create S3 Bucket** in AWS Console
2. **Configure CORS** on the bucket:
   ```json
   [
     {
       "AllowedHeaders": ["*"],
       "AllowedMethods": ["GET", "PUT", "POST"],
       "AllowedOrigins": ["http://localhost:3000", "https://yourdomain.com"],
       "ExposeHeaders": ["ETag"]
     }
   ]
   ```

3. **Create IAM User** with S3 permissions:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "s3:PutObject",
           "s3:GetObject",
           "s3:DeleteObject"
         ],
         "Resource": "arn:aws:s3:::your-bucket-name/*"
       }
     ]
   }
   ```

4. **Add credentials to .env:**
   ```
   AWS_ACCESS_KEY_ID=your-access-key
   AWS_SECRET_ACCESS_KEY=your-secret-key
   AWS_REGION=ap-south-1
   AWS_BUCKET_NAME=your-bucket-name
   ```

---

## 🔒 Security Considerations

| Concern | Mitigation |
|---------|------------|
| **Credential Exposure** | AWS keys never sent to client; only signed URLs |
| **URL Expiry** | Pre-signed URLs expire in 60 seconds |
| **File Validation** | Type and size validated before URL generation |
| **Public vs Private** | Files stored privately; accessed via signed URLs |
| **Lifecycle Policies** | Configure S3 lifecycle rules for auto-cleanup |

### Allowed File Types
- Images: `image/jpeg`, `image/png`, `image/gif`, `image/webp`
- Documents: `application/pdf`, `application/msword`, `.docx`

### File Size Limit
- Maximum: **10 MB**

### Lifecycle Policy Recommendations

Configure in S3 bucket settings:
- Move to Glacier after 90 days (cost optimization)
- Delete incomplete multipart uploads after 7 days
- Optional: Auto-delete files after 1 year

---

## 🧪 Testing the Upload Flow

### Using the UI
1. Login to the application
2. Navigate to **Uploads** page
3. Drag & drop or click to select a file
4. Watch the progress bar as file uploads directly to S3
5. See the file appear in your files list

### Using Postman

1. **Get upload URL:**
   ```
   POST http://localhost:3000/api/upload
   Body: { "filename": "test.png", "fileType": "image/png" }
   ```

2. **Upload to S3:**
   ```
   PUT {uploadUrl from step 1}
   Headers: Content-Type: image/png
   Body: [Select file in Binary mode]
   ```

3. **Save metadata:**
   ```
   POST http://localhost:3000/api/files
   Body: { "name": "test.png", "key": "...", "url": "...", "fileType": "image/png" }
   ```

---

## 📊 Database Schema

```prisma
model File {
  id          Int      @id @default(autoincrement())
  name        String
  key         String   @unique  // S3 object key
  url         String
  fileType    String
  size        Int?
  uploadedBy  Int?
  user        User?    @relation(...)
  createdAt   DateTime @default(now())
}
```

---

## 🔄 Trade-offs and Reflections

### Pre-Signed URLs vs Direct Upload

| Approach | Pros | Cons |
|----------|------|------|
| **Pre-signed URL** | Secure, scalable, fast | Extra API call, URL expiry |
| **Direct to Backend** | Simple | Slow, insecure, memory-heavy |

### Public vs Private File Access

- **Private (Recommended)**: Files require authentication; use signed URLs for access
- **Public**: Faster access but exposes all files to anyone with the URL

### Lifecycle Management Benefits

1. **Cost Reduction**: Auto-archive old files to cheaper storage tiers
2. **Compliance**: Auto-delete files after retention period
3. **Security**: Reduce attack surface by removing stale data

---

## � Transactional Emails with AWS SES

### Why Transactional Emails Matter

Transactional emails are trigger-based notifications sent automatically by your backend:

| Event | Email Type |
|-------|------------|
| User signs up | Welcome email |
| Password reset request | Reset link |
| Habit streak milestone | Streak notification |
| Account activity | Security alert |

### Email Flow Diagram

```
┌─────────────┐     1. User Action       ┌─────────────┐
│   Client    │ ──────────────────────► │   Server    │
│  (Browser)  │                         │  (Next.js)  │
└─────────────┘                         └─────────────┘
                                               │
                                               │ 2. Trigger Email
                                               │    (non-blocking)
                                               ▼
                                        ┌─────────────┐
                                        │   AWS SES   │
                                        │   Service   │
                                        └─────────────┘
                                               │
                                               │ 3. Deliver Email
                                               ▼
                                        ┌─────────────┐
                                        │   User's    │
                                        │   Inbox     │
                                        └─────────────┘
```

### Email API Endpoints

#### Check Configuration
```http
GET /api/email
```
**Response:**
```json
{
  "success": true,
  "configured": true,
  "provider": "AWS SES"
}
```

#### Send Email with Template
```http
POST /api/email
Content-Type: application/json

{
  "to": "user@example.com",
  "template": "welcome",
  "templateData": {
    "userName": "John"
  }
}
```

#### Available Templates

| Template | Required Data | Description |
|----------|---------------|-------------|
| `welcome` | `userName` | Welcome email after signup |
| `password-reset` | `userName`, `resetToken` | Password reset link |
| `streak` | `userName`, `habitName`, `streakDays` | Habit streak celebration |
| `activity-alert` | `userName`, `activityType`, `details` | Security notification |
| `notification` | `userName`, `title`, `message`, `ctaText?`, `ctaUrl?` | Generic notification |

#### Send Raw Email
```http
POST /api/email
Content-Type: application/json

{
  "to": "user@example.com",
  "subject": "Hello!",
  "message": "<h1>Welcome</h1><p>This is a test email.</p>"
}
```

### AWS SES Setup

1. **Verify Email/Domain** in AWS SES Console
   - Go to SES → Verified identities → Create identity
   - Verify your sender email or domain

2. **Request Production Access** (for sandbox exit)
   - In sandbox mode, you can only send to verified emails
   - Request production access for unrestricted sending

3. **Add to .env:**
   ```env
   AWS_ACCESS_KEY_ID=your-access-key
   AWS_SECRET_ACCESS_KEY=your-secret-key
   AWS_REGION=ap-south-1
   SES_EMAIL_SENDER=no-reply@yourdomain.com
   ```

### Testing Email Sending

**Using cURL:**
```bash
curl -X POST http://localhost:3000/api/email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "your-verified-email@example.com",
    "template": "welcome",
    "templateData": { "userName": "Test User" }
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Email sent successfully",
  "messageId": "01010189b2example123"
}
```

**Console Log:**
```
✅ Email sent successfully: 01010189b2example123
```

### Email Security & Best Practices

| Concern | Solution |
|---------|----------|
| **Sandbox Mode** | Only verified emails receive messages; request production access |
| **Rate Limits** | SES: 1 email/sec (sandbox), 14/sec (production) - implement queuing |
| **Bounces** | Monitor SES dashboard; handle bounces to protect sender reputation |
| **Spam Compliance** | Include unsubscribe link; authenticate with SPF/DKIM |
| **Non-blocking** | Send emails asynchronously; don't block user actions |

### Sandbox vs Production

| Feature | Sandbox | Production |
|---------|---------|------------|
| Recipients | Verified only | Anyone |
| Daily limit | 200 emails | Based on quota |
| Rate limit | 1/second | 14/second |
| Setup | Automatic | Requires approval |

---

## 🏗️ Component Architecture

HabitFlow uses a modular component architecture for maintainability, reusability, and scalability.

### Component Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│                        RootLayout                           │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                      Header                            │  │
│  │   [Logo] [Nav Links] [Auth Status]                    │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌─────────────┬─────────────────────────────────────────┐  │
│  │   Sidebar   │              Main Content               │  │
│  │   (opt.)    │   ┌─────────────────────────────────┐   │  │
│  │             │   │         PageHeader              │   │  │
│  │  • Home     │   │   [Title] [Subtitle] [Actions]  │   │  │
│  │  • Dashboard│   └─────────────────────────────────┘   │  │
│  │  • Habits   │   ┌─────────────────────────────────┐   │  │
│  │  • Users    │   │       Page Content              │   │  │
│  │  • Uploads  │   │   [Cards] [Forms] [Lists]       │   │  │
│  │             │   └─────────────────────────────────┘   │  │
│  └─────────────┴─────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                      Footer                            │  │
│  │   [Logo] [Links] [Tech Badges]                        │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Folder Structure

```
src/components/
├── layout/                    # Layout components
│   ├── Header.tsx            # Navigation header
│   ├── Sidebar.tsx           # Side navigation
│   ├── Footer.tsx            # Page footer
│   ├── LayoutWrapper.tsx     # Layout composition
│   └── index.ts              # Barrel export
├── ui/                        # Reusable UI primitives
│   ├── Button.tsx            # Button component
│   ├── Card.tsx              # Card component
│   ├── InputField.tsx        # Form inputs
│   ├── Modal.tsx             # Modal dialog
│   ├── Badge.tsx             # Status badges
│   └── index.ts              # Barrel export
├── Navbar.tsx                 # Legacy navbar (refactored to Header)
├── Breadcrumbs.tsx           # Breadcrumb navigation
├── FileUpload.tsx            # File upload component
├── ProtectedRoute.tsx        # Auth wrapper
└── index.ts                   # Main barrel export
```

### Component Categories

| Category | Components | Purpose |
|----------|------------|---------|
| **Layout** | Header, Sidebar, Footer, LayoutWrapper | Page structure and navigation |
| **UI** | Button, Card, InputField, Modal, Badge | Reusable UI primitives |
| **Functional** | ProtectedRoute, FileUpload, Breadcrumbs | Feature-specific components |

### Usage Examples

#### Importing Components
```tsx
// Single import from barrel export
import { Button, Card, Header, InputField } from "@/components";

// Category-specific imports
import { Header, Sidebar, Footer } from "@/components/layout";
import { Button, Card, Modal } from "@/components/ui";
```

#### Button Component
```tsx
// Primary button (default)
<Button label="Save Changes" onClick={handleSave} />

// Secondary button
<Button variant="secondary" label="Cancel" />

// Loading state
<Button loading label="Saving..." disabled />

// With icons
<Button 
  leftIcon={<PlusIcon />} 
  label="Add Habit" 
  variant="success" 
/>

// Sizes
<Button size="sm" label="Small" />
<Button size="lg" label="Large" />
```

**Props Contract:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| label | string | - | Button text |
| variant | 'primary' \| 'secondary' \| 'danger' \| 'success' \| 'ghost' | 'primary' | Visual style |
| size | 'sm' \| 'md' \| 'lg' | 'md' | Button size |
| loading | boolean | false | Show loading spinner |
| leftIcon | ReactNode | - | Icon before text |
| rightIcon | ReactNode | - | Icon after text |
| fullWidth | boolean | false | Full width button |

#### Card Component
```tsx
// Basic card
<Card title="My Habits" subtitle="Track your progress">
  <p>Card content here</p>
</Card>

// Stat card with icon
<StatCard 
  value="24" 
  label="Total Habits" 
  icon="📊"
  color="indigo"
  trend={{ value: 12, direction: "up" }}
/>

// Glass morphism card
<Card variant="glass" hoverable onClick={handleClick}>
  <p>Interactive glass card</p>
</Card>
```

#### InputField Component
```tsx
// Basic input
<InputField 
  label="Email" 
  type="email" 
  placeholder="Enter your email"
  required
/>

// With error state
<InputField 
  label="Password" 
  type="password" 
  error="Password must be at least 8 characters"
/>

// With icons
<InputField 
  label="Search" 
  leftIcon={<SearchIcon />}
  placeholder="Search habits..."
/>

// TextArea variant
<TextArea 
  label="Description" 
  rows={4}
  helperText="Optional description for your habit"
/>
```

#### Modal Component
```tsx
const [isOpen, setIsOpen] = useState(false);

<Modal 
  isOpen={isOpen} 
  onClose={() => setIsOpen(false)}
  title="Create New Habit"
  size="md"
  footer={
    <>
      <Button variant="secondary" label="Cancel" onClick={() => setIsOpen(false)} />
      <Button label="Create" onClick={handleCreate} />
    </>
  }
>
  <form>
    <InputField label="Habit Name" required />
    <InputField label="Description" />
  </form>
</Modal>
```

#### Layout Components
```tsx
// Using LayoutWrapper for consistent page structure
<LayoutWrapper variant="default">
  <PageContainer>
    <PageHeader 
      title="Dashboard" 
      subtitle="Track your habit progress"
      actions={<Button label="Add Habit" />}
    />
    {/* Page content */}
  </PageContainer>
</LayoutWrapper>

// Sidebar layout variant
<LayoutWrapper variant="sidebar">
  {/* Content with sidebar */}
</LayoutWrapper>
```

### Design Consistency

All components follow these design principles:

1. **Color Palette**: Uses CSS custom properties for consistent theming
   - Primary: Indigo (#6366f1)
   - Secondary: Cyan (#06b6d4)
   - Success: Emerald (#10b981)
   - Danger: Red (#ef4444)

2. **Spacing**: Consistent padding/margin using Tailwind's spacing scale

3. **Border Radius**: Rounded corners (rounded-xl for cards, rounded-lg for buttons)

4. **Transitions**: All interactive elements have smooth 200-300ms transitions

5. **Dark Mode**: Full support via Tailwind's dark: prefix and CSS variables

### Accessibility Features

| Feature | Implementation |
|---------|---------------|
| **Keyboard Navigation** | All interactive elements are focusable with Tab |
| **ARIA Labels** | Buttons, inputs, and modals have proper aria-* attributes |
| **Focus Indicators** | Visible focus rings on interactive elements |
| **Screen Reader Support** | Hidden decorative icons with aria-hidden="true" |
| **Color Contrast** | WCAG AA compliant color combinations |
| **Error Announcements** | Form errors use role="alert" for screen readers |

### Adding New Components

1. Create component file in appropriate folder (`layout/` or `ui/`)
2. Add TypeScript interface for props
3. Include JSDoc documentation
4. Export from barrel file (`index.ts`)
5. Add usage examples to this README

```tsx
// Example: components/ui/NewComponent.tsx
interface NewComponentProps {
  /** Required prop description */
  title: string;
  /** Optional prop with default */
  variant?: "default" | "alt";
}

/**
 * NewComponent
 * 
 * Brief description of what this component does.
 * 
 * @example
 * <NewComponent title="Hello" variant="alt" />
 */
export default function NewComponent({ title, variant = "default" }: NewComponentProps) {
  // Implementation
}
```

---

## 🚀 Deployment

### Environment Variables Required

```env
DATABASE_URL=postgresql://...
JWT_SECRET=your-secure-secret
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=ap-south-1
AWS_BUCKET_NAME=your-bucket
SES_EMAIL_SENDER=no-reply@yourdomain.com
```

### Deploy to Vercel
```bash
vercel --prod
```

---

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [AWS S3 Pre-Signed URLs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html)
- [AWS SES Developer Guide](https://docs.aws.amazon.com/ses/latest/dg/Welcome.html)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

## 📝 License

MIT License - See LICENSE file for details.

---

## ✅ Assignment: Asynchronous State Handling (Loading + Error)

This project now includes route-level fallback UI for asynchronous states in the App Router so users never see blank or confusing transitions.

### Why This Improves UX

Loading and error states communicate system status clearly:

- **Loading**: Shows structured skeleton UI while data is being fetched.
- **Error**: Prevents hard crashes and offers a clear recovery action.

This keeps trust high by making app behavior predictable, even when network calls are slow or fail.

### Implementation Summary

Implemented route-level fallback files in users routes:

- `src/app/users/loading.tsx`
- `src/app/users/error.tsx`
- `src/app/users/[id]/loading.tsx`
- `src/app/users/[id]/error.tsx`

Updated page behavior so failures are handled by App Router error boundaries:

- `src/app/users/page.tsx`
- `src/app/users/[id]/page.tsx`

Implementation details:

- Replaced spinner-first loading with skeleton-style loaders (`animate-pulse` blocks).
- Added retry-friendly route error UI with `reset()` buttons.
- Added optional slow-network simulation via query param:
  - `/users?demoSlow=1`
  - `/users/1?demoSlow=1`

### Testing States

1. **Skeleton Loading State**
  - Open `/users?demoSlow=1`
  - Open `/users/1?demoSlow=1`
  - Optional: Enable browser network throttling (Fast 3G/Slow 3G)

2. **Error Fallback State**
  - Temporarily break an API route URL or stop API/database service
  - Visit `/users` or `/users/[id]`
  - Confirm the error boundary appears with a `Try Again` action

3. **Successful Retry State**
  - Restore API availability
  - Click `Try Again`
  - Confirm route renders successfully

### Evidence Checklist

Capture and attach screenshots/GIFs for:

- [ ] Skeleton loading UI on `/users`
- [ ] Skeleton loading UI on `/users/[id]`
- [ ] Error fallback UI with retry button
- [ ] Successful render after pressing retry

Recommended path for evidence assets:

- `docs/screenshots/async-states/loading-users.png`
- `docs/screenshots/async-states/loading-user-profile.png`
- `docs/screenshots/async-states/error-state.png`
- `docs/screenshots/async-states/retry-success.png`

### Reflection

Handling async states with skeletons and error boundaries makes the app feel reliable under real-world conditions where latency and failures are normal. Instead of uncertainty or abrupt crashes, users get clear feedback and a safe path to recover, which directly improves confidence and perceived quality.

---

## ✅ Assignment: JWT Sessions with Refresh Tokens

This app now uses a two-token authentication model with automatic refresh and secure cookie practices.

### JWT Structure

JWTs have 3 parts: `header.payload.signature`

- **Header**: Algorithm and token type metadata.
- **Payload**: Claims like `id`, `email`, `role`, `type`, and expiry (`exp`).
- **Signature**: Integrity check using server secrets.

Implemented token payload claims:

- Access token payload: `{ id, email, role, type: "access" }`
- Refresh token payload: `{ id, email, role, type: "refresh" }`

### Access vs Refresh Tokens

- **Access Token**: Short-lived (default `15m`) and sent in `Authorization: Bearer ...`.
- **Refresh Token**: Long-lived (default `7d`) and stored in a secure HTTP-only cookie.

Server implementation:

- Login issues both tokens.
- Refresh endpoint rotates refresh tokens and returns a new access token.
- Logout clears the refresh token cookie.

### Storage and Security Choices

- Access token is stored **in memory only** (client runtime state), not in `localStorage`.
- Refresh token is stored in cookie with:
  - `HttpOnly`
  - `SameSite=Strict`
  - `Secure` in production
  - path-scoped to `/api/auth`
- Sensitive data (passwords, secrets) is never stored in JWT payloads.

### Refresh Flow and Expiry Handling

Flow:

1. User signs in at `/api/auth/login`.
2. Server returns `accessToken` and sets `refreshToken` cookie.
3. Client sends access token in `Authorization` header.
4. If API returns `401`, client calls `/api/auth/refresh`.
5. Server verifies refresh cookie, rotates it, returns a new access token.
6. Client retries original request automatically.

Implemented files:

- `src/lib/authTokens.ts`
- `src/lib/tokenManager.ts`
- `src/app/api/auth/login/route.ts`
- `src/app/api/auth/refresh/route.ts`
- `src/app/api/auth/logout/route.ts`
- `src/lib/fetcher.ts`
- `src/context/AuthContext.tsx`

### Security Risk Reflection (XSS / CSRF / Replay)

- **XSS mitigation**: Refresh token is inaccessible to JavaScript (HTTP-only cookie), and access token is not persisted in browser storage.
- **CSRF mitigation**: `SameSite=Strict` cookie policy and origin validation on auth cookie endpoints (`/api/auth/refresh`, `/api/auth/logout`).
- **Replay risk reduction**: Short-lived access token + refresh token rotation on each refresh.

### Evidence / Verification Checklist

Capture screenshots or API client logs for:

- [ ] Successful login response returning `accessToken`
- [ ] `Set-Cookie` for `refreshToken` with security flags
- [ ] Expired access token request returning `401`
- [ ] Successful `/api/auth/refresh` response with new access token
- [ ] Retried protected request succeeding after refresh
- [ ] Logout clearing refresh cookie

Recommended asset paths:

- `docs/screenshots/jwt-refresh/login-success.png`
- `docs/screenshots/jwt-refresh/refresh-cookie-flags.png`
- `docs/screenshots/jwt-refresh/access-expired-401.png`
- `docs/screenshots/jwt-refresh/refresh-success.png`
- `docs/screenshots/jwt-refresh/request-retry-success.png`
- `docs/screenshots/jwt-refresh/logout-cookie-cleared.png`

### Optional Environment Variables

You can customize token lifetimes with:

- `ACCESS_TOKEN_TTL` (default: `15m`)
- `REFRESH_TOKEN_TTL` (default: `7d`)
- `JWT_SECRET` (required)
- `REFRESH_TOKEN_SECRET` (optional fallback to `JWT_SECRET`)

---

## ✅ Assignment: Role-Based Access Control (RBAC)

This project now enforces role-based permissions in both API routes and UI components using a centralized policy map.

### Roles and Permissions

Defined in `src/config/roles.ts`:

| Role | Core Permissions | Typical Access |
|------|------------------|----------------|
| `admin` | create/read/update/delete + user/file/habit management | Full system access |
| `editor` | read/create/update + upload + own-file deletion | Can work on content/resources but cannot perform destructive admin operations |
| `viewer` | read-only + dashboard visibility | View-only experience |

Role normalization is supported so legacy values like `USER` are mapped safely to a supported role (`editor`).

### Policy Evaluation Logic

Implemented in `src/lib/rbac.ts`:

1. Parse actor context from request headers (`x-user-id`, `x-user-role`) injected by middleware.
2. Normalize role to `admin | editor | viewer`.
3. Evaluate permission from role map.
4. Optionally allow ownership-based access for specific operations.
5. Log allow/deny decisions for auditability.

Example decision pattern:

- `checkPermission({ actor, permission, resource, action, targetUserId, allowOwner })`
- Returns allow/deny and logs:
  - `"[RBAC] editor delete files: DENIED"`
  - `"[RBAC] admin update user_profile: ALLOWED"`

### API Enforcement Coverage

RBAC checks are enforced in:

- `src/app/api/users/route.ts` (`read_users`)
- `src/app/api/users/[id]/route.ts` (`read_users`, `manage_users`)
- `src/app/api/habits/route.ts` (`read_habits`, `create_habit`)
- `src/app/api/habits/[id]/route.ts` (`read_habits`, `update_habits`, `delete_habits`)
- `src/app/api/habits/toggle/route.ts` (`update_habits`)
- `src/app/api/dashboard/stats/route.ts` (`view_dashboard` + owner/admin constraint)
- `src/app/api/files/route.ts` (`read_files`, `upload_files`, `delete_own_file`, `delete_any_file`)
- `src/app/api/upload/route.ts` (`upload_files`)
- `src/app/api/admin/route.ts` (`manage_users`)

Middleware (`src/app/middleware.ts`) now authenticates and attaches actor headers for protected API prefixes before route handlers run.

### UI Enforcement Coverage

Role-based UI controls are implemented in:

- `src/app/habits/page.tsx`
  - Create button hidden for read-only roles
  - Delete button visible only when role has delete permission
- `src/app/uploads/page.tsx`
  - Upload panel hidden for roles without upload permission
  - Delete action visible only for authorized roles/ownership

### Allow / Deny Evidence Checklist

Capture logs/screenshots from terminal or browser console for:

- [ ] Admin can update/delete user records (ALLOW)
- [ ] Editor denied for admin-only delete habit or user management (DENY)
- [ ] Viewer denied for create/upload actions (DENY)
- [ ] Editor allowed for create/update habit (ALLOW)
- [ ] File delete allowed for owner role path and denied otherwise

Recommended evidence folder:

- `docs/screenshots/rbac/admin-allow.png`
- `docs/screenshots/rbac/editor-deny-admin-action.png`
- `docs/screenshots/rbac/viewer-deny-create.png`
- `docs/screenshots/rbac/editor-allow-habit-update.png`
- `docs/screenshots/rbac/file-ownership-checks.png`

### Reflection

This RBAC design scales because policy definitions are centralized and reused by both backend and frontend. Auditing is built in through explicit allow/deny decision logs for every protected operation. For more complex systems, this model can evolve into policy-based access control (PBAC/ABAC) by adding contextual attributes (tenant, resource sensitivity, environment) to the same evaluation pipeline.

---

## ✅ Assignment: XSS and SQL Injection Defense (OWASP)

This project now includes centralized sanitization, output encoding, and SQLi-pattern detection utilities applied across API routes.

### OWASP-focused Security Utility

Implemented in `src/lib/security.ts`:

- `sanitizeInput`: strips all HTML tags for plain-text fields.
- `sanitizeRichText`: allows only safe formatting tags.
- `encodeOutput`: escapes output entities for safe rendering contexts.
- `detectSqliRisk`: detects common SQL injection signatures.
- `parseSafeInt`: safe integer parsing for query/body numeric values.
- `serializeJsonForHtmlScript`: escapes JSON-LD script output safely.

Libraries used:

- `sanitize-html`
- `validator`

### Where Sanitization Is Enforced

Sanitized and validated untrusted inputs in:

- `src/app/api/auth/login/route.ts`
- `src/app/api/auth/signup/route.ts`
- `src/app/api/habits/route.ts`
- `src/app/api/users/[id]/route.ts`
- `src/app/api/upload/route.ts`
- `src/app/api/files/route.ts`
- `src/app/api/email/route.ts`

Output encoding hardening:

- `src/components/Breadcrumbs.tsx`
  - JSON-LD script now uses safe serialization to prevent script-context injection.

### SQL Injection Prevention Approach

- Prisma ORM queries remain parameterized (no raw string concatenation).
- Input fields and numeric query params are sanitized before use.
- Suspicious SQLi patterns are rejected early with `400` responses.

### Before/After Demonstration

Added demo API and page:

- `src/app/api/security/sanitize/route.ts`
- `src/app/security-demo/page.tsx`

Use payloads like:

- `<script>alert("Hacked!")</script>`
- `' OR 1=1 --`

The demo returns:

- original input
- sanitized plain output
- encoded output
- detection flags for script and SQLi patterns

### Evidence Checklist

Capture screenshots or logs for:

- [ ] Before input with script payload in security demo
- [ ] After sanitized output with script removed/escaped
- [ ] SQLi-like payload flagged by detector
- [ ] API request rejected (400) for blocked malicious input
- [ ] Normal safe input accepted and processed

Recommended evidence path:

- `docs/screenshots/security/xss-before.png`
- `docs/screenshots/security/xss-after.png`
- `docs/screenshots/security/sqli-detected.png`
- `docs/screenshots/security/rejected-request.png`
- `docs/screenshots/security/safe-request-success.png`

### Reflection

These controls matter because every external input source is untrusted by default. Sanitization, encoding, and strict validation reduce exploitability for XSS/SQLi while keeping behavior predictable. Ongoing security posture should include periodic dependency audits, CSP and secure headers, schema-based validation expansion, and recurring review of all new input paths.

