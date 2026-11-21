import React, { useState } from "react";
import {
  FileText,
  CheckSquare,
  Boxes,
  DollarSign,
  CalendarCheck,
  X,
  CheckCircle,
} from "lucide-react";
import { useConstructionStore } from "../../store/useConstructionStore";
import { Button } from "../ui/button";

interface QuickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickActionModal: React.FC<QuickActionModalProps> = ({ isOpen, onClose }) => {
  const { projects, selectedProjectId, addDailyReport, addTask, addMaterialRequest, addExpense } =
    useConstructionStore();

  const [activeForm, setActiveForm] = useState<
    "MENU" | "REPORT" | "TASK" | "MATERIAL" | "EXPENSE"
  >("MENU");

  // Form states
  const [taskTitle, setTaskTitle] = useState("");
  const [taskPriority, setTaskPriority] = useState<"LOW" | "MEDIUM" | "HIGH" | "URGENT">("HIGH");
  const [workSummary, setWorkSummary] = useState("");
  const [workersCount, setWorkersCount] = useState(80);
  const [materialName, setMaterialName] = useState("");
  const [quantity, setQuantity] = useState(100);
  const [expenseAmount, setExpenseAmount] = useState(5000);
  const [expenseDesc, setExpenseDesc] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (!isOpen) return null;

  const currentProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const handleClose = () => {
    setActiveForm("MENU");
    setSuccessMsg("");
    onClose();
  };

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    addTask({
      id: `tsk-${Date.now()}`,
      title: taskTitle,
      description: "Quick task logged from top action bar",
      projectId: currentProject.id,
      projectName: currentProject.name,
      siteLocation: currentProject.location,
      stageName: "Structural Work",
      assignedTo: "Site Engineer Team",
      assignedWorkersCount: 8,
      priority: taskPriority,
      status: "ASSIGNED",
      startDate: new Date().toISOString().split("T")[0],
      dueDate: "2026-12-15",
      estimatedHours: 40,
      progress: 0,
    });
    setSuccessMsg("Task successfully scheduled and allocated to site team!");
    setTimeout(handleClose, 1200);
  };

  const handleSaveReport = (e: React.FormEvent) => {
    e.preventDefault();
    addDailyReport({
      id: `dr-${Date.now()}`,
      projectId: currentProject.id,
      projectName: currentProject.name,
      siteLocation: currentProject.location,
      reportDate: new Date().toISOString().split("T")[0],
      supervisorName: "Site Supervisor",
      weather: "Sunny / 28°C",
      workersPresent: Number(workersCount),
      workersAbsent: 2,
      workCompleted: workSummary,
      stageName: "Structural Framework",
      completedQuantity: "Daily batch pour completed",
      materialsUsed: "RMC M40, TMT Reinforcement Steel",
      equipmentUsed: "Hydraulic Cranes, Transit Mixers",
      siteExpenses: 12000,
      photos: ["https://images.unsplash.com/photo-1541888946425-d0fbb1861564?w=600&auto=format&fit=crop&q=80"],
      nextDayPlan: "Curing inspection and column shuttering",
      approvalStatus: "SUBMITTED",
    });
    setSuccessMsg("Daily Progress Report submitted to Project Manager for approval!");
    setTimeout(handleClose, 1200);
  };

  const handleSaveMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    addMaterialRequest({
      id: `mr-${Date.now()}`,
      projectId: currentProject.id,
      projectName: currentProject.name,
      requestedBy: "Field Site Supervisor",
      materialName,
      quantity: Number(quantity),
      unit: "Units",
      requiredDate: "2026-11-26",
      urgency: "High",
      status: "PENDING",
      estimatedCost: quantity * 85,
    });
    setSuccessMsg("Material Requisition raised and sent to procurement approval!");
    setTimeout(handleClose, 1200);
  };

  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    addExpense({
      id: `exp-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      projectId: currentProject.id,
      projectName: currentProject.name,
      category: "Materials",
      amount: Number(expenseAmount),
      paymentMethod: "Bank Transfer",
      vendor: "Authorized Site Supplier",
      description: expenseDesc || "Field operational site expense",
      createdBy: "Sarah Chen",
      status: "PENDING",
    });
    setSuccessMsg("Expense recorded and sent to Accounts for verification!");
    setTimeout(handleClose, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {activeForm === "MENU" && "Quick Construction Actions"}
              {activeForm === "REPORT" && "Submit Daily Site Report"}
              {activeForm === "TASK" && "Create Construction Task"}
              {activeForm === "MATERIAL" && "Raise Material Requisition"}
              {activeForm === "EXPENSE" && "Record Project Expense"}
            </h3>
            <p className="text-xs text-slate-500">
              Site: <span className="font-semibold text-slate-700">{currentProject.name}</span>
            </p>
          </div>
          <button
            onClick={handleClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {successMsg && (
          <div className="my-4 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-semibold text-emerald-800 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
            {successMsg}
          </div>
        )}

        {/* Menu View */}
        {activeForm === "MENU" && !successMsg && (
          <div className="grid grid-cols-2 gap-3 py-4">
            <button
              onClick={() => setActiveForm("REPORT")}
              className="flex flex-col items-start gap-2 rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-left hover:border-blue-500 hover:bg-blue-50/40 transition-all group"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Daily Site Report</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Log progress, weather & labor</p>
              </div>
            </button>

            <button
              onClick={() => setActiveForm("TASK")}
              className="flex flex-col items-start gap-2 rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-left hover:border-amber-500 hover:bg-amber-50/40 transition-all group"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-700 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                <CheckSquare className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Create Task</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Assign critical work package</p>
              </div>
            </button>

            <button
              onClick={() => setActiveForm("MATERIAL")}
              className="flex flex-col items-start gap-2 rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-left hover:border-purple-500 hover:bg-purple-50/40 transition-all group"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Boxes className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Material Request</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Order concrete, steel, cement</p>
              </div>
            </button>

            <button
              onClick={() => setActiveForm("EXPENSE")}
              className="flex flex-col items-start gap-2 rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-left hover:border-emerald-500 hover:bg-emerald-50/40 transition-all group"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <DollarSign className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Record Expense</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Log machinery, fuel, vendor bills</p>
              </div>
            </button>
          </div>
        )}

        {/* Task Form */}
        {activeForm === "TASK" && !successMsg && (
          <form onSubmit={handleSaveTask} className="space-y-3 pt-3">
            <div>
              <label className="text-xs font-semibold text-slate-700">Task Title</label>
              <input
                required
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="e.g. Concrete Pouring Pier P16"
                className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700">Priority</label>
              <select
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value as any)}
                className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-blue-500 focus:outline-none"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent (Critical Path)</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-3">
              <Button type="button" variant="outline" size="sm" onClick={() => setActiveForm("MENU")}>
                Back
              </Button>
              <Button type="submit" size="sm">
                Save & Assign
              </Button>
            </div>
          </form>
        )}

        {/* Report Form */}
        {activeForm === "REPORT" && !successMsg && (
          <form onSubmit={handleSaveReport} className="space-y-3 pt-3">
            <div>
              <label className="text-xs font-semibold text-slate-700">Workers Present on Site</label>
              <input
                type="number"
                required
                value={workersCount}
                onChange={(e) => setWorkersCount(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700">Work Executed Today</label>
              <textarea
                required
                rows={3}
                value={workSummary}
                onChange={(e) => setWorkSummary(e.target.value)}
                placeholder="Describe pier caps poured, rebar fixing, or formwork completed..."
                className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div className="flex justify-end gap-2 pt-3">
              <Button type="button" variant="outline" size="sm" onClick={() => setActiveForm("MENU")}>
                Back
              </Button>
              <Button type="submit" size="sm">
                Submit Report
              </Button>
            </div>
          </form>
        )}

        {/* Material Request Form */}
        {activeForm === "MATERIAL" && !successMsg && (
          <form onSubmit={handleSaveMaterial} className="space-y-3 pt-3">
            <div>
              <label className="text-xs font-semibold text-slate-700">Material Name</label>
              <input
                required
                value={materialName}
                onChange={(e) => setMaterialName(e.target.value)}
                placeholder="e.g. Ready-Mix Concrete M40"
                className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700">Quantity Needed</label>
              <input
                type="number"
                required
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div className="flex justify-end gap-2 pt-3">
              <Button type="button" variant="outline" size="sm" onClick={() => setActiveForm("MENU")}>
                Back
              </Button>
              <Button type="submit" size="sm">
                Submit Requisition
              </Button>
            </div>
          </form>
        )}

        {/* Expense Form */}
        {activeForm === "EXPENSE" && !successMsg && (
          <form onSubmit={handleSaveExpense} className="space-y-3 pt-3">
            <div>
              <label className="text-xs font-semibold text-slate-700">Amount ($)</label>
              <input
                type="number"
                required
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700">Description & Vendor</label>
              <input
                required
                value={expenseDesc}
                onChange={(e) => setExpenseDesc(e.target.value)}
                placeholder="e.g. Diesel fuel for generators"
                className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div className="flex justify-end gap-2 pt-3">
              <Button type="button" variant="outline" size="sm" onClick={() => setActiveForm("MENU")}>
                Back
              </Button>
              <Button type="submit" size="sm">
                Record Expense
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
