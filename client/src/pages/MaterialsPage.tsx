import React, { useState } from "react";
import {
  Boxes,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Send,
  Building,
  Check,
} from "lucide-react";
import { useConstructionStore } from "../store/useConstructionStore";
import { MaterialItem, MaterialRequest } from "../types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { formatCurrency } from "../lib/utils";

export const MaterialsPage: React.FC = () => {
  const { materials, materialRequests, projects, addMaterialRequest, approveMaterialRequest } =
    useConstructionStore();

  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [projectId, setProjectId] = useState(projects[0]?.id || "");
  const [materialName, setMaterialName] = useState("Ready-Mix Concrete M40 Grade");
  const [quantity, setQuantity] = useState(250);
  const [unit, setUnit] = useState("m³");
  const [requiredDate, setRequiredDate] = useState("2026-11-28");
  const [urgency, setUrgency] = useState<MaterialRequest["urgency"]>("High");

  const lowStockMaterials = materials.filter((m) => m.status === "Low Stock");

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const proj = projects.find((p) => p.id === projectId) || projects[0];
    const newReq: MaterialRequest = {
      id: `mr-${Date.now()}`,
      projectId: proj.id,
      projectName: proj.name,
      requestedBy: "Site Supervisor",
      materialName,
      quantity: Number(quantity),
      unit,
      requiredDate,
      urgency,
      status: "PENDING",
      estimatedCost: quantity * 110,
    };
    addMaterialRequest(newReq);
    setIsRequestOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Material Master & Stock Inventory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor real-time site stock, minimum stock buffers, and field material requisition approvals.
          </p>
        </div>
        <Button onClick={() => setIsRequestOpen(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-xs">
          <Plus className="h-4 w-4" />
          Raise Material Requisition
        </Button>
      </div>

      {/* Low Stock Warning Banner if applicable */}
      {lowStockMaterials.length > 0 && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-xs text-amber-900 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-amber-950">
              Low Stock Alert ({lowStockMaterials.length} Commodities Below Buffer)
            </p>
            <p className="text-amber-800">
              {lowStockMaterials.map((m) => `${m.name} (${m.availableStock} ${m.unit} remaining)`).join(" • ")}
            </p>
          </div>
        </div>
      )}

      {/* Material Master Stock Table */}
      <Card>
        <CardHeader className="p-4 border-b">
          <CardTitle className="text-sm font-bold">On-Site Materials Inventory</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase border-b">
                <tr>
                  <th className="px-6 py-3">Material Name & Code</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Available Stock</th>
                  <th className="px-6 py-3">Minimum Buffer</th>
                  <th className="px-6 py-3">Unit Price</th>
                  <th className="px-6 py-3">Site Location</th>
                  <th className="px-6 py-3">Stock Health</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {materials.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/70">
                    <td className="px-6 py-4 font-bold text-slate-900">
                      <div>{m.name}</div>
                      <span className="font-mono text-[10px] text-slate-400 font-normal">{m.code}</span>
                    </td>
                    <td className="px-6 py-4">{m.category}</td>
                    <td className="px-6 py-4 font-mono font-bold text-slate-900">
                      {m.availableStock} {m.unit}
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-500">{m.minimumStock} {m.unit}</td>
                    <td className="px-6 py-4 font-mono">${m.unitPrice}</td>
                    <td className="px-6 py-4 text-slate-600">{m.siteLocation}</td>
                    <td className="px-6 py-4">
                      <Badge variant={m.status === "In Stock" ? "success" : "warning"} className="text-[10px]">
                        {m.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Field Material Requisitions Approval Workflow */}
      <Card>
        <CardHeader className="p-4 border-b">
          <CardTitle className="text-sm font-bold">Field Material Requisitions & Procurement Requests</CardTitle>
          <CardDescription className="text-xs">
            Workflow: Field Supervisor → Project Manager Review → Procurement Authorization → Delivery
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase border-b">
                <tr>
                  <th className="px-6 py-3">Material Requested</th>
                  <th className="px-6 py-3">Quantity</th>
                  <th className="px-6 py-3">Project Site</th>
                  <th className="px-6 py-3">Requested By</th>
                  <th className="px-6 py-3">Required By</th>
                  <th className="px-6 py-3">Estimated Cost</th>
                  <th className="px-6 py-3">Urgency</th>
                  <th className="px-6 py-3">Approval</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {materialRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/70">
                    <td className="px-6 py-4 font-bold text-slate-900">{req.materialName}</td>
                    <td className="px-6 py-4 font-mono font-bold">{req.quantity} {req.unit}</td>
                    <td className="px-6 py-4">{req.projectName}</td>
                    <td className="px-6 py-4 text-slate-600">{req.requestedBy}</td>
                    <td className="px-6 py-4 font-mono">{req.requiredDate}</td>
                    <td className="px-6 py-4 font-mono font-bold text-slate-800">{formatCurrency(req.estimatedCost)}</td>
                    <td className="px-6 py-4">
                      <Badge variant={req.urgency === "Critical" ? "destructive" : "warning"} className="text-[10px]">
                        {req.urgency}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      {req.status === "PENDING" ? (
                        <Button
                          onClick={() => approveMaterialRequest(req.id)}
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] h-7"
                        >
                          <Check className="h-3 w-3 mr-1" /> Approve
                        </Button>
                      ) : (
                        <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Approved
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

      {/* Request Modal */}
      {isRequestOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-900">Raise Material Requisition</h3>
              <button onClick={() => setIsRequestOpen(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateRequest} className="mt-4 space-y-3 text-xs">
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

              <div>
                <label className="font-semibold text-slate-700">Material Commodity</label>
                <input
                  required
                  value={materialName}
                  onChange={(e) => setMaterialName(e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 p-2 text-xs focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Quantity</label>
                  <input
                    type="number"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="mt-1 w-full rounded-md border border-slate-300 p-2 text-xs focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Unit</label>
                  <input
                    required
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="mt-1 w-full rounded-md border border-slate-300 p-2 text-xs focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Required By Date</label>
                  <input
                    type="date"
                    value={requiredDate}
                    onChange={(e) => setRequiredDate(e.target.value)}
                    className="mt-1 w-full rounded-md border border-slate-300 p-2 text-xs focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Urgency</label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value as any)}
                    className="mt-1 w-full rounded-md border border-slate-300 p-2 text-xs focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical (Immediate Pour)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsRequestOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm">
                  Send Requisition
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
