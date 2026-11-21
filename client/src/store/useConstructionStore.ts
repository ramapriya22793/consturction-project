import { create } from "zustand";
import {
  Project,
  Task,
  Worker,
  AttendanceRecord,
  WageSummary,
  DailyReport,
  MaterialItem,
  MaterialRequest,
  Equipment,
  ExpenseRecord,
  Invoice,
  ApprovalItem,
  UserRole,
} from "../types";
import {
  initialProjects,
  initialTasks,
  initialWorkers,
  initialAttendance,
  initialWages,
  initialDailyReports,
  initialMaterials,
  initialMaterialRequests,
  initialEquipment,
  initialExpenses,
  initialInvoices,
  initialApprovals,
} from "../mockData/constructionData";
import { DEMO_ACCOUNTS, DemoAccount } from "../mockData/demoAccounts";

export type FontTheme = "outfit" | "inter" | "jakarta" | "manrope" | "space" | "dmsans";

interface ConstructionState {
  // Authentication & Session
  currentUser: DemoAccount;
  isAuthenticated: boolean;

  // Navigation & Role & Styling
  activeRole: UserRole;
  selectedProjectId: string;
  isSidebarCollapsed: boolean;
  isMobileMenuOpen: boolean;
  searchQuery: string;
  fontTheme: FontTheme;
  
  // Data Collections
  projects: Project[];
  tasks: Task[];
  workers: Worker[];
  attendance: AttendanceRecord[];
  wages: WageSummary[];
  dailyReports: DailyReport[];
  materials: MaterialItem[];
  materialRequests: MaterialRequest[];
  equipment: Equipment[];
  expenses: ExpenseRecord[];
  invoices: Invoice[];
  approvals: ApprovalItem[];

  // Actions
  setActiveRole: (role: UserRole) => void;
  setSelectedProjectId: (id: string) => void;
  toggleSidebar: () => void;
  toggleMobileMenu: () => void;
  setMobileMenuOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  setFontTheme: (theme: FontTheme) => void;

  // Authentication Actions
  loginWithCredentials: (email: string, password: string) => { success: boolean; error?: string };
  loginAsDemoRole: (role: UserRole) => void;
  logout: () => void;

  // Project Mutations
  addProject: (project: Project) => void;
  updateProjectProgress: (id: string, progress: number) => void;

  // Task Mutations
  addTask: (task: Task) => void;
  updateTaskStatus: (taskId: string, status: Task["status"]) => void;

  // Workforce & Attendance Mutations
  addWorker: (worker: Worker) => void;
  markAttendance: (record: AttendanceRecord) => void;
  approveWage: (id: string) => void;

  // Daily Report Mutations
  addDailyReport: (report: DailyReport) => void;
  updateReportApproval: (reportId: string, status: DailyReport["approvalStatus"], comments?: string) => void;

  // Material & Equipment Mutations
  addMaterialRequest: (request: MaterialRequest) => void;
  approveMaterialRequest: (id: string) => void;
  updateEquipmentStatus: (id: string, status: Equipment["status"]) => void;

  // Financial & Approvals
  addExpense: (expense: ExpenseRecord) => void;
  resolveApproval: (id: string, approved: boolean) => void;
}

export const useConstructionStore = create<ConstructionState>((set, get) => ({
  currentUser: DEMO_ACCOUNTS[0], // Default Builder/Owner
  isAuthenticated: true,

  activeRole: "BUILDER_OWNER",
  selectedProjectId: "prj-metro-01",
  isSidebarCollapsed: false,
  isMobileMenuOpen: false,
  searchQuery: "",
  fontTheme: "outfit",

  projects: initialProjects,
  tasks: initialTasks,
  workers: initialWorkers,
  attendance: initialAttendance,
  wages: initialWages,
  dailyReports: initialDailyReports,
  materials: initialMaterials,
  materialRequests: initialMaterialRequests,
  equipment: initialEquipment,
  expenses: initialExpenses,
  invoices: initialInvoices,
  approvals: initialApprovals,

  setActiveRole: (role) => {
    const matchedAccount = DEMO_ACCOUNTS.find((a) => a.role === role) || DEMO_ACCOUNTS[0];
    set({ activeRole: role, currentUser: matchedAccount });
  },
  setSelectedProjectId: (id) => set({ selectedProjectId: id }),
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setFontTheme: (fontTheme) => {
    if (typeof document !== "undefined") {
      document.body.classList.remove(
        "font-theme-outfit",
        "font-theme-inter",
        "font-theme-jakarta",
        "font-theme-manrope",
        "font-theme-space",
        "font-theme-dmsans"
      );
      document.body.classList.add(`font-theme-${fontTheme}`);
    }
    set({ fontTheme });
  },

  loginWithCredentials: (email, password) => {
    const found = DEMO_ACCOUNTS.find(
      (a) => a.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (!found) {
      return { success: false, error: "No account found matching this corporate email address." };
    }
    if (password && password !== found.password) {
      return { success: false, error: "Invalid password for this account. Check demo credentials below." };
    }
    set({
      currentUser: found,
      activeRole: found.role,
      isAuthenticated: true,
    });
    return { success: true };
  },

  loginAsDemoRole: (role) => {
    const account = DEMO_ACCOUNTS.find((a) => a.role === role) || DEMO_ACCOUNTS[0];
    set({
      currentUser: account,
      activeRole: account.role,
      isAuthenticated: true,
    });
  },

  logout: () => {
    set({
      isAuthenticated: false,
    });
  },

  addProject: (project) =>
    set((state) => ({ projects: [project, ...state.projects] })),

  updateProjectProgress: (id, progress) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === id ? { ...p, progressPercentage: progress } : p
      ),
    })),

  addTask: (task) =>
    set((state) => ({ tasks: [task, ...state.tasks] })),

  updateTaskStatus: (taskId, status) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status,
              progress: status === "COMPLETED" ? 100 : t.progress,
            }
          : t
      ),
    })),

  addWorker: (worker) =>
    set((state) => ({ workers: [worker, ...state.workers] })),

  markAttendance: (record) =>
    set((state) => ({
      attendance: [
        record,
        ...state.attendance.filter(
          (a) => !(a.workerId === record.workerId && a.date === record.date)
        ),
      ],
    })),

  approveWage: (id) =>
    set((state) => ({
      wages: state.wages.map((w) =>
        w.id === id ? { ...w, status: "APPROVED" } : w
      ),
    })),

  addDailyReport: (report) =>
    set((state) => ({
      dailyReports: [report, ...state.dailyReports],
      approvals: [
        {
          id: `app-${Date.now()}`,
          type: "Daily Report",
          title: `Daily Progress Log (${report.reportDate})`,
          submittedBy: report.supervisorName,
          projectName: report.projectName,
          date: report.reportDate,
          status: "PENDING",
          urgency: "Normal",
        },
        ...state.approvals,
      ],
    })),

  updateReportApproval: (reportId, status, comments) =>
    set((state) => ({
      dailyReports: state.dailyReports.map((r) =>
        r.id === reportId
          ? { ...r, approvalStatus: status, reviewerComments: comments }
          : r
      ),
    })),

  addMaterialRequest: (request) =>
    set((state) => ({
      materialRequests: [request, ...state.materialRequests],
      approvals: [
        {
          id: `app-mr-${Date.now()}`,
          type: "Material Request",
          title: `Request for ${request.quantity} ${request.unit} ${request.materialName}`,
          submittedBy: request.requestedBy,
          projectName: request.projectName,
          date: new Date().toISOString().split("T")[0],
          amountOrCount: `$${request.estimatedCost}`,
          status: "PENDING",
          urgency: request.urgency === "Critical" ? "Urgent" : "Normal",
        },
        ...state.approvals,
      ],
    })),

  approveMaterialRequest: (id) =>
    set((state) => ({
      materialRequests: state.materialRequests.map((m) =>
        m.id === id ? { ...m, status: "APPROVED" } : m
      ),
    })),

  updateEquipmentStatus: (id, status) =>
    set((state) => ({
      equipment: state.equipment.map((e) =>
        e.id === id ? { ...e, status } : e
      ),
    })),

  addExpense: (expense) =>
    set((state) => ({ expenses: [expense, ...state.expenses] })),

  resolveApproval: (id, approved) =>
    set((state) => ({
      approvals: state.approvals.map((a) =>
        a.id === id ? { ...a, status: approved ? "APPROVED" : "REJECTED" } : a
      ),
    })),
}));
