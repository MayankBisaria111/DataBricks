import { FiArrowRight, FiShield, FiUsers, FiMail, FiLock, FiMoon, FiSun } from "react-icons/fi";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { setSession, UserRole } from "../app/auth";
import { useState } from "react";
import { useDarkMode } from "../contexts/DarkModeContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { isDark, toggleDarkMode } = useDarkMode();
  const [showForm, setShowForm] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  function handleRoleSelect(role: UserRole) {
    setSelectedRole(role);
    setShowForm(true);
  }

  function handleSignIn() {
    if (!email || !password || !username || !selectedRole) {
      alert("Please fill in all fields");
      return;
    }

    setSession(selectedRole, username, email);
    navigate(selectedRole === "controller" ? "/controller" : "/passenger", { replace: true });
  }

  function handleBack() {
    setShowForm(false);
    setSelectedRole(null);
    setEmail("");
    setPassword("");
    setUsername("");
  }

  return (
    <div className={`relative flex min-h-screen items-center justify-center overflow-hidden p-4 transition-colors duration-300 ${isDark ? "bg-gradient-to-br from-slate-950 via-black to-slate-900" : "bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100"}`}>
      <div
        className={`pointer-events-none absolute inset-0 ${
          isDark
            ? "bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.2),transparent_50%),radial-gradient(circle_at_80%_70%,rgba(99,102,241,0.16),transparent_45%)]"
            : "bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.16),transparent_50%),radial-gradient(circle_at_80%_70%,rgba(79,70,229,0.12),transparent_45%)]"
        }`}
      />
      {/* Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className={`absolute top-4 right-4 p-2 rounded-lg transition-colors duration-300 ${isDark ? "bg-slate-800 text-yellow-400 hover:bg-slate-700" : "bg-slate-200 text-slate-600 hover:bg-slate-300"}`}
      >
        {isDark ? <FiSun className="text-xl" /> : <FiMoon className="text-xl" />}
      </button>

      {!showForm ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, ease: "easeOut" }}
          className={`w-full max-w-xl rounded-3xl border p-8 shadow-[0_12px_45px_rgba(15,23,42,0.1)] backdrop-blur transition-colors duration-300 ${isDark ? "border-slate-700/50 bg-slate-800/85" : "border-white/80 bg-white/85"}`}
        >
          <p className={`text-sm font-medium uppercase tracking-widest ${isDark ? "text-violet-400" : "text-indigo-600"}`}>Rail Drishti</p>
          <h1 className={`mt-2 text-3xl font-semibold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>Select your role</h1>
          <p className={`mt-1 text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>Choose your command mode to initialize the dashboard.</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              className={`group rounded-2xl border p-5 text-left shadow-sm transition hover:-translate-y-0.5 transition-colors duration-300 ${isDark ? "border-slate-600 bg-slate-700 hover:border-violet-500 hover:bg-violet-900/30" : "border-slate-200/80 bg-white hover:border-indigo-300 hover:bg-indigo-50/70"}`}
              onClick={() => handleRoleSelect("passenger")}
            >
              <FiUsers className={`text-lg ${isDark ? "text-violet-400" : "text-indigo-600"}`} />
              <h2 className={`mt-3 font-medium ${isDark ? "text-white" : "text-slate-900"}`}>Passenger</h2>
              <p className={`mt-1 text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>View updates, status and chat support.</p>
              <div className={`mt-4 inline-flex items-center gap-1 text-xs font-semibold ${isDark ? "text-violet-400" : "text-indigo-600"}`}>
                Continue <FiArrowRight className="transition group-hover:translate-x-0.5" />
              </div>
            </button>

            <button
              className={`group rounded-2xl border p-5 text-left shadow-sm transition hover:-translate-y-0.5 transition-colors duration-300 ${isDark ? "border-slate-600 bg-slate-700 hover:border-violet-500 hover:bg-violet-900/30" : "border-slate-200/80 bg-white hover:border-indigo-300 hover:bg-indigo-50/70"}`}
              onClick={() => handleRoleSelect("controller")}
            >
              <FiShield className={`text-lg ${isDark ? "text-violet-400" : "text-indigo-600"}`} />
              <h2 className={`mt-3 font-medium ${isDark ? "text-white" : "text-slate-900"}`}>Controller</h2>
              <p className={`mt-1 text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>Manage operations and monitor system state.</p>
              <div className={`mt-4 inline-flex items-center gap-1 text-xs font-semibold ${isDark ? "text-violet-400" : "text-indigo-600"}`}>
                Continue <FiArrowRight className="transition group-hover:translate-x-0.5" />
              </div>
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, ease: "easeOut" }}
          className={`w-full max-w-xl rounded-3xl border p-8 shadow-[0_12px_45px_rgba(15,23,42,0.1)] backdrop-blur transition-colors duration-300 ${isDark ? "border-slate-700/50 bg-slate-800/85" : "border-white/80 bg-white/85"}`}
        >
          <p className={`text-sm font-medium uppercase tracking-widest ${isDark ? "text-violet-400" : "text-indigo-600"}`}>Rail Drishti</p>
          <h1 className={`mt-2 text-3xl font-semibold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
            Sign in as {selectedRole === "controller" ? "Controller" : "Passenger"}
          </h1>
          <p className={`mt-1 text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>Enter your credentials to continue.</p>

          <div className="mt-6 space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDark ? "text-slate-200" : "text-slate-900"}`}>Username</label>
              <div className={`flex items-center gap-3 rounded-xl border px-3 py-2 transition-colors duration-300 focus-within:border-indigo-400 ${isDark ? "border-slate-600 bg-slate-700 focus-within:bg-slate-600" : "border-slate-200 bg-slate-50 focus-within:bg-white"}`}>
                <FiUsers className={isDark ? "text-slate-500" : "text-slate-400"} />
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`flex-1 bg-transparent outline-none ${isDark ? "text-white placeholder:text-slate-500" : "text-slate-900 placeholder:text-slate-400"}`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${isDark ? "text-slate-200" : "text-slate-900"}`}>Email</label>
              <div className={`flex items-center gap-3 rounded-xl border px-3 py-2 transition-colors duration-300 focus-within:border-indigo-400 ${isDark ? "border-slate-600 bg-slate-700 focus-within:bg-slate-600" : "border-slate-200 bg-slate-50 focus-within:bg-white"}`}>
                <FiMail className={isDark ? "text-slate-500" : "text-slate-400"} />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`flex-1 bg-transparent outline-none ${isDark ? "text-white placeholder:text-slate-500" : "text-slate-900 placeholder:text-slate-400"}`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${isDark ? "text-slate-200" : "text-slate-900"}`}>Password</label>
              <div className={`flex items-center gap-3 rounded-xl border px-3 py-2 transition-colors duration-300 focus-within:border-indigo-400 ${isDark ? "border-slate-600 bg-slate-700 focus-within:bg-slate-600" : "border-slate-200 bg-slate-50 focus-within:bg-white"}`}>
                <FiLock className={isDark ? "text-slate-500" : "text-slate-400"} />
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`flex-1 bg-transparent outline-none ${isDark ? "text-white placeholder:text-slate-500" : "text-slate-900 placeholder:text-slate-400"}`}
                />
              </div>
            </div>

            {selectedRole === "passenger" ? (
              <p className={`rounded-xl border px-3 py-2 text-xs ${isDark ? "border-slate-700 bg-slate-800 text-slate-300" : "border-slate-200 bg-slate-50 text-slate-600"}`}>
                Seat and coach details can be submitted inside <strong>Quick Complaint</strong> on the passenger dashboard.
              </p>
            ) : null}
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={handleBack}
              className={`flex-1 rounded-xl border py-2 text-sm font-medium transition ${isDark ? "border-slate-600 text-slate-200 hover:bg-slate-700" : "border-slate-200 text-slate-900 hover:bg-slate-50"}`}
            >
              Back
            </button>
            <button
              onClick={handleSignIn}
              className={`flex-1 rounded-xl py-2 text-white font-medium transition ${isDark ? "bg-violet-600 hover:bg-violet-700" : "bg-indigo-600 hover:bg-indigo-700"}`}
            >
              Sign In
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
