import React from "react";
import { Link } from "react-router-dom";
import { ShieldAlert, ArrowLeft, KeyRound, Lock } from "lucide-react";
import { useConstructionStore } from "../../store/useConstructionStore";
import { UserRole } from "../../types";
import { Button } from "../ui/button";

interface RBACGuardProps {
  allowedRoles: UserRole[];
  moduleName: string;
  children: React.ReactNode;
}

export const RBACGuard: React.FC<RBACGuardProps> = ({
  allowedRoles,
  moduleName,
  children,
}) => {
  const { activeRole, currentUser, loginAsDemoRole } = useConstructionStore();

  const hasAccess = allowedRoles.includes(activeRole);

  if (hasAccess) {
    return <>{children}</>;
  }

  const roleLabelMap: Record<UserRole, string> = {
    BUILDER_OWNER: "Builder / Owner",
    PROJECT_MANAGER: "Project Manager",
    CIVIL_ENGINEER: "Civil Engineer",
    SITE_SUPERVISOR: "Site Supervisor",
    ACCOUNTANT: "Accountant",
    CLIENT: "Client Portal",
    ADMIN: "Platform Admin",
  };

  const permittedLabels = allowedRoles.map((r) => roleLabelMap[r]).join(", ");

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-xl text-center space-y-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 ring-8 ring-rose-50/50">
          <ShieldAlert className="h-7 w-7" />
        </div>

        <div className="space-y-1.5">
          <span className="inline-block rounded-md bg-rose-100 px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-rose-700">
            403 • Access Restricted
          </span>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Restricted Module: {moduleName}
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Your current active role <span className="font-bold text-slate-900">({currentUser?.roleLabel || roleLabelMap[activeRole]})</span> does not have authorization to access this area.
          </p>
        </div>

        <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-left space-y-1 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-slate-700">
            <Lock className="h-3.5 w-3.5 text-slate-500" />
            <span>Authorized Roles Only:</span>
          </div>
          <p className="text-[11px] text-slate-600 pl-5">
            {permittedLabels}
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
          <Link to="/" className="w-full">
            <Button variant="outline" className="w-full text-xs gap-1.5">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Dashboard</span>
            </Button>
          </Link>
          <Button
            onClick={() => loginAsDemoRole(allowedRoles[0])}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs gap-1.5 shadow-sm"
          >
            <KeyRound className="h-3.5 w-3.5" />
            <span>Switch to {roleLabelMap[allowedRoles[0]]}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
