import React, { useState } from "react";
import {
  FileText,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Camera,
  Calendar,
  Users,
  Sun,
  Truck,
  Download,
  Check,
  X,
  Eye,
} from "lucide-react";
import { useConstructionStore } from "../store/useConstructionStore";
import { DailyReport } from "../types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

export const DailyReportsPage: React.FC = () => {
  const { dailyReports, projects, addDailyReport, updateReportApproval } = useConstructionStore();
  const [selectedReport, setSelectedReport] = useState<DailyReport | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Form states
  const [projectId, setProjectId] = useState(projects[0]?.id || "");
  const [weather, setWeather] = useState("Sunny / 28°C");
  const [workersPresent, setWorkersPresent] = useState(84);
  const [workersAbsent, setWorkersAbsent] = useState(2);
  const [stageName, setStageName] = useState("Pier Columns & Pier Caps Pouring");
  const [workCompleted, setWorkCompleted] = useState("");
  const [completedQuantity, setCompletedQuantity] = useState("180 m³ concrete poured, 28 MT rebar placed");
  const [materialsUsed, setMaterialsUsed] = useState("180 m³ M40 Concrete, 28 MT Fe500D TMT Bars");
  const [equipmentUsed, setEquipmentUsed] = useState("2x 50-Ton Cranes, 6x Transit Mixers");
  const [siteExpenses, setSiteExpenses] = useState(15000);
  const [safetyObservations, setSafetyObservations] = useState("100% PPE adherence, morning safety toolbox talk completed.");
  const [nextDayPlan, setNextDayPlan] = useState("Shuttering removal and curing inspection.");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const proj = projects.find((p) => p.id === projectId) || projects[0];
    const newReport: DailyReport = {
      id: `dr-${Date.now()}`,
      projectId: proj.id,
      projectName: proj.name,
      siteLocation: proj.location,
      reportDate: new Date().toISOString().split("T")[0],
      supervisorName: "Site Field Supervisor",
      weather,
      workersPresent: Number(workersPresent),
      workersAbsent: Number(workersAbsent),
      workCompleted,
      stageName,
      completedQuantity,
      materialsUsed,
      equipmentUsed,
      siteExpenses: Number(siteExpenses),
      safetyObservations,
      photos: ["https://images.unsplash.com/photo-1541888946425-d0fbb1861564?w=800&auto=format&fit=crop&q=80"],
      nextDayPlan,
      approvalStatus: "SUBMITTED",
    };
    addDailyReport(newReport);
    setIsCreateOpen(false);
    setWorkCompleted("");
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Daily Site Progress Reports (DPR)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Official field compliance records, photo logs, workforce muster, and quality certifications.
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-xs">
          <Plus className="h-4 w-4" />
          Log Daily Report
        </Button>
      </div>

      {/* Reports List */}
      <div className="grid grid-cols-1 gap-4">
        {dailyReports.map((report) => (
          <Card key={report.id} className="hover:border-slate-300 transition-colors">
            <CardHeader className="p-5 pb-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">
                      {report.projectName} — Daily Report
                    </h3>
                    <p className="text-xs text-slate-500">
                      Filed on <span className="font-semibold text-slate-700">{report.reportDate}</span> by {report.supervisorName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs font-mono">
                    <Sun className="h-3 w-3 text-amber-500 mr-1" />
                    {report.weather}
                  </Badge>
                  <Badge variant="outline" className="text-xs font-mono">
                    <Users className="h-3 w-3 text-blue-500 mr-1" />
                    {report.workersPresent} Workers Present
                  </Badge>
                  <Badge
                    variant={
                      report.approvalStatus === "APPROVED"
                        ? "success"
                        : report.approvalStatus === "REJECTED"
                        ? "destructive"
                        : "warning"
                    }
                    className="text-xs"
                  >
                    {report.approvalStatus}
                  </Badge>
                  <Button
                    onClick={() => setSelectedReport(report)}
                    variant="outline"
                    size="sm"
                    className="text-xs h-8 flex items-center gap-1"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Inspect Details
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-5 pt-0 space-y-3">
              <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-100">
                <p className="text-[11px] font-bold text-slate-500 uppercase">Work Executed Today:</p>
                <p className="text-xs text-slate-800 leading-relaxed font-medium mt-1">
                  {report.workCompleted}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-600">
                <div className="bg-white p-2.5 rounded border border-slate-200">
                  <span className="font-semibold text-slate-800 block">Completed Quantity:</span>
                  <span className="text-[11px] text-slate-600">{report.completedQuantity}</span>
                </div>
                <div className="bg-white p-2.5 rounded border border-slate-200">
                  <span className="font-semibold text-slate-800 block">Materials Used:</span>
                  <span className="text-[11px] text-slate-600 truncate block">{report.materialsUsed}</span>
                </div>
                <div className="bg-white p-2.5 rounded border border-slate-200">
                  <span className="font-semibold text-slate-800 block">Equipment Active:</span>
                  <span className="text-[11px] text-slate-600 truncate block">{report.equipmentUsed}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Inspect & Approve Details Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Daily Site Progress Inspection & Verification
                </h3>
                <p className="text-xs text-slate-500">{selectedReport.projectName} • {selectedReport.reportDate}</p>
              </div>
              <button onClick={() => setSelectedReport(null)} className="text-slate-400 font-bold">✕</button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-slate-50 border">
                <div>
                  <span className="text-slate-400 block text-[10px]">Site Location:</span>
                  <span className="font-bold text-slate-800">{selectedReport.siteLocation}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Supervisor in Charge:</span>
                  <span className="font-bold text-slate-800">{selectedReport.supervisorName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Weather Condition:</span>
                  <span className="font-bold text-slate-800">{selectedReport.weather}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Workforce Muster:</span>
                  <span className="font-bold text-slate-800">{selectedReport.workersPresent} Present, {selectedReport.workersAbsent} Absent</span>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-800">Work Executed Today:</span>
                <p className="mt-1 p-3 rounded-lg bg-slate-50 text-slate-700 leading-relaxed border">
                  {selectedReport.workCompleted}
                </p>
              </div>

              <div>
                <span className="font-bold text-slate-800">Safety & Quality Observations:</span>
                <p className="mt-1 p-3 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-100">
                  {selectedReport.safetyObservations || "100% PPE compliance recorded."}
                </p>
              </div>

              <div>
                <span className="font-bold text-slate-800">Plan for Tomorrow:</span>
                <p className="mt-1 p-3 rounded-lg bg-blue-50 text-blue-800 border border-blue-100">
                  {selectedReport.nextDayPlan}
                </p>
              </div>

              {selectedReport.photos.length > 0 && (
                <div>
                  <span className="font-bold text-slate-800">Site Progress Photos:</span>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {selectedReport.photos.map((ph, idx) => (
                      <img key={idx} src={ph} alt="Site" className="rounded-lg h-36 w-full object-cover border" />
                    ))}
                  </div>
                </div>
              )}

              {/* Approval Actions for PM / Owner */}
              <div className="pt-4 border-t flex items-center justify-between">
                <span className="font-bold text-slate-700">Project Manager / Owner Decision:</span>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => {
                      updateReportApproval(selectedReport.id, "REJECTED", "Rejection: Cube strength results missing");
                      setSelectedReport(null);
                    }}
                    variant="destructive"
                    size="sm"
                    className="text-xs"
                  >
                    <X className="h-3.5 w-3.5 mr-1" /> Reject
                  </Button>
                  <Button
                    onClick={() => {
                      updateReportApproval(selectedReport.id, "APPROVED", "Approved by Project Manager");
                      setSelectedReport(null);
                    }}
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 text-xs text-white"
                  >
                    <Check className="h-3.5 w-3.5 mr-1" /> Approve & Update Progress
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Report Form Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-900">Create Daily Site Report</h3>
              <button onClick={() => setIsCreateOpen(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleCreate} className="mt-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Project Site</label>
                  <select
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    className="mt-1 w-full rounded-md border border-slate-300 p-2 text-xs focus:border-blue-500 focus:outline-none"
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Weather Condition</label>
                  <input
                    value={weather}
                    onChange={(e) => setWeather(e.target.value)}
                    className="mt-1 w-full rounded-md border border-slate-300 p-2 text-xs focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Workers Present on Site</label>
                  <input
                    type="number"
                    value={workersPresent}
                    onChange={(e) => setWorkersPresent(Number(e.target.value))}
                    className="mt-1 w-full rounded-md border border-slate-300 p-2 text-xs focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Workers Absent</label>
                  <input
                    type="number"
                    value={workersAbsent}
                    onChange={(e) => setWorkersAbsent(Number(e.target.value))}
                    className="mt-1 w-full rounded-md border border-slate-300 p-2 text-xs focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700">Work Completed Today</label>
                <textarea
                  required
                  rows={3}
                  value={workCompleted}
                  onChange={(e) => setWorkCompleted(e.target.value)}
                  placeholder="Detailed breakdown of construction work executed today..."
                  className="mt-1 w-full rounded-md border border-slate-300 p-2 text-xs focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Quantity Poured / Placed</label>
                  <input
                    value={completedQuantity}
                    onChange={(e) => setCompletedQuantity(e.target.value)}
                    className="mt-1 w-full rounded-md border border-slate-300 p-2 text-xs focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Materials Used</label>
                  <input
                    value={materialsUsed}
                    onChange={(e) => setMaterialsUsed(e.target.value)}
                    className="mt-1 w-full rounded-md border border-slate-300 p-2 text-xs focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Heavy Equipment Used</label>
                  <input
                    value={equipmentUsed}
                    onChange={(e) => setEquipmentUsed(e.target.value)}
                    className="mt-1 w-full rounded-md border border-slate-300 p-2 text-xs focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Site Expenses ($)</label>
                  <input
                    type="number"
                    value={siteExpenses}
                    onChange={(e) => setSiteExpenses(Number(e.target.value))}
                    className="mt-1 w-full rounded-md border border-slate-300 p-2 text-xs focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700">Tomorrow's Planned Activities</label>
                <input
                  value={nextDayPlan}
                  onChange={(e) => setNextDayPlan(e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 p-2 text-xs focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm">
                  Publish Daily Report
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
