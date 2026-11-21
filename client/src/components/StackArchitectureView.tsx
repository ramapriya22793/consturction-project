import React from "react";
import {
  Server,
  Database,
  Cloud,
  Shield,
  Layers,
  FileText,
  Mail,
  Activity,
  GitBranch,
  Globe,
  Lock,
  Cpu,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";

export const StackArchitectureView: React.FC = () => {
  const stackLayers = [
    {
      title: "1. Frontend Layer",
      icon: Globe,
      badge: "Vite + Vercel",
      color: "border-blue-500",
      items: [
        { label: "Framework", val: "React.js 19" },
        { label: "Language", val: "TypeScript" },
        { label: "Build Tool", val: "Vite" },
        { label: "Styling", val: "Tailwind CSS + Shadcn UI" },
        { label: "State Management", val: "Zustand" },
        { label: "Form Handling", val: "React Hook Form + Zod" },
        { label: "Charts & Analytics", val: "Recharts" },
        { label: "API Client", val: "Axios (Bearer Token Interceptor)" },
      ],
    },
    {
      title: "2. Backend & API Layer",
      icon: Server,
      badge: "Node.js 24 + Render",
      color: "border-emerald-500",
      items: [
        { label: "Runtime", val: "Node.js 24 LTS" },
        { label: "Framework", val: "Express.js (TypeScript)" },
        { label: "Architecture", val: "Modular REST API" },
        { label: "Auth Middleware", val: "Supabase Auth JWT Verification" },
        { label: "Authorization", val: "Role-Based Access Control (RBAC)" },
        { label: "Request Validation", val: "Zod Schema Parser" },
        { label: "ORM", val: "Prisma v6" },
        { label: "Background Queue", val: "BullMQ + Redis Ready" },
      ],
    },
    {
      title: "3. Database & Security Layer",
      icon: Database,
      badge: "Supabase PostgreSQL",
      color: "border-purple-500",
      items: [
        { label: "Database", val: "PostgreSQL (Supabase Hosted)" },
        { label: "Migrations", val: "Prisma Migrate" },
        { label: "Studio GUI", val: "Prisma Studio & Supabase Dashboard" },
        { label: "Security", val: "Row-Level Security (RLS) & Foreign Keys" },
        { label: "Schema Models", val: "User, Project, Task, DailyReport, Material, Document" },
      ],
    },
    {
      title: "4. Cloud Object Storage Layer",
      icon: Cloud,
      badge: "Cloudflare R2",
      color: "border-amber-500",
      items: [
        { label: "Provider", val: "Cloudflare R2 (Zero Egress Fees)" },
        { label: "Protocol", val: "S3-Compatible Protocol" },
        { label: "Client SDK", val: "@aws-sdk/client-s3 + @aws-sdk/s3-request-presigner" },
        { label: "Access Security", val: "Private Buckets + Expiring Presigned URLs" },
        { label: "File Types", val: "CAD Drawings (.dwg/.dxf), PDF Reports, Excel Sheets, Photos" },
      ],
    },
    {
      title: "5. Reports & Document Generation",
      icon: FileText,
      badge: "PDFKit & ExcelJS",
      color: "border-cyan-500",
      items: [
        { label: "PDF Engine", val: "PDFKit (Streamed Daily Progress Reports)" },
        { label: "Excel Engine", val: "ExcelJS (Styled Material BOQs & Formulas)" },
        { label: "Visualizations", val: "Recharts SVG/Canvas Dynamic Graphs" },
        { label: "Archive Target", val: "Cloudflare R2 Document Store" },
      ],
    },
    {
      title: "6. Security & Infrastructure",
      icon: Shield,
      badge: "Enterprise Hardened",
      color: "border-red-500",
      items: [
        { label: "API Headers", val: "Helmet (CSP, HSTS, XSS Filters)" },
        { label: "CORS", val: "Explicit Origin Whitelisting" },
        { label: "Error Tracking", val: "Sentry SDK (@sentry/node)" },
        { label: "Email Service", val: "Resend API" },
        { label: "CI/CD Pipeline", val: "GitHub Actions → Vercel (Front) + Render (Back)" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          Civil Project Architecture & Technology Stack
        </h2>
        <p className="text-sm text-slate-500">
          Configured strictly according to the Civil Project Technology Specification.
        </p>
      </div>

      {/* Architecture Data Flow Diagram */}
      <Card className="bg-slate-950 text-white border-slate-800">
        <CardHeader>
          <CardTitle className="text-base text-amber-400 flex items-center gap-2">
            <Cpu className="h-5 w-5" />
            End-to-End Architectural Data Flow
          </CardTitle>
          <CardDescription className="text-slate-400">
            Secure client-to-cloud request execution pipeline
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center text-xs">
            <div className="rounded-lg bg-slate-900 p-4 border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="font-mono text-blue-400 font-bold block mb-1">CLIENT APP</span>
                <p className="font-semibold text-white">React + Vite</p>
                <p className="text-slate-400 mt-1">Zustand, Tailwind, Shadcn, React Hook Form</p>
              </div>
              <Badge variant="outline" className="mt-3 border-blue-500/30 text-blue-300">
                Hosted: Vercel
              </Badge>
            </div>

            <div className="rounded-lg bg-slate-900 p-4 border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="font-mono text-emerald-400 font-bold block mb-1">REST API</span>
                <p className="font-semibold text-white">Express + TypeScript</p>
                <p className="text-slate-400 mt-1">Zod, Helmet, Supabase JWT, RBAC Guard</p>
              </div>
              <Badge variant="outline" className="mt-3 border-emerald-500/30 text-emerald-300">
                Hosted: Render
              </Badge>
            </div>

            <div className="rounded-lg bg-slate-900 p-4 border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="font-mono text-purple-400 font-bold block mb-1">RELATIONAL DB</span>
                <p className="font-semibold text-white">PostgreSQL (Prisma)</p>
                <p className="text-slate-400 mt-1">Prisma Migrate, RLS, Foreign Key Integrity</p>
              </div>
              <Badge variant="outline" className="mt-3 border-purple-500/30 text-purple-300">
                Hosted: Supabase
              </Badge>
            </div>

            <div className="rounded-lg bg-slate-900 p-4 border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="font-mono text-amber-400 font-bold block mb-1">OBJECT STORAGE</span>
                <p className="font-semibold text-white">Cloudflare R2</p>
                <p className="text-slate-400 mt-1">AWS S3 SDK, Presigned URLs (CAD/PDF/Excel)</p>
              </div>
              <Badge variant="outline" className="mt-3 border-amber-500/30 text-amber-300">
                Cloudflare CDN & R2
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid of Stack Layers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stackLayers.map((layer) => {
          const Icon = layer.icon;
          return (
            <Card key={layer.title} className={`border-t-4 ${layer.color} shadow-sm`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-slate-700" />
                    <CardTitle className="text-base font-bold text-slate-900">
                      {layer.title}
                    </CardTitle>
                  </div>
                </div>
                <Badge variant="secondary" className="w-fit text-[11px] font-mono mt-1">
                  {layer.badge}
                </Badge>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="divide-y divide-slate-100 text-xs">
                  {layer.items.map((item) => (
                    <div key={item.label} className="py-2 flex justify-between items-start gap-2">
                      <span className="font-semibold text-slate-600 shrink-0">{item.label}:</span>
                      <span className="font-mono text-slate-900 text-right">{item.val}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
