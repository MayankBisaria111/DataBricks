import { motion } from "framer-motion";
import StatusBadge from "./StatusBadge";

export type TrainRow = {
  number: string;
  name: string;
  currentLocation: string;
  delayMins: number;
  status: "On Time" | "Delayed" | "Critical";
};

type TrainTableProps = {
  rows: TrainRow[];
};

export default function TrainTable({ rows }: TrainTableProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="rounded-3xl border border-white/80 bg-white/90 p-5 shadow-[0_12px_36px_rgba(15,23,42,0.1)] backdrop-blur"
    >
      <h3 className="mb-4 text-base font-semibold text-slate-900">Active Trains</h3>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="px-2 py-3 font-semibold">Train</th>
              <th className="px-2 py-3 font-semibold">Current Location</th>
              <th className="px-2 py-3 font-semibold">Delay</th>
              <th className="px-2 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.number} className="border-b border-slate-100 transition hover:bg-slate-50/70">
                <td className="px-2 py-3">
                  <p className="font-semibold text-slate-900">{row.number}</p>
                  <p className="text-xs text-slate-500">{row.name}</p>
                </td>
                <td className="px-2 py-3 text-slate-700">{row.currentLocation}</td>
                <td className={`px-2 py-3 font-semibold ${row.delayMins > 20 ? "text-rose-600" : row.delayMins > 5 ? "text-amber-600" : "text-emerald-600"}`}>
                  {row.delayMins} min
                </td>
                <td className="px-2 py-3">
                  <StatusBadge status={row.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.section>
  );
}
