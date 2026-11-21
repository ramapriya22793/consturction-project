import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  CheckSquare,
  FileText,
  Users,
  CalendarCheck,
  CreditCard,
  Boxes,
  Truck,
  DollarSign,
  ClipboardCheck,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  HardHat,
  Sparkles,
} from "lucide-react";
import { useConstructionStore } from "../../store/useConstructionStore";
import { cn } from "../../lib/utils";

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { isSidebarCollapsed, toggleSidebar, approvals, materials } = useConstructionStore();

  const pendingApprovalsCount = approvals.filter((a) => a.status === "PENDING").length;
  const lowStockCount = materials.filter((m) => m.status === "Low Stock").length;

  const navSections = [
    {
      title: "Main Operations",
      items: [
        { label: "Dashboard", path: "/", icon: LayoutDashboard },
        { label: "Projects & Sites", path: "/projects", icon: Building2 },
        { label: "Tasks & Milestones", path: "/tasks", icon: CheckSquare },
        { label: "Daily Site Reports", path: "/daily-reports", icon: FileText },
      ],
    },
    {
      title: "Workforce",
      items: [
        { label: "Workers Directory", path: "/workforce", icon: Users },
        { label: "Daily Attendance", path: "/attendance", icon: CalendarCheck },
        { label: "Leaves & Wages", path: "/leaves-wages", icon: CreditCard },
      ],
    },
    {
      title: "Field Operations",
      items: [
        { label: "Materials & Inventory", path: "/materials", icon: Boxes, badge: lowStockCount > 0 ? `${lowStockCount} Low` : undefined, badgeColor: "bg-amber-500/20 text-amber-400" },
        { label: "Heavy Equipment", path: "/equipment", icon: Truck },
      ],
    },
    {
      title: "Commercial & Finance",
      items: [
        { label: "Finance & Budgets", path: "/finance", icon: DollarSign },
      ],
    },
    {
      title: "Governance",
      items: [
        { label: "Pending Approvals", path: "/approvals", icon: ClipboardCheck, badge: pendingApprovalsCount > 0 ? `${pendingApprovalsCount}` : undefined, badgeColor: "bg-red-500/20 text-red-400" },
        { label: "Company Setup", path: "/onboarding", icon: Sparkles },
      ],
    },
  ];

  return (
    <aside
      className={cn(
        "relative flex flex-col justify-between border-r border-slate-800 bg-slate-950 text-slate-300 transition-all duration-300 shrink-0 select-none z-30",
        isSidebarCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Brand Header */}
      <div>
        <div className="flex h-16 items-center justify-between px-4 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur">
          <Link to="/" className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 font-black shadow-lg shadow-amber-500/20">
              <HardHat className="h-6 w-6" />
            </div>
            {!isSidebarCollapsed && (
              <div className="leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold tracking-tight text-white text-base">
                    CIVIL<span className="text-amber-400">PULSE</span>
                  </span>
                  <span className="rounded bg-amber-400/10 px-1 py-0.2 text-[9px] font-bold text-amber-400 uppercase tracking-wider border border-amber-400/20">
                    SaaS
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium truncate">Construction ERP</p>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation Sections */}
        <div className="px-3 py-4 space-y-6 overflow-y-auto max-h-[calc(100vh-10rem)] scrollbar-thin scrollbar-thumb-slate-800">
          {navSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              {!isSidebarCollapsed && (
                <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {section.title}
                </p>
              )}
              <nav className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.path === "/"
                      ? location.pathname === "/"
                      : location.pathname.startsWith(item.path);

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      title={isSidebarCollapsed ? item.label : undefined}
                      className={cn(
                        "group flex items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold transition-all",
                        isActive
                          ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                          : "text-slate-400 hover:bg-slate-900 hover:text-slate-100"
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Icon
                          className={cn(
                            "h-4 w-4 shrink-0 transition-colors",
                            isActive ? "text-white" : "text-slate-400 group-hover:text-amber-400"
                          )}
                        />
                        {!isSidebarCollapsed && (
                          <span className="truncate">{item.label}</span>
                        )}
                      </div>

                      {!isSidebarCollapsed && item.badge && (
                        <span
                          className={cn(
                            "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                            item.badgeColor || "bg-slate-800 text-slate-300"
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Toggle */}
      <div className="border-t border-slate-800/80 p-3 bg-slate-950/60">
        <button
          onClick={toggleSidebar}
          className="flex w-full items-center justify-center gap-2 rounded-lg py-1.5 text-xs font-semibold text-slate-400 hover:bg-slate-900 hover:text-white transition-colors"
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span>Collapse Sidebar</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};
