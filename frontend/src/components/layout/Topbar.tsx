import { useState } from "react";
import { FiLogOut, FiMenu, FiSun, FiMoon, FiSearch } from "react-icons/fi";
import { Bell, ChevronDown, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { clearSession, UserRole, getSession } from "../../app/auth";
import { useDarkMode } from "../../contexts/DarkModeContext";

type TopbarProps = {
  role: UserRole;
  onMenuClick: () => void;
};

function roleLabel(role: UserRole): string {
  return role === "controller" ? "Controller" : "Passenger";
}

export default function Topbar({ role, onMenuClick }: TopbarProps) {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { isDark, toggleDarkMode } = useDarkMode();
  const session = getSession();
  const username = session?.username || "User";
  const email = session?.email || "";
  const initials = username
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  function handleLogout() {
    clearSession();
    navigate("/login", { replace: true });
  }

  return (
    <header className={`sticky top-0 z-20 flex h-16 items-center justify-between border-b px-4 backdrop-blur-xl md:px-6 ${isDark ? "border-slate-700/40 bg-slate-900/70" : "border-slate-200/60 bg-white/60"}`}>
      <div className="flex items-center gap-3">
        <button
          className={`rounded-xl p-2 transition duration-150 active:scale-95 md:hidden ${isDark ? "text-slate-300 hover:bg-slate-700" : "text-slate-600 hover:bg-white"}`}
          onClick={onMenuClick}
          aria-label="Open sidebar"
        >
          <FiMenu />
        </button>
        <p className={`text-xl font-bold tracking-tight ${isDark ? "text-indigo-200" : "text-indigo-800"}`}>Rail Drishti</p>
      </div>

      <div className="relative flex items-center gap-3">
        <div className={`hidden items-center rounded-full px-3 py-1.5 md:flex ${isDark ? "bg-slate-800" : "bg-slate-100/90"}`}>
          <FiSearch className={`${isDark ? "text-slate-500" : "text-slate-400"}`} />
          <input
            placeholder="Search..."
            className={`ml-2 w-44 bg-transparent text-sm outline-none ${isDark ? "text-slate-200 placeholder:text-slate-500" : "text-slate-700 placeholder:text-slate-400"}`}
          />
        </div>
        <button
          onClick={toggleDarkMode}
          className={`hidden rounded-full p-2 transition duration-150 active:scale-95 md:inline-flex ${isDark ? "text-slate-300 hover:bg-slate-800 hover:text-white" : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"}`}
          aria-label="Toggle dark mode"
          title="Toggle dark mode"
        >
          {isDark ? <FiSun size={16} /> : <FiMoon size={16} />}
        </button>
        <button
          className={`hidden rounded-full p-2 transition duration-150 active:scale-95 md:inline-flex ${isDark ? "text-slate-300 hover:bg-slate-800 hover:text-white" : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"}`}
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell size={16} />
        </button>
        <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium ${isDark ? "border-indigo-900 bg-indigo-950 text-indigo-300" : "border-indigo-100 bg-indigo-50 text-indigo-700"}`}>
          <Sparkles size={13} />
          {roleLabel(role)}
        </span>
        <button
          className={`inline-flex items-center gap-2 rounded-xl px-2 py-1.5 text-xs font-medium transition duration-150 active:scale-95 ${isDark ? "text-slate-100 hover:bg-slate-800" : "text-slate-700 hover:bg-slate-100"}`}
          onClick={() => setIsProfileOpen((prev) => !prev)}
          title="Profile menu"
        >
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-[10px] font-semibold text-white">
            {initials}
          </span>
          <span className="hidden text-left sm:block">
            <span className="block leading-tight">{username}</span>
            <span className={`block text-[10px] font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>{roleLabel(role)}</span>
          </span>
          <ChevronDown size={14} className={`transition ${isProfileOpen ? "rotate-180" : ""}`} />
        </button>

        {isProfileOpen ? (
          <div className={`absolute right-0 top-12 z-30 w-56 rounded-2xl border p-3 shadow-[0_18px_38px_rgba(15,23,42,0.14)] backdrop-blur ${isDark ? "border-slate-700 bg-slate-800/95" : "border-slate-200/80 bg-white/95"}`}>
            <div className={`mb-3 px-3 py-2 border-b ${isDark ? "border-slate-700" : "border-slate-200"}`}>
              <p className={`text-xs font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>{username}</p>
              <p className={`text-[10px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>{email}</p>
              {role === "passenger" && (session?.seatNumber || session?.coachNumber) && (
                <p className={`text-[10px] mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  {session?.seatNumber && `Seat: ${session.seatNumber}`}
                  {session?.seatNumber && session?.coachNumber && " • "}
                  {session?.coachNumber && `Coach: ${session.coachNumber}`}
                </p>
              )}
            </div>
            <button
              className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition active:scale-[0.98] ${isDark ? "text-slate-200 hover:bg-slate-700" : "text-slate-700 hover:bg-slate-100"}`}
              onClick={handleLogout}
            >
              <FiLogOut />
              Logout
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
}
