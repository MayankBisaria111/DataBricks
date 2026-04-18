import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

type AlertItem = {
  id: string;
  message: string;
  severity: "info" | "warning" | "critical";
  time: string;
};

type AlertsPanelProps = {
  alerts: AlertItem[];
};

function alertTone(severity: AlertItem["severity"]) {
  if (severity === "critical") return "border-rose-100 bg-rose-50 text-rose-700";
  if (severity === "warning") return "border-amber-100 bg-amber-50 text-amber-700";
  return "border-indigo-100 bg-indigo-50 text-indigo-700";
}

export default function AlertsPanel({ alerts }: AlertsPanelProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="rounded-3xl border border-white/80 bg-white/90 p-5 shadow-[0_12px_36px_rgba(15,23,42,0.1)] backdrop-blur"
    >
      <h3 className="mb-4 text-base font-semibold text-slate-900">Operational Alerts</h3>
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div key={alert.id} className={`rounded-2xl border px-3 py-2 ${alertTone(alert.severity)}`}>
            <p className="inline-flex items-start gap-2 text-sm font-medium">
              <AlertTriangle size={14} className="mt-0.5" />
              {alert.message}
            </p>
            <p className="mt-1 pl-6 text-xs opacity-80">{alert.time}</p>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
