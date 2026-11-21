import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { AppLayout } from "./components/layout/AppLayout";
import { RoleDashboardSwitcher } from "./components/dashboard/RoleDashboardSwitcher";
import { ProjectsPage } from "./pages/ProjectsPage";
import { ProjectDetailPage } from "./pages/ProjectDetailPage";
import { TasksPage } from "./pages/TasksPage";
import { DailyReportsPage } from "./pages/DailyReportsPage";
import { WorkersPage } from "./pages/WorkersPage";
import { AttendancePage } from "./pages/AttendancePage";
import { LeaveWagePage } from "./pages/LeaveWagePage";
import { MaterialsPage } from "./pages/MaterialsPage";
import { EquipmentPage } from "./pages/EquipmentPage";
import { FinancePage } from "./pages/FinancePage";
import { ApprovalsPage } from "./pages/ApprovalsPage";
import { OnboardingPage } from "./pages/OnboardingPage";
import { AuthPage } from "./pages/AuthPage";
import { RBACGuard } from "./components/auth/RBACGuard";

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<AuthPage />} />
          <Route path="/auth/login" element={<AuthPage />} />

          {/* Protected Application Layout */}
          <Route path="/" element={<AppLayout />}>
            <Route index element={<RoleDashboardSwitcher />} />
            <Route
              path="projects"
              element={
                <RBACGuard
                  allowedRoles={["BUILDER_OWNER", "PROJECT_MANAGER", "CIVIL_ENGINEER", "ACCOUNTANT", "CLIENT", "ADMIN"]}
                  moduleName="Projects & Sites"
                >
                  <ProjectsPage />
                </RBACGuard>
              }
            />
            <Route
              path="projects/:id"
              element={
                <RBACGuard
                  allowedRoles={["BUILDER_OWNER", "PROJECT_MANAGER", "CIVIL_ENGINEER", "ACCOUNTANT", "CLIENT", "ADMIN"]}
                  moduleName="Project Details"
                >
                  <ProjectDetailPage />
                </RBACGuard>
              }
            />
            <Route
              path="tasks"
              element={
                <RBACGuard
                  allowedRoles={["BUILDER_OWNER", "PROJECT_MANAGER", "CIVIL_ENGINEER", "SITE_SUPERVISOR", "ADMIN"]}
                  moduleName="Tasks & Milestones"
                >
                  <TasksPage />
                </RBACGuard>
              }
            />
            <Route
              path="daily-reports"
              element={
                <RBACGuard
                  allowedRoles={["BUILDER_OWNER", "PROJECT_MANAGER", "CIVIL_ENGINEER", "SITE_SUPERVISOR", "ADMIN"]}
                  moduleName="Daily Site Reports (DPR)"
                >
                  <DailyReportsPage />
                </RBACGuard>
              }
            />
            <Route
              path="workforce"
              element={
                <RBACGuard
                  allowedRoles={["BUILDER_OWNER", "PROJECT_MANAGER", "SITE_SUPERVISOR", "ADMIN"]}
                  moduleName="Workers Directory"
                >
                  <WorkersPage />
                </RBACGuard>
              }
            />
            <Route
              path="attendance"
              element={
                <RBACGuard
                  allowedRoles={["BUILDER_OWNER", "PROJECT_MANAGER", "SITE_SUPERVISOR", "ACCOUNTANT", "ADMIN"]}
                  moduleName="Daily Attendance & Muster Roll"
                >
                  <AttendancePage />
                </RBACGuard>
              }
            />
            <Route
              path="leaves-wages"
              element={
                <RBACGuard
                  allowedRoles={["BUILDER_OWNER", "ACCOUNTANT", "ADMIN"]}
                  moduleName="Leaves & Wage Management"
                >
                  <LeaveWagePage />
                </RBACGuard>
              }
            />
            <Route
              path="materials"
              element={
                <RBACGuard
                  allowedRoles={["BUILDER_OWNER", "PROJECT_MANAGER", "CIVIL_ENGINEER", "SITE_SUPERVISOR", "ADMIN"]}
                  moduleName="Materials & Inventory"
                >
                  <MaterialsPage />
                </RBACGuard>
              }
            />
            <Route
              path="equipment"
              element={
                <RBACGuard
                  allowedRoles={["BUILDER_OWNER", "PROJECT_MANAGER", "CIVIL_ENGINEER", "SITE_SUPERVISOR", "ADMIN"]}
                  moduleName="Heavy Equipment Operations"
                >
                  <EquipmentPage />
                </RBACGuard>
              }
            />
            <Route
              path="finance"
              element={
                <RBACGuard
                  allowedRoles={["BUILDER_OWNER", "ACCOUNTANT", "ADMIN"]}
                  moduleName="Commercial Finance & Budgets"
                >
                  <FinancePage />
                </RBACGuard>
              }
            />
            <Route
              path="approvals"
              element={
                <RBACGuard
                  allowedRoles={["BUILDER_OWNER", "PROJECT_MANAGER", "ACCOUNTANT", "ADMIN"]}
                  moduleName="Pending Approvals Queue"
                >
                  <ApprovalsPage />
                </RBACGuard>
              }
            />
            <Route
              path="onboarding"
              element={
                <RBACGuard
                  allowedRoles={["BUILDER_OWNER", "ADMIN"]}
                  moduleName="Company Onboarding"
                >
                  <OnboardingPage />
                </RBACGuard>
              }
            />
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
        <Toaster richColors position="top-right" />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
