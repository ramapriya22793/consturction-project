import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  Menu,
  HardHat,
  LogOut,
  KeyRound,
} from "lucide-react";
import { useConstructionStore, FontTheme } from "../../store/useConstructionStore";
import { UserRole } from "../../types";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

interface TopNavProps {
  onOpenQuickAction: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({ onOpenQuickAction }) => {
  const navigate = useNavigate();
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
    toggleMobileMenu,
    currentUser,
    logout,
  } = useConstructionStore();

  const [showUserMenu, setShowUserMenu] = useState(false);

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
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 px-3 sm:px-6 backdrop-blur-md shadow-xs">
      {/* Left: Mobile Drawer Trigger, Brand (mobile), Global Search & Site Switcher */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
        {/* Mobile Hamburger Drawer Trigger */}
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden p-1.5 -ml-1 text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-xl transition-colors shrink-0"
          aria-label="Toggle navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Brand Icon & Name on Mobile */}
        <div className="flex lg:hidden items-center gap-2 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 font-black shadow-xs">
            <HardHat className="h-4 w-4" />
          </div>
          <span className="font-black text-sm tracking-tight text-slate-900 hidden xs:inline">
            CIVIL<span className="text-amber-500">PULSE</span>
          </span>
        </div>

        {/* Global Search - Clean responsive sizing */}
        <div className="relative hidden lg:block w-44 xl:w-60 group shrink-0">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects..."
            className="w-full rounded-xl border border-slate-200/90 bg-slate-50/80 pl-9 pr-8 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all shadow-xs"
          />
          <kbd className="absolute right-2.5 top-2.5 rounded bg-slate-200/60 px-1.5 py-0.5 text-[9px] font-mono text-slate-500">
            /
          </kbd>
        </div>

        {/* Site Selector with location pin (Desktop wide screens) */}
        <div className="hidden 2xl:flex items-center gap-1.5 rounded-xl border border-slate-200/90 bg-slate-50/80 px-2.5 py-1.5 text-xs shadow-xs hover:border-slate-300 transition-colors shrink-0">
          <Building className="h-3.5 w-3.5 text-blue-600 shrink-0" />
          <span className="font-semibold text-slate-500">Site:</span>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="bg-transparent font-bold text-slate-900 focus:outline-none cursor-pointer max-w-[140px] truncate"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.code} ({p.name})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right: Font Switcher, Role Switcher, Quick Action, User */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Font Style Customizer (Hidden on small mobile) */}
        <div className="hidden md:flex items-center gap-1.5 rounded-xl border border-slate-200/90 bg-slate-50/90 px-2 py-1.5 text-xs shadow-xs hover:border-slate-300 transition-colors shrink-0">
          <Type className="h-3.5 w-3.5 text-slate-500 shrink-0" />
          <span className="font-semibold text-slate-500 hidden xl:inline">Font:</span>
          <select
            value={fontTheme}
            onChange={(e) => setFontTheme(e.target.value as FontTheme)}
            className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer text-xs"
          >
            <option value="outfit">Outfit (Modern)</option>
            <option value="inter">Inter (Linear)</option>
            <option value="jakarta">Plus Jakarta</option>
            <option value="manrope">Manrope</option>
            <option value="space">Space Grotesk</option>
            <option value="dmsans">DM Sans</option>
          </select>
        </div>

        {/* Role-Based Access Control Switcher */}
        <div className="flex items-center gap-1.5 rounded-xl border border-blue-200/80 bg-blue-50/70 px-2 sm:px-3 py-1.5 text-xs shadow-xs hover:bg-blue-50 transition-colors">
          <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0" />
          <span className="font-bold text-blue-900 hidden lg:inline">Role:</span>
          <select
            value={activeRole}
            onChange={(e) => setActiveRole(e.target.value as UserRole)}
            className="bg-transparent font-extrabold text-blue-700 focus:outline-none cursor-pointer text-xs max-w-[95px] sm:max-w-none truncate"
          >
            {roles.map((r) => (
              <option key={r.role} value={r.role}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        {/* Quick Action Button - Icon on tiny screens, full on tablet+ */}
        <Button
          onClick={onOpenQuickAction}
          className="flex items-center gap-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs h-8 sm:h-9 px-2 sm:px-3 rounded-xl shadow-md shadow-amber-500/20 active:scale-95 transition-all"
        >
          <Plus className="h-4 w-4 stroke-[3]" />
          <span className="hidden sm:inline">Quick Action</span>
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

        {/* User Profile Avatar with Interactive Dropdown */}
        <div className="relative pl-1 sm:pl-2 border-l border-slate-200">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 rounded-xl p-1 hover:bg-slate-100 transition-colors"
          >
            <div className="relative">
              <img
                src={currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                alt={currentUser?.name || "User"}
                className="h-8 w-8 rounded-full border border-slate-300 object-cover shadow-xs"
              />
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
            </div>
            <div className="hidden lg:block leading-tight text-left max-w-[130px] truncate">
              <p className="text-xs font-bold text-slate-900 truncate">{currentUser?.name || "User"}</p>
              <p className="text-[10px] text-slate-400 font-medium truncate">{currentUser?.roleLabel || "Role"}</p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400 hidden sm:block" />
          </button>

          {/* User Account Popover */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 text-xs">
              <div className="flex items-start gap-3 pb-3 border-b border-slate-100">
                <img
                  src={currentUser?.avatar}
                  alt={currentUser?.name}
                  className="h-10 w-10 rounded-xl object-cover ring-2 ring-slate-100 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-slate-900 truncate">{currentUser?.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{currentUser?.email}</p>
                  <span className="inline-block mt-1 rounded-md bg-blue-50 px-2 py-0.5 text-[9px] font-extrabold text-blue-700 border border-blue-200">
                    {currentUser?.roleLabel}
                  </span>
                </div>
              </div>

              <div className="py-2 space-y-1">
                <Link
                  to="/login"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2.5 w-full rounded-xl px-2.5 py-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors font-medium"
                >
                  <KeyRound className="h-4 w-4 text-amber-500" />
                  <span>Switch Role / Account</span>
                </Link>
                <Link
                  to="/onboarding"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2.5 w-full rounded-xl px-2.5 py-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors font-medium"
                >
                  <Sparkles className="h-4 w-4 text-blue-500" />
                  <span>Company Onboarding</span>
                </Link>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    logout();
                    setShowUserMenu(false);
                    navigate("/login");
                  }}
                  className="flex items-center gap-2.5 w-full rounded-xl px-2.5 py-2 text-rose-600 hover:bg-rose-50 transition-colors font-bold"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
