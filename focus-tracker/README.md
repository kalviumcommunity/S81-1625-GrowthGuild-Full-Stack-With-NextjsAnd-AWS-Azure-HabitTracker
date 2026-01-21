# 🎯 HabitFlow - Full-Stack Habit Tracker

A modern, full-stack habit tracking application built with Next.js 15, TypeScript, Prisma, and PostgreSQL. Features secure authentication, real-time updates, and cloud file uploads using AWS S3 pre-signed URLs.

## 🚀 Features

- **User Authentication** - JWT-based secure login/signup with bcrypt password hashing
- **Habit Management** - Create, update, delete, and track daily habits
- **Dashboard Analytics** - Visual progress tracking and statistics
- **Cloud File Uploads** - Secure file uploads using AWS S3 pre-signed URLs
- **Redis Caching** - Optional Redis caching for improved performance
- **Modern UI** - Responsive design with Tailwind CSS and glass-morphism effects

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
│   │   │   ├── upload/      # Pre-signed URL generation
│   │   │   ├── files/       # File metadata storage
│   │   │   └── users/       # User management
│   │   ├── dashboard/       # User dashboard
│   │   ├── habits/          # Habits page
│   │   ├── uploads/         # File uploads page
│   │   ├── login/           # Login page
│   │   └── signup/          # Signup page
│   ├── components/
│   │   ├── FileUpload.tsx   # Drag & drop file upload
│   │   ├── Navbar.tsx       # Navigation with auth state
│   │   └── ProtectedRoute.tsx
│   ├── context/
│   │   └── AuthContext.tsx  # Global auth state
│   └── lib/
│       ├── prisma.ts        # Database client
│       ├── redis.ts         # Redis client (optional)
│       └── s3.ts            # AWS S3 utilities
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

## 🚀 Deployment

### Environment Variables Required

```env
DATABASE_URL=postgresql://...
JWT_SECRET=your-secure-secret
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=ap-south-1
AWS_BUCKET_NAME=your-bucket
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
- [Tailwind CSS](https://tailwindcss.com/docs)

---

## 📝 License

MIT License - See LICENSE file for details.

