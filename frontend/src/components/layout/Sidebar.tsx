import { IconType } from "react-icons";
import { FiHome, FiMessageSquare, FiShield, FiUsers, FiX, FiMap, FiAlertCircle, FiTrendingDown, FiSettings, FiLogOut, FiPlus } from "react-icons/fi";
import { Link, NavLink } from "react-router-dom";
import { UserRole } from "../../app/auth";
import { useDarkMode } from "../../contexts/DarkModeContext";

type SidebarProps = {
  role: UserRole;
  isOpen: boolean;
  onClose: () => void;
};

type NavItem = {
  to: string;
  label: string;
  icon: IconType;
};

const passengerNav: NavItem[] = [
  { to: "/passenger", label: "Passenger", icon: FiUsers },
  { to: "/predict-delay", label: "Predict Delay", icon: FiTrendingDown },
  { to: "/routes", label: "Route Optimizer", icon: FiMap },
  { to: "/complaint", label: "Quick Complaint", icon: FiAlertCircle },
  { to: "/chat", label: "Chat", icon: FiMessageSquare },
];

const controllerNav: NavItem[] = [
  { to: "/controller", label: "Overview", icon: FiShield },
  { to: "/controller/map", label: "Map", icon: FiMap },
  { to: "/controller/trains", label: "Trains", icon: FiTrendingDown },
  { to: "/controller/alerts", label: "Alerts", icon: FiAlertCircle },
  { to: "/controller/complaints", label: "Complaints", icon: FiMessageSquare },
  { to: "/chat", label: "Chat", icon: FiMessageSquare },
];

export default function Sidebar({ role, isOpen, onClose }: SidebarProps) {
  const { isDark } = useDarkMode();
  const navItems = role === "controller" ? controllerNav : passengerNav;

  return (
    <>
      <div
        className={`fixed inset-0 z-30 transition md:hidden ${isDark ? "bg-black/60" : "bg-slate-900/40"} ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={onClose}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r p-4 transition-all md:static md:z-auto md:w-64 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } ${isDark ? "border-slate-700/40 bg-slate-950" : "border-slate-200/70 bg-slate-50"}`}
      >
        <div className="mb-6 flex items-center justify-between px-2 pt-1">
          <Link to="/" className={`flex items-center gap-2 text-base font-black tracking-tight ${isDark ? "text-indigo-200" : "text-indigo-800"}`}>
            <span className="rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 p-2 text-white shadow-sm">
              <FiHome className="text-base" />
            </span>
            Rail Drishti
          </Link>
          <button
            className={`rounded-lg p-2 transition active:scale-95 md:hidden ${isDark ? "text-slate-400 hover:bg-slate-700" : "text-slate-500 hover:bg-slate-100"}`}
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <FiX />
          </button>
        </div>
        <button className={`mb-4 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition ${
          isDark ? "bg-indigo-600 text-white hover:bg-indigo-500" : "bg-indigo-600 text-white hover:bg-indigo-700"
        }`}>
          <FiPlus />
          New Report
        </button>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? isDark
                      ? "bg-slate-900 text-indigo-400 shadow-sm"
                      : "bg-white text-indigo-700 shadow-sm"
                    : isDark
                    ? "text-slate-400 hover:translate-x-1 hover:bg-slate-800/60"
                    : "text-slate-600 hover:translate-x-1 hover:bg-slate-200"
                }`
              }
              title={item.label}
            >
              <span className="flex items-center gap-3">
                <item.icon className="text-base" />
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>
        <div className={`mt-5 border-t pt-4 ${isDark ? "border-slate-800" : "border-slate-200"}`}>
          <button className={`mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${isDark ? "text-slate-400 hover:bg-slate-800/60" : "text-slate-600 hover:bg-slate-200"}`}>
            <FiSettings />
            Settings
          </button>
          <button className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${isDark ? "text-slate-400 hover:bg-slate-800/60" : "text-slate-600 hover:bg-slate-200"}`}>
            <FiLogOut />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
