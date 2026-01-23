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
- **App Router** - Next.js 13+ file-based routing with dynamic routes

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

