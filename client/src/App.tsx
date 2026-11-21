import React, { useState } from "react";
import { Navbar } from "./components/Navbar";
import { Sidebar, NavTab } from "./components/Sidebar";
import { Dashboard } from "./components/Dashboard";
import { DailyReportsView } from "./components/DailyReportsView";
import { DocumentsView } from "./components/DocumentsView";
import { MaterialsView } from "./components/MaterialsView";
import { TasksView } from "./components/TasksView";
import { StackArchitectureView } from "./components/StackArchitectureView";
import { useProjectStore } from "./store/useProjectStore";

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>("dashboard");
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const { activeProjectId, projects } = useProjectStore();
  const currentProject = projects.find((p) => p.id === activeProjectId) || projects[0];

  const handleExportExcel = async () => {
    setActiveTab("materials");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
          {activeTab === "dashboard" && (
            <Dashboard
              onOpenReportModal={() => setIsReportModalOpen(true)}
              onOpenUploadModal={() => setIsUploadModalOpen(true)}
              onExportExcel={handleExportExcel}
            />
          )}

          {activeTab === "reports" && (
            <DailyReportsView
              isModalOpen={isReportModalOpen}
              setIsModalOpen={setIsReportModalOpen}
            />
          )}

          {activeTab === "documents" && (
            <DocumentsView
              isUploadModalOpen={isUploadModalOpen}
              setIsUploadModalOpen={setIsUploadModalOpen}
            />
          )}

          {activeTab === "materials" && <MaterialsView />}

          {activeTab === "tasks" && <TasksView />}

          {activeTab === "stack" && <StackArchitectureView />}
        </main>
      </div>
    </div>
  );
}

export default App;
