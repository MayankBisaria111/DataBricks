import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { AlertTriangle, Search, Timer, Train, Users } from "lucide-react";
import { KpiTile, TrainTable, AlertsPanel, DelayChart } from "../components/dashboard";
import RailMap from "../components/map/RailMap";
import { useDarkMode } from "../contexts/DarkModeContext";

const stations = ["Delhi Central", "Mumbai Central", "Chennai Central", "Kolkata Central", "Bangalore City", "Hyderabad", "Pune", "Jaipur", "Lucknow", "Ahmedabad"];

const trains = [
  { number: "12001", name: "Rajdhani Express", currentLocation: "Near Delhi Central", delayMins: 3, status: "On Time" as const, station: "Delhi Central", passengers: 420, confidence: 95 },
  { number: "12012", name: "Shatabdi Express", currentLocation: "Approaching Mumbai Central", delayMins: 18, status: "Delayed" as const, station: "Mumbai Central", passengers: 310, confidence: 88 },
  { number: "12657", name: "Mysore Express", currentLocation: "Near Chennai Central", delayMins: 22, status: "Delayed" as const, station: "Chennai Central", passengers: 278, confidence: 84 },
  { number: "12345", name: "Intercity Express", currentLocation: "Delhi - Jaipur section", delayMins: 0, status: "On Time" as const, station: "Delhi Central", passengers: 192, confidence: 97 },
  { number: "12904", name: "Golden Temple Mail", currentLocation: "Near Lucknow", delayMins: 41, status: "Critical" as const, station: "Lucknow", passengers: 506, confidence: 91 },
];

const alerts = [
  { id: "a1", message: "Train 12345 delayed by 25 mins", severity: "warning" as const, time: "2 min ago" },
  { id: "a2", message: "Heavy fog detected near Kanpur corridor", severity: "critical" as const, time: "5 min ago" },
  { id: "a3", message: "Signal restored at Jaipur junction", severity: "info" as const, time: "11 min ago" },
];

export default function ControllerPage() {
  const { isDark } = useDarkMode();
  const [selectedStation, setSelectedStation] = useState("Delhi Central");
  const [selectedTrainNumber, setSelectedTrainNumber] = useState("12001");

  const stationTrains = useMemo(() => trains.filter((train) => train.station === selectedStation), [selectedStation]);
  const delayedCount = trains.filter((train) => train.status !== "On Time").length;
  const onTimePercent = Math.round(((trains.length - delayedCount) / trains.length) * 100);
  const selectedTrain = useMemo(
    () => trains.find((train) => train.number === selectedTrainNumber) ?? stationTrains[0] ?? trains[0],
    [selectedTrainNumber, stationTrains],
  );
  const delayTrend = [
    { time: "06:00", delay: 4 },
    { time: "09:00", delay: 9 },
    { time: "12:00", delay: selectedTrain.delayMins },
    { time: "15:00", delay: Math.max(selectedTrain.delayMins - 3, 0) },
    { time: "18:00", delay: selectedTrain.delayMins + 5 },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="space-y-6">
      <div className={`rounded-3xl border p-5 shadow-[0_12px_40px_-10px_rgba(19,27,46,0.08)] ${isDark ? "border-slate-700 bg-slate-800/70" : "border-slate-200 bg-white/80"}`}>
        <h1 className={`text-3xl font-semibold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>Control Center</h1>
        <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>High-fidelity network command view for trains, alerts, map and station operations.</p>
      </div>

      <div className={`rounded-3xl border p-5 shadow-sm ${isDark ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-white/95"}`}>
        <label className={`mb-2 inline-flex items-center gap-2 text-sm font-semibold ${isDark ? "text-slate-200" : "text-slate-800"}`}>
          <Search size={14} />
          Select Station
        </label>
        <select
          value={selectedStation}
          onChange={(event) => setSelectedStation(event.target.value)}
          className={`w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-4 ${isDark ? "border-slate-600 bg-slate-700 text-white focus:ring-indigo-900/30" : "border-slate-300 bg-white focus:ring-indigo-100"}`}
        >
          {stations.map((station) => (
            <option key={station} value={station}>
              {station}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <KpiTile label="Total trains active" value={`${trains.length}`} icon={Train} tone="indigo" hint="Across monitored network" />
        <KpiTile label="Delayed trains" value={`${delayedCount}`} icon={AlertTriangle} tone="amber" hint="Includes critical services" />
        <KpiTile label="On-time percentage" value={`${onTimePercent}%`} icon={Timer} tone="emerald" hint="Computed from live mock feed" />
      </div>

      <div>
        <h2 className={`mb-2 text-lg font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>Live Train Map - {selectedStation}</h2>
        <RailMap mode="controller" filterStation={selectedStation} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <TrainTable rows={stationTrains} />
        <AlertsPanel alerts={alerts} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <DelayChart data={delayTrend} />
        <div className={`rounded-3xl border p-5 shadow-sm ${isDark ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-white/95"}`}>
          <h3 className={`mb-3 text-base font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>Train Detail Panel</h3>
          <select
            value={selectedTrainNumber}
            onChange={(event) => setSelectedTrainNumber(event.target.value)}
            className={`mb-4 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-4 ${isDark ? "border-slate-600 bg-slate-700 text-white focus:ring-indigo-900/30" : "border-slate-300 bg-white focus:ring-indigo-100"}`}
          >
            {trains.map((train) => (
              <option key={train.number} value={train.number}>
                {train.number} - {train.name}
              </option>
            ))}
          </select>
          <div className="space-y-2 text-sm">
            <p className={isDark ? "text-slate-200" : "text-slate-800"}>
              <strong>Train:</strong> {selectedTrain.name}
            </p>
            <p className={isDark ? "text-slate-200" : "text-slate-800"}>
              <strong>Location:</strong> {selectedTrain.currentLocation}
            </p>
            <p className={isDark ? "text-slate-200" : "text-slate-800"}>
              <strong>Delay:</strong> {selectedTrain.delayMins} min
            </p>
            <p className={isDark ? "text-slate-200" : "text-slate-800"}>
              <strong>Confidence:</strong> {selectedTrain.confidence}%
            </p>
            <p className={isDark ? "text-slate-200" : "text-slate-800"}>
              <strong>Passengers affected:</strong> {selectedTrain.passengers}
            </p>
          </div>
          <div className={`mt-4 rounded-2xl border px-3 py-2 text-xs ${isDark ? "border-slate-700 bg-slate-900/50 text-slate-300" : "border-slate-200 bg-slate-50 text-slate-600"}`}>
            Operational note: monitor approaching trains and prioritize platform announcements for delayed services.
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <KpiTile label="Station passengers" value={`${stationTrains.reduce((sum, train) => sum + train.passengers, 0)}`} icon={Users} tone="indigo" hint="Estimated impacted riders" />
        <KpiTile label="Critical trains" value={`${trains.filter((train) => train.status === "Critical").length}`} icon={AlertTriangle} tone="amber" hint="Immediate action required" />
        <KpiTile label="Station trains" value={`${stationTrains.length}`} icon={Train} tone="emerald" hint={`Inbound to ${selectedStation}`} />
      </div>
    </motion.div>
  );
}