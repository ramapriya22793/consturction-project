import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  Plus,
  Search,
  Filter,
  LayoutGrid,
  List,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { useConstructionStore } from "../store/useConstructionStore";
import { Project, ProjectStatus } from "../types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { formatCurrency } from "../lib/utils";

export const ProjectsPage: React.FC = () => {
  const { projects, addProject } = useConstructionStore();
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Create form state
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [type, setType] = useState<Project["type"]>("Infrastructure");
  const [clientName, setClientName] = useState("");
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState(10000000);
  const [startDate, setStartDate] = useState("2026-03-01");
  const [completionDate, setCompletionDate] = useState("2027-12-31");
  const [projectManager, setProjectManager] = useState("Sarah Chen, PMP");
  const [engineer, setEngineer] = useState("Marcus Miller, M.Eng");

  const filteredProjects = projects.filter((p) => {
    const matchesStatus = statusFilter === "ALL" || p.status === statusFilter;
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase()) ||
      p.clientName.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newProj: Project = {
      id: `prj-${Date.now()}`,
      code,
      name,
      type,
      location,
      siteAddress: location,
      clientName,
      projectManager,
      assignedEngineer: engineer,
      supervisor: "Assigned Supervisor",
      startDate,
      expectedCompletionDate: completionDate,
      contractValue: budget * 1.15,
      budget,
      spent: 0,
      status: "ACTIVE",
      progressPercentage: 0,
      image: "https://images.unsplash.com/photo-1541888946425-d0fbb1861564?w=800&auto=format&fit=crop&q=80",
      description: "New civil project initialized with standard construction stage template.",
      workforceCount: 45,
      openTasksCount: 4,
      stages: [
        { id: "s1", name: "Site Levelling & Preparation", startDate, endDate: "2026-05-01", assignedEngineer: engineer, status: "IN_PROGRESS", progress: 20, tasksCount: 4 },
        { id: "s2", name: "Foundation & Substructure", startDate: "2026-05-02", endDate: "2026-09-30", assignedEngineer: engineer, status: "NOT_STARTED", progress: 0, tasksCount: 8 },
        { id: "s3", name: "Superstructure Frame", startDate: "2026-10-01", endDate: completionDate, assignedEngineer: engineer, status: "NOT_STARTED", progress: 0, tasksCount: 12 },
      ],
    };
    addProject(newProj);
    setIsCreateOpen(false);
    setName("");
    setCode("");
  };

  const getStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case "ACTIVE":
        return <Badge variant="success">ACTIVE</Badge>;
      case "DELAYED":
        return <Badge variant="destructive">DELAYED</Badge>;
      case "COMPLETED":
        return <Badge variant="default">COMPLETED</Badge>;
      case "ON_HOLD":
        return <Badge variant="warning">ON HOLD</Badge>;
      case "DRAFT":
        return <Badge variant="secondary">DRAFT</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Construction Projects & Active Sites
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Overview of {projects.length} multi-disciplinary capital construction projects.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setIsCreateOpen(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-xs">
            <Plus className="h-4 w-4" />
            Create Project
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <Search className="h-4 w-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, code, client or location..."
            className="w-full text-xs bg-transparent focus:outline-none text-slate-800 placeholder-slate-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {["ALL", "ACTIVE", "DELAYED", "COMPLETED", "ON_HOLD"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                statusFilter === st
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {st}
            </button>
          ))}

          <div className="border-l pl-2 flex items-center gap-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md ${viewMode === "grid" ? "bg-slate-200 text-slate-900" : "text-slate-400 hover:text-slate-600"}`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-md ${viewMode === "table" ? "bg-slate-200 text-slate-900" : "text-slate-400 hover:text-slate-600"}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((p) => (
            <Card key={p.id} className="overflow-hidden hover:shadow-md transition-shadow border-slate-200 flex flex-col justify-between">
              <div>
                <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute top-3 right-3">{getStatusBadge(p.status)}</div>
                  <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur px-2.5 py-1 rounded-md text-[11px] font-mono font-bold text-amber-400 border border-slate-800">
                    {p.code}
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base leading-snug">{p.name}</h3>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      {p.location}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-500">Progress:</span>
                      <span className="text-blue-600 font-bold">{p.progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${p.progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Budget</span>
                      <span className="font-bold text-slate-800">{formatCurrency(p.budget)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Spent</span>
                      <span className="font-bold text-slate-800">{formatCurrency(p.spent)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs mt-2">
                <span className="text-slate-500">Client: <strong className="text-slate-700">{p.clientName}</strong></span>
                <Link
                  to={`/projects/${p.id}`}
                  className="font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  Project Details
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* Table View */
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold uppercase border-b">
                  <tr>
                    <th className="px-6 py-3">Code & Name</th>
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3">Location</th>
                    <th className="px-6 py-3">Client</th>
                    <th className="px-6 py-3">Budget</th>
                    <th className="px-6 py-3">Progress</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProjects.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/70">
                      <td className="px-6 py-4 font-bold text-slate-900">
                        <div>{p.name}</div>
                        <span className="font-mono text-[10px] text-slate-400">{p.code}</span>
                      </td>
                      <td className="px-6 py-4">{p.type}</td>
                      <td className="px-6 py-4 text-slate-600">{p.location}</td>
                      <td className="px-6 py-4 font-medium">{p.clientName}</td>
                      <td className="px-6 py-4 font-mono font-bold text-slate-800">{formatCurrency(p.budget)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-100 rounded-full h-1.5">
                            <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${p.progressPercentage}%` }}></div>
                          </div>
                          <span className="font-bold text-blue-600">{p.progressPercentage}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(p.status)}</td>
                      <td className="px-6 py-4 text-right">
                        <Link to={`/projects/${p.id}`} className="text-blue-600 font-bold hover:underline">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Project Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-900">Create New Construction Project</h3>
              <button onClick={() => setIsCreateOpen(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleCreate} className="mt-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Project Name</label>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. City Rail Elevated Corridor"
                    className="mt-1 w-full rounded-md border border-slate-300 p-2 text-xs focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Project Code</label>
                  <input
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="e.g. CR-VIADUCT-02"
                    className="mt-1 w-full rounded-md border border-slate-300 p-2 text-xs focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Project Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="mt-1 w-full rounded-md border border-slate-300 p-2 text-xs focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Residential">Residential</option>
                    <option value="Industrial">Industrial</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Client Organization</label>
                  <input
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. National Highway Authority"
                    className="mt-1 w-full rounded-md border border-slate-300 p-2 text-xs focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700">Site Location & Address</label>
                <input
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Sector 22, Highway Expressway Interchange"
                  className="mt-1 w-full rounded-md border border-slate-300 p-2 text-xs focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Approved Budget ($)</label>
                  <input
                    type="number"
                    required
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="mt-1 w-full rounded-md border border-slate-300 p-2 text-xs focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="mt-1 w-full rounded-md border border-slate-300 p-2 text-xs focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Completion Date</label>
                  <input
                    type="date"
                    value={completionDate}
                    onChange={(e) => setCompletionDate(e.target.value)}
                    className="mt-1 w-full rounded-md border border-slate-300 p-2 text-xs focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm">
                  Create Project
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
