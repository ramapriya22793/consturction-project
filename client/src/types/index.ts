export type UserRole =
  | "BUILDER_OWNER"
  | "PROJECT_MANAGER"
  | "CIVIL_ENGINEER"
  | "SITE_SUPERVISOR"
  | "ACCOUNTANT"
  | "CLIENT"
  | "ADMIN";

export type ProjectStatus = "ACTIVE" | "COMPLETED" | "ON_HOLD" | "DELAYED" | "DRAFT";

export interface ProjectStage {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  assignedEngineer: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "DELAYED";
  progress: number;
  dependencies?: string[];
  tasksCount: number;
}

export interface Project {
  id: string;
  code: string;
  name: string;
  type: "Commercial" | "Residential" | "Infrastructure" | "Industrial";
  location: string;
  siteAddress: string;
  clientName: string;
  clientEmail?: string;
  projectManager: string;
  assignedEngineer: string;
  supervisor: string;
  startDate: string;
  expectedCompletionDate: string;
  contractValue: number;
  budget: number;
  spent: number;
  status: ProjectStatus;
  progressPercentage: number;
  image: string;
  description: string;
  stages: ProjectStage[];
  workforceCount: number;
  openTasksCount: number;
}

export type TaskStatus =
  | "NOT_STARTED"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "BLOCKED"
  | "UNDER_REVIEW"
  | "COMPLETED"
  | "CANCELLED";

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface Task {
  id: string;
  title: string;
  description: string;
  projectId: string;
  projectName: string;
  siteLocation: string;
  stageName: string;
  assignedTo: string;
  assignedWorkersCount: number;
  priority: TaskPriority;
  status: TaskStatus;
  startDate: string;
  dueDate: string;
  estimatedHours: number;
  progress: number;
  blockerReason?: string;
}

export type WorkerTrade =
  | "Mason"
  | "Carpenter"
  | "Electrician"
  | "Plumber"
  | "Painter"
  | "Welder"
  | "Helper"
  | "Machine Operator"
  | "Site Labour";

export interface Worker {
  id: string;
  workerId: string;
  name: string;
  phone: string;
  trade: WorkerTrade;
  dailyWage: number;
  employmentType: "Full-Time" | "Contract" | "Daily-Wage";
  assignedProjectId: string;
  assignedProjectName: string;
  availability: "Available" | "On-Site" | "On-Leave";
  status: "Active" | "Inactive";
  photo: string;
  joinedDate: string;
  emergencyContact: string;
  rating: number;
}

export interface AttendanceRecord {
  id: string;
  workerId: string;
  workerName: string;
  trade: string;
  projectId: string;
  date: string;
  status: "PRESENT" | "ABSENT" | "HALF_DAY" | "ON_LEAVE" | "OVERTIME";
  checkIn?: string;
  checkOut?: string;
  overtimeHours?: number;
  remarks?: string;
  verifiedBySupervisor: boolean;
}

export interface WageSummary {
  id: string;
  workerId: string;
  workerName: string;
  trade: string;
  workingDays: number;
  halfDays: number;
  overtimeHours: number;
  dailyWage: number;
  grossWage: number;
  advancePaid: number;
  deductions: number;
  netPayable: number;
  status: "PENDING_APPROVAL" | "APPROVED" | "PAID";
  period: string;
}

export interface DailyReport {
  id: string;
  projectId: string;
  projectName: string;
  siteLocation: string;
  reportDate: string;
  supervisorName: string;
  weather: string;
  workersPresent: number;
  workersAbsent: number;
  workCompleted: string;
  stageName: string;
  completedQuantity: string;
  materialsUsed: string;
  equipmentUsed: string;
  siteExpenses: number;
  delays?: string;
  blockers?: string;
  qualityConcerns?: string;
  safetyObservations?: string;
  photos: string[];
  nextDayPlan: string;
  approvalStatus: "SUBMITTED" | "APPROVED" | "CORRECTION_REQUESTED" | "REJECTED";
  reviewerComments?: string;
}

export interface MaterialItem {
  id: string;
  name: string;
  code: string;
  category: "Concrete" | "Steel" | "Aggregates" | "Masonry" | "Finishing" | "Electrical" | "Plumbing";
  unit: string;
  availableStock: number;
  minimumStock: number;
  unitPrice: number;
  siteLocation: string;
  supplier: string;
  status: "In Stock" | "Low Stock" | "Out of Stock";
}

export interface MaterialRequest {
  id: string;
  projectId: string;
  projectName: string;
  requestedBy: string;
  materialName: string;
  quantity: number;
  unit: string;
  requiredDate: string;
  urgency: "Normal" | "High" | "Critical";
  status: "PENDING" | "APPROVED" | "REJECTED" | "DISPATCHED";
  estimatedCost: number;
}

export interface Equipment {
  id: string;
  name: string;
  code: string;
  type: string;
  assignedProjectId: string;
  assignedProjectName: string;
  status: "ACTIVE" | "MAINTENANCE" | "IDLE";
  operatorName: string;
  fuelConsumptionLph: number;
  hoursWorkedToday: number;
  lastMaintenanceDate: string;
  nextServiceDueDate: string;
  rentalCostPerDay: number;
}

export interface ExpenseRecord {
  id: string;
  date: string;
  projectId: string;
  projectName: string;
  category: "Labour" | "Materials" | "Equipment" | "Transportation" | "Fuel" | "Miscellaneous";
  amount: number;
  paymentMethod: "Bank Transfer" | "Cash" | "UPI" | "Cheque";
  vendor: string;
  description: string;
  createdBy: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  receiptUrl?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  type: "Client Collection" | "Vendor Bill" | "Contractor";
  projectName: string;
  partyName: string;
  amount: number;
  dueDate: string;
  status: "PAID" | "PENDING" | "OVERDUE";
  issuedDate: string;
}

export interface ApprovalItem {
  id: string;
  type: "Daily Report" | "Material Request" | "Expense" | "Leave" | "Wage Sheet";
  title: string;
  submittedBy: string;
  projectName: string;
  date: string;
  amountOrCount?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  urgency: "Normal" | "High" | "Urgent";
}
