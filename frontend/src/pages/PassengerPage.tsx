import { motion } from "framer-motion";
import { ChangeEvent, useState } from "react";
import { AlarmClockCheck, CircleAlert, Cloud, CloudFog, Clock, Search, Timer, Train, TrendingUp } from "lucide-react";
import { KpiTile } from "../components/dashboard";
import RailMap from "../components/map/RailMap";
import { useDarkMode } from "../contexts/DarkModeContext";

const kpis = [
  { label: "Avg delay today", value: "12 min", icon: Timer, tone: "amber" as const, hint: "+2 min vs yesterday" },
  { label: "Trains on time", value: "82%", icon: AlarmClockCheck, tone: "emerald" as const, hint: "Healthy network performance" },
  { label: "Delayed trains", value: "27", icon: CircleAlert, tone: "indigo" as const, hint: "Across current active routes" },
];

const stations = [
  { code: "DEL", name: "Delhi Central" },
  { code: "BOM", name: "Mumbai Central" },
  { code: "CHN", name: "Chennai Central" },
  { code: "BLR", name: "Bengaluru City" },
  { code: "KOL", name: "Kolkata" },
  { code: "HYD", name: "Hyderabad" },
  { code: "JAI", name: "Jaipur" },
  { code: "LCK", name: "Lucknow" },
];

type Station = {
  name: string;
  code: string;
  scheduledTime: string;
  actualTime?: string;
  isCurrentStop?: boolean;
};

type LiveTrain = {
  number: string;
  name: string;
  currentStation: string;
  nextStation: string;
  departedAt: string;
  expectedArrival: string;
  actualDelay: number;
  currentDelay: number;
  stations: Station[];
  status: "On Time" | "Delayed" | "Critical";
};

const trainTracking: Record<string, LiveTrain> = {
  "12001": {
    number: "12001",
    name: "Rajdhani Express",
    currentStation: "Delhi Central",
    nextStation: "Agra Cantonment",
    departedAt: "06:45 AM",
    expectedArrival: "09:15 AM",
    actualDelay: 8,
    currentDelay: 12,
    status: "Delayed",
    stations: [
      { name: "Delhi Central", code: "DEL", scheduledTime: "06:30 AM", actualTime: "06:45 AM", isCurrentStop: true },
      { name: "Agra Cantonment", code: "AGC", scheduledTime: "09:00 AM", actualTime: "" },
      { name: "Gwalior Junction", code: "GWL", scheduledTime: "11:30 AM", actualTime: "" },
      { name: "Jhansi Junction", code: "JHS", scheduledTime: "01:00 PM", actualTime: "" },
    ],
  },
  "12012": {
    number: "12012",
    name: "Shatabdi Express",
    currentStation: "Mumbai Central",
    nextStation: "Pune Junction",
    departedAt: "07:15 AM",
    expectedArrival: "10:45 AM",
    actualDelay: 0,
    currentDelay: 0,
    status: "On Time",
    stations: [
      { name: "Mumbai Central", code: "BCT", scheduledTime: "07:00 AM", actualTime: "07:15 AM", isCurrentStop: true },
      { name: "Pune Junction", code: "PUNE", scheduledTime: "10:30 AM", actualTime: "" },
      { name: "Indore", code: "INDB", scheduledTime: "02:00 PM", actualTime: "" },
      { name: "Bhopal Junction", code: "BPL", scheduledTime: "05:30 PM", actualTime: "" },
    ],
  },
  "12657": {
    number: "12657",
    name: "Mysore Express",
    currentStation: "Chennai Central",
    nextStation: "Krishnapatnam Port",
    departedAt: "08:20 AM",
    expectedArrival: "12:30 PM",
    actualDelay: 22,
    currentDelay: 18,
    status: "Delayed",
    stations: [
      { name: "Chennai Central", code: "MAS", scheduledTime: "08:00 AM", actualTime: "08:20 AM", isCurrentStop: true },
      { name: "Krishnapatnam Port", code: "KRX", scheduledTime: "12:00 PM", actualTime: "" },
      { name: "Nellore", code: "NELLR", scheduledTime: "03:00 PM", actualTime: "" },
      { name: "Tirupati", code: "TIPT", scheduledTime: "05:30 PM", actualTime: "" },
    ],
  },
  "12345": {
    number: "12345",
    name: "Intercity Express",
    currentStation: "Delhi Central",
    nextStation: "Mathura Junction",
    departedAt: "09:00 AM",
    expectedArrival: "11:15 AM",
    actualDelay: 0,
    currentDelay: 0,
    status: "On Time",
    stations: [
      { name: "Delhi Central", code: "DEL", scheduledTime: "09:00 AM", actualTime: "09:00 AM", isCurrentStop: true },
      { name: "Mathura Junction", code: "MTJ", scheduledTime: "11:00 AM", actualTime: "" },
      { name: "Agra City", code: "ACNL", scheduledTime: "12:30 PM", actualTime: "" },
      { name: "Jaipur Junction", code: "JP", scheduledTime: "05:00 PM", actualTime: "" },
    ],
  },
  "12904": {
    number: "12904",
    name: "Golden Temple Mail",
    currentStation: "Lucknow Charbagh",
    nextStation: "Kanpur Central",
    departedAt: "05:30 AM",
    expectedArrival: "08:15 AM",
    actualDelay: 41,
    currentDelay: 38,
    status: "Critical",
    stations: [
      { name: "Lucknow Charbagh", code: "LKO", scheduledTime: "05:30 AM", actualTime: "06:08 AM", isCurrentStop: true },
      { name: "Kanpur Central", code: "CNB", scheduledTime: "07:45 AM", actualTime: "" },
      { name: "Ghaziabad", code: "GZB", scheduledTime: "09:30 AM", actualTime: "" },
      { name: "Delhi Junction", code: "DLI", scheduledTime: "11:15 AM", actualTime: "" },
    ],
  },
};

const recentJourneys = [
  { id: "jn1", route: "Indore -> Delhi", train: "12345", status: "Delayed by 18 min" },
  { id: "jn2", route: "Bhopal -> Jaipur", train: "12012", status: "On time" },
  { id: "jn3", route: "Pune -> Mumbai", train: "12904", status: "Delayed by 8 min" },
];

type PredictionResult = {
  trainNumber: string;
  stationCode: string;
  predictedDelay: number;
  confidence: number;
  weatherImpact: "Low" | "Moderate" | "High";
};

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const hours = ["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"];

export default function PassengerPage() {
  const [form, setForm] = useState({ source: "", destination: "", date: "" });
  const [selectedTrainForTracking, setSelectedTrainForTracking] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<string[] | null>(null);
  const [predictionForm, setPredictionForm] = useState({ trainNumber: "", station: "", date: "", month: "", hour: "" });
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const { isDark } = useDarkMode();

  const handleQuickSearch = () => {
    if (form.source && form.destination) {
      // Show trains from trainTracking that match the route
      const matchingTrains = Object.keys(trainTracking).slice(0, 3); // Show first 3 trains
      setSearchResults(matchingTrains);
    }
  };

  const handlePredictionChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setPredictionForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePredict = () => {
    if (predictionForm.trainNumber && predictionForm.station && predictionForm.date && predictionForm.month && predictionForm.hour) {
      const predictedDelay = Math.floor(Math.random() * 25) + 5;
      const confidence = Math.floor(Math.random() * 30) + 70;
      setPredictionResult({
        trainNumber: predictionForm.trainNumber,
        stationCode: predictionForm.station,
        predictedDelay,
        confidence,
        weatherImpact: ["Low", "Moderate", "High"][Math.floor(Math.random() * 3)] as "Low" | "Moderate" | "High",
      });
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="space-y-6">
      <div className={`rounded-2xl border p-5 ${isDark ? "border-slate-700 bg-slate-800/70" : "border-slate-200 bg-white/80"}`}>
        <h1 className={`text-2xl font-semibold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>Dashboard</h1>
        <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>Real-time network orchestration and AI-driven ETA confidence.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {kpis.map((kpi) => <KpiTile key={kpi.label} {...kpi} />)}
      </div>

      <div className={`rounded-3xl border p-6 shadow-[0_12px_40px_-10px_rgba(19,27,46,0.08)] ${isDark ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-white/95"}`}>
        <h2 className={`mb-6 inline-flex items-center gap-2 text-lg font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
          <TrendingUp size={20} /> Delay Predictor
        </h2>
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          <div>
            <label className={`text-sm font-medium block mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>Train Number</label>
            <input type="text" name="trainNumber" placeholder="e.g., 12001" value={predictionForm.trainNumber} onChange={handlePredictionChange} className={`w-full rounded-xl border px-3 py-2 text-sm outline-none transition focus:ring-4 ${isDark ? "border-slate-600 bg-slate-700 text-white focus:ring-indigo-900/30" : "border-slate-300 bg-white focus:ring-indigo-100"}`} />
          </div>
          <div>
            <label className={`text-sm font-medium block mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>Station</label>
            <select name="station" value={predictionForm.station} onChange={handlePredictionChange} className={`w-full rounded-xl border px-3 py-2 text-sm outline-none transition focus:ring-4 appearance-none ${isDark ? "border-slate-600 bg-slate-700 text-white focus:ring-indigo-900/30" : "border-slate-300 bg-white focus:ring-indigo-100"}`}>
              <option value="">Select station...</option>
              {stations.map((s) => <option key={s.code} value={s.code}>{s.code}</option>)}
            </select>
          </div>
          <div>
            <label className={`text-sm font-medium block mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>Date</label>
            <input type="date" name="date" value={predictionForm.date} onChange={handlePredictionChange} className={`w-full rounded-xl border px-3 py-2 text-sm outline-none transition focus:ring-4 ${isDark ? "border-slate-600 bg-slate-700 text-white focus:ring-indigo-900/30" : "border-slate-300 bg-white focus:ring-indigo-100"}`} />
          </div>
          <div>
            <label className={`text-sm font-medium block mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>Month</label>
            <select name="month" value={predictionForm.month} onChange={handlePredictionChange} className={`w-full rounded-xl border px-3 py-2 text-sm outline-none transition focus:ring-4 appearance-none ${isDark ? "border-slate-600 bg-slate-700 text-white focus:ring-indigo-900/30" : "border-slate-300 bg-white focus:ring-indigo-100"}`}>
              <option value="">Select month...</option>
              {months.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className={`text-sm font-medium block mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>Hour</label>
            <select name="hour" value={predictionForm.hour} onChange={handlePredictionChange} className={`w-full rounded-xl border px-3 py-2 text-sm outline-none transition focus:ring-4 appearance-none ${isDark ? "border-slate-600 bg-slate-700 text-white focus:ring-indigo-900/30" : "border-slate-300 bg-white focus:ring-indigo-100"}`}>
              <option value="">Select hour...</option>
              {hours.map((h) => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>
          <div className="flex items-end">
            <button onClick={handlePredict} disabled={!predictionForm.trainNumber || !predictionForm.station || !predictionForm.date || !predictionForm.month || !predictionForm.hour} className={`w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${predictionForm.trainNumber && predictionForm.station && predictionForm.date && predictionForm.month && predictionForm.hour ? "bg-indigo-600 hover:bg-indigo-700 text-white" : isDark ? "bg-slate-700 text-slate-500 cursor-not-allowed" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}>
              <Clock size={14} /> Predict
            </button>
          </div>
        </div>
      </div>

      {predictionResult && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`rounded-3xl border p-6 shadow-[0_12px_40px_-10px_rgba(19,27,46,0.08)] ${isDark ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-white/95"}`}>
          <h2 className={`mb-4 text-lg font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>Prediction Result</h2>
          <div className="grid gap-4 md:grid-cols-4">
            <div className={`rounded-2xl border p-4 ${isDark ? "border-slate-700 bg-slate-700/50" : "border-slate-200 bg-slate-100"}`}>
              <p className={`text-xs font-semibold uppercase mb-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>Train Number</p>
              <p className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{predictionResult.trainNumber}</p>
            </div>
            <div className={`rounded-2xl border p-4 ${isDark ? "border-slate-700 bg-slate-700/50" : "border-slate-200 bg-slate-100"}`}>
              <p className={`text-xs font-semibold uppercase mb-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>Station</p>
              <p className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{predictionResult.stationCode}</p>
            </div>
            <div className={`rounded-2xl border p-4 ${isDark ? "border-slate-700 bg-slate-700/50" : "border-slate-200 bg-slate-100"}`}>
              <p className={`text-xs font-semibold uppercase mb-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>Predicted Delay</p>
              <p className={`text-lg font-bold text-amber-600`}>{predictionResult.predictedDelay} min</p>
            </div>
            <div className={`rounded-2xl border p-4 ${isDark ? "border-slate-700 bg-slate-700/50" : "border-slate-200 bg-slate-100"}`}>
              <p className={`text-xs font-semibold uppercase mb-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>Confidence</p>
              <p className={`text-lg font-bold text-indigo-600`}>{predictionResult.confidence}%</p>
            </div>
          </div>
          <div className={`rounded-2xl border p-4 mt-4 ${isDark ? "border-slate-700 bg-slate-700/50" : "border-slate-200 bg-slate-100"}`}>
            <p className={`inline-flex items-center gap-2 text-sm font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
              <Cloud size={16} /> Weather Impact
            </p>
            <p className={`text-lg font-bold mt-2 ${predictionResult.weatherImpact === "High" ? "text-red-600" : predictionResult.weatherImpact === "Moderate" ? "text-amber-600" : "text-emerald-600"}`}>
              {predictionResult.weatherImpact}
            </p>
          </div>
        </motion.div>
      )}

      <div className="grid gap-4 xl:grid-cols-3">
        <div className={`rounded-3xl border p-5 shadow-[0_12px_40px_-10px_rgba(19,27,46,0.08)] ${isDark ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-white/95"}`}>
          <h2 className={`mb-4 inline-flex items-center gap-2 text-base font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
            <Search size={16} /> Quick Search
          </h2>
          <div className="space-y-3">
            <select name="source" value={form.source} onChange={handleChange} className={`w-full rounded-xl border px-3 py-2 text-sm outline-none transition focus:ring-4 appearance-none ${isDark ? "border-slate-600 bg-slate-700 text-white focus:ring-indigo-900/30" : "border-slate-300 bg-white focus:ring-indigo-100"}`}>
              <option value="">From station...</option>
              {stations.map((s) => <option key={s.code} value={s.code}>{s.name}</option>)}
            </select>
            <select name="destination" value={form.destination} onChange={handleChange} className={`w-full rounded-xl border px-3 py-2 text-sm outline-none transition focus:ring-4 appearance-none ${isDark ? "border-slate-600 bg-slate-700 text-white focus:ring-indigo-900/30" : "border-slate-300 bg-white focus:ring-indigo-100"}`}>
              <option value="">To station...</option>
              {stations.map((s) => <option key={s.code} value={s.code}>{s.name}</option>)}
            </select>
            <input type="date" name="date" value={form.date} onChange={handleChange} className={`w-full rounded-xl border px-3 py-2 text-sm outline-none transition focus:ring-4 ${isDark ? "border-slate-600 bg-slate-700 text-white focus:ring-indigo-900/30" : "border-slate-300 bg-white focus:ring-indigo-100"}`} />
            <button onClick={handleQuickSearch} disabled={!form.source || !form.destination} className={`w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${form.source && form.destination ? "bg-indigo-600 hover:bg-indigo-700 text-white" : isDark ? "bg-slate-700 text-slate-500 cursor-not-allowed" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}>
              <Train size={14} /> Search Routes
            </button>
          </div>
        </div>

        <div className={`rounded-3xl border p-5 shadow-[0_12px_40px_-10px_rgba(19,27,46,0.08)] ${isDark ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-white/95"}`}>
          <h2 className={`mb-4 text-base font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>Recent Journeys</h2>
          <div className="space-y-2">
            {recentJourneys.map((journey) => (
              <button key={journey.id} onClick={() => setSelectedTrainForTracking(journey.train)} className={`w-full rounded-xl border px-3 py-2 text-left transition ${selectedTrainForTracking === journey.train ? isDark ? "border-indigo-600 bg-indigo-600/20" : "border-indigo-400 bg-indigo-100" : isDark ? "border-slate-700 bg-slate-900/40 hover:bg-slate-800/50" : "border-slate-200 bg-slate-50/80 hover:bg-slate-100"}`}>
                <p className={`text-sm font-medium ${isDark ? "text-slate-100" : "text-slate-800"}`}>{journey.route}</p>
                <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>Train #{journey.train} - {journey.status}</p>
              </button>
            ))}
          </div>
        </div>

        <div className={`rounded-3xl border p-5 shadow-[0_12px_40px_-10px_rgba(19,27,46,0.08)] ${isDark ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-white/95"}`}>
          <h2 className={`mb-3 inline-flex items-center gap-2 text-base font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
            <CloudFog size={16} /> Weather Impact
          </h2>
          <p className={`text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>Moderate fog expected on the north corridor between 19:00 - 22:00. Potential impact: 8-15 min delay.</p>
        </div>
      </div>

      {selectedTrainForTracking && trainTracking[selectedTrainForTracking] && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`rounded-3xl border p-6 shadow-[0_12px_40px_-10px_rgba(19,27,46,0.08)] ${isDark ? "border-slate-700 bg-slate-800/50" : "border-slate-200 bg-white/95"}`}>
          <h2 className={`mb-6 text-2xl font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>Live Train Tracking - {trainTracking[selectedTrainForTracking].name}</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 mb-6">
            <div className={`rounded-2xl border p-4 ${isDark ? "border-slate-700 bg-slate-700/50" : "border-slate-200 bg-slate-100"}`}>
              <p className={`text-xs font-semibold uppercase mb-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}>Currently At</p>
              <p className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{trainTracking[selectedTrainForTracking].currentStation}</p>
            </div>
            <div className={`rounded-2xl border p-4 ${isDark ? "border-slate-700 bg-slate-700/50" : "border-slate-200 bg-slate-100"}`}>
              <p className={`text-xs font-semibold uppercase mb-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}>Next Stop</p>
              <p className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{trainTracking[selectedTrainForTracking].nextStation}</p>
            </div>
            <div className={`rounded-2xl border p-4 ${isDark ? "border-slate-700 bg-slate-700/50" : "border-slate-200 bg-slate-100"}`}>
              <p className={`text-xs font-semibold uppercase mb-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}>Delay Status</p>
              <p className={`text-lg font-bold ${trainTracking[selectedTrainForTracking].status === "Critical" ? isDark ? "text-red-400" : "text-red-600" : trainTracking[selectedTrainForTracking].status === "Delayed" ? isDark ? "text-amber-400" : "text-amber-600" : isDark ? "text-emerald-400" : "text-emerald-600"}`}>{trainTracking[selectedTrainForTracking].currentDelay} min</p>
            </div>
            <div className={`rounded-2xl border p-4 ${isDark ? "border-slate-700 bg-slate-700/50" : "border-slate-200 bg-slate-100"}`}>
              <p className={`text-xs font-semibold uppercase mb-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}>Status</p>
              <p className={`text-lg font-bold ${trainTracking[selectedTrainForTracking].status === "Critical" ? "text-red-600" : trainTracking[selectedTrainForTracking].status === "Delayed" ? "text-amber-600" : "text-emerald-600"}`}>{trainTracking[selectedTrainForTracking].status}</p>
            </div>
          </div>
          <div className={`rounded-lg p-4 overflow-x-auto ${isDark ? "bg-slate-900/30" : "bg-slate-50"}`}>
            <div className="flex items-center gap-2 min-w-max pb-2">
              {trainTracking[selectedTrainForTracking].stations.map((station, idx) => (
                <div key={idx} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${station.isCurrentStop ? isDark ? "bg-indigo-500 border-indigo-400" : "bg-indigo-600 border-indigo-500" : station.actualTime ? isDark ? "bg-emerald-500 border-emerald-400" : "bg-emerald-600 border-emerald-500" : isDark ? "bg-slate-600 border-slate-500" : "bg-slate-400 border-slate-300"}`}>
                      {station.isCurrentStop && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <p className={`text-xs font-semibold mt-2 whitespace-nowrap ${isDark ? "text-slate-300" : "text-slate-700"}`}>{station.code}</p>
                  </div>
                  {idx < trainTracking[selectedTrainForTracking].stations.length - 1 && <div className={`w-8 h-0.5 mx-1 ${station.isCurrentStop || station.actualTime ? isDark ? "bg-emerald-500" : "bg-emerald-600" : isDark ? "bg-slate-600" : "bg-slate-300"}`} />}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 space-y-2">
            <h3 className={`text-sm font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>Journey Schedule</h3>
            <div className={`rounded-lg p-3 space-y-2 ${isDark ? "bg-slate-900/30" : "bg-slate-50"}`}>
              {trainTracking[selectedTrainForTracking].stations.map((station, idx) => (
                <div key={idx} className={`flex items-center justify-between text-sm p-2 rounded ${station.isCurrentStop ? isDark ? "bg-indigo-900/30 border border-indigo-700" : "bg-indigo-50 border border-indigo-200" : ""}`}>
                  <div>
                    <p className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>{station.name}</p>
                    <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>{station.code}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs font-semibold ${isDark ? "text-slate-300" : "text-slate-700"}`}>Scheduled: {station.scheduledTime}</p>
                    {station.actualTime && <p className={`text-xs ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>Actual: {station.actualTime}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {searchResults && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`rounded-3xl border p-6 shadow-[0_12px_40px_-10px_rgba(19,27,46,0.08)] ${isDark ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-white/95"}`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-2xl font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>Available Trains - {form.source} to {form.destination}</h2>
            <button onClick={() => setSearchResults(null)} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${isDark ? "bg-slate-700 hover:bg-slate-600 text-slate-200" : "bg-slate-200 hover:bg-slate-300 text-slate-800"}`}>
              Clear
            </button>
          </div>
          
          <div className="grid gap-6 lg:grid-cols-2">
            <div className={`rounded-2xl border p-4 overflow-hidden ${isDark ? "border-slate-700 bg-slate-900/40" : "border-slate-200 bg-slate-50"}`}>
              <h3 className={`text-sm font-semibold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>Routes Available</h3>
              <div className="space-y-2">
                {searchResults.map((trainNum) => {
                  const train = trainTracking[trainNum];
                  return (
                    <button key={trainNum} onClick={() => setSelectedTrainForTracking(trainNum)} className={`w-full rounded-xl border p-3 text-left transition ${selectedTrainForTracking === trainNum ? isDark ? "border-indigo-600 bg-indigo-600/20" : "border-indigo-400 bg-indigo-100" : isDark ? "border-slate-700 bg-slate-900/40 hover:bg-slate-800/50" : "border-slate-200 bg-slate-50/80 hover:bg-slate-100"}`}>
                      <p className={`text-sm font-semibold ${isDark ? "text-slate-100" : "text-slate-800"}`}>
                        Train #{train.number} - {train.name}
                      </p>
                      <p className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                        Departs: {train.departedAt} | Expected: {train.expectedArrival}
                      </p>
                      <p className={`text-xs mt-1 font-medium ${train.status === "Critical" ? "text-red-600" : train.status === "Delayed" ? "text-amber-600" : "text-emerald-600"}`}>
                        {train.status} {train.currentDelay > 0 ? `(+${train.currentDelay} min)` : ""}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className={`rounded-2xl border overflow-hidden ${isDark ? "border-slate-700" : "border-slate-200"}`} style={{ height: "400px" }}>
              <RailMap />
            </div>
          </div>

          {selectedTrainForTracking && trainTracking[selectedTrainForTracking] && (
            <div className={`rounded-2xl border p-4 mt-6 ${isDark ? "border-slate-700 bg-slate-900/40" : "border-slate-200 bg-slate-50"}`}>
              <h3 className={`text-sm font-semibold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>Journey Details - {trainTracking[selectedTrainForTracking].name}</h3>
              <div className={`rounded-lg p-3 space-y-2 ${isDark ? "bg-slate-900/30" : "bg-white"}`}>
                {trainTracking[selectedTrainForTracking].stations.map((station, idx) => (
                  <div key={idx} className={`flex items-center justify-between text-sm p-2 rounded ${station.isCurrentStop ? isDark ? "bg-indigo-900/30 border border-indigo-700" : "bg-indigo-50 border border-indigo-200" : ""}`}>
                    <div>
                      <p className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>{station.name}</p>
                      <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>{station.code}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs font-semibold ${isDark ? "text-slate-300" : "text-slate-700"}`}>Scheduled: {station.scheduledTime}</p>
                      {station.actualTime && <p className={`text-xs ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>Actual: {station.actualTime}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
