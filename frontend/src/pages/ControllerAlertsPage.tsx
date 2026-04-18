import { motion } from "framer-motion";
import { AlertsPanel, DelayChart } from "../components/dashboard";
import { useDarkMode } from "../contexts/DarkModeContext";
import { controllerAlerts } from "./controllerData";

const trend = [
  { time: "06:00", delay: 4 },
  { time: "09:00", delay: 9 },
  { time: "12:00", delay: 13 },
  { time: "15:00", delay: 10 },
  { time: "18:00", delay: 15 },
];

export default function ControllerAlertsPage() {
  const { isDark } = useDarkMode();

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="space-y-6">
      <div>
        <h1 className={`text-3xl font-semibold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>Controller Alerts</h1>
        <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>View alert feed and delay trend insights.</p>
      </div>
      <div className="grid gap-4 xl:grid-cols-[1fr_2fr]">
        <AlertsPanel alerts={controllerAlerts} />
        <DelayChart data={trend} />
      </div>
    </motion.div>
  );
}
