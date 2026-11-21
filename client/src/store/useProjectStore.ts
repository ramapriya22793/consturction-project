import { create } from "zustand";

export interface Project {
  id: string;
  code: string;
  name: string;
  description?: string;
  location: string;
  budget: number;
  spent: number;
  status: "PLANNING" | "IN_PROGRESS" | "ON_HOLD" | "COMPLETED" | "CANCELLED";
  startDate: string;
  endDate?: string;
  clientName: string;
  _count?: {
    tasks: number;
    dailyReports: number;
    documents: number;
    materials: number;
  };
}

export interface TaskItem {
  id: string;
  projectId: string;
  title: string;
  status: "TODO" | "IN_PROGRESS" | "UNDER_REVIEW" | "COMPLETED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  dueDate?: string;
  assignedTo?: { id: string; name: string; role: string };
}

export interface DailyReportItem {
  id: string;
  projectId: string;
  reportDate: string;
  authorName: string;
  weather?: string;
  workforceCount: number;
  equipmentOnSite?: string;
  workSummary: string;
  issuesDelays?: string;
}

export interface MaterialItem {
  id: string;
  projectId: string;
  name: string;
  category?: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalCost: number;
  supplier?: string;
  status: string;
}

export interface DocumentItem {
  id: string;
  projectId: string;
  title: string;
  category: string;
  fileType: string;
  r2Key: string;
  r2Url?: string;
  fileSize: number;
  version: number;
  createdAt: string;
}

interface ProjectState {
  projects: Project[];
  activeProjectId: string | null;
  tasks: TaskItem[];
  dailyReports: DailyReportItem[];
  materials: MaterialItem[];
  documents: DocumentItem[];
  isLoading: boolean;
  setActiveProjectId: (id: string) => void;
  setProjects: (projects: Project[]) => void;
  setTasks: (tasks: TaskItem[]) => void;
  addTask: (task: TaskItem) => void;
  updateTaskStatus: (taskId: string, status: TaskItem["status"]) => void;
  addDailyReport: (report: DailyReportItem) => void;
  addMaterial: (material: MaterialItem) => void;
  addDocument: (doc: DocumentItem) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [
    {
      id: "prj-1",
      code: "PRJ-METRO-01",
      name: "Metro Viaduct & Station Expansion",
      description: "Elevated transit viaduct structure and 4 intermodal civil stations.",
      location: "Sector 14 - Highway Junction",
      budget: 15400000,
      spent: 4250000,
      status: "IN_PROGRESS",
      clientName: "State Metro Rail Corp",
      startDate: "2026-01-15",
      endDate: "2027-12-30",
      _count: { tasks: 8, dailyReports: 24, documents: 14, materials: 18 },
    },
    {
      id: "prj-2",
      code: "PRJ-RES-TOWER",
      name: "Apex Sky Commercial & Residential Complex",
      description: "32-story reinforced concrete mixed-use tower with dual basements.",
      location: "Downtown Central Avenue",
      budget: 28500000,
      spent: 8900000,
      status: "IN_PROGRESS",
      clientName: "Apex Urban Properties",
      startDate: "2025-06-01",
      endDate: "2028-03-31",
      _count: { tasks: 12, dailyReports: 45, documents: 32, materials: 29 },
    },
  ],
  activeProjectId: "prj-1",
  tasks: [
    {
      id: "t-1",
      projectId: "prj-1",
      title: "Foundation Pier Piling & Bored Wells (Piers 12-18)",
      status: "IN_PROGRESS",
      priority: "HIGH",
      dueDate: "2026-12-15",
      assignedTo: { id: "u-eng", name: "Marcus Miller", role: "SITE_ENGINEER" },
    },
    {
      id: "t-2",
      projectId: "prj-1",
      title: "Structural Steel Girder Fabrication Quality Inspection",
      status: "TODO",
      priority: "URGENT",
      dueDate: "2026-11-30",
      assignedTo: { id: "u-pm", name: "Sarah Chen", role: "PROJECT_MANAGER" },
    },
    {
      id: "t-3",
      projectId: "prj-1",
      title: "Geotechnical Soil Bearing Capacity Verification",
      status: "COMPLETED",
      priority: "MEDIUM",
      dueDate: "2026-11-05",
      assignedTo: { id: "u-eng", name: "Marcus Miller", role: "SITE_ENGINEER" },
    },
  ],
  dailyReports: [
    {
      id: "dr-101",
      projectId: "prj-1",
      reportDate: "2026-11-20",
      authorName: "Marcus Miller",
      weather: "Sunny / 28°C",
      workforceCount: 84,
      equipmentOnSite: "3x Hydraulic Rigs, 2x 50-Ton Mobile Cranes, 6x Concrete Transit Mixers",
      workSummary: "Completed concrete pour for Pier Cap P14. Total volume poured 180 m³. Curing tests for Pier P12 passed 28-day 45MPa strength verification.",
      issuesDelays: "Minor delay of 45 mins due to municipal concrete transit truck detour during peak morning traffic.",
    },
    {
      id: "dr-100",
      projectId: "prj-1",
      reportDate: "2026-11-19",
      authorName: "Marcus Miller",
      weather: "Overcast / 24°C",
      workforceCount: 78,
      equipmentOnSite: "2x Hydraulic Rigs, 2x Cranes",
      workSummary: "Rebar tying for Pier P15 completed. Formwork inspected and cleared for concrete pouring.",
      issuesDelays: "None.",
    },
  ],
  materials: [
    {
      id: "mat-1",
      projectId: "prj-1",
      name: "Ready-Mix Concrete Grade M40",
      category: "Concrete",
      quantity: 1200,
      unit: "m³",
      unitPrice: 110,
      totalCost: 132000,
      supplier: "Holcim Cement & Aggregates",
      status: "DELIVERED",
    },
    {
      id: "mat-2",
      projectId: "prj-1",
      name: "Fe500D TMT Reinforcement Steel Bars (16mm & 25mm)",
      category: "Steel",
      quantity: 250,
      unit: "Metric Tonnes",
      unitPrice: 750,
      totalCost: 187500,
      supplier: "ArcelorMittal Infrastructure",
      status: "DELIVERED",
    },
    {
      id: "mat-3",
      projectId: "prj-1",
      name: "Prestressed Concrete Strands (15.2mm)",
      category: "Steel",
      quantity: 45,
      unit: "Metric Tonnes",
      unitPrice: 1350,
      totalCost: 60750,
      supplier: "Tata Steel Global",
      status: "IN_TRANSIT",
    },
  ],
  documents: [
    {
      id: "doc-1",
      projectId: "prj-1",
      title: "Viaduct Superstructure CAD Layout - Rev C",
      category: "CAD_DRAWING",
      fileType: "application/pdf",
      r2Key: "projects/prj-1/documents/viaduct-superstructure-rev-c.pdf",
      r2Url: "https://civil-project-documents.r2.cloudflarestorage.com/projects/prj-1/documents/viaduct-superstructure-rev-c.pdf",
      fileSize: 14850000,
      version: 3,
      createdAt: "2026-11-15T09:30:00Z",
    },
    {
      id: "doc-2",
      projectId: "prj-1",
      title: "Substructure Geotechnical Foundation Report",
      category: "INSPECTION_REPORT",
      fileType: "application/pdf",
      r2Key: "projects/prj-1/documents/geotech-foundation-report.pdf",
      fileSize: 4200000,
      version: 1,
      createdAt: "2026-11-08T14:15:00Z",
    },
    {
      id: "doc-3",
      projectId: "prj-1",
      title: "Q4 Material Procurement Invoices & Bill of Quantities",
      category: "INVOICE",
      fileType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      r2Key: "projects/prj-1/documents/boq-q4-invoices.xlsx",
      fileSize: 1850000,
      version: 2,
      createdAt: "2026-11-18T16:00:00Z",
    },
  ],
  isLoading: false,
  setActiveProjectId: (id) => set({ activeProjectId: id }),
  setProjects: (projects) => set({ projects }),
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({ tasks: [task, ...state.tasks] })),
  updateTaskStatus: (taskId, status) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, status } : t)),
    })),
  addDailyReport: (report) =>
    set((state) => ({ dailyReports: [report, ...state.dailyReports] })),
  addMaterial: (material) =>
    set((state) => ({ materials: [material, ...state.materials] })),
  addDocument: (doc) =>
    set((state) => ({ documents: [doc, ...state.documents] })),
}));
