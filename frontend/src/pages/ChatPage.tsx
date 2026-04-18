import { motion } from "framer-motion";
import { useDarkMode } from "../contexts/DarkModeContext";
import ChatbotPanel from "../components/chat/ChatbotPanel";

export default function ChatPage() {
  const { isDark } = useDarkMode();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="flex flex-col h-full space-y-0"
    >
      {/* Chat Header — mirrors the HTML's "Chat Header Area" */}
      <div
        className={`px-8 py-6 flex-shrink-0 z-10 border-b ${
          isDark
            ? "bg-slate-900 border-slate-700/30 shadow-[0_12px_40px_-10px_rgba(0,0,0,0.4)]"
            : "bg-white border-slate-200/40 shadow-[0_12px_40px_-10px_rgba(19,27,46,0.08)]"
        }`}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1
              className={`text-xl font-semibold tracking-tight ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              Rail Drishti Assistant
            </h1>
            <p
              className={`text-sm mt-0.5 ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Operational support and anomaly resolution.
            </p>
          </div>

          {/* Status badge — matches the HTML's "System Nominal" pill */}
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
              isDark
                ? "bg-emerald-900/30 text-emerald-400 border-emerald-700/40"
                : "bg-emerald-50 text-emerald-700 border-emerald-200/50"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            System Nominal
          </span>
        </div>
      </div>

      {/* Chat Panel — fills the remaining space */}
      <div className="flex-1 min-h-0 relative">
        <ChatbotPanel />
      </div>
    </motion.div>
  );
}
