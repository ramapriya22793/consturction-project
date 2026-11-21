import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  CheckSquare,
  FileText,
  Menu,
} from "lucide-react";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";
import { QuickActionModal } from "./QuickActionModal";
import { useConstructionStore } from "../../store/useConstructionStore";
import { cn } from "../../lib/utils";

export const AppLayout: React.FC = () => {
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const location = useLocation();
  const { toggleMobileMenu } = useConstructionStore();

  const mobileNavItems = [
    { label: "Dashboard", path: "/", icon: LayoutDashboard },
    { label: "Projects", path: "/projects", icon: Building2 },
    { label: "Tasks", path: "/tasks", icon: CheckSquare },
    { label: "DPR", path: "/daily-reports", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex font-sans antialiased">
      {/* Desktop Sidebar + Mobile Drawer */}
      <Sidebar />

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Navbar */}
        <TopNav onOpenQuickAction={() => setIsQuickActionOpen(true)} />

        {/* Dynamic Route Content with Responsive Padding */}
        <main className="flex-1 p-3.5 sm:p-5 md:p-6 lg:p-8 pb-24 lg:pb-8 max-w-[1600px] w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (Thumb Friendly for Site Use) */}
      <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 lg:hidden flex items-center justify-around py-2 px-2 shadow-xl">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.path === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all",
                isActive
                  ? "text-blue-600 font-bold"
                  : "text-slate-500 hover:text-slate-800"
              )}
            >
              <div
                className={cn(
                  "p-1 rounded-lg transition-colors",
                  isActive ? "bg-blue-50 text-blue-600" : ""
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </Link>
          );
        })}

        {/* More Menu Drawer Trigger */}
        <button
          onClick={toggleMobileMenu}
          className="flex flex-col items-center justify-center py-1 px-3 text-slate-500 hover:text-slate-800 transition-all rounded-xl"
        >
          <div className="p-1 rounded-lg">
            <Menu className="h-5 w-5" />
          </div>
          <span className="text-[10px] mt-0.5">More</span>
        </button>
      </nav>

      {/* Global Quick Action Modal */}
      <QuickActionModal
        isOpen={isQuickActionOpen}
        onClose={() => setIsQuickActionOpen(false)}
      />
    </div>
  );
};
