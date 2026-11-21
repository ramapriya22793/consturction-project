import React from "react";
import {
  Truck,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Fuel,
  Wrench,
  Activity,
} from "lucide-react";
import { useConstructionStore } from "../store/useConstructionStore";
import { Equipment } from "../types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { formatCurrency } from "../lib/utils";

export const EquipmentPage: React.FC = () => {
  const { equipment, updateEquipmentStatus } = useConstructionStore();

  const activeCount = equipment.filter((e) => e.status === "ACTIVE").length;
  const maintenanceCount = equipment.filter((e) => e.status === "MAINTENANCE").length;
  const totalDailyRental = equipment.reduce((acc, e) => acc + e.rentalCostPerDay, 0);

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Heavy Equipment & Civil Plant Machinery
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Fleet tracking, operator assignments, telematics fuel consumption, and maintenance schedules.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 border-l-4 border-l-emerald-600">
          <span className="text-xs text-slate-500 font-semibold">Active Fleet Machines</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{activeCount} Operational</p>
          <p className="text-[11px] text-emerald-600 font-medium">100% safety certified</p>
        </Card>
        <Card className="p-4 border-l-4 border-l-amber-500">
          <span className="text-xs text-slate-500 font-semibold">In Workshop / Maintenance</span>
          <p className="text-2xl font-black text-amber-600 mt-1">{maintenanceCount} Under Service</p>
          <p className="text-[11px] text-slate-400">Scheduled hydraulic overhaul</p>
        </Card>
        <Card className="p-4 border-l-4 border-l-blue-600">
          <span className="text-xs text-slate-500 font-semibold">Combined Daily Fleet Cost</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{formatCurrency(totalDailyRental)} / day</p>
          <p className="text-[11px] text-slate-400">Owned & leased equipment</p>
        </Card>
      </div>

      {/* Equipment Fleet Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {equipment.map((item) => (
          <Card key={item.id} className="p-5 hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-amber-400 font-bold">
                    <Truck className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm leading-snug">{item.name}</h3>
                    <p className="font-mono text-[10px] text-slate-400 font-bold">{item.code} • {item.type}</p>
                  </div>
                </div>
                <Badge
                  variant={item.status === "ACTIVE" ? "success" : item.status === "MAINTENANCE" ? "warning" : "secondary"}
                  className="text-[10px]"
                >
                  {item.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Site Allocated</span>
                  <span className="font-bold text-slate-800 truncate block">{item.assignedProjectName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Certified Operator</span>
                  <span className="font-bold text-slate-800">{item.operatorName}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Hours Worked Today</span>
                  <span className="font-mono font-bold text-slate-800">{item.hoursWorkedToday} hrs</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Fuel Burn Rate</span>
                  <span className="font-mono font-bold text-slate-800">{item.fuelConsumptionLph} L/hr</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Rental Rate</span>
                  <span className="font-mono font-bold text-emerald-600">${item.rentalCostPerDay}/day</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-3 text-xs">
              <span className="text-[11px] text-slate-500">
                Next Service Due: <strong className="text-slate-700">{item.nextServiceDueDate}</strong>
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => updateEquipmentStatus(item.id, "ACTIVE")}
                  className={`px-2 py-1 rounded text-[10px] font-bold ${item.status === "ACTIVE" ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                >
                  Active
                </button>
                <button
                  onClick={() => updateEquipmentStatus(item.id, "MAINTENANCE")}
                  className={`px-2 py-1 rounded text-[10px] font-bold ${item.status === "MAINTENANCE" ? "bg-amber-500 text-slate-950" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                >
                  Maintenance
                </button>
                <button
                  onClick={() => updateEquipmentStatus(item.id, "IDLE")}
                  className={`px-2 py-1 rounded text-[10px] font-bold ${item.status === "IDLE" ? "bg-slate-700 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                >
                  Idle
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
