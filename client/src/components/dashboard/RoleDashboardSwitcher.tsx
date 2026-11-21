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
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
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

  /* =========================================================================
     1. BUILDER / OWNER DASHBOARD
     ========================================================================= */
  if (activeRole === "BUILDER_OWNER") {
    return (
      <div className="space-y-6">
        {/* Executive Header Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 p-6 text-white shadow-lg border border-slate-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-amber-400/20 px-2 py-0.5 text-xs font-bold text-amber-300 border border-amber-400/30">
                  BUILDER & OWNER EXECUTIVE CONTROL
                </span>
                <span className="text-xs text-slate-300">Apex Construction Enterprise</span>
              </div>
              <h1 className="mt-2 text-2xl font-black tracking-tight text-white">
                Multi-Site Operational & Financial Command Center
              </h1>
              <p className="text-xs text-slate-300 mt-1">
                Real-time visibility across all capital projects, cash flows, delayed critical paths, and on-site labor.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/approvals">
                <Button className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs h-9">
                  Review Approvals ({pendingApprovalsCount})
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* 9 Core Business Question KPI Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-l-4 border-l-blue-600">
            <CardHeader className="pb-1">
              <CardDescription className="text-xs font-bold uppercase text-slate-500">
                1. Active Projects
              </CardDescription>
              <CardTitle className="text-2xl font-black text-slate-900">
                {activeProjects} / {totalProjects} Sites
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Progressing: <strong className="text-emerald-600">{activeProjects}</strong></span>
                <span>Delayed: <strong className="text-red-600">{delayedProjects.length}</strong></span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
                <div
                  className="bg-blue-600 h-1.5 rounded-full"
                  style={{ width: `${(activeProjects / totalProjects) * 100}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="pb-1">
              <CardDescription className="text-xs font-bold uppercase text-slate-500">
                2. Delayed Projects & Critical Path
              </CardDescription>
              <CardTitle className="text-2xl font-black text-red-600">
                {delayedProjects.length} Site Delay
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-600 truncate font-semibold">
                {delayedProjects[0]?.name || "None"}
              </p>
              <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1 font-medium">
                <AlertTriangle className="h-3 w-3" /> Core Wall Wind Impediment
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500">
            <CardHeader className="pb-1">
              <CardDescription className="text-xs font-bold uppercase text-slate-500">
                3. Total Workforce on Site
              </CardDescription>
              <CardTitle className="text-2xl font-black text-slate-900">
                {workersPresentToday} Workers Logged
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5" /> 96% Daily Turnout
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Active Sites: Metro Viaduct & Apex Tower
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-emerald-600">
            <CardHeader className="pb-1">
              <CardDescription className="text-xs font-bold uppercase text-slate-500">
                4. Capital Spent / Budget
              </CardDescription>
              <CardTitle className="text-2xl font-black text-slate-900">
                {formatCurrency(totalSpent)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-500">
                Budget: <span className="font-semibold text-slate-800">{formatCurrency(totalBudget)}</span>
              </p>
              <p className="text-[11px] text-blue-600 font-bold mt-1">
                {((totalSpent / totalBudget) * 100).toFixed(1)}% Funds Disbursed
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Project Budget Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-bold text-slate-900">
                Multi-Project Budget vs Actual Expenditure ($ Millions)
              </CardTitle>
              <CardDescription className="text-xs">
                Capital allocation compared with verified disbursements
              </CardDescription>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={budgetVsSpentData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} unit="M" />
                  <Tooltip
                    formatter={(val: any) => [`$${val}M`, undefined]}
                    contentStyle={{ backgroundColor: "#0f172a", borderRadius: "8px", color: "#fff" }}
                  />
                  <Legend />
                  <Bar dataKey="Budget" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Spent" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Workforce Attendance Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-bold text-slate-900">
                Cross-Site Labour Attendance & Overtime Hours
              </CardTitle>
              <CardDescription className="text-xs">
                6-Day site muster roll trends across civil trades
              </CardDescription>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={attendanceTrendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderRadius: "8px", color: "#fff" }} />
                  <Legend />
                  <Line type="monotone" dataKey="present" stroke="#10b981" strokeWidth={3} name="Workers Present" />
                  <Line type="monotone" dataKey="overtime" stroke="#f59e0b" strokeWidth={2} name="Overtime Persons" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Immediate Site Progress Feed & Pending Approvals */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Latest Work Completed Today */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-sm font-bold text-slate-900">
                  What Work Was Completed Today?
                </CardTitle>
                <CardDescription className="text-xs">
                  Field reports submitted directly by site supervisors
                </CardDescription>
              </div>
              <Link to="/daily-reports">
                <Button variant="outline" size="sm" className="text-xs h-7">
                  View All Logs
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {dailyReports.map((report) => (
                <div key={report.id} className="rounded-xl border border-slate-100 bg-slate-50 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">{report.projectName}</span>
                    <Badge variant={report.approvalStatus === "APPROVED" ? "success" : "warning"} className="text-[10px]">
                      {report.approvalStatus}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    "{report.workCompleted}"
                  </p>
                  <div className="flex items-center gap-4 text-[11px] text-slate-500">
                    <span>Supervisor: {report.supervisorName}</span>
                    <span>Labor: {report.workersPresent} on site</span>
                    <span>Equipment: {report.equipmentUsed}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Pending Approvals Requiring Owner/PM Attention */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-bold text-slate-900 flex items-center justify-between">
                <span>Action Needed</span>
                <Badge variant="destructive" className="text-[10px]">
                  {pendingApprovalsCount} Items
                </Badge>
              </CardTitle>
              <CardDescription className="text-xs">
                Decisions awaiting authorization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {approvals.slice(0, 4).map((item) => (
                <div key={item.id} className="rounded-lg border border-slate-200 bg-white p-3 text-xs shadow-sm space-y-1">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-[9px] uppercase font-bold text-blue-700">
                      {item.type}
                    </Badge>
                    <span className="text-[10px] text-slate-400">{item.date}</span>
                  </div>
                  <p className="font-semibold text-slate-900">{item.title}</p>
                  <p className="text-[11px] text-slate-500">{item.submittedBy}</p>
                </div>
              ))}
              <Link to="/approvals" className="block pt-2">
                <Button variant="outline" size="sm" className="w-full text-xs">
                  Open Approvals Center
                </Button>
              </Link>
            </CardContent>
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
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="default" className="bg-purple-600 text-[10px]">
                PROJECT MANAGER WORKSPACE
              </Badge>
              <span className="text-xs text-slate-500">Managing {projects.length} Capital Sites</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 mt-1">{currentProject.name}</h1>
            <p className="text-xs text-slate-500">
              Client: {currentProject.clientName} • Target Completion: {currentProject.expectedCompletionDate}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/tasks">
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-xs">
                Manage Tasks ({pendingTasks.length})
              </Button>
            </Link>
          </div>
        </div>

        {/* Milestone Progress Bar & KPIs */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="p-4 border-l-4 border-l-purple-600">
            <p className="text-xs font-semibold text-slate-500">Overall Site Progress</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{currentProject.progressPercentage}%</p>
            <div className="w-full bg-slate-100 rounded-full h-2 mt-2">
              <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${currentProject.progressPercentage}%` }}></div>
            </div>
          </Card>

          <Card className="p-4 border-l-4 border-l-amber-500">
            <p className="text-xs font-semibold text-slate-500">Pending & Blocked Tasks</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{pendingTasks.length} Active</p>
            <p className="text-xs text-red-600 font-semibold mt-1">1 Critical Blocker Reported</p>
          </Card>

          <Card className="p-4 border-l-4 border-l-emerald-600">
            <p className="text-xs font-semibold text-slate-500">Active Stage</p>
            <p className="text-base font-bold text-slate-900 mt-1 truncate">Pier Columns & Caps</p>
            <p className="text-xs text-emerald-600 font-medium mt-1">68% Stage Completion</p>
          </Card>
        </div>

        {/* Stage Execution Overview Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold">Construction Stages & Milestone Progress (%)</CardTitle>
            <CardDescription className="text-xs">Contractual milestones for {currentProject.name}</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stageProgressData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" domain={[0, 100]} unit="%" stroke="#64748b" fontSize={12} />
                <YAxis type="category" dataKey="name" stroke="#64748b" fontSize={11} width={130} />
                <Tooltip formatter={(val: any) => [`${val}%`, "Progress"]} />
                <Bar dataKey="progress" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
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
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
          <div>
            <Badge variant="default" className="bg-emerald-600 text-[10px]">
              CIVIL ENGINEER FIELD WORKSPACE
            </Badge>
            <h1 className="text-2xl font-black text-slate-900 mt-1">
              Structural Inspections & Quality Assurance
            </h1>
            <p className="text-xs text-slate-500">
              Site: {currentProject.name} • Engineer in Charge: Marcus Miller, M.Eng
            </p>
          </div>
          <Link to="/daily-reports">
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-xs">
              Review Daily Progress Logs
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 border-l-4 border-l-emerald-600">
            <p className="text-xs text-slate-500 font-semibold">Concrete Pour Strength Verifications</p>
            <p className="text-2xl font-black text-slate-900 mt-1">45.2 MPa</p>
            <p className="text-xs text-emerald-600 font-medium mt-1">Passes M40 Specification</p>
          </Card>
          <Card className="p-4 border-l-4 border-l-amber-500">
            <p className="text-xs text-slate-500 font-semibold">Slump & Flow Tests</p>
            <p className="text-2xl font-black text-slate-900 mt-1">140 mm</p>
            <p className="text-xs text-slate-500 mt-1">Within 125 - 150mm tolerance</p>
          </Card>
          <Card className="p-4 border-l-4 border-l-blue-600">
            <p className="text-xs text-slate-500 font-semibold">Active Engineering Tasks</p>
            <p className="text-2xl font-black text-slate-900 mt-1">
              {tasks.filter((t) => t.stageName.includes("Piling") || t.stageName.includes("Pier")).length} Tasks
            </p>
            <p className="text-xs text-slate-500 mt-1">Rebar & prestress tendon inspections</p>
          </Card>
        </div>

        {/* Quality Log Checklist */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold">Engineering Quality Log & Inspection Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { item: "Pier Cap P14 28-day Cube Compressive Test", status: "PASSED", note: "Result 46.1 MPa, cleared for superstructure bearing plate placement." },
              { item: "Span S3 Tendon Grouting & Elongation Measurements", status: "VERIFIED", note: "Grout flow cone test 18s, tendon anchorage seated." },
              { item: "Ultrasonic Testing on Girder Flange Welds", status: "PENDING", note: "Scheduled for tomorrow with third-party testing lab." },
            ].map((q, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-slate-200 p-3 text-xs bg-slate-50">
                <div>
                  <p className="font-bold text-slate-900">{q.item}</p>
                  <p className="text-slate-500 mt-0.5">{q.note}</p>
                </div>
                <Badge variant={q.status === "PASSED" ? "success" : "warning"} className="text-[10px]">
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
      <div className="space-y-5 max-w-3xl mx-auto">
        <div className="rounded-xl bg-amber-500 p-4 text-slate-950 shadow-md">
          <Badge variant="outline" className="border-slate-900 text-slate-950 font-bold text-[10px]">
            MOBILE-FIRST FIELD SUPERVISOR
          </Badge>
          <h1 className="text-xl font-black mt-1">Site Supervisor Station</h1>
          <p className="text-xs text-slate-900 font-medium">
            Assigned Site: <span className="font-bold">{currentProject.name}</span>
          </p>
        </div>

        {/* 1-Click Fast Daily Report & Attendance Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link to="/daily-reports" className="block">
            <Button className="w-full h-16 flex flex-col items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 text-white shadow-md">
              <FileText className="h-5 w-5" />
              <span className="text-xs font-bold">1-Click Daily Report</span>
            </Button>
          </Link>
          <Link to="/attendance" className="block">
            <Button className="w-full h-16 flex flex-col items-center justify-center gap-1 bg-slate-900 hover:bg-slate-800 text-white shadow-md">
              <Users className="h-5 w-5 text-amber-400" />
              <span className="text-xs font-bold">Mark Attendance ({workers.length})</span>
            </Button>
          </Link>
        </div>

        {/* Supervisor Status Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card className="p-3 text-center">
            <p className="text-[11px] text-slate-500 font-semibold">Workers Present</p>
            <p className="text-2xl font-black text-slate-900 mt-1">82</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-[11px] text-slate-500 font-semibold">Workers Absent</p>
            <p className="text-2xl font-black text-red-600 mt-1">2</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-[11px] text-slate-500 font-semibold">Tasks Completed</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">1</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-[11px] text-slate-500 font-semibold">Heavy Machines</p>
            <p className="text-2xl font-black text-blue-600 mt-1">3 Active</p>
          </Card>
        </div>

        {/* Immediate Site Checklist */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold">Today's Site Field Checklist</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="flex items-center gap-2 p-2 rounded bg-emerald-50 text-emerald-800 border border-emerald-100">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>07:45 AM Mandatory Safety PPE briefing conducted</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded bg-emerald-50 text-emerald-800 border border-emerald-100">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>Diesel refilled for Transit Mixers & Rotary Rig 2</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded bg-amber-50 text-amber-800 border border-amber-100">
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
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
          <div>
            <Badge variant="default" className="bg-cyan-700 text-[10px]">
              FINANCIAL ACCOUNTS & BILLING DESK
            </Badge>
            <h1 className="text-2xl font-black text-slate-900 mt-1">Project Finances & Cash Flows</h1>
            <p className="text-xs text-slate-500">
              Tracking contractor bills, client receivables, vendor payables & labor wages.
            </p>
          </div>
          <Link to="/finance">
            <Button size="sm" className="bg-cyan-700 hover:bg-cyan-800 text-xs">
              Open Full Finance Ledger
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 border-l-4 border-l-emerald-600">
            <p className="text-xs text-slate-500 font-semibold">Total Client Collections</p>
            <p className="text-2xl font-black text-slate-900 mt-1">$4,850,000</p>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">RA Bills Received</p>
          </Card>
          <Card className="p-4 border-l-4 border-l-amber-500">
            <p className="text-xs text-slate-500 font-semibold">Pending Client Invoices</p>
            <p className="text-2xl font-black text-slate-900 mt-1">$1,100,000</p>
            <p className="text-[11px] text-amber-600 font-semibold mt-1">2 Pending RA Bills</p>
          </Card>
          <Card className="p-4 border-l-4 border-l-blue-600">
            <p className="text-xs text-slate-500 font-semibold">Vendor & Material Payables</p>
            <p className="text-2xl font-black text-slate-900 mt-1">$135,000</p>
            <p className="text-[11px] text-slate-500 mt-1">Due next week (ArcelorMittal)</p>
          </Card>
          <Card className="p-4 border-l-4 border-l-purple-600">
            <p className="text-xs text-slate-500 font-semibold">Approved Labour Wages</p>
            <p className="text-2xl font-black text-slate-900 mt-1">$105,250</p>
            <p className="text-[11px] text-purple-600 font-semibold mt-1">Muster Roll Verified</p>
          </Card>
        </div>

        {/* Invoices List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold">Outstanding Client & Vendor Invoices</CardTitle>
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
      <div className="space-y-6">
        <div className="rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white shadow-md">
          <Badge variant="outline" className="border-white/30 text-white text-[10px]">
            CLIENT PORTAL
          </Badge>
          <h1 className="text-2xl font-bold mt-2">{currentProject.name}</h1>
          <p className="text-xs text-slate-300 mt-1">
            Client: {currentProject.clientName} • Managed by: {currentProject.projectManager}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 border-l-4 border-l-blue-600">
            <p className="text-xs text-slate-500 font-semibold">Verified Construction Progress</p>
            <p className="text-3xl font-black text-slate-900 mt-1">{currentProject.progressPercentage}%</p>
            <p className="text-xs text-emerald-600 font-medium mt-1">On schedule for Q4 2027 handover</p>
          </Card>
          <Card className="p-4 border-l-4 border-l-emerald-600">
            <p className="text-xs text-slate-500 font-semibold">Payment Milestones Disbursed</p>
            <p className="text-3xl font-black text-slate-900 mt-1">$5.12M</p>
            <p className="text-xs text-slate-500 mt-1">Of $18.5M Contract Value</p>
          </Card>
          <Card className="p-4 border-l-4 border-l-amber-500">
            <p className="text-xs text-slate-500 font-semibold">Site Quality Inspection Score</p>
            <p className="text-3xl font-black text-slate-900 mt-1">98.4%</p>
            <p className="text-xs text-emerald-600 font-medium mt-1">Zero structural non-compliances</p>
          </Card>
        </div>

        {/* Client Progress Photos Carousel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Camera className="h-4 w-4 text-blue-600" />
              Approved Construction Progress Photos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl overflow-hidden border border-slate-200">
                <img
                  src="https://images.unsplash.com/photo-1541888946425-d0fbb1861564?w=800&auto=format&fit=crop&q=80"
                  alt="Pier Cap"
                  className="w-full h-48 object-cover"
                />
                <div className="p-3 bg-white text-xs">
                  <p className="font-bold text-slate-900">Pier Cap P14 Concrete Pouring & Curing</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">Verified on Nov 21, 2026</p>
                </div>
              </div>
              <div className="rounded-xl overflow-hidden border border-slate-200">
                <img
                  src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80"
                  alt="Viaduct"
                  className="w-full h-48 object-cover"
                />
                <div className="p-3 bg-white text-xs">
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
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <Badge variant="destructive" className="text-[10px]">PLATFORM ADMIN</Badge>
          <h1 className="text-2xl font-black text-slate-900 mt-1">Platform Multi-Tenant Administration</h1>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-xs text-slate-500 font-semibold">Total Companies</p>
          <p className="text-2xl font-black text-slate-900 mt-1">14 Enterprise</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-slate-500 font-semibold">Total Projects</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{projects.length} Sites</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-slate-500 font-semibold">Total Active Users</p>
          <p className="text-2xl font-black text-slate-900 mt-1">284 Users</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-slate-500 font-semibold">System Health</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">99.98% OK</p>
        </Card>
      </div>
    </div>
  );
};
