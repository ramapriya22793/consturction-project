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
  ChevronLeft,
  ChevronRight,
  HardHat,
  Sparkles,
  ShieldCheck,
  X,
  KeyRound,
} from "lucide-react";
import { useConstructionStore } from "../../store/useConstructionStore";
import { cn } from "../../lib/utils";

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const {
    isSidebarCollapsed,
    toggleSidebar,
    isMobileMenuOpen,
    setMobileMenuOpen,
    approvals,
    materials,
    currentUser,
  } = useConstructionStore();

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
        {
          label: "Materials & Inventory",
          path: "/materials",
          icon: Boxes,
          badge: lowStockCount > 0 ? `${lowStockCount} Low` : undefined,
          badgeColor: "bg-amber-400/20 text-amber-300 border border-amber-400/30",
        },
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
        {
          label: "Pending Approvals",
          path: "/approvals",
          icon: ClipboardCheck,
          badge: pendingApprovalsCount > 0 ? `${pendingApprovalsCount}` : undefined,
          badgeColor: "bg-rose-500/20 text-rose-300 border border-rose-500/30",
        },
        { label: "Company Onboarding", path: "/onboarding", icon: Sparkles },
      ],
    },
  ];

  const renderNavLinks = (isMobile: boolean = false) => (
    <div className="flex-1 px-3 py-4 space-y-6 overflow-y-auto no-scrollbar">
      {navSections.map((section, idx) => (
        <div key={idx} className="space-y-1">
          {(!isSidebarCollapsed || isMobile) && (
            <p className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5">
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
                  onClick={() => isMobile && setMobileMenuOpen(false)}
                  title={!isMobile && isSidebarCollapsed ? item.label : undefined}
                  className={cn(
                    "group flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-150",
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30 font-bold"
                      : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0 transition-transform duration-150 group-hover:scale-110",
                        isActive ? "text-white" : "text-slate-400 group-hover:text-amber-400"
                      )}
                    />
                    {(!isSidebarCollapsed || isMobile) && (
                      <span className="truncate">{item.label}</span>
                    )}
                  </div>

                  {(!isSidebarCollapsed || isMobile) && item.badge && (
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-bold shadow-sm",
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
  );

  return (
    <>
      {/* DESKTOP SIDEBAR - Hidden on mobile (<1024px) */}
      <aside
        className={cn(
          "hidden lg:flex flex-col justify-between border-r border-slate-800/80 bg-[#0B1120] text-slate-300 transition-all duration-300 shrink-0 select-none z-30 shadow-xl min-h-screen sticky top-0",
          isSidebarCollapsed ? "w-20" : "w-64"
        )}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Brand Header */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-slate-800/80 bg-[#0B1120]/90 backdrop-blur shrink-0">
            <Link to="/" className="flex items-center gap-3 overflow-hidden group">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-slate-950 font-black shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
                <HardHat className="h-5 w-5" />
              </div>
              {!isSidebarCollapsed && (
                <div className="leading-tight">
                  <div className="flex items-center gap-1.5">
                    <span className="font-black tracking-tight text-white text-base">
                      CIVIL<span className="text-amber-400">PULSE</span>
                    </span>
                    <span className="rounded-md bg-amber-400/10 px-1.5 py-0.5 text-[9px] font-extrabold text-amber-400 uppercase tracking-wider border border-amber-400/20">
                      ERP
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium">Enterprise Platform</p>
                </div>
              )}
            </Link>
          </div>

          {/* Nav Links */}
          {renderNavLinks(false)}

          {/* Footer Organization & Toggle */}
          <div className="border-t border-slate-800/80 p-3 bg-slate-950/80 shrink-0 space-y-2">
            {!isSidebarCollapsed && (
              <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800/70 text-xs">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                <div className="truncate leading-tight">
                  <p className="text-[11px] font-bold text-slate-200 truncate">Metro Hub Project Live</p>
                  <p className="text-[10px] text-slate-400">Sync: 100% OK</p>
                </div>
              </div>
            )}

            <button
              onClick={toggleSidebar}
              className="flex w-full items-center justify-center gap-2 rounded-xl py-2 text-xs font-bold text-slate-400 hover:bg-slate-900 hover:text-white transition-colors"
            >
              {isSidebarCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <>
                  <ChevronLeft className="h-4 w-4" />
                  <span>Collapse Navigation</span>
                </>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* MOBILE SLIDE-OUT DRAWER - Visible only on mobile when opened */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Menu Panel */}
          <aside className="relative flex flex-col justify-between w-72 max-w-[85vw] bg-[#0B1120] text-slate-300 shadow-2xl z-10 h-full animate-in slide-in-from-left duration-250 border-r border-slate-800">
            <div className="flex flex-col h-full overflow-hidden">
              {/* Brand Header & Close Button */}
              <div className="flex h-16 items-center justify-between px-4 border-b border-slate-800/80 bg-[#0B1120] shrink-0">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-slate-950 font-black shadow-md shadow-amber-500/20">
                    <HardHat className="h-4 w-4" />
                  </div>
                  <div className="leading-tight">
                    <span className="font-black tracking-tight text-white text-base">
                      CIVIL<span className="text-amber-400">PULSE</span>
                    </span>
                    <span className="ml-1.5 rounded-md bg-amber-400/10 px-1 py-0.5 text-[8px] font-extrabold text-amber-400 uppercase tracking-wider border border-amber-400/20">
                      ERP
                    </span>
                  </div>
                </Link>

                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation links */}
              {renderNavLinks(true)}

              {/* Drawer Footer with User Profile and Switch Role */}
              <div className="border-t border-slate-800/80 p-3.5 bg-slate-950/95 shrink-0 space-y-2.5">
                <div className="flex items-center gap-3">
                  <img
                    src={currentUser?.avatar}
                    alt={currentUser?.name}
                    className="h-9 w-9 rounded-xl object-cover ring-1 ring-slate-700"
                  />
                  <div className="min-w-0 flex-1 leading-tight">
                    <p className="text-xs font-bold text-white truncate">{currentUser?.name}</p>
                    <p className="text-[10px] text-amber-400 font-medium truncate">{currentUser?.roleLabel}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
                  >
                    <KeyRound className="h-3.5 w-3.5 text-amber-400" />
                    <span>Switch Role / Login</span>
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};
