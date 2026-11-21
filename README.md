# Civil Project – Engineering Infrastructure & Management Platform

A modern, enterprise-grade civil engineering and construction management platform built to oversee capital projects, heavy civil infrastructure works, site operations, CAD drawings, materials procurement, and daily progress reporting.

---

## 🛠 Technology Stack Architecture

| Layer | Technology | Description |
|---|---|---|
| **Frontend Framework** | React.js (v19) + TypeScript | Modern component architecture and type safety |
| **Build Tool** | Vite | Lightning-fast HMR and optimized production bundling |
| **Styling & UI** | Tailwind CSS + Shadcn UI | Responsive design system & accessible components |
| **State Management** | Zustand | Global lightweight, reactive client store |
| **Form Handling** | React Hook Form + Zod | Schema-based client form validation |
| **Charts & Analytics** | Recharts | Interactive financial & workforce trend graphs |
| **API Client** | Axios | Interceptors with Supabase JWT bearer injection |
| **Backend Runtime** | Node.js (v24 LTS) | High-performance asynchronous JavaScript engine |
| **Server Framework** | Express.js (TypeScript) | Modular RESTful architecture |
| **Authentication** | Supabase Auth | Secure session tokens & JWT validation |
| **Authorization** | RBAC | Role-Based Access Control (`ADMIN`, `PROJECT_MANAGER`, `SITE_ENGINEER`, `CONTRACTOR`, `CLIENT`) |
| **API Validation** | Zod | Request body/param validation middleware |
| **Database & ORM** | Supabase PostgreSQL + Prisma v6 | Relational data integrity, migrations & RLS |
| **Cloud Object Storage** | Cloudflare R2 | S3-compatible private buckets with Zero Egress fees |
| **Storage SDK** | AWS SDK for JavaScript v3 | Presigned upload/download URLs (`@aws-sdk/client-s3`) |
| **PDF Generation** | PDFKit | Formatted Daily Progress Reports with signature blocks |
| **Excel Generation** | ExcelJS | Automated Bill of Quantities (BOQ) with formulas |
| **Notifications & Mail** | Resend API | Transactional project notifications |
| **Error Monitoring** | Sentry SDK (`@sentry/node`) | Real-time crash monitoring and stack tracing |
| **Hosting & Deploy** | Vercel (Front) + Render (Back) | Automated CI/CD integration with GitHub |

---

## 📂 Repository Structure

```
├── client/                     # Frontend Application (React + Vite + Tailwind)
│   ├── src/
│   │   ├── components/         # UI & View Components
│   │   │   ├── ui/             # Button, Card, Badge (Shadcn primitives)
│   │   │   ├── Dashboard.tsx   # Recharts Analytics & Metric Cards
│   │   │   ├── DailyReportsView.tsx # PDFKit Daily Log Generator
│   │   │   ├── DocumentsView.tsx    # Cloudflare R2 CAD Storage Manager
│   │   │   ├── MaterialsView.tsx    # ExcelJS BOQ & Material Procurement
│   │   │   ├── TasksView.tsx        # Milestone & Critical Path Tracker
│   │   │   ├── Navbar.tsx      # RBAC Switcher & Supabase Session Indicator
│   │   │   ├── Sidebar.tsx     # Navigation & System Status Pane
│   │   │   └── StackArchitectureView.tsx # Stack Documentation
│   │   ├── lib/                # Axios API & Supabase Clients
│   │   ├── store/              # Zustand Auth & Project Store
│   │   ├── App.tsx             # Root Layout
│   │   └── main.tsx            # Application Entrypoint
│   ├── tailwind.config.js      # Tailwind Theme Configuration
│   ├── vercel.json             # Vercel Deployment Configuration
│   └── package.json
│
├── server/                     # Backend Application (Node.js + Express + Prisma)
│   ├── prisma/
│   │   ├── schema.prisma       # Supabase PostgreSQL Models & Enums
│   │   └── seed.ts             # Initial Database Seeder
│   ├── src/
│   │   ├── config/             # Zod Env Validator, Prisma, Supabase & R2 SDK
│   │   ├── controllers/        # Project, Document, Report, Task Controllers
│   │   ├── middleware/         # Supabase Auth, RBAC & Zod Request Validator
│   │   ├── routes/             # Express API Endpoints
│   │   ├── services/           # R2 Storage, PDFKit & ExcelJS Engines
│   │   └── index.ts            # Server Entry with Helmet & CORS
│   └── package.json
│
├── render.yaml                 # Render Blueprint for Automated Backend Deployment
└── package.json                # Monorepo Workspace Configuration
```

---

## 🚀 Quickstart Guide

### 1. Prerequisites
- **Node.js**: v24 LTS (or >= v20)
- **npm**: >= 10.x

### 2. Installation
From the root directory:
```bash
# Install root, client, and server dependencies
npm run build
```

### 3. Environment Variables

#### Backend (`server/.env`):
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres?schema=public"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres"

# Supabase Auth
SUPABASE_URL="https://[YOUR-PROJECT].supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOi..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOi..."

# Cloudflare R2
R2_ACCOUNT_ID="your-r2-account-id"
R2_ACCESS_KEY_ID="your-r2-access-key-id"
R2_SECRET_ACCESS_KEY="your-r2-secret-access-key"
R2_BUCKET_NAME="civil-project-documents"

# Services
RESEND_API_KEY="re_..."
CLIENT_URL="http://localhost:5173"
```

#### Frontend (`client/.env`):
```env
VITE_API_URL="http://localhost:5000/api/v1"
VITE_SUPABASE_URL="https://[YOUR-PROJECT].supabase.co"
VITE_SUPABASE_ANON_KEY="eyJhbGciOi..."
```

### 4. Running the Development Servers

```bash
# Run both Frontend (Vite) and Backend (Express) concurrently:
npm run dev:all

# Or individually:
npm run dev:client   # Starts Vite on http://localhost:5173
npm run dev:server   # Starts Express on http://localhost:5000
```

### 5. Database Commands
```bash
npm run prisma:generate  # Generates Prisma Client types
npm run prisma:migrate   # Runs database schema migrations on Supabase
npm run prisma:seed      # Seeds sample civil engineering projects and tasks
npm run prisma:studio    # Opens web database manager on http://localhost:5555
```

---

## 🌐 Production Deployment

- **Frontend on Vercel**:
  - Connect your GitHub repository to Vercel.
  - Set Root Directory to `client`.
  - Framework Preset: `Vite`.
  - Add environment variables `VITE_API_URL`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.

- **Backend on Render**:
  - Use the included `render.yaml` blueprint or create a Web Service.
  - Root directory: `server`.
  - Build command: `npm install && npx prisma generate && npm run build`.
  - Start command: `npm start`.
