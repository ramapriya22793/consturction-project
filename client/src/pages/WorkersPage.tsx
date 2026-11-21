import React, { useState } from "react";
import {
  Users,
  Plus,
  Search,
  Phone,
  HardHat,
  MapPin,
  Calendar,
  DollarSign,
  Star,
  CheckCircle,
  Eye,
} from "lucide-react";
import { useConstructionStore } from "../store/useConstructionStore";
import { Worker, WorkerTrade } from "../types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { formatCurrency } from "../lib/utils";

export const WorkersPage: React.FC = () => {
  const { workers, projects, addWorker } = useConstructionStore();
  const [tradeFilter, setTradeFilter] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+91 98000 12345");
  const [trade, setTrade] = useState<WorkerTrade>("Mason");
  const [dailyWage, setDailyWage] = useState(950);
  const [employmentType, setEmploymentType] = useState<Worker["employmentType"]>("Full-Time");
  const [assignedProjectId, setAssignedProjectId] = useState(projects[0]?.id || "");
  const [emergencyContact, setEmergencyContact] = useState("+91 98000 54321");

  const trades: WorkerTrade[] = [
    "Mason",
    "Carpenter",
    "Electrician",
    "Plumber",
    "Painter",
    "Welder",
    "Helper",
    "Machine Operator",
    "Site Labour",
  ];

  const filteredWorkers = workers.filter((w) => {
    const matchesTrade = tradeFilter === "ALL" || w.trade === tradeFilter;
    const matchesSearch =
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.workerId.toLowerCase().includes(search.toLowerCase()) ||
      w.trade.toLowerCase().includes(search.toLowerCase());
    return matchesTrade && matchesSearch;
  });

  const handleAddWorker = (e: React.FormEvent) => {
    e.preventDefault();
    const proj = projects.find((p) => p.id === assignedProjectId) || projects[0];
    const newWorker: Worker = {
      id: `wrk-${Date.now()}`,
      workerId: `WKR-${Math.floor(1000 + Math.random() * 9000)}`,
      name,
      phone,
      trade,
      dailyWage: Number(dailyWage),
      employmentType,
      assignedProjectId: proj.id,
      assignedProjectName: proj.name,
      availability: "On-Site",
      status: "Active",
      photo: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80",
      joinedDate: new Date().toISOString().split("T")[0],
      emergencyContact,
      rating: 4.8,
    };
    addWorker(newWorker);
    setIsAddOpen(false);
    setName("");
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Workforce Directory & Tradesmen Master
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage skilled craftsmen, daily wages, trade certifications, and emergency contacts.
          </p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-xs">
          <Plus className="h-4 w-4" />
          Register New Worker
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <Search className="h-4 w-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search worker by name, ID or trade..."
            className="w-full text-xs bg-transparent focus:outline-none text-slate-800 placeholder-slate-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setTradeFilter("ALL")}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
              tradeFilter === "ALL" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All Trades ({workers.length})
          </button>
          {trades.map((t) => (
            <button
              key={t}
              onClick={() => setTradeFilter(t)}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                tradeFilter === t ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Workers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWorkers.map((w) => (
          <Card key={w.id} className="p-4 hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <img
                    src={w.photo}
                    alt={w.name}
                    className="h-12 w-12 rounded-xl object-cover border border-slate-200"
                  />
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{w.name}</h3>
                    <p className="font-mono text-[10px] text-slate-400 font-bold">{w.workerId}</p>
                  </div>
                </div>
                <Badge
                  variant={w.availability === "On-Site" ? "success" : "warning"}
                  className="text-[10px]"
                >
                  {w.availability}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Trade</span>
                  <span className="font-bold text-slate-800">{w.trade}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Daily Wage</span>
                  <span className="font-bold font-mono text-emerald-600">${w.dailyWage} / day</span>
                </div>
              </div>

              <div className="space-y-1 text-[11px] text-slate-500">
                <p className="flex items-center gap-1.5 truncate">
                  <HardHat className="h-3 w-3 text-slate-400" />
                  Site: <strong className="text-slate-700">{w.assignedProjectName}</strong>
                </p>
                <p className="flex items-center gap-1.5">
                  <Phone className="h-3 w-3 text-slate-400" />
                  {w.phone}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-3">
              <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span>{w.rating}</span>
              </div>
              <Button
                onClick={() => setSelectedWorker(w)}
                variant="outline"
                size="sm"
                className="text-xs h-7"
              >
                View Profile
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Worker Profile Modal */}
      {selectedWorker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-900">Worker Dossier & Wage Card</h3>
              <button onClick={() => setSelectedWorker(null)} className="text-slate-400 font-bold">✕</button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border">
                <img src={selectedWorker.photo} alt={selectedWorker.name} className="h-16 w-16 rounded-xl object-cover" />
                <div>
                  <h4 className="font-bold text-base text-slate-900">{selectedWorker.name}</h4>
                  <p className="text-slate-500">{selectedWorker.trade} • {selectedWorker.workerId}</p>
                  <p className="text-emerald-600 font-bold font-mono mt-1">${selectedWorker.dailyWage} / day ({selectedWorker.employmentType})</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 rounded-lg border">
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">Phone Number</span>
                  <span className="font-semibold text-slate-800">{selectedWorker.phone}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">Emergency Contact</span>
                  <span className="font-semibold text-slate-800">{selectedWorker.emergencyContact}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">Joined Site Team</span>
                  <span className="font-semibold text-slate-800">{selectedWorker.joinedDate}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">Current Site</span>
                  <span className="font-semibold text-slate-800 truncate block">{selectedWorker.assignedProjectName}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Worker Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-900">Register New Tradesman</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleAddWorker} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700">Full Name</label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="mt-1 w-full rounded-md border border-slate-300 p-2 text-xs focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Trade Skill</label>
                  <select
                    value={trade}
                    onChange={(e) => setTrade(e.target.value as WorkerTrade)}
                    className="mt-1 w-full rounded-md border border-slate-300 p-2 text-xs focus:border-blue-500 focus:outline-none"
                  >
                    {trades.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Daily Wage ($)</label>
                  <input
                    type="number"
                    required
                    value={dailyWage}
                    onChange={(e) => setDailyWage(Number(e.target.value))}
                    className="mt-1 w-full rounded-md border border-slate-300 p-2 text-xs focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Phone</label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1 w-full rounded-md border border-slate-300 p-2 text-xs focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Assigned Project</label>
                  <select
                    value={assignedProjectId}
                    onChange={(e) => setAssignedProjectId(e.target.value)}
                    className="mt-1 w-full rounded-md border border-slate-300 p-2 text-xs focus:border-blue-500 focus:outline-none"
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700">Emergency Contact</label>
                <input
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 p-2 text-xs focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsAddOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm">
                  Register Worker
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
