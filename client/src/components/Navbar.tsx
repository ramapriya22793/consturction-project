import React from "react";
import { HardHat, ShieldCheck, UserCheck, Bell, ChevronDown } from "lucide-react";
import { useAuthStore, UserRole } from "../store/useAuthStore";
import { useProjectStore } from "../store/useProjectStore";
import { Badge } from "./ui/badge";

export const Navbar: React.FC = () => {
  const { user, activeRole, setActiveRole } = useAuthStore();
  const { projects, activeProjectId, setActiveProjectId } = useProjectStore();

  const activeProject = projects.find((p) => p.id === activeProjectId);

  const roles: { role: UserRole; label: string }[] = [
    { role: "ADMIN", label: "Admin" },
    { role: "PROJECT_MANAGER", label: "Project Manager" },
    { role: "SITE_ENGINEER", label: "Site Engineer" },
    { role: "CONTRACTOR", label: "Contractor" },
    { role: "CLIENT", label: "Client" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white shadow-sm">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500 text-slate-950 font-bold shadow-md">
            <HardHat className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-slate-900">
                CIVIL<span className="text-blue-600">PRO</span>
              </span>
              <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                Enterprise
              </Badge>
            </div>
            <p className="text-xs text-slate-500">Civil Infrastructure Management</p>
          </div>
        </div>

        {/* Project Selector */}
        <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1.5 px-3 border border-slate-200">
          <span className="text-xs font-semibold text-slate-500">Site:</span>
          <select
            value={activeProjectId || ""}
            onChange={(e) => setActiveProjectId(e.target.value)}
            className="bg-transparent text-sm font-semibold text-slate-800 focus:outline-none cursor-pointer"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.code} – {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* User, RBAC Switcher & Supabase Auth Status */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span className="text-slate-600 font-medium">RBAC Role:</span>
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

          <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
            <div className="flex items-center gap-2">
              <img
                src={user?.avatarUrl || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"}
                alt={user?.name}
                className="h-8 w-8 rounded-full border border-slate-300 object-cover"
              />
              <div className="text-left hidden md:block">
                <p className="text-xs font-bold text-slate-800 leading-tight">{user?.name}</p>
                <p className="text-[10px] text-slate-500 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block"></span>
                  Supabase Auth Active
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
