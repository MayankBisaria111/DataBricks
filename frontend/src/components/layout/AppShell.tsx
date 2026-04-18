import { ReactNode, useState } from "react";
import { motion } from "framer-motion";
import { UserRole } from "../../app/auth";
import { useDarkMode } from "../../contexts/DarkModeContext";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import FloatingChatButton from "./FloatingChatButton";

type AppShellProps = {
  role: UserRole;
  children: ReactNode;
};

export default function AppShell({ role, children }: AppShellProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { isDark } = useDarkMode();

  return (
    <div className={`flex min-h-screen transition-colors duration-300 ${isDark ? "bg-slate-950" : "bg-slate-50"}`}>
      <Sidebar role={role} isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className={`flex min-h-screen flex-1 flex-col md:ml-0 ${isDark ? "bg-slate-900" : "bg-slate-100/60"}`}>
        <Topbar role={role} onMenuClick={() => setSidebarOpen(true)} />
        <motion.main
          key={role}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className={`flex-1 p-4 md:p-6 transition-colors duration-300 ${isDark ? "bg-slate-900 text-white" : "bg-slate-100/60"}`}
        >
          {children}
        </motion.main>
      </div>
      <FloatingChatButton />
    </div>
  );
}
