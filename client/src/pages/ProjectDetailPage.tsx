import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  Calendar,
  DollarSign,
  MapPin,
  Users,
  CheckCircle2,
  Clock,
  Layers,
  FileText,
  Boxes,
  Truck,
  Shield,
  Activity,
  Plus,
  ArrowRight,
} from "lucide-react";
import { useConstructionStore } from "../store/useConstructionStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { formatCurrency } from "../lib/utils";

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { projects, tasks, dailyReports, materials, expenses } = useConstructionStore();
  const [activeTab, setActiveTab] = useState<string>("overview");

  const project = projects.find((p) => p.id === id) || projects[0];

  const projectTasks = tasks.filter((t) => t.projectId === project.id);
  const projectReports = dailyReports.filter((r) => r.projectId === project.id);
  const projectMaterials = materials.filter((m) => m.siteLocation.toLowerCase().includes(project.name.toLowerCase().substring(0, 5)));
  const projectExpenses = expenses.filter((e) => e.projectId === project.id);

  const tabs = [
    { id: "overview", label: "1. Overview" },
    { id: "stages", label: "2. Project Stages" },
    { id: "tasks", label: `3. Tasks (${projectTasks.length})` },
    { id: "workforce", label: "4. Workforce" },
    { id: "reports", label: `5. Daily Reports (${projectReports.length})` },
    { id: "materials", label: "6. Materials" },
    { id: "expenses", label: "7. Expenses" },
    { id: "documents", label: "8. Documents" },
    { id: "team", label: "9. Team" },
    { id: "activity", label: "10. Activity Log" },
  ];

  return (
    <div className="space-y-6">
      {/* Back Button & Top Banner */}
      <div className="flex items-center gap-2">
        <Link to="/projects" className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Projects Directory
        </Link>
      </div>

      <div className="rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-amber-400/20 px-2 py-0.5 text-xs font-mono font-bold text-amber-400 border border-amber-400/30">
                {project.code}
              </span>
              <Badge variant="outline" className="border-white/30 text-white text-[10px]">
                {project.type}
              </Badge>
              <Badge variant={project.status === "ACTIVE" ? "success" : "destructive"} className="text-[10px]">
                {project.status}
              </Badge>
            </div>
            <h1 className="text-2xl font-black mt-2 text-white">{project.name}</h1>
            <p className="text-xs text-slate-300 mt-1 flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-amber-400" />
              {project.siteAddress} • Client: {project.clientName}
            </p>
          </div>

          <div className="flex items-center gap-6 bg-slate-950/60 p-4 rounded-xl border border-slate-700/80">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Contract Value</span>
              <span className="text-lg font-black text-white">{formatCurrency(project.contractValue)}</span>
            </div>
            <div className="border-l border-slate-700 pl-4">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Progress</span>
              <span className="text-lg font-black text-amber-400">{project.progressPercentage}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 10 Navigation Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto border-b border-slate-200 pb-1 scrollbar-thin">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === tab.id
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <span className="text-xs text-slate-500 font-semibold">Budget Utilization</span>
              <p className="text-xl font-bold text-slate-900 mt-1">{formatCurrency(project.spent)}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Budget: {formatCurrency(project.budget)}</p>
            </Card>
            <Card className="p-4">
              <span className="text-xs text-slate-500 font-semibold">Workforce Allocated</span>
              <p className="text-xl font-bold text-slate-900 mt-1">{project.workforceCount} Persons</p>
              <p className="text-[11px] text-emerald-600 font-medium mt-0.5">Muster roll verified</p>
            </Card>
            <Card className="p-4">
              <span className="text-xs text-slate-500 font-semibold">Scheduled Completion</span>
              <p className="text-xl font-bold text-slate-900 mt-1">{project.expectedCompletionDate}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Started: {project.startDate}</p>
            </Card>
            <Card className="p-4">
              <span className="text-xs text-slate-500 font-semibold">Project Manager</span>
              <p className="text-base font-bold text-slate-900 mt-1">{project.projectManager}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Engineer: {project.assignedEngineer}</p>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-bold">Scope & Civil Engineering Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-700 leading-relaxed">{project.description}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 2: PROJECT STAGES */}
      {activeTab === "stages" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Contractual Construction Stages & Work Packages</h3>
          </div>
          <div className="space-y-3">
            {project.stages.map((stage) => (
              <Card key={stage.id} className="p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{stage.name}</span>
                      <Badge variant={stage.status === "COMPLETED" ? "success" : stage.status === "DELAYED" ? "destructive" : "default"} className="text-[10px]">
                        {stage.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500">
                      Duration: {stage.startDate} to {stage.endDate} • Lead Engineer: {stage.assignedEngineer}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-32">
                      <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                        <span>Completion</span>
                        <span>{stage.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${stage.progress}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: TASKS */}
      {activeTab === "tasks" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Tasks Allocated to this Site</h3>
            <Link to="/tasks">
              <Button size="sm" variant="outline" className="text-xs">
                Open Full Kanban Board
              </Button>
            </Link>
          </div>
          {projectTasks.map((t) => (
            <Card key={t.id} className="p-3 text-xs flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">{t.title}</p>
                <p className="text-slate-500 mt-0.5">Assigned: {t.assignedTo} • Due: {t.dueDate}</p>
              </div>
              <Badge variant="outline">{t.status}</Badge>
            </Card>
          ))}
        </div>
      )}

      {/* TAB 4: WORKFORCE */}
      {activeTab === "workforce" && (
        <Card className="p-4">
          <h3 className="text-sm font-bold text-slate-900 mb-3">On-Site Labor Allocation ({project.workforceCount} Workers)</h3>
          <p className="text-xs text-slate-600">
            Workforce on this project includes Masons, Carpenters, Welders, Hydraulic Rig Operators, and Helpers.
          </p>
          <div className="mt-4">
            <Link to="/attendance">
              <Button size="sm" className="text-xs">Mark Site Attendance</Button>
            </Link>
          </div>
        </Card>
      )}

      {/* TAB 5: DAILY REPORTS */}
      {activeTab === "reports" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Filed Daily Progress Reports</h3>
            <Link to="/daily-reports">
              <Button size="sm" className="text-xs">New Report</Button>
            </Link>
          </div>
          {projectReports.map((r) => (
            <Card key={r.id} className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-xs">Date: {r.reportDate}</span>
                <Badge variant={r.approvalStatus === "APPROVED" ? "success" : "warning"}>{r.approvalStatus}</Badge>
              </div>
              <p className="text-xs text-slate-700">{r.workCompleted}</p>
            </Card>
          ))}
        </div>
      )}

      {/* TAB 6: MATERIALS */}
      {activeTab === "materials" && (
        <Card className="p-4">
          <h3 className="text-sm font-bold text-slate-900 mb-2">Allocated Materials & Consumables</h3>
          <p className="text-xs text-slate-500 mb-4">Stock allocated directly to this project location.</p>
          <Link to="/materials">
            <Button size="sm" className="text-xs">View Materials Master</Button>
          </Link>
        </Card>
      )}

      {/* TAB 7: EXPENSES */}
      {activeTab === "expenses" && (
        <Card className="p-4">
          <h3 className="text-sm font-bold text-slate-900 mb-3">Project Expenses & Field Disbursements</h3>
          {projectExpenses.map((exp) => (
            <div key={exp.id} className="flex justify-between items-center py-2 border-b text-xs">
              <div>
                <p className="font-bold text-slate-800">{exp.description}</p>
                <p className="text-slate-500">{exp.category} • {exp.vendor}</p>
              </div>
              <span className="font-mono font-bold text-slate-900">{formatCurrency(exp.amount)}</span>
            </div>
          ))}
        </Card>
      )}

      {/* TAB 8: DOCUMENTS */}
      {activeTab === "documents" && (
        <Card className="p-4">
          <h3 className="text-sm font-bold text-slate-900 mb-2">Cloudflare R2 Engineering Drawings & Contracts</h3>
          <p className="text-xs text-slate-500">
            Structural DWG/DXF drawings, geotechnical soil bore tests, and municipal NOC approvals stored securely.
          </p>
        </Card>
      )}

      {/* TAB 9: TEAM */}
      {activeTab === "team" && (
        <Card className="p-4 space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Assigned Project Personnel</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 border">
              <span className="text-[10px] text-slate-400 font-bold block">PROJECT MANAGER</span>
              <p className="font-bold text-slate-900 mt-1">{project.projectManager}</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border">
              <span className="text-[10px] text-slate-400 font-bold block">SITE ENGINEER</span>
              <p className="font-bold text-slate-900 mt-1">{project.assignedEngineer}</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border">
              <span className="text-[10px] text-slate-400 font-bold block">SITE SUPERVISOR</span>
              <p className="font-bold text-slate-900 mt-1">{project.supervisor}</p>
            </div>
          </div>
        </Card>
      )}

      {/* TAB 10: ACTIVITY LOG */}
      {activeTab === "activity" && (
        <Card className="p-4">
          <h3 className="text-sm font-bold text-slate-900 mb-3">Project Audit Trail & Milestone History</h3>
          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-slate-400" />
              <span>Today 08:00 AM - Daily muster roll attendance verified (82 workers present)</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-slate-400" />
              <span>Nov 20 04:30 PM - Pier Cap P14 180 m³ concrete pour completed</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-slate-400" />
              <span>Nov 18 10:15 AM - Ultrasonic testing passed for Girder Span S4</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
