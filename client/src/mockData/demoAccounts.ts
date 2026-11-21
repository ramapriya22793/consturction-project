import { UserRole } from "../types";

export interface DemoAccount {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  password: string;
  roleTitle: string;
  roleLabel: string;
  company: string;
  avatar: string;
  badgeColor: string;
  description: string;
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    id: "usr-owner-01",
    role: "BUILDER_OWNER",
    name: "Alexander Vance",
    email: "owner@civilpulse.com",
    password: "OwnerPassword123!",
    roleLabel: "Builder / Owner",
    roleTitle: "Managing Director & Executive Builder",
    company: "Apex Construction Enterprises Ltd.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    description: "Multi-site executive overview, budget allocations, critical path delays, cash burn, and high-level approval authority.",
  },
  {
    id: "usr-pm-02",
    role: "PROJECT_MANAGER",
    name: "Sarah Chen, PMP",
    email: "pm@civilpulse.com",
    password: "PMPassword123!",
    roleLabel: "Project Manager",
    roleTitle: "Lead Project Manager",
    company: "Apex Construction Enterprises Ltd.",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    description: "Milestone management, critical path tracking, sub-contractor coordination, stage completion, and blocker resolution.",
  },
  {
    id: "usr-eng-03",
    role: "CIVIL_ENGINEER",
    name: "David Miller, PE",
    email: "engineer@civilpulse.com",
    password: "EngineerPassword123!",
    roleLabel: "Civil Engineer",
    roleTitle: "Senior QA/QC Structural Civil Engineer",
    company: "Apex Construction Enterprises Ltd.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    description: "Structural design verifications, concrete cube compressive strength tests, slump tests, and technical task execution.",
  },
  {
    id: "usr-sup-04",
    role: "SITE_SUPERVISOR",
    name: "Rajesh Patel",
    email: "supervisor@civilpulse.com",
    password: "SupervisorPassword123!",
    roleLabel: "Site Supervisor",
    roleTitle: "Senior Site Operations Supervisor",
    company: "Apex Construction Enterprises Ltd.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    badgeColor: "bg-amber-400/20 text-amber-200 border-amber-400/30",
    description: "Mobile-first daily site progress reports (DPR), muster roll attendance tracking, weather logging, and machinery checks.",
  },
  {
    id: "usr-acc-05",
    role: "ACCOUNTANT",
    name: "Elena Rostova, CPA",
    email: "accountant@civilpulse.com",
    password: "AccountantPassword123!",
    roleLabel: "Accountant",
    roleTitle: "Chief Commercial Controller & Payroll Head",
    company: "Apex Construction Enterprises Ltd.",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    description: "Commercial cash flow, client receivables, vendor payables, muster roll weekly wage disbursements, and overdue invoices.",
  },
  {
    id: "usr-cli-06",
    role: "CLIENT",
    name: "Marcus Sterling",
    email: "client@civilpulse.com",
    password: "ClientPassword123!",
    roleLabel: "Client Portal",
    roleTitle: "Infrastructure Executive (Client Representative)",
    company: "State Metro Rail Corporation",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    description: "Client verified progress transparency, stage completion certificates, payment milestones, and site progress photo gallery.",
  },
  {
    id: "usr-adm-07",
    role: "ADMIN",
    name: "Platform Administrator",
    email: "admin@civilpulse.com",
    password: "AdminPassword123!",
    roleLabel: "Platform Admin",
    roleTitle: "Global System Administrator",
    company: "CivilPulse Cloud Systems",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/30",
    description: "Multi-tenant company configurations, global user management, system audit logs, and security policies.",
  },
];
