import React from "react";
import {
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  FileText,
  Boxes,
  CreditCard,
  DollarSign,
  Check,
  X,
} from "lucide-react";
import { useConstructionStore } from "../store/useConstructionStore";
import { ApprovalItem } from "../types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

export const ApprovalsPage: React.FC = () => {
  const { approvals, resolveApproval } = useConstructionStore();

  const pendingApprovals = approvals.filter((a) => a.status === "PENDING");
  const completedApprovals = approvals.filter((a) => a.status !== "PENDING");

  const getTypeIcon = (type: ApprovalItem["type"]) => {
    switch (type) {
      case "Daily Report":
        return <FileText className="h-4 w-4 text-blue-600" />;
      case "Material Request":
        return <Boxes className="h-4 w-4 text-purple-600" />;
      case "Wage Sheet":
        return <CreditCard className="h-4 w-4 text-emerald-600" />;
      case "Expense":
        return <DollarSign className="h-4 w-4 text-amber-600" />;
      default:
        return <ClipboardCheck className="h-4 w-4 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Unified Decision & Approvals Queue
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Central governance for site progress logs, concrete/steel requisitions, wage muster rolls, and field expenses.
          </p>
        </div>
        <Badge variant={pendingApprovals.length > 0 ? "destructive" : "success"} className="text-xs px-3 py-1 font-bold">
          {pendingApprovals.length} Actions Requiring Authorization
        </Badge>
      </div>

      {/* Pending Items Table */}
      <Card>
        <CardHeader className="p-4 border-b">
          <CardTitle className="text-sm font-bold">Pending Decisions Awaiting Authorization</CardTitle>
          <CardDescription className="text-xs">
            Review field submissions and click Approve or Reject to update live project states.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase border-b">
                <tr>
                  <th className="px-6 py-3">Submission Type</th>
                  <th className="px-6 py-3">Description & Scope</th>
                  <th className="px-6 py-3">Project Site</th>
                  <th className="px-6 py-3">Submitted By</th>
                  <th className="px-6 py-3">Amount / Count</th>
                  <th className="px-6 py-3">Urgency</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pendingApprovals.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/70">
                    <td className="px-6 py-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(app.type)}
                        <span>{app.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-800">{app.title}</td>
                    <td className="px-6 py-4 text-slate-600">{app.projectName}</td>
                    <td className="px-6 py-4">{app.submittedBy}</td>
                    <td className="px-6 py-4 font-mono font-bold text-slate-900">
                      {app.amountOrCount || "Standard Log"}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={app.urgency === "Urgent" ? "destructive" : "warning"} className="text-[10px]">
                        {app.urgency}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          onClick={() => resolveApproval(app.id, false)}
                          variant="destructive"
                          size="sm"
                          className="text-[11px] h-7 px-2.5"
                        >
                          <X className="h-3 w-3 mr-1" /> Reject
                        </Button>
                        <Button
                          onClick={() => resolveApproval(app.id, true)}
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] h-7 px-2.5"
                        >
                          <Check className="h-3 w-3 mr-1" /> Approve
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {pendingApprovals.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-slate-400">
                      <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                      All pending approvals have been processed! No pending items.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Decision Audit History */}
      {completedApprovals.length > 0 && (
        <Card>
          <CardHeader className="p-4 border-b">
            <CardTitle className="text-sm font-bold text-slate-700">Resolved Approvals History</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-left text-xs">
              <tbody className="divide-y divide-slate-100">
                {completedApprovals.map((app) => (
                  <tr key={app.id} className="text-slate-500">
                    <td className="px-6 py-3 font-semibold text-slate-700">{app.title}</td>
                    <td className="px-6 py-3">{app.projectName}</td>
                    <td className="px-6 py-3">{app.submittedBy}</td>
                    <td className="px-6 py-3 text-right">
                      <Badge variant={app.status === "APPROVED" ? "success" : "destructive"} className="text-[10px]">
                        {app.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
