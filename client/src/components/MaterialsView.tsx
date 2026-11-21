import React, { useState } from "react";
import {
  Boxes,
  FileSpreadsheet,
  Plus,
  DollarSign,
  Truck,
  CheckCircle2,
  Clock,
  Layers,
} from "lucide-react";
import { useProjectStore, MaterialItem } from "../store/useProjectStore";
import { useAuthStore } from "../store/useAuthStore";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { formatCurrency } from "../lib/utils";

export const MaterialsView: React.FC = () => {
  const { materials, activeProjectId, projects, addMaterial } = useProjectStore();
  const { user } = useAuthStore();
  const [isExporting, setIsExporting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Material form state
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Steel");
  const [quantity, setQuantity] = useState(100);
  const [unit, setUnit] = useState("Metric Tonnes");
  const [unitPrice, setUnitPrice] = useState(700);
  const [supplier, setSupplier] = useState("");

  const currentProject = projects.find((p) => p.id === activeProjectId) || projects[0];

  const totalProcuredCost = materials.reduce((acc, m) => acc + m.totalCost, 0);

  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      // Connect to Express ExcelJS endpoint
      const response = await fetch(
        `http://localhost:5000/api/v1/reports/materials/${currentProject.id}/excel`,
        {
          headers: { "x-demo-user-id": user?.id || "demo-engineer-id" },
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `materials-boq-${currentProject.code}.xlsx`;
        a.click();
      } else {
        // Fallback CSV representation for instant client download if backend server process isn't running
        const headers = "Item Name,Category,Quantity,Unit,Unit Price,Total Cost,Supplier,Status\n";
        const rows = materials
          .map(
            (m) =>
              `"${m.name}","${m.category || ""}",${m.quantity},"${m.unit}",${m.unitPrice},${m.totalCost},"${m.supplier || ""}","${m.status}"`
          )
          .join("\n");
        const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `materials-boq-${currentProject.code}.csv`;
        a.click();
      }
    } catch (e) {
      const headers = "Item Name,Category,Quantity,Unit,Unit Price,Total Cost,Supplier,Status\n";
      const rows = materials
        .map(
          (m) =>
            `"${m.name}","${m.category || ""}",${m.quantity},"${m.unit}",${m.unitPrice},${m.totalCost},"${m.supplier || ""}","${m.status}"`
        )
        .join("\n");
      const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `materials-boq-${currentProject.code}.csv`;
      a.click();
    } finally {
      setIsExporting(false);
    }
  };

  const handleCreateMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    const newMat: MaterialItem = {
      id: `mat-${Date.now()}`,
      projectId: activeProjectId || "prj-1",
      name,
      category,
      quantity,
      unit,
      unitPrice,
      totalCost: quantity * unitPrice,
      supplier: supplier || "Direct Wholesaler",
      status: "ORDERED",
    };
    addMaterial(newMat);
    setIsModalOpen(false);
    setName("");
    setSupplier("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Material Inventory & Bill of Quantities (ExcelJS)
          </h2>
          <p className="text-sm text-slate-500">
            Automated Excel sheet generation with formulas, styled headers, and procurement tracking.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleExportExcel}
            variant="outline"
            className="flex items-center gap-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50"
            disabled={isExporting}
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
            {isExporting ? "Generating Excel..." : "Export Excel (ExcelJS)"}
          </Button>
          <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Material Order
          </Button>
        </div>
      </div>

      {/* Summary KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 uppercase font-semibold">Total Materials Cost</p>
              <p className="text-xl font-bold text-slate-900 mt-1">{formatCurrency(totalProcuredCost)}</p>
            </div>
            <DollarSign className="h-6 w-6 text-emerald-600 bg-emerald-50 p-1 rounded-full" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 uppercase font-semibold">Line Items Tracked</p>
              <p className="text-xl font-bold text-slate-900 mt-1">{materials.length} Commodities</p>
            </div>
            <Boxes className="h-6 w-6 text-blue-600 bg-blue-50 p-1 rounded-full" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 uppercase font-semibold">Delivered Items</p>
              <p className="text-xl font-bold text-slate-900 mt-1">
                {materials.filter((m) => m.status === "DELIVERED").length} Verified
              </p>
            </div>
            <Truck className="h-6 w-6 text-amber-600 bg-amber-50 p-1 rounded-full" />
          </div>
        </Card>
      </div>

      {/* Materials Table */}
      <Card>
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500">
            Material Inventory & Consumables
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500 border-b">
                <tr>
                  <th className="px-6 py-3">Material Name</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Quantity</th>
                  <th className="px-6 py-3">Unit Price</th>
                  <th className="px-6 py-3">Total Value</th>
                  <th className="px-6 py-3">Supplier</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {materials.map((mat) => (
                  <tr key={mat.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-900">{mat.name}</td>
                    <td className="px-6 py-4">
                      <Badge variant="secondary" className="text-xs">
                        {mat.category || "General"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-700">
                      {mat.quantity} {mat.unit}
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-700">
                      {formatCurrency(mat.unitPrice)}
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-slate-900">
                      {formatCurrency(mat.totalCost)}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600">{mat.supplier || "N/A"}</td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={mat.status === "DELIVERED" ? "success" : "warning"}
                        className="text-xs"
                      >
                        {mat.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add Material Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Add Material Order</h3>
                <p className="text-xs text-slate-500">Bill of Quantities Procurement Entry</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateMaterial} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700">Material Description</label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="e.g. Portland Pozzolana Cement (PPC)"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 w-full rounded-md border border-slate-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Steel">Steel & Rebar</option>
                    <option value="Concrete">Concrete & Cement</option>
                    <option value="Aggregates">Aggregates & Sand</option>
                    <option value="Piping">Piping & Drainage</option>
                    <option value="Electrical">Electrical & Cables</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700">Unit of Measurement</label>
                  <input
                    required
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="mt-1 w-full rounded-md border border-slate-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
                    placeholder="m³, MT, Bags"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Quantity</label>
                  <input
                    type="number"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="mt-1 w-full rounded-md border border-slate-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700">Unit Price ($)</label>
                  <input
                    type="number"
                    required
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(Number(e.target.value))}
                    className="mt-1 w-full rounded-md border border-slate-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Supplier Name</label>
                <input
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="e.g. Holcim, ArcelorMittal"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Add to Inventory</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
