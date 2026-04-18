import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MessageSquareWarning, Siren } from "lucide-react";
import { useDarkMode } from "../contexts/DarkModeContext";
import { controllerComplaints, controllerTrains } from "./controllerData";

export default function ControllerComplaintsPage() {
  const { isDark } = useDarkMode();
  const [trainNumber, setTrainNumber] = useState("all");

  const filteredComplaints = useMemo(
    () => (trainNumber === "all" ? controllerComplaints : controllerComplaints.filter((item) => item.trainNumber === trainNumber)),
    [trainNumber],
  );

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="space-y-6">
      <div>
        <h1 className={`text-3xl font-semibold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>Controller Complaints</h1>
        <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>Filter complaints by train and track resolution status.</p>
      </div>

      <div className={`rounded-3xl border p-5 shadow-[0_12px_40px_-10px_rgba(19,27,46,0.08)] ${isDark ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-white/95"}`}>
        <label className={`mb-2 block text-sm font-semibold ${isDark ? "text-slate-200" : "text-slate-700"}`}>Select Train</label>
        <select
          value={trainNumber}
          onChange={(e) => setTrainNumber(e.target.value)}
          className={`w-full rounded-xl border px-3 py-2 text-sm ${isDark ? "border-slate-600 bg-slate-700 text-white" : "border-slate-300 bg-white"}`}
        >
          <option value="all">All trains</option>
          {controllerTrains.map((train) => (
            <option key={train.number} value={train.number}>
              {train.number} - {train.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className={`rounded-2xl border p-4 ${isDark ? "border-slate-700 bg-slate-800/80" : "border-slate-200 bg-white"}`}>
          <p className={`text-xs uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>Active complaints</p>
          <p className={`mt-2 text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{filteredComplaints.length}</p>
        </div>
        <div className={`rounded-2xl border p-4 ${isDark ? "border-slate-700 bg-slate-800/80" : "border-slate-200 bg-white"}`}>
          <p className={`text-xs uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>Escalated</p>
          <p className={`mt-2 text-2xl font-bold text-rose-600`}>{filteredComplaints.filter((x) => x.status === "Escalated").length}</p>
        </div>
        <div className={`rounded-2xl border p-4 ${isDark ? "border-slate-700 bg-slate-800/80" : "border-slate-200 bg-white"}`}>
          <p className={`text-xs uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>Resolved</p>
          <p className={`mt-2 text-2xl font-bold text-emerald-600`}>{filteredComplaints.filter((x) => x.status === "Resolved").length}</p>
        </div>
      </div>

      <div className="grid gap-3">
        {filteredComplaints.map((item) => (
          <div key={item.id} className={`rounded-2xl border p-4 transition hover:-translate-y-0.5 ${isDark ? "border-slate-700 bg-slate-800/80" : "border-slate-200 bg-white"}`}>
            <p className={`inline-flex items-center gap-2 text-sm font-semibold ${isDark ? "text-slate-100" : "text-slate-900"}`}>
              {item.status === "Escalated" ? <Siren size={14} className="text-rose-500" /> : <MessageSquareWarning size={14} />}
              Train {item.trainNumber} - {item.category}
            </p>
            <p className={`mt-1 text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}>{item.message}</p>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className={isDark ? "text-slate-400" : "text-slate-500"}>{item.createdAt}</span>
              <span className={`rounded-full px-2 py-0.5 font-semibold ${
                item.status === "Resolved"
                  ? "bg-emerald-50 text-emerald-700"
                  : item.status === "Escalated"
                    ? "bg-rose-50 text-rose-700"
                    : "bg-amber-50 text-amber-700"
              }`}>
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
