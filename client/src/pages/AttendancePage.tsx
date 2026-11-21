import React, { useState } from "react";
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  UserCheck,
  Users,
  Download,
  AlertCircle,
  Building,
} from "lucide-react";
import { useConstructionStore } from "../store/useConstructionStore";
import { AttendanceRecord } from "../types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

export const AttendancePage: React.FC = () => {
  const { workers, attendance, projects, selectedProjectId, markAttendance } = useConstructionStore();
  const [selectedDate, setSelectedDate] = useState("2026-11-21");
  const [activeSiteId, setActiveSiteId] = useState(selectedProjectId || projects[0]?.id);

  const currentProject = projects.find((p) => p.id === activeSiteId) || projects[0];

  const siteWorkers = workers.filter((w) => w.assignedProjectId === currentProject.id);

  // Status counts
  const presentCount = attendance.filter((a) => a.status === "PRESENT" || a.status === "OVERTIME").length;
  const absentCount = attendance.filter((a) => a.status === "ABSENT").length;
  const overtimeCount = attendance.filter((a) => a.status === "OVERTIME").length;
  const onLeaveCount = attendance.filter((a) => a.status === "ON_LEAVE").length;

  const handleStatusChange = (
    workerId: string,
    workerName: string,
    trade: string,
    status: AttendanceRecord["status"]
  ) => {
    const record: AttendanceRecord = {
      id: `att-${workerId}-${selectedDate}`,
      workerId,
      workerName,
      trade,
      projectId: currentProject.id,
      date: selectedDate,
      status,
      checkIn: status === "ABSENT" || status === "ON_LEAVE" ? undefined : "07:55 AM",
      checkOut: status === "ABSENT" || status === "ON_LEAVE" ? undefined : "05:00 PM",
      overtimeHours: status === "OVERTIME" ? 2.5 : 0,
      remarks: `Marked by Site Supervisor on ${selectedDate}`,
      verifiedBySupervisor: true,
    };
    markAttendance(record);
  };

  const getWorkerRecord = (workerId: string) => {
    return attendance.find((a) => a.workerId === workerId && a.date === selectedDate);
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Site Labour Attendance & Daily Muster Roll
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Biometric & supervisor attendance tracking, check-ins, overtime calculations, and approvals.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-800 bg-white"
          />
          <Button variant="outline" size="sm" className="text-xs flex items-center gap-1.5">
            <Download className="h-3.5 w-3.5" />
            Export Muster Roll
          </Button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-l-emerald-600">
          <span className="text-xs text-slate-500 font-semibold">Total Present</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{presentCount}</p>
          <p className="text-[11px] text-emerald-600 font-medium">96% Muster Roll Attendance</p>
        </Card>
        <Card className="p-4 border-l-4 border-l-red-500">
          <span className="text-xs text-slate-500 font-semibold">Absent</span>
          <p className="text-2xl font-black text-red-600 mt-1">{absentCount}</p>
          <p className="text-[11px] text-slate-400">Unexcused Absence</p>
        </Card>
        <Card className="p-4 border-l-4 border-l-amber-500">
          <span className="text-xs text-slate-500 font-semibold">Overtime Recorded</span>
          <p className="text-2xl font-black text-amber-600 mt-1">{overtimeCount}</p>
          <p className="text-[11px] text-amber-700 font-medium">Extra Shift Hours Logged</p>
        </Card>
        <Card className="p-4 border-l-4 border-l-blue-500">
          <span className="text-xs text-slate-500 font-semibold">On Approved Leave</span>
          <p className="text-2xl font-black text-blue-600 mt-1">{onLeaveCount}</p>
          <p className="text-[11px] text-blue-600 font-medium">Verified Sick / Casual</p>
        </Card>
      </div>

      {/* Attendance Sheet */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
          <div>
            <CardTitle className="text-sm font-bold">
              Site Muster Roll – {currentProject.name}
            </CardTitle>
            <CardDescription className="text-xs">
              Date: {selectedDate} • Verified by: Site Field Supervisor
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">Select Site:</span>
            <select
              value={activeSiteId}
              onChange={(e) => setActiveSiteId(e.target.value)}
              className="rounded-md border border-slate-300 p-1 text-xs font-semibold text-slate-800 bg-white"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase border-b">
                <tr>
                  <th className="px-6 py-3">Worker Name & ID</th>
                  <th className="px-6 py-3">Trade Skill</th>
                  <th className="px-6 py-3">Daily Wage</th>
                  <th className="px-6 py-3">Check-In / Out</th>
                  <th className="px-6 py-3">Overtime</th>
                  <th className="px-6 py-3">Attendance Status Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {workers.map((worker) => {
                  const record = getWorkerRecord(worker.id);
                  const currentStatus = record?.status || "PRESENT";

                  return (
                    <tr key={worker.id} className="hover:bg-slate-50/70">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={worker.photo} alt={worker.name} className="h-8 w-8 rounded-full object-cover" />
                          <div>
                            <span className="font-bold text-slate-900 block">{worker.name}</span>
                            <span className="font-mono text-[10px] text-slate-400">{worker.workerId}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-700">{worker.trade}</td>
                      <td className="px-6 py-4 font-mono font-bold text-slate-800">${worker.dailyWage}</td>
                      <td className="px-6 py-4 font-mono text-slate-500">
                        {record?.checkIn ? `${record.checkIn} - ${record.checkOut}` : "-- : --"}
                      </td>
                      <td className="px-6 py-4 font-mono font-semibold text-amber-600">
                        {record?.overtimeHours ? `+${record.overtimeHours} hrs` : "0 hrs"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleStatusChange(worker.id, worker.name, worker.trade, "PRESENT")}
                            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                              currentStatus === "PRESENT"
                                ? "bg-emerald-600 text-white shadow-sm"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                          >
                            Present
                          </button>
                          <button
                            onClick={() => handleStatusChange(worker.id, worker.name, worker.trade, "OVERTIME")}
                            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                              currentStatus === "OVERTIME"
                                ? "bg-amber-500 text-slate-950 font-black shadow-sm"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                          >
                            OT (2.5h)
                          </button>
                          <button
                            onClick={() => handleStatusChange(worker.id, worker.name, worker.trade, "HALF_DAY")}
                            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                              currentStatus === "HALF_DAY"
                                ? "bg-blue-600 text-white shadow-sm"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                          >
                            Half-Day
                          </button>
                          <button
                            onClick={() => handleStatusChange(worker.id, worker.name, worker.trade, "ABSENT")}
                            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                              currentStatus === "ABSENT"
                                ? "bg-red-600 text-white shadow-sm"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                          >
                            Absent
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
