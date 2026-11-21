import React from "react";
import {
  DollarSign,
  Users,
  AlertTriangle,
  FolderLock,
  TrendingUp,
  FileDown,
  PlusCircle,
  FileSpreadsheet,
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
} from "recharts";
import { useProjectStore } from "../store/useProjectStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { formatCurrency } from "../lib/utils";

interface DashboardProps {
  onOpenReportModal: () => void;
  onOpenUploadModal: () => void;
  onExportExcel: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onOpenReportModal,
  onOpenUploadModal,
  onExportExcel,
}) => {
  const { projects, activeProjectId, dailyReports, materials, documents, tasks } = useProjectStore();
  const currentProject = projects.find((p) => p.id === activeProjectId) || projects[0];

  // Budget data for Recharts
  const budgetComparisonData = projects.map((p) => ({
    name: p.code,
    Budget: p.budget / 1000000,
    Spent: p.spent / 1000000,
  }));

  // Workforce trend for Recharts
  const workforceData = [
    { day: "Mon", workforce: 68 },
    { day: "Tue", workforce: 74 },
    { day: "Wed", workforce: 82 },
    { day: "Thu", workforce: 78 },
    { day: "Fri", workforce: 84 },
    { day: "Sat", workforce: 62 },
    { day: "Sun", workforce: 20 },
  ];

  const totalBudget = projects.reduce((acc, p) => acc + p.budget, 0);
  const totalSpent = projects.reduce((acc, p) => acc + p.spent, 0);
  const currentWorkforce = dailyReports[0]?.workforceCount || 84;
  const pendingTasks = tasks.filter((t) => t.status !== "COMPLETED").length;

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-xl bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 p-6 text-white shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
              {currentProject.code}
            </span>
            <Badge variant="outline" className="text-white border-white/20 text-xs">
              {currentProject.status.replace("_", " ")}
            </Badge>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">{currentProject.name}</h1>
          <p className="text-sm text-slate-300 mt-1">
            Client: <span className="font-semibold text-white">{currentProject.clientName}</span> | Location: {currentProject.location}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            onClick={onOpenReportModal}
            variant="civil"
            size="sm"
            className="flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            New Daily Report (PDF)
          </Button>

          <Button
            onClick={onOpenUploadModal}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border-white/20"
          >
            <FolderLock className="h-4 w-4 text-amber-400" />
            Upload to R2
          </Button>

          <Button
            onClick={onExportExcel}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border-white/20"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
            Export BOQ Excel
          </Button>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-600">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Project Budget & Expenditure
            </CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {formatCurrency(currentProject.spent)}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Allocated: <span className="font-semibold text-slate-700">{formatCurrency(currentProject.budget)}</span>
            </p>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
              <div
                className="bg-blue-600 h-1.5 rounded-full"
                style={{ width: `${Math.min(100, (currentProject.spent / currentProject.budget) * 100)}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Workforce on Site
            </CardTitle>
            <Users className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{currentWorkforce} Persons</div>
            <p className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-1">
              <TrendingUp className="h-3.5 w-3.5" /> +8% vs yesterday's shift
            </p>
            <p className="text-[11px] text-slate-400 mt-2">Certified safety helmets & gear logged</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-600">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Open Tasks & Milestones
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{pendingTasks} Active</div>
            <p className="text-xs text-slate-500 mt-1">
              Completed: <span className="font-semibold text-emerald-600">{tasks.filter((t) => t.status === "COMPLETED").length}</span>
            </p>
            <p className="text-[11px] text-slate-400 mt-2">Critical path monitoring active</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-600">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Cloudflare R2 Documents
            </CardTitle>
            <FolderLock className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{documents.length} Files</div>
            <p className="text-xs text-slate-500 mt-1">
              Encrypted CAD, Specs & Contracts
            </p>
            <p className="text-[11px] text-emerald-600 font-medium mt-2">S3-Compatible Presigned Access</p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Charts (Recharts) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Budget Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Financial Budget vs Expenditure ($ Millions)</CardTitle>
            <CardDescription>Multi-project comparative allocation and disbursed funds</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budgetComparisonData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} unit="M" />
                <Tooltip
                  formatter={(value: any) => [`$${value}M`, undefined]}
                  contentStyle={{ backgroundColor: "#0f172a", borderRadius: "8px", color: "#fff" }}
                />
                <Legend />
                <Bar dataKey="Budget" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Spent" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Workforce Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">7-Day On-Site Labor & Workforce Trend</CardTitle>
            <CardDescription>Real-time daily log analytics of engineers and craftworkers</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={workforceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderRadius: "8px", color: "#fff" }}
                />
                <Line
                  type="monotone"
                  dataKey="workforce"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 5, fill: "#10b981" }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
