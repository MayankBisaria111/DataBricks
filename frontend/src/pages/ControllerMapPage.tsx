import { useState } from "react";
import { motion } from "framer-motion";
import { Layers } from "lucide-react";
import RailMap from "../components/map/RailMap";
import { useDarkMode } from "../contexts/DarkModeContext";
import { controllerStations } from "./controllerData";

export default function ControllerMapPage() {
  const { isDark } = useDarkMode();
  const [selectedStation, setSelectedStation] = useState("Delhi Central");

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="space-y-6">
      <div>
        <h1 className={`text-3xl font-semibold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>Controller Map</h1>
        <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>Monitor all trains approaching a selected station.</p>
      </div>
      <div className={`rounded-3xl border p-5 shadow-[0_12px_40px_-10px_rgba(19,27,46,0.08)] ${isDark ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-white/95"}`}>
        <label className={`mb-2 inline-flex items-center gap-2 text-sm font-semibold ${isDark ? "text-slate-200" : "text-slate-700"}`}>
          <Layers size={14} />
          Station
        </label>
        <select value={selectedStation} onChange={(e) => setSelectedStation(e.target.value)} className={`w-full rounded-xl border px-3 py-2 text-sm ${isDark ? "border-slate-600 bg-slate-700 text-white" : "border-slate-300 bg-white"}`}>
          {controllerStations.map((station) => (
            <option key={station} value={station}>
              {station}
            </option>
          ))}
        </select>
      </div>
      <RailMap mode="controller" filterStation={selectedStation} />
    </motion.div>
  );
}
