import React, { useState } from "react";
import {
  DollarSign,
  Plus,
  TrendingUp,
  FileText,
  CreditCard,
  Building,
  CheckCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { useConstructionStore } from "../store/useConstructionStore";
import { ExpenseRecord } from "../types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { formatCurrency } from "../lib/utils";

export const FinancePage: React.FC = () => {
  const { projects, expenses, invoices, addExpense } = useConstructionStore();
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  // Form states
  const [projectId, setProjectId] = useState(projects[0]?.id || "");
  const [category, setCategory] = useState<ExpenseRecord["category"]>("Materials");
  const [amount, setAmount] = useState(12000);
  const [vendor, setVendor] = useState("Holcim Cement & RMC");
  const [description, setDescription] = useState("Direct site supply");
  const [paymentMethod, setPaymentMethod] = useState<ExpenseRecord["paymentMethod"]>("Bank Transfer");

  const totalBudget = projects.reduce((acc, p) => acc + p.budget, 0);
  const totalSpent = projects.reduce((acc, p) => acc + p.spent, 0);
  const remainingBudget = totalBudget - totalSpent;
  const pendingInvoices = invoices.filter((i) => i.status === "PENDING" || i.status === "OVERDUE");

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const proj = projects.find((p) => p.id === projectId) || projects[0];
    const newExp: ExpenseRecord = {
      id: `exp-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      projectId: proj.id,
      projectName: proj.name,
      category,
      amount: Number(amount),
      paymentMethod,
      vendor,
      description,
      createdBy: "Sarah Chen, PMP",
      status: "PENDING",
    };
    addExpense(newExp);
    setIsExpenseModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Project Financials, Cost Centers & Cash Flow
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor budget vs actual expenditures, vendor bills, client collections, and field expenses.
          </p>
        </div>
        <Button onClick={() => setIsExpenseModalOpen(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-xs">
          <Plus className="h-4 w-4" />
          Log Project Expense
        </Button>
      </div>

      {/* Financial Overview KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-l-blue-600">
          <span className="text-xs text-slate-500 font-semibold">Total Approved Budget</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{formatCurrency(totalBudget)}</p>
          <p className="text-[11px] text-slate-400">Across {projects.length} Capital Projects</p>
        </Card>
        <Card className="p-4 border-l-4 border-l-amber-500">
          <span className="text-xs text-slate-500 font-semibold">Total Actual Expenditure</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{formatCurrency(totalSpent)}</p>
          <p className="text-[11px] text-amber-700 font-bold mt-0.5">
            {((totalSpent / totalBudget) * 100).toFixed(1)}% Budget Disbursed
          </p>
        </Card>
        <Card className="p-4 border-l-4 border-l-emerald-600">
          <span className="text-xs text-slate-500 font-semibold">Remaining Capital Funds</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{formatCurrency(remainingBudget)}</p>
          <p className="text-[11px] text-emerald-600 font-medium">Positive Project Liquidity</p>
        </Card>
        <Card className="p-4 border-l-4 border-l-red-500">
          <span className="text-xs text-slate-500 font-semibold">Pending & Overdue Bills</span>
          <p className="text-2xl font-black text-red-600 mt-1">{pendingInvoices.length} Bills</p>
          <p className="text-[11px] text-red-500 font-medium">Action Required by Accounts</p>
        </Card>
      </div>

      {/* Expenses Breakdown */}
      <Card>
        <CardHeader className="p-4 border-b">
          <CardTitle className="text-sm font-bold">Field Project Expenses & Vouchers</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase border-b">
                <tr>
                  <th className="px-6 py-3">Expense Date</th>
                  <th className="px-6 py-3">Project Site</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Description</th>
                  <th className="px-6 py-3">Vendor / Beneficiary</th>
                  <th className="px-6 py-3">Method</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {expenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50/70">
                    <td className="px-6 py-4 font-mono text-slate-500">{exp.date}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900">{exp.projectName}</td>
                    <td className="px-6 py-4">
                      <Badge variant="secondary" className="text-[10px]">
                        {exp.category}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700">{exp.description}</td>
                    <td className="px-6 py-4 text-slate-600">{exp.vendor}</td>
                    <td className="px-6 py-4">{exp.paymentMethod}</td>
                    <td className="px-6 py-4 font-mono font-black text-slate-900">{formatCurrency(exp.amount)}</td>
                    <td className="px-6 py-4">
                      <Badge variant={exp.status === "APPROVED" ? "success" : "warning"} className="text-[10px]">
                        {exp.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Invoices & Collections */}
      <Card>
        <CardHeader className="p-4 border-b">
          <CardTitle className="text-sm font-bold">Client RA Invoices & Vendor Bill Register</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase border-b">
                <tr>
                  <th className="px-6 py-3">Invoice Number</th>
                  <th className="px-6 py-3">Classification</th>
                  <th className="px-6 py-3">Project</th>
                  <th className="px-6 py-3">Party Name</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Due Date</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/70">
                    <td className="px-6 py-4 font-mono font-bold text-slate-900">{inv.invoiceNumber}</td>
                    <td className="px-6 py-4">{inv.type}</td>
                    <td className="px-6 py-4">{inv.projectName}</td>
                    <td className="px-6 py-4 font-medium">{inv.partyName}</td>
                    <td className="px-6 py-4 font-mono font-black text-slate-900">{formatCurrency(inv.amount)}</td>
                    <td className="px-6 py-4 font-mono text-slate-500">{inv.dueDate}</td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={inv.status === "PAID" ? "success" : inv.status === "OVERDUE" ? "destructive" : "warning"}
                        className="text-[10px]"
                      >
                        {inv.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Log Expense Modal */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-900">Record Field Expense</h3>
              <button onClick={() => setIsExpenseModalOpen(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateExpense} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700">Project Site</label>
                <select
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 p-2 text-xs focus:border-blue-500 focus:outline-none"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Expense Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="mt-1 w-full rounded-md border border-slate-300 p-2 text-xs focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Materials">Materials</option>
                    <option value="Equipment">Equipment</option>
                    <option value="Labour">Labour</option>
                    <option value="Fuel">Fuel & Diesel</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Miscellaneous">Miscellaneous</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Amount ($)</label>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="mt-1 w-full rounded-md border border-slate-300 p-2 text-xs focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700">Vendor / Supplier Name</label>
                <input
                  required
                  value={vendor}
                  onChange={(e) => setVendor(e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 p-2 text-xs focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">Description & Purpose</label>
                <input
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 p-2 text-xs focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="mt-1 w-full rounded-md border border-slate-300 p-2 text-xs focus:border-blue-500 focus:outline-none"
                >
                  <option value="Bank Transfer">Bank Transfer (NEFT/RTGS)</option>
                  <option value="Cheque">Corporate Cheque</option>
                  <option value="UPI">Instant UPI</option>
                  <option value="Cash">Site Petty Cash</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsExpenseModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm">
                  Record Expense
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
