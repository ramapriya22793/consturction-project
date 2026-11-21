import React from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  DollarSign,
  Users,
  AlertTriangle,
  Clock,
  CheckCircle2,
  TrendingUp,
  FileText,
  Boxes,
  Truck,
  ArrowUpRight,
  ShieldAlert,
  Calendar,
  Camera,
  Plus,
  Send,
  Eye,
  CreditCard,
  Briefcase,
  Layers,
  ChevronRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
  Line,
} from "recharts";
import { useConstructionStore } from "../../store/useConstructionStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { formatCurrency } from "../../lib/utils";

export const RoleDashboardSwitcher: React.FC = () => {
  const {
    activeRole,
    projects,
    tasks,
    workers,
    attendance,
    dailyReports,
    materials,
    equipment,
    expenses,
    invoices,
    approvals,
    selectedProjectId,
    resolveApproval,
  } = useConstructionStore();

  const currentProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  // Global calculations
  const totalProjects = projects.length;
  const activeProjects = projects.filter((p) => p.status === "ACTIVE").length;
  const delayedProjects = projects.filter((p) => p.status === "DELAYED");
  const totalBudget = projects.reduce((acc, p) => acc + p.budget, 0);
  const totalSpent = projects.reduce((acc, p) => acc + p.spent, 0);
  const workersPresentToday = attendance.filter((a) => a.status === "PRESENT" || a.status === "OVERTIME").length;
  const pendingApprovalsCount = approvals.filter((a) => a.status === "PENDING").length;
  const overdueInvoices = invoices.filter((i) => i.status === "OVERDUE");
  const pendingTasks = tasks.filter((t) => t.status !== "COMPLETED");

  // Recharts Data
  const budgetVsSpentData = projects.map((p) => ({
    name: p.code,
    Budget: p.budget / 1000000,
    Spent: p.spent / 1000000,
  }));

  const attendanceTrendData = [
    { day: "Mon", present: 220, overtime: 18 },
    { day: "Tue", present: 245, overtime: 25 },
    { day: "Wed", present: 258, overtime: 32 },
    { day: "Thu", present: 240, overtime: 20 },
    { day: "Fri", present: 261, overtime: 40 },
    { day: "Sat", present: 195, overtime: 12 },
  ];

  const stageProgressData = currentProject.stages.map((stg) => ({
    name: stg.name.length > 20 ? stg.name.substring(0, 18) + "..." : stg.name,
    progress: stg.progress,
  }));

  /* Custom Recharts Tooltip */
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-slate-700 bg-slate-900/95 p-3 text-xs text-white shadow-xl backdrop-blur-md">
          <p className="font-bold text-slate-300 mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center gap-2 font-mono">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-slate-400">{entry.name}:</span>
              <span className="font-bold text-white">
                {entry.name === "Budget" || entry.name === "Spent"
                  ? `$${entry.value}M`
                  : `${entry.value} Workers`}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  /* =========================================================================
     1. BUILDER / OWNER DASHBOARD
     ========================================================================= */
  if (activeRole === "BUILDER_OWNER") {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        {/* Executive Header Banner - Ultra Premium Design */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0B1120] via-[#111C35] to-[#1E293B] p-6 text-white shadow-xl border border-slate-800/80">
          <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
          <div className="absolute right-40 -top-10 h-48 w-48 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />

          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/15 px-3 py-1 text-xs font-black text-amber-400 border border-amber-400/30">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping" />
                  BUILDER & OWNER COMMAND
                </span>
                <span className="text-xs text-slate-400 font-medium">Apex Construction Enterprise HQ</span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-white leading-tight">
                Multi-Site Operational & Financial Command Center
              </h1>
              <p className="text-xs text-slate-300 max-w-2xl font-normal leading-relaxed">
                Centralized oversight across 4 capital civil sites, critical path progress, on-site labor muster rolls, and cash disbursements.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link to="/approvals">
                <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs h-10 px-4 rounded-xl shadow-lg shadow-amber-500/20 active:scale-95 transition-all">
                  <span>Review Approvals</span>
                  <span className="ml-1.5 rounded-full bg-slate-950/20 px-2 py-0.5 text-[11px] font-extrabold text-slate-950">
                    {pendingApprovalsCount}
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* 4 Core Business Question KPI Cards - Redesigned SaaS Aesthetics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Active Projects */}
          <Card className="p-5 hover:shadow-lg transition-all duration-200 border-slate-200/90 bg-white group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                1. Active Projects
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform">
                <Building2 className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-3xl font-black tracking-tight text-slate-900 font-mono">
                {activeProjects} <span className="text-sm font-semibold text-slate-400">/ {totalProjects} Sites</span>
              </p>
              <div className="flex items-center justify-between text-xs mt-2 text-slate-500">
                <span className="font-semibold text-emerald-600 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {activeProjects} Progressing
                </span>
                <span className="font-semibold text-rose-600 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                  {delayedProjects.length} Delayed
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full"
                  style={{ width: `${(activeProjects / totalProjects) * 100}%` }}
                />
              </div>
            </div>
          </Card>

          {/* Card 2: Delayed Projects */}
          <Card className="p-5 hover:shadow-lg transition-all duration-200 border-slate-200/90 bg-white group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                2. Delayed Projects
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600 group-hover:scale-110 transition-transform">
                <AlertTriangle className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-3xl font-black tracking-tight text-rose-600 font-mono">
                {delayedProjects.length} <span className="text-sm font-semibold text-slate-400">Site Delay</span>
              </p>
              <p className="text-xs font-bold text-slate-800 truncate mt-2">
                {delayedProjects[0]?.name || "None"}
              </p>
              <p className="text-[11px] text-rose-600 font-semibold mt-1 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" /> Core Wall Wind Impediment
              </p>
            </div>
          </Card>

          {/* Card 3: Total Workforce on Site */}
          <Card className="p-5 hover:shadow-lg transition-all duration-200 border-slate-200/90 bg-white group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                3. Workforce on Site
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 group-hover:scale-110 transition-transform">
                <Users className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-3xl font-black tracking-tight text-slate-900 font-mono">
                261 <span className="text-sm font-semibold text-slate-400">Labourers</span>
              </p>
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold mt-2">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>96% Daily Muster Turnout</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 truncate">
                Active Sites: Metro Viaduct & Apex Tower
              </p>
            </div>
          </Card>

          {/* Card 4: Capital Spent vs Budget */}
          <Card className="p-5 hover:shadow-lg transition-all duration-200 border-slate-200/90 bg-white group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                4. Capital Spent / Budget
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-3xl font-black tracking-tight text-slate-900 font-mono">
                {formatCurrency(totalSpent)}
              </p>
              <p className="text-xs text-slate-500 mt-2">
                Total Budget: <span className="font-bold text-slate-800">{formatCurrency(totalBudget)}</span>
              </p>
              <p className="text-[11px] text-blue-600 font-extrabold mt-1">
                {((totalSpent / totalBudget) * 100).toFixed(1)}% Funds Disbursed
              </p>
            </div>
          </Card>
        </div>

        {/* Analytics Charts - Enhanced Aesthetics */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Project Budget Comparison */}
          <Card className="border-slate-200/90 shadow-sm bg-white">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-black text-slate-900">
                    Multi-Project Budget vs Actual Expenditure ($ Millions)
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500 mt-0.5">
                    Contractual capital allocation compared with verified disbursements
                  </CardDescription>
                </div>
                <Badge variant="outline" className="font-mono text-[10px] text-slate-600">
                  4 Projects
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="h-72 pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={budgetVsSpentData} barGap={6}>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} unit="M" tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend iconType="circle" />
                  <Bar dataKey="Budget" fill="#3B82F6" radius={[6, 6, 0, 0]} name="Budget" />
                  <Bar dataKey="Spent" fill="#F59E0B" radius={[6, 6, 0, 0]} name="Spent" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Workforce Attendance Trend - Rich Area Chart */}
          <Card className="border-slate-200/90 shadow-sm bg-white">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-black text-slate-900">
                    Cross-Site Labour Attendance & Overtime Hours
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500 mt-0.5">
                    6-Day site muster roll trends across all construction trades
                  </CardDescription>
                </div>
                <Badge variant="outline" className="font-mono text-[10px] text-emerald-600 bg-emerald-50">
                  Live Muster
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="h-72 pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={attendanceTrendData}>
                  <defs>
                    <linearGradient id="presentGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="overtimeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend iconType="circle" />
                  <Area
                    type="monotone"
                    dataKey="present"
                    stroke="#10B981"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#presentGradient)"
                    name="Workers Present"
                  />
                  <Area
                    type="monotone"
                    dataKey="overtime"
                    stroke="#F59E0B"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#overtimeGradient)"
                    name="Overtime Persons"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Immediate Site Progress Feed & Pending Approvals */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Latest Work Completed Today */}
          <Card className="lg:col-span-2 border-slate-200/90 shadow-sm bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <CardTitle className="text-sm font-black text-slate-900">
                  What Work Was Completed Today?
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Daily progress reports submitted directly by field supervisors
                </CardDescription>
              </div>
              <Link to="/daily-reports">
                <Button variant="outline" size="sm" className="text-xs h-8 rounded-lg font-bold">
                  View All Logs ({dailyReports.length})
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3.5 pt-4">
              {dailyReports.map((report) => (
                <div
                  key={report.id}
                  className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-4 space-y-2.5 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 text-xs">{report.projectName}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-[11px] text-slate-500 font-medium">{report.reportDate}</span>
                    </div>
                    <Badge
                      variant={report.approvalStatus === "APPROVED" ? "success" : "warning"}
                      className="text-[10px] px-2 py-0.5"
                    >
                      {report.approvalStatus}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-800 leading-relaxed font-medium">
                    "{report.workCompleted}"
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                    <span>Supervisor: <strong className="text-slate-700">{report.supervisorName}</strong></span>
                    <span>Workforce: <strong className="text-slate-700">{report.workersPresent} Active</strong></span>
                    <span>Equipment: <strong className="text-slate-700">{report.equipmentUsed}</strong></span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Pending Approvals Requiring Owner/PM Attention */}
          <Card className="border-slate-200/90 shadow-sm bg-white flex flex-col justify-between">
            <div>
              <CardHeader className="pb-3 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-black text-slate-900">
                      Decisions Requiring Action
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500">
                      Pending managerial authorizations
                    </CardDescription>
                  </div>
                  <Badge variant="destructive" className="text-[10px] px-2 py-0.5 font-bold">
                    {pendingApprovalsCount} Items
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                {approvals.slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-slate-200/80 bg-white p-3 text-xs shadow-xs space-y-1.5 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[9px] font-bold text-blue-700 uppercase">
                        {item.type}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">{item.date}</span>
                    </div>
                    <p className="font-bold text-slate-900 leading-snug">{item.title}</p>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span>{item.submittedBy}</span>
                      <button
                        onClick={() => resolveApproval(item.id, true)}
                        className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
                      >
                        Quick Approve
                      </button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </div>

            <div className="p-4 border-t border-slate-100">
              <Link to="/approvals" className="block">
                <Button variant="outline" size="sm" className="w-full text-xs font-bold rounded-xl h-9">
                  Open Approvals Center
                  <ChevronRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  /* =========================================================================
     2. PROJECT MANAGER DASHBOARD
     ========================================================================= */
  if (activeRole === "PROJECT_MANAGER") {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 p-6 text-white shadow-xl border border-purple-900/40">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-purple-500/20 px-2.5 py-0.5 text-xs font-bold text-purple-300 border border-purple-500/30">
                PROJECT MANAGER WORKSPACE
              </span>
              <span className="text-xs text-slate-300">Managing {projects.length} Capital Sites</span>
            </div>
            <h1 className="text-2xl font-black text-white mt-2">{currentProject.name}</h1>
            <p className="text-xs text-slate-300 mt-1">
              Client: {currentProject.clientName} • Target Completion: {currentProject.expectedCompletionDate}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/tasks">
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl h-9">
                Manage Tasks ({pendingTasks.length})
              </Button>
            </Link>
          </div>
        </div>

        {/* Milestone Progress Bar & KPIs */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="p-5 border-l-4 border-l-purple-600 bg-white">
            <span className="text-xs font-bold text-slate-500 uppercase">Overall Site Progress</span>
            <p className="text-3xl font-black text-slate-900 mt-1 font-mono">{currentProject.progressPercentage}%</p>
            <div className="w-full bg-slate-100 rounded-full h-2 mt-3">
              <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${currentProject.progressPercentage}%` }} />
            </div>
          </Card>

          <Card className="p-5 border-l-4 border-l-amber-500 bg-white">
            <span className="text-xs font-bold text-slate-500 uppercase">Pending & Blocked Tasks</span>
            <p className="text-3xl font-black text-slate-900 mt-1 font-mono">{pendingTasks.length} Active</p>
            <p className="text-xs text-rose-600 font-bold mt-2">1 Critical Blocker Flagged</p>
          </Card>

          <Card className="p-5 border-l-4 border-l-emerald-600 bg-white">
            <span className="text-xs font-bold text-slate-500 uppercase">Active Stage</span>
            <p className="text-lg font-black text-slate-900 mt-1 truncate">Pier Columns & Caps</p>
            <p className="text-xs text-emerald-600 font-bold mt-2">68% Stage Completion</p>
          </Card>
        </div>

        {/* Stage Execution Overview Chart */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-sm font-black">Construction Stages & Milestone Progress (%)</CardTitle>
            <CardDescription className="text-xs">Contractual milestones for {currentProject.name}</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stageProgressData} layout="vertical">
                <CartesianGrid strokeDasharray="4 4" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" domain={[0, 100]} unit="%" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis type="category" dataKey="name" stroke="#64748b" fontSize={11} width={140} tickLine={false} />
                <Tooltip formatter={(val: any) => [`${val}%`, "Progress"]} />
                <Bar dataKey="progress" fill="#8B5CF6" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    );
  }

  /* =========================================================================
     3. CIVIL ENGINEER DASHBOARD
     ========================================================================= */
  if (activeRole === "CIVIL_ENGINEER") {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 p-6 text-white shadow-xl border border-emerald-900/40">
          <div>
            <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-300 border border-emerald-500/30">
              CIVIL ENGINEER FIELD WORKSPACE
            </span>
            <h1 className="text-2xl font-black text-white mt-2">
              Structural Inspections & Quality Assurance
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Site: {currentProject.name} • Engineer in Charge: Marcus Miller, M.Eng
            </p>
          </div>
          <Link to="/daily-reports">
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl h-9">
              Review Daily Progress Logs
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-5 border-l-4 border-l-emerald-600 bg-white">
            <span className="text-xs text-slate-500 font-bold uppercase">Concrete Cube Compressive Strength</span>
            <p className="text-3xl font-black text-slate-900 mt-1 font-mono">45.2 MPa</p>
            <p className="text-xs text-emerald-600 font-bold mt-2">Passes M40 Specification</p>
          </Card>
          <Card className="p-5 border-l-4 border-l-amber-500 bg-white">
            <span className="text-xs text-slate-500 font-bold uppercase">Slump & Flow Tests</span>
            <p className="text-3xl font-black text-slate-900 mt-1 font-mono">140 mm</p>
            <p className="text-xs text-slate-500 mt-2">Within 125 - 150mm tolerance</p>
          </Card>
          <Card className="p-5 border-l-4 border-l-blue-600 bg-white">
            <span className="text-xs text-slate-500 font-bold uppercase">Active Engineering Tasks</span>
            <p className="text-3xl font-black text-slate-900 mt-1 font-mono">
              {tasks.filter((t) => t.stageName.includes("Piling") || t.stageName.includes("Pier")).length} Tasks
            </p>
            <p className="text-xs text-slate-500 mt-2">Rebar & prestress tendon inspections</p>
          </Card>
        </div>

        {/* Quality Log Checklist */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-sm font-black">Engineering Quality Log & Inspection Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { item: "Pier Cap P14 28-day Cube Compressive Test", status: "PASSED", note: "Result 46.1 MPa, cleared for superstructure bearing plate placement." },
              { item: "Span S3 Tendon Grouting & Elongation Measurements", status: "VERIFIED", note: "Grout flow cone test 18s, tendon anchorage seated." },
              { item: "Ultrasonic Testing on Girder Flange Welds", status: "PENDING", note: "Scheduled for tomorrow with third-party testing lab." },
            ].map((q, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl border border-slate-200 p-3.5 text-xs bg-slate-50">
                <div>
                  <p className="font-bold text-slate-900">{q.item}</p>
                  <p className="text-slate-500 mt-0.5">{q.note}</p>
                </div>
                <Badge variant={q.status === "PASSED" ? "success" : "warning"} className="text-[10px] px-2 py-0.5">
                  {q.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  /* =========================================================================
     4. SITE SUPERVISOR DASHBOARD (MOBILE-FIRST)
     ========================================================================= */
  if (activeRole === "SITE_SUPERVISOR") {
    return (
      <div className="space-y-5 max-w-3xl mx-auto animate-in fade-in duration-300">
        <div className="rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 p-5 text-slate-950 shadow-lg">
          <Badge variant="outline" className="border-slate-900/30 text-slate-950 font-black text-[10px] bg-slate-950/10">
            MOBILE-FIRST FIELD SUPERVISOR
          </Badge>
          <h1 className="text-xl font-black mt-2">Site Supervisor Station</h1>
          <p className="text-xs text-slate-950/90 font-medium">
            Assigned Site: <strong className="font-black">{currentProject.name}</strong>
          </p>
        </div>

        {/* 1-Click Fast Daily Report & Attendance Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link to="/daily-reports" className="block">
            <Button className="w-full h-16 flex flex-col items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-md active:scale-95 transition-all">
              <FileText className="h-5 w-5" />
              <span className="text-xs font-black">1-Click Daily Report</span>
            </Button>
          </Link>
          <Link to="/attendance" className="block">
            <Button className="w-full h-16 flex flex-col items-center justify-center gap-1 bg-[#0B1120] hover:bg-slate-900 text-white rounded-2xl shadow-md active:scale-95 transition-all">
              <Users className="h-5 w-5 text-amber-400" />
              <span className="text-xs font-black">Mark Attendance ({workers.length})</span>
            </Button>
          </Link>
        </div>

        {/* Supervisor Status Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card className="p-4 text-center bg-white border-slate-200">
            <span className="text-[11px] text-slate-500 font-bold uppercase">Workers Present</span>
            <p className="text-3xl font-black text-slate-900 mt-1 font-mono">82</p>
          </Card>
          <Card className="p-4 text-center bg-white border-slate-200">
            <span className="text-[11px] text-slate-500 font-bold uppercase">Workers Absent</span>
            <p className="text-3xl font-black text-rose-600 mt-1 font-mono">2</p>
          </Card>
          <Card className="p-4 text-center bg-white border-slate-200">
            <span className="text-[11px] text-slate-500 font-bold uppercase">Tasks Done</span>
            <p className="text-3xl font-black text-emerald-600 mt-1 font-mono">1</p>
          </Card>
          <Card className="p-4 text-center bg-white border-slate-200">
            <span className="text-[11px] text-slate-500 font-bold uppercase">Machinery</span>
            <p className="text-3xl font-black text-blue-600 mt-1 font-mono">3 Active</p>
          </Card>
        </div>

        {/* Immediate Site Checklist */}
        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-black">Today's Field Safety & Pour Checklist</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5 text-xs">
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-100 font-medium">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>07:45 AM Mandatory Safety PPE toolbox briefing conducted</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-100 font-medium">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>Diesel refilled for Transit Mixers & Rotary Rig 2</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-50 text-amber-900 border border-amber-100 font-medium">
              <Clock className="h-4 w-4 shrink-0 text-amber-600" />
              <span>Concrete cube sampling scheduled for 03:30 PM pour</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  /* =========================================================================
     5. ACCOUNTANT DASHBOARD
     ========================================================================= */
  if (activeRole === "ACCOUNTANT") {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-cyan-950 via-slate-900 to-sky-950 p-6 text-white shadow-xl border border-cyan-900/40">
          <div>
            <span className="rounded-full bg-cyan-500/20 px-2.5 py-0.5 text-xs font-bold text-cyan-300 border border-cyan-500/30">
              FINANCIAL ACCOUNTS & BILLING DESK
            </span>
            <h1 className="text-2xl font-black text-white mt-2">Project Finances & Cash Flows</h1>
            <p className="text-xs text-slate-300 mt-1">
              Tracking contractor bills, client receivables, vendor payables & labor wages.
            </p>
          </div>
          <Link to="/finance">
            <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold rounded-xl h-9">
              Open Full Finance Ledger
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 border-l-4 border-l-emerald-600 bg-white">
            <span className="text-xs text-slate-500 font-bold uppercase">Client Collections</span>
            <p className="text-3xl font-black text-slate-900 mt-1 font-mono">$4,850,000</p>
            <p className="text-[11px] text-emerald-600 font-bold mt-2">RA Bills Received</p>
          </Card>
          <Card className="p-5 border-l-4 border-l-amber-500 bg-white">
            <span className="text-xs text-slate-500 font-bold uppercase">Pending Client Invoices</span>
            <p className="text-3xl font-black text-slate-900 mt-1 font-mono">$1,100,000</p>
            <p className="text-[11px] text-amber-600 font-bold mt-2">2 Pending RA Bills</p>
          </Card>
          <Card className="p-5 border-l-4 border-l-blue-600 bg-white">
            <span className="text-xs text-slate-500 font-bold uppercase">Vendor Payables</span>
            <p className="text-3xl font-black text-slate-900 mt-1 font-mono">$135,000</p>
            <p className="text-[11px] text-slate-500 mt-2">Due next week (ArcelorMittal)</p>
          </Card>
          <Card className="p-5 border-l-4 border-l-purple-600 bg-white">
            <span className="text-xs text-slate-500 font-bold uppercase">Approved Wages</span>
            <p className="text-3xl font-black text-slate-900 mt-1 font-mono">$105,250</p>
            <p className="text-[11px] text-purple-600 font-bold mt-2">Muster Roll Verified</p>
          </Card>
        </div>

        {/* Invoices List */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-sm font-black">Outstanding Client & Vendor Invoices</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase border-b">
                <tr>
                  <th className="px-6 py-3">Invoice #</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Project</th>
                  <th className="px-6 py-3">Party Name</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Due Date</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/70">
                    <td className="px-6 py-3 font-mono font-bold text-slate-900">{inv.invoiceNumber}</td>
                    <td className="px-6 py-3">{inv.type}</td>
                    <td className="px-6 py-3">{inv.projectName}</td>
                    <td className="px-6 py-3 font-medium">{inv.partyName}</td>
                    <td className="px-6 py-3 font-bold font-mono text-slate-900">{formatCurrency(inv.amount)}</td>
                    <td className="px-6 py-3 text-slate-500">{inv.dueDate}</td>
                    <td className="px-6 py-3">
                      <Badge variant={inv.status === "PAID" ? "success" : inv.status === "OVERDUE" ? "destructive" : "warning"} className="text-[10px]">
                        {inv.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    );
  }

  /* =========================================================================
     6. CLIENT DASHBOARD
     ========================================================================= */
  if (activeRole === "CLIENT") {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="rounded-2xl bg-gradient-to-r from-[#0B1120] to-[#1E293B] p-6 text-white shadow-xl border border-slate-800">
          <Badge variant="outline" className="border-white/30 text-white text-[10px] bg-white/10">
            CLIENT PORTAL
          </Badge>
          <h1 className="text-2xl font-black mt-2 text-white">{currentProject.name}</h1>
          <p className="text-xs text-slate-300 mt-1">
            Client: {currentProject.clientName} • Managed by: {currentProject.projectManager}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-5 border-l-4 border-l-blue-600 bg-white">
            <span className="text-xs text-slate-500 font-bold uppercase">Verified Progress</span>
            <p className="text-3xl font-black text-slate-900 mt-1 font-mono">{currentProject.progressPercentage}%</p>
            <p className="text-xs text-emerald-600 font-bold mt-2">On schedule for Q4 2027 handover</p>
          </Card>
          <Card className="p-5 border-l-4 border-l-emerald-600 bg-white">
            <span className="text-xs text-slate-500 font-bold uppercase">Milestones Disbursed</span>
            <p className="text-3xl font-black text-slate-900 mt-1 font-mono">$5.12M</p>
            <p className="text-xs text-slate-500 mt-2">Of $18.5M Contract Value</p>
          </Card>
          <Card className="p-5 border-l-4 border-l-amber-500 bg-white">
            <span className="text-xs text-slate-500 font-bold uppercase">Quality Inspection Rating</span>
            <p className="text-3xl font-black text-slate-900 mt-1 font-mono">98.4%</p>
            <p className="text-xs text-emerald-600 font-bold mt-2">Zero structural non-compliances</p>
          </Card>
        </div>

        {/* Client Progress Photos */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-sm font-black flex items-center gap-2">
              <Camera className="h-4 w-4 text-blue-600" />
              Approved Construction Progress Photos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl overflow-hidden border border-slate-200 group">
                <img
                  src="https://images.unsplash.com/photo-1541888946425-d0fbb1861564?w=800&auto=format&fit=crop&q=80"
                  alt="Pier Cap"
                  className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="p-3.5 bg-white text-xs">
                  <p className="font-bold text-slate-900">Pier Cap P14 Concrete Pouring & Curing</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">Verified on Nov 21, 2026</p>
                </div>
              </div>
              <div className="rounded-2xl overflow-hidden border border-slate-200 group">
                <img
                  src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80"
                  alt="Viaduct"
                  className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="p-3.5 bg-white text-xs">
                  <p className="font-bold text-slate-900">Precast Girder Alignment for Span S4</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">Verified on Nov 18, 2026</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  /* =========================================================================
     7. ADMIN DASHBOARD
     ========================================================================= */
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <Badge variant="destructive" className="text-[10px]">PLATFORM ADMIN</Badge>
          <h1 className="text-2xl font-black text-slate-900 mt-1">Platform Multi-Tenant Administration</h1>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-5 bg-white border-slate-200">
          <span className="text-xs text-slate-500 font-bold uppercase">Total Companies</span>
          <p className="text-3xl font-black text-slate-900 mt-1 font-mono">14 Enterprise</p>
        </Card>
        <Card className="p-5 bg-white border-slate-200">
          <span className="text-xs text-slate-500 font-bold uppercase">Total Projects</span>
          <p className="text-3xl font-black text-slate-900 mt-1 font-mono">{projects.length} Sites</p>
        </Card>
        <Card className="p-5 bg-white border-slate-200">
          <span className="text-xs text-slate-500 font-bold uppercase">Active Users</span>
          <p className="text-3xl font-black text-slate-900 mt-1 font-mono">284 Users</p>
        </Card>
        <Card className="p-5 bg-white border-slate-200">
          <span className="text-xs text-slate-500 font-bold uppercase">System Status</span>
          <p className="text-3xl font-black text-emerald-600 mt-1 font-mono">99.98% OK</p>
        </Card>
      </div>
    </div>
  );
};
