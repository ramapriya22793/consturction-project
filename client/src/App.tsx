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
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="projects/:id" element={<ProjectDetailPage />} />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="daily-reports" element={<DailyReportsPage />} />
            <Route path="workforce" element={<WorkersPage />} />
            <Route path="attendance" element={<AttendancePage />} />
            <Route path="leaves-wages" element={<LeaveWagePage />} />
            <Route path="materials" element={<MaterialsPage />} />
            <Route path="equipment" element={<EquipmentPage />} />
            <Route path="finance" element={<FinancePage />} />
            <Route path="approvals" element={<ApprovalsPage />} />
            <Route path="onboarding" element={<OnboardingPage />} />
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
