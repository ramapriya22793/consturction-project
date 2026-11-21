import React, { useState, useEffect } from "react";
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
  ChevronDown,
  Sparkles,
  Type,
} from "lucide-react";
import { useConstructionStore, FontTheme } from "../../store/useConstructionStore";
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
    fontTheme,
    setFontTheme,
  } = useConstructionStore();

  useEffect(() => {
    // Ensure initial font class is active on body
    document.body.classList.remove(
      "font-theme-outfit",
      "font-theme-inter",
      "font-theme-jakarta",
      "font-theme-manrope",
      "font-theme-space",
      "font-theme-dmsans"
    );
    document.body.classList.add(`font-theme-${fontTheme}`);
  }, [fontTheme]);

  const [showNotifications, setShowNotifications] = useState(false);

  const pendingApprovals = approvals.filter((a) => a.status === "PENDING");

  const roles: { role: UserRole; label: string }[] = [
    { role: "BUILDER_OWNER", label: "Builder / Owner" },
    { role: "PROJECT_MANAGER", label: "Project Manager" },
    { role: "CIVIL_ENGINEER", label: "Civil Engineer" },
    { role: "SITE_SUPERVISOR", label: "Site Supervisor" },
    { role: "ACCOUNTANT", label: "Accountant" },
    { role: "CLIENT", label: "Client Portal" },
    { role: "ADMIN", label: "Platform Admin" },
  ];

  const currentDateFormatted = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 px-6 backdrop-blur-md shadow-xs">
      {/* Left: Global Search & Active Site Switcher */}
      <div className="flex items-center gap-3.5 flex-1 max-w-xl">
        <div className="relative w-64 sm:w-72 lg:w-80 group">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects, tasks, workers..."
            className="w-full rounded-xl border border-slate-200/90 bg-slate-50/80 pl-9 pr-9 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all shadow-xs"
          />
          <kbd className="absolute right-2.5 top-2.5 rounded bg-slate-200/60 px-1.5 py-0.5 text-[9px] font-mono text-slate-500">
            /
          </kbd>
        </div>

        {/* Site Selector with location pin */}
        <div className="hidden lg:flex items-center gap-2 rounded-xl border border-slate-200/90 bg-slate-50/80 px-3 py-1.5 text-xs shadow-xs hover:border-slate-300 transition-colors">
          <Building className="h-3.5 w-3.5 text-blue-600 shrink-0" />
          <span className="font-semibold text-slate-500">Site:</span>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="bg-transparent font-bold text-slate-900 focus:outline-none cursor-pointer max-w-[200px] truncate"
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
        {/* Date & Weather Pill */}
        <div className="hidden xl:flex items-center gap-2.5 text-xs text-slate-600 bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-1.5 shadow-xs">
          <div className="flex items-center gap-1.5 font-medium">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <span>{currentDateFormatted}</span>
          </div>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-1.5 font-semibold text-amber-600">
            <CloudSun className="h-4 w-4 text-amber-500" />
            <span>Sunny 29°C</span>
          </div>
        </div>

        {/* Font Style Customizer */}
        <div className="flex items-center gap-1.5 rounded-xl border border-slate-200/90 bg-slate-50/90 px-2.5 py-1.5 text-xs shadow-xs hover:border-slate-300 transition-colors">
          <Type className="h-3.5 w-3.5 text-slate-500 shrink-0" />
          <span className="font-semibold text-slate-500 hidden sm:inline">Font:</span>
          <select
            value={fontTheme}
            onChange={(e) => setFontTheme(e.target.value as FontTheme)}
            className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer text-xs"
          >
            <option value="outfit">Outfit (Modern SaaS)</option>
            <option value="inter">Inter (Linear / Vercel)</option>
            <option value="jakarta">Plus Jakarta Sans</option>
            <option value="manrope">Manrope (Civil Architecture)</option>
            <option value="space">Space Grotesk (Engineering)</option>
            <option value="dmsans">DM Sans (Clean Corporate)</option>
          </select>
        </div>

        {/* Role-Based Access Control Switcher */}
        <div className="flex items-center gap-2 rounded-xl border border-blue-200/80 bg-blue-50/70 px-3 py-1.5 text-xs shadow-xs hover:bg-blue-50 transition-colors">
          <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0" />
          <span className="font-bold text-blue-900 hidden sm:inline">Role View:</span>
          <select
            value={activeRole}
            onChange={(e) => setActiveRole(e.target.value as UserRole)}
            className="bg-transparent font-extrabold text-blue-700 focus:outline-none cursor-pointer"
          >
            {roles.map((r) => (
              <option key={r.role} value={r.role}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        {/* Quick Action Button - Modern Gradient */}
        <Button
          onClick={onOpenQuickAction}
          className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs h-9 px-3.5 rounded-xl shadow-md shadow-amber-500/20 active:scale-95 transition-all"
        >
          <Plus className="h-4 w-4 stroke-[3]" />
          <span>Quick Action</span>
        </Button>

        {/* Notifications Icon with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-xl p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <Bell className="h-4 w-4" />
            {pendingApprovals.length > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-black text-white shadow-xs animate-bounce">
                {pendingApprovals.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b pb-2.5 mb-2">
                <span className="text-xs font-bold text-slate-900">Pending Approvals</span>
                <Badge variant="destructive" className="text-[10px] px-2 py-0.5">
                  {pendingApprovals.length} new
                </Badge>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto no-scrollbar">
                {pendingApprovals.slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl bg-slate-50 p-2.5 text-xs border border-slate-100 hover:bg-slate-100/70 transition-colors"
                  >
                    <p className="font-bold text-slate-900">{item.title}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {item.submittedBy} • {item.projectName}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar with Online indicator */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"
              alt="Sarah Chen"
              className="h-8 w-8 rounded-full border border-slate-300 object-cover shadow-xs"
            />
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
          </div>
          <div className="hidden md:block leading-tight text-left">
            <p className="text-xs font-bold text-slate-900">Sarah Chen, PMP</p>
            <p className="text-[10px] text-slate-400 font-medium">Apex Construction Ltd</p>
          </div>
        </div>
      </div>
    </header>
  );
};
