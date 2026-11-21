import React from "react";
import {
  LayoutDashboard,
  Building2,
  FileText,
  FolderLock,
  CheckSquare,
  Boxes,
  Activity,
  Cloud,
} from "lucide-react";
import { cn } from "../lib/utils";

export type NavTab = "dashboard" | "reports" | "documents" | "tasks" | "materials" | "stack";

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: "dashboard" as NavTab, label: "Dashboard & KPIs", icon: LayoutDashboard },
    { id: "reports" as NavTab, label: "Daily Site Reports (PDF)", icon: FileText },
    { id: "documents" as NavTab, label: "Cloudflare R2 Storage", icon: FolderLock },
    { id: "tasks" as NavTab, label: "Tasks & Milestones", icon: CheckSquare },
    { id: "materials" as NavTab, label: "Materials & BOQ (Excel)", icon: Boxes },
    { id: "stack" as NavTab, label: "System Architecture", icon: Activity },
  ];

  return (
    <aside className="w-64 border-r border-slate-200 bg-slate-900 text-slate-300 flex flex-col justify-between min-h-[calc(100vh-4rem)]">
      <div className="p-4 space-y-6">
        <div>
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Operations Menu
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all text-left",
                    isActive
                      ? "bg-blue-600 text-white shadow-md font-semibold"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <Icon className={cn("h-4 w-4", isActive ? "text-white" : "text-slate-400")} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Cloud & Security Status Box */}
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
            <Cloud className="h-4 w-4 text-amber-400" />
            Infrastructure Status
          </div>
          <div className="space-y-1.5 text-[11px] text-slate-400">
            <div className="flex justify-between items-center">
              <span>Database:</span>
              <span className="text-emerald-400 font-mono font-medium">Supabase PG</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Object Storage:</span>
              <span className="text-emerald-400 font-mono font-medium">Cloudflare R2</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Backend API:</span>
              <span className="text-emerald-400 font-mono font-medium">Express + Zod</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Deployments:</span>
              <span className="text-blue-400 font-mono font-medium">Vercel + Render</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-slate-800 text-[11px] text-slate-400">
        <p className="font-semibold text-slate-300">Civil Engineering ERP v1.0</p>
        <p className="text-slate-400">Full Stack System Ready</p>
      </div>
    </aside>
  );
};
