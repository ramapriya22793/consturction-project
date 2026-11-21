import React, { useState } from "react";
import {
  CreditCard,
  CheckCircle,
  Clock,
  Download,
  DollarSign,
  AlertCircle,
  FileSpreadsheet,
  Check,
} from "lucide-react";
import { useConstructionStore } from "../store/useConstructionStore";
import { WageSummary } from "../types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { formatCurrency } from "../lib/utils";

export const LeaveWagePage: React.FC = () => {
  const { wages, approveWage } = useConstructionStore();
  const [periodFilter, setPeriodFilter] = useState("Nov 2026");

  const totalPayable = wages.reduce((acc, w) => acc + w.netPayable, 0);
  const totalAdvances = wages.reduce((acc, w) => acc + w.advancePaid, 0);

  const handleExportSummary = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Worker Name,Trade,Days,Daily Wage,Gross Wage,Advance,Deductions,Net Payable,Status"]
        .concat(
          wages.map(
            (w) =>
              `"${w.workerName}","${w.trade}",${w.workingDays},${w.dailyWage},${w.grossWage},${w.advancePaid},${w.deductions},${w.netPayable},"${w.status}"`
          )
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `wages-report-${periodFilter.replace(" ", "-")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Labour Wage Management & Muster Roll Calculations
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified working days, overtime, advance deductions, and final approval for cash disbursements.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={periodFilter}
            onChange={(e) => setPeriodFilter(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-800 bg-white"
          >
            <option value="Nov 2026">November 2026</option>
            <option value="Oct 2026">October 2026</option>
            <option value="Sep 2026">September 2026</option>
          </select>
          <Button
            onClick={handleExportSummary}
            variant="outline"
            size="sm"
            className="text-xs flex items-center gap-1.5 border-emerald-600 text-emerald-700"
          >
            <FileSpreadsheet className="h-3.5 w-3.5" />
            Export Wage Sheet
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 border-l-4 border-l-emerald-600">
          <span className="text-xs text-slate-500 font-semibold">Total Net Payable</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{formatCurrency(totalPayable)}</p>
          <p className="text-[11px] text-emerald-600 font-semibold">Ready for Bank Transfer / Cash</p>
        </Card>
        <Card className="p-4 border-l-4 border-l-amber-500">
          <span className="text-xs text-slate-500 font-semibold">Advances Deducted</span>
          <p className="text-2xl font-black text-amber-600 mt-1">{formatCurrency(totalAdvances)}</p>
          <p className="text-[11px] text-slate-400">Pre-paid festive & site advances</p>
        </Card>
        <Card className="p-4 border-l-4 border-l-blue-600">
          <span className="text-xs text-slate-500 font-semibold">Approval Status</span>
          <p className="text-2xl font-black text-slate-900 mt-1">
            {wages.filter((w) => w.status === "APPROVED").length} / {wages.length} Approved
          </p>
          <p className="text-[11px] text-slate-500">Subject to PM authorization</p>
        </Card>
      </div>

      {/* Wage Calculation Table */}
      <Card>
        <CardHeader className="p-4 border-b">
          <CardTitle className="text-sm font-bold">Wage Ledger ({periodFilter})</CardTitle>
          <CardDescription className="text-xs">
            Formula: (Working Days × Rate) + (Half Days × Rate × 0.5) + (Overtime × Rate ÷ 8 × 1.5) – Advance – Deductions
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase border-b">
                <tr>
                  <th className="px-6 py-3">Worker Name</th>
                  <th className="px-6 py-3">Trade</th>
                  <th className="px-6 py-3">Days</th>
                  <th className="px-6 py-3">Overtime</th>
                  <th className="px-6 py-3">Daily Wage</th>
                  <th className="px-6 py-3">Gross Wage</th>
                  <th className="px-6 py-3">Advance</th>
                  <th className="px-6 py-3">Net Payable</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Approval</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {wages.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-50/70">
                    <td className="px-6 py-4 font-bold text-slate-900">{w.workerName}</td>
                    <td className="px-6 py-4">{w.trade}</td>
                    <td className="px-6 py-4 font-mono font-semibold">{w.workingDays}d {w.halfDays > 0 ? `(${w.halfDays}h)` : ""}</td>
                    <td className="px-6 py-4 font-mono font-semibold text-amber-600">+{w.overtimeHours} hrs</td>
                    <td className="px-6 py-4 font-mono font-bold">${w.dailyWage}</td>
                    <td className="px-6 py-4 font-mono">${w.grossWage}</td>
                    <td className="px-6 py-4 font-mono text-red-500">-${w.advancePaid}</td>
                    <td className="px-6 py-4 font-mono font-black text-emerald-600 text-sm">
                      {formatCurrency(w.netPayable)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={w.status === "APPROVED" ? "success" : "warning"} className="text-[10px]">
                        {w.status.replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {w.status === "PENDING_APPROVAL" ? (
                        <Button
                          onClick={() => approveWage(w.id)}
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] h-7"
                        >
                          <Check className="h-3 w-3 mr-1" /> Approve
                        </Button>
                      ) : (
                        <span className="text-[11px] text-emerald-600 font-bold flex items-center justify-end gap-1">
                          <CheckCircle className="h-3.5 w-3.5" /> Cleared
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
