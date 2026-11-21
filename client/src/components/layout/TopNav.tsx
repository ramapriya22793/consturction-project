import React, { useState } from "react";
import {
  Search,
  Bell,
  Plus,
  ShieldCheck,
  Building,
  Calendar,
  CloudSun,
  User,
  CheckCircle,
} from "lucide-react";
import { useConstructionStore } from "../../store/useConstructionStore";
import { UserRole } from "../../types";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

interface TopNavProps {
  onOpenQuickAction: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({ onOpenQuickAction }) => {
  const {
    activeRole,
    setActiveRole,
    projects,
    selectedProjectId,
    setSelectedProjectId,
    searchQuery,
    setSearchQuery,
    approvals,
  } = useConstructionStore();

  const [showNotifications, setShowNotifications] = useState(false);

  const pendingApprovals = approvals.filter((a) => a.status === "PENDING");

  const roles: { role: UserRole; label: string; badgeColor: string }[] = [
    { role: "BUILDER_OWNER", label: "Builder / Owner", badgeColor: "bg-blue-600" },
    { role: "PROJECT_MANAGER", label: "Project Manager", badgeColor: "bg-purple-600" },
    { role: "CIVIL_ENGINEER", label: "Civil Engineer", badgeColor: "bg-emerald-600" },
    { role: "SITE_SUPERVISOR", label: "Site Supervisor", badgeColor: "bg-amber-600" },
    { role: "ACCOUNTANT", label: "Accountant", badgeColor: "bg-cyan-600" },
    { role: "CLIENT", label: "Client Portal", badgeColor: "bg-slate-700" },
    { role: "ADMIN", label: "Platform Admin", badgeColor: "bg-red-600" },
  ];

  const currentDateFormatted = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-6 backdrop-blur shadow-sm">
      {/* Left: Global Search & Active Site Switcher */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects, tasks, workers..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none transition-colors"
          />
        </div>

        <div className="hidden lg:flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs">
          <Building className="h-3.5 w-3.5 text-slate-500" />
          <span className="font-semibold text-slate-500">Site:</span>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer max-w-[180px] truncate"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.code} ({p.name})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right: Date, Weather, Role Switcher, Quick Action, User */}
      <div className="flex items-center gap-3">
        {/* Date & Weather */}
        <div className="hidden xl:flex items-center gap-2 text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1">
          <Calendar className="h-3.5 w-3.5 text-slate-400" />
          <span>{currentDateFormatted}</span>
          <span className="text-slate-300">|</span>
          <CloudSun className="h-3.5 w-3.5 text-amber-500" />
          <span>Sunny 29°C</span>
        </div>

        {/* Role-Based Access Control Switcher */}
        <div className="flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50/70 px-2.5 py-1 text-xs">
          <ShieldCheck className="h-4 w-4 text-blue-600" />
          <span className="font-semibold text-blue-900 hidden sm:inline">Role View:</span>
          <select
            value={activeRole}
            onChange={(e) => setActiveRole(e.target.value as UserRole)}
            className="bg-transparent font-bold text-blue-700 focus:outline-none cursor-pointer"
          >
            {roles.map((r) => (
              <option key={r.role} value={r.role}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        {/* Quick Action Button */}
        <Button
          onClick={onOpenQuickAction}
          className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow-sm text-xs h-8 px-3"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Quick Action</span>
        </Button>

        {/* Notifications Icon with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <Bell className="h-4 w-4" />
            {pendingApprovals.length > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                {pendingApprovals.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 bg-white p-3 shadow-xl z-50">
              <div className="flex items-center justify-between border-b pb-2 mb-2">
                <span className="text-xs font-bold text-slate-900">Pending Approvals</span>
                <Badge variant="outline" className="text-[10px]">
                  {pendingApprovals.length} new
                </Badge>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {pendingApprovals.slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    className="rounded-lg bg-slate-50 p-2 text-xs border border-slate-100"
                  >
                    <p className="font-semibold text-slate-800">{item.title}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {item.submittedBy} • {item.projectName}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <img
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"
            alt="Sarah Chen"
            className="h-8 w-8 rounded-full border border-slate-300 object-cover"
          />
          <div className="hidden md:block leading-tight text-left">
            <p className="text-xs font-bold text-slate-900">Sarah Chen, PMP</p>
            <p className="text-[10px] text-slate-500">Apex Construction Ltd</p>
          </div>
        </div>
      </div>
    </header>
  );
};
