import { motion } from "framer-motion";
import { useState } from "react";
import { AlertTriangle, CheckCircle, Clock, Hash, Sparkles, Zap } from "lucide-react";
import RailMap from "../components/map/RailMap";
import { useDarkMode } from "../contexts/DarkModeContext";

type PredictionResult = {
  trainNumber: string;
  trainName: string;
  currentDelay: number;
  predictedDelay: number;
  confidence: number;
  nextUpdate: string;
  factors: string[];
};

const mockTrains = [
  { id: 12001, name: "Rajdhani Express" },
  { id: 12012, name: "Shatabdi Express" },
  { id: 12657, name: "Mysore Express" },
  { id: 12345, name: "Intercity Express" },
];

export default function TrainDelayPredictionPageClean() {
  const { isDark } = useDarkMode();
  const [trainNo, setTrainNo] = useState("");
  const [stationCode, setStationCode] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState("");
  const [month, setMonth] = useState("");
  const [hour, setHour] = useState("");
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);

  function handlePredict() {
    if (!trainNo || !stationCode || !dayOfWeek || !month || !hour) return;
    setLoading(true);
    window.setTimeout(() => {
      const currentDelay = Math.floor(Math.random() * 20);
      const predictedDelay = currentDelay + Math.floor(Math.random() * 15);
      setPrediction({
        trainNumber: trainNo,
        trainName: mockTrains.find((t) => String(t.id) === trainNo)?.name || "Unknown Train",
        currentDelay,
        predictedDelay,
        confidence: 85 + Math.random() * 10,
        nextUpdate: "in 5 minutes",
        factors: ["Current traffic congestion", "Weather conditions", "Signal maintenance", "Junction crossings"],
      });
      setLoading(false);
    }, 800);
  }

  function getDelayColor(delay: number) {
    if (delay <= 5) return isDark ? "text-emerald-400" : "text-emerald-600";
    if (delay <= 15) return isDark ? "text-amber-400" : "text-amber-600";
    return isDark ? "text-red-400" : "text-red-600";
  }

  function getDelayBg(delay: number) {
    if (delay <= 5) return isDark ? "bg-emerald-950 border-emerald-800" : "bg-emerald-50 border-emerald-200";
    if (delay <= 15) return isDark ? "bg-amber-950 border-amber-800" : "bg-amber-50 border-amber-200";
    return isDark ? "bg-red-950 border-red-800" : "bg-red-50 border-red-200";
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="space-y-6">
      <div>
        <h1 className={`text-3xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Train Delay Prediction</h1>
        <p className={`mt-2 text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>Get real-time delay predictions powered by AI analytics</p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <div className={`md:col-span-2 rounded-3xl p-6 shadow-[0_12px_40px_-10px_rgba(19,27,46,0.08)] ${isDark ? "border border-slate-700 bg-slate-800" : "border border-slate-100 bg-white"}`}>
          <h2 className={`mb-4 text-xl font-semibold ${isDark ? "text-white" : ""}`}>Enter Predictor Inputs</h2>
          <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className={`mb-1 block text-xs font-semibold ${isDark ? "text-slate-300" : "text-slate-600"}`}>train_no (int)</label>
                <input type="number" value={trainNo} onChange={(e) => setTrainNo(e.target.value)} className={`w-full rounded-xl border px-4 py-3 ${isDark ? "border-slate-600 bg-slate-700 text-white" : "border-slate-300 bg-white"}`} />
              </div>
              <div>
                <label className={`mb-1 block text-xs font-semibold ${isDark ? "text-slate-300" : "text-slate-600"}`}>station_code (int)</label>
                <input type="number" value={stationCode} onChange={(e) => setStationCode(e.target.value)} className={`w-full rounded-xl border px-4 py-3 ${isDark ? "border-slate-600 bg-slate-700 text-white" : "border-slate-300 bg-white"}`} />
              </div>
              <div>
                <label className={`mb-1 block text-xs font-semibold ${isDark ? "text-slate-300" : "text-slate-600"}`}>day_of_week (int)</label>
                <input type="number" value={dayOfWeek} onChange={(e) => setDayOfWeek(e.target.value)} className={`w-full rounded-xl border px-4 py-3 ${isDark ? "border-slate-600 bg-slate-700 text-white" : "border-slate-300 bg-white"}`} />
              </div>
              <div>
                <label className={`mb-1 block text-xs font-semibold ${isDark ? "text-slate-300" : "text-slate-600"}`}>month (int)</label>
                <input type="number" value={month} onChange={(e) => setMonth(e.target.value)} className={`w-full rounded-xl border px-4 py-3 ${isDark ? "border-slate-600 bg-slate-700 text-white" : "border-slate-300 bg-white"}`} />
              </div>
              <div className="md:col-span-2">
                <label className={`mb-1 block text-xs font-semibold ${isDark ? "text-slate-300" : "text-slate-600"}`}>hour (int)</label>
                <input type="number" value={hour} onChange={(e) => setHour(e.target.value)} className={`w-full rounded-xl border px-4 py-3 ${isDark ? "border-slate-600 bg-slate-700 text-white" : "border-slate-300 bg-white"}`} />
              </div>
            </div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handlePredict} disabled={loading} className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3 font-semibold text-white hover:from-indigo-700 hover:to-violet-700 disabled:from-slate-400 disabled:to-slate-400">
              {loading ? "Analyzing..." : "Predict Delay"}
            </motion.button>
          </div>
        </div>
        <div className="space-y-4">
          <div className={`rounded-2xl border p-4 ${isDark ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-white"}`}><p className="inline-flex items-center gap-2 text-sm"><Hash size={16} /> Numeric model inputs</p></div>
          <div className={`rounded-2xl border p-4 ${isDark ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-white"}`}><p className="inline-flex items-center gap-2 text-sm"><CheckCircle size={16} /> High accuracy</p></div>
          <div className={`rounded-2xl border p-4 ${isDark ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-white"}`}><p className="inline-flex items-center gap-2 text-sm"><Sparkles size={16} /> Multi-factor analysis</p></div>
        </div>
      </div>
      {trainNo ? <RailMap mode="passenger" filterTrainNumber={trainNo} compact /> : null}
      {prediction ? (
        <div className={`rounded-3xl border p-6 ${isDark ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-white"}`}>
          <h2 className="mb-4 text-xl font-semibold">Prediction Results</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className={`rounded-xl border p-4 ${getDelayBg(prediction.currentDelay)}`}>
              <p className="text-xs">Current Delay</p>
              <p className={`text-3xl font-bold ${getDelayColor(prediction.currentDelay)}`}>{prediction.currentDelay} min</p>
            </div>
            <div className={`rounded-xl border p-4 ${getDelayBg(prediction.predictedDelay)}`}>
              <p className="text-xs">Predicted Delay</p>
              <p className={`text-3xl font-bold ${getDelayColor(prediction.predictedDelay)}`}>{prediction.predictedDelay} min</p>
            </div>
          </div>
          <p className="mt-4 text-sm">
            <strong>{prediction.trainNumber}</strong> - {prediction.trainName} | Confidence {prediction.confidence.toFixed(1)}% | Next update {prediction.nextUpdate}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {prediction.factors.map((factor) => (
              <span key={factor} className={`rounded-full px-2 py-1 text-xs ${isDark ? "bg-slate-700 text-slate-200" : "bg-slate-100 text-slate-700"}`}>
                {factor}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </motion.div>
  );
}
