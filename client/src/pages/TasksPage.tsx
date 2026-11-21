import React, { useState } from "react";
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  User,
  AlertTriangle,
  Kanban,
  List as ListIcon,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { useConstructionStore } from "../store/useConstructionStore";
import { Task, TaskPriority, TaskStatus } from "../types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

export const TasksPage: React.FC = () => {
  const { tasks, projects, addTask, updateTaskStatus } = useConstructionStore();
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState(projects[0]?.id || "");
  const [stageName, setStageName] = useState("Foundation & Substructure");
  const [assignedTo, setAssignedTo] = useState("Marcus Miller (Site Engineer)");
  const [assignedWorkers, setAssignedWorkers] = useState(10);
  const [priority, setPriority] = useState<TaskPriority>("HIGH");
  const [dueDate, setDueDate] = useState("2026-12-15");

  const filteredTasks = tasks.filter((t) => {
    const matchesPriority = priorityFilter === "ALL" || t.priority === priorityFilter;
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.projectName.toLowerCase().includes(search.toLowerCase()) ||
      t.assignedTo.toLowerCase().includes(search.toLowerCase());
    return matchesPriority && matchesSearch;
  });

  const kanbanColumns: { id: TaskStatus; label: string; color: string }[] = [
    { id: "NOT_STARTED", label: "Not Started", color: "border-t-slate-400" },
    { id: "ASSIGNED", label: "Assigned", color: "border-t-blue-500" },
    { id: "IN_PROGRESS", label: "In Progress", color: "border-t-amber-500" },
    { id: "BLOCKED", label: "Blocked", color: "border-t-red-500" },
    { id: "UNDER_REVIEW", label: "Under Review", color: "border-t-purple-500" },
    { id: "COMPLETED", label: "Completed", color: "border-t-emerald-500" },
  ];

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    const proj = projects.find((p) => p.id === projectId) || projects[0];
    const newTask: Task = {
      id: `tsk-${Date.now()}`,
      title,
      description,
      projectId: proj.id,
      projectName: proj.name,
      siteLocation: proj.location,
      stageName,
      assignedTo,
      assignedWorkersCount: Number(assignedWorkers),
      priority,
      status: "ASSIGNED",
      startDate: new Date().toISOString().split("T")[0],
      dueDate,
      estimatedHours: 40,
      progress: 0,
    };
    addTask(newTask);
    setIsModalOpen(false);
    setTitle("");
    setDescription("");
  };

  const getPriorityBadge = (p: TaskPriority) => {
    switch (p) {
      case "URGENT":
        return <Badge variant="destructive">URGENT</Badge>;
      case "HIGH":
        return <Badge variant="warning">HIGH</Badge>;
      case "MEDIUM":
        return <Badge variant="default">MEDIUM</Badge>;
      case "LOW":
        return <Badge variant="secondary">LOW</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Task Scheduling & Critical Path Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage work packages, stage dependencies, and worker allocation.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-xs">
          <Plus className="h-4 w-4" />
          Create Task
        </Button>
      </div>

      {/* Filter and View Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <Search className="h-4 w-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks, assigned engineers..."
            className="w-full text-xs bg-transparent focus:outline-none text-slate-800 placeholder-slate-400"
          />
        </div>

        <div className="flex items-center gap-2">
          {["ALL", "URGENT", "HIGH", "MEDIUM", "LOW"].map((p) => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                priorityFilter === p ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {p}
            </button>
          ))}

          <div className="border-l pl-2 flex items-center gap-1">
            <button
              onClick={() => setViewMode("kanban")}
              className={`p-1.5 rounded-md ${viewMode === "kanban" ? "bg-slate-200 text-slate-900" : "text-slate-400 hover:text-slate-600"}`}
            >
              <Kanban className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-md ${viewMode === "list" ? "bg-slate-200 text-slate-900" : "text-slate-400 hover:text-slate-600"}`}
            >
              <ListIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Kanban Board View */}
      {viewMode === "kanban" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5 items-start">
          {kanbanColumns.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.id);
            return (
              <div key={col.id} className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 space-y-3">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="text-xs font-bold text-slate-800">{col.label}</span>
                  <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                    {colTasks.length}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {colTasks.map((task) => (
                    <Card key={task.id} className={`p-3 bg-white shadow-sm border-t-2 ${col.color} space-y-2`}>
                      <div className="flex items-start justify-between gap-1">
                        <span className="text-[10px] font-mono text-slate-400 font-bold truncate max-w-[110px]">
                          {task.projectName}
                        </span>
                        {getPriorityBadge(task.priority)}
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 leading-snug">{task.title}</h4>

                      {task.blockerReason && (
                        <div className="rounded bg-red-50 p-1.5 text-[10px] text-red-700 font-semibold border border-red-200 flex items-start gap-1">
                          <AlertTriangle className="h-3 w-3 shrink-0 text-red-600 mt-0.5" />
                          <span>{task.blockerReason}</span>
                        </div>
                      )}

                      <div className="space-y-1 text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3 text-slate-400" />
                          <span className="truncate">{task.assignedTo}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>{task.assignedWorkersCount} Workers</span>
                          <span className="font-mono text-[10px] text-slate-600 font-semibold">{task.dueDate}</span>
                        </div>
                      </div>

                      {/* Quick Status Mover */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400">Move:</span>
                        <select
                          value={task.status}
                          onChange={(e) => updateTaskStatus(task.id, e.target.value as TaskStatus)}
                          className="bg-slate-100 text-[10px] font-bold text-slate-700 rounded px-1.5 py-0.5 focus:outline-none"
                        >
                          <option value="NOT_STARTED">Not Started</option>
                          <option value="ASSIGNED">Assigned</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="BLOCKED">Blocked</option>
                          <option value="UNDER_REVIEW">Under Review</option>
                          <option value="COMPLETED">Completed</option>
                        </select>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold uppercase border-b">
                  <tr>
                    <th className="px-6 py-3">Task Title</th>
                    <th className="px-6 py-3">Project & Stage</th>
                    <th className="px-6 py-3">Assigned Lead</th>
                    <th className="px-6 py-3">Workers</th>
                    <th className="px-6 py-3">Priority</th>
                    <th className="px-6 py-3">Due Date</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTasks.map((task) => (
                    <tr key={task.id} className="hover:bg-slate-50/70">
                      <td className="px-6 py-4 font-bold text-slate-900">{task.title}</td>
                      <td className="px-6 py-4">
                        <div>{task.projectName}</div>
                        <span className="text-[10px] text-slate-400">{task.stageName}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-700 font-medium">{task.assignedTo}</td>
                      <td className="px-6 py-4">{task.assignedWorkersCount} Labourers</td>
                      <td className="px-6 py-4">{getPriorityBadge(task.priority)}</td>
                      <td className="px-6 py-4 font-mono text-slate-500">{task.dueDate}</td>
                      <td className="px-6 py-4">
                        <select
                          value={task.status}
                          onChange={(e) => updateTaskStatus(task.id, e.target.value as TaskStatus)}
                          className="bg-slate-100 text-xs font-semibold text-slate-800 rounded px-2 py-1"
                        >
                          <option value="NOT_STARTED">Not Started</option>
                          <option value="ASSIGNED">Assigned</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="BLOCKED">Blocked</option>
                          <option value="UNDER_REVIEW">Under Review</option>
                          <option value="COMPLETED">Completed</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-900">Create Construction Work Package</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateTask} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700">Task Title</label>
                <input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Diaphragm Wall Concrete Pumping & Curing"
                  className="mt-1 w-full rounded-md border border-slate-300 p-2 text-xs focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">Detailed Scope & Instructions</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Engineering instructions, mix design, inspection requirements..."
                  className="mt-1 w-full rounded-md border border-slate-300 p-2 text-xs focus:border-blue-500 focus:outline-none"
                />
              </div>

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
                  <label className="font-semibold text-slate-700">Construction Stage</label>
                  <input
                    value={stageName}
                    onChange={(e) => setStageName(e.target.value)}
                    className="mt-1 w-full rounded-md border border-slate-300 p-2 text-xs focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Assigned Person</label>
                  <input
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="mt-1 w-full rounded-md border border-slate-300 p-2 text-xs focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Workers Assigned</label>
                  <input
                    type="number"
                    value={assignedWorkers}
                    onChange={(e) => setAssignedWorkers(Number(e.target.value))}
                    className="mt-1 w-full rounded-md border border-slate-300 p-2 text-xs focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TaskPriority)}
                    className="mt-1 w-full rounded-md border border-slate-300 p-2 text-xs focus:border-blue-500 focus:outline-none"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent (Critical Path)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm">
                  Schedule Task
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
