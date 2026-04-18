import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useDarkMode } from "../../contexts/DarkModeContext";

type KpiTileProps = {
  label: string;
  value: string;
  icon: LucideIcon;
  tone: "amber" | "emerald" | "indigo";
  hint: string;
};

export default function KpiTile({ label, value, icon: Icon, tone, hint }: KpiTileProps) {
  const { isDark } = useDarkMode();

  const darkModeToneClasses = {
    amber: "bg-amber-950 border-amber-800 text-amber-200",
    emerald: "bg-emerald-950 border-emerald-800 text-emerald-200",
    indigo: "bg-indigo-950 border-indigo-800 text-indigo-200",
  };

  const lightModeToneClasses = {
    amber: "bg-amber-50 border-amber-200 text-amber-700",
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-700",
    indigo: "bg-indigo-50 border-indigo-200 text-indigo-700",
  };

  const toneClasses = isDark ? darkModeToneClasses : lightModeToneClasses;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={`rounded-2xl border p-4 transition-colors duration-300 ${toneClasses[tone]}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${isDark ? "opacity-80" : "opacity-80"}`}>{label}</p>
          <p className={`text-2xl font-bold ${isDark ? "" : ""}`}>{value}</p>
          <p className={`text-xs ${isDark ? "opacity-60" : "opacity-60"} mt-1`}>{hint}</p>
        </div>
        <Icon className="h-8 w-8 opacity-70" />
      </div>
    </motion.div>
  );
}