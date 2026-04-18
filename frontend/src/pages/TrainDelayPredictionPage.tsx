import { motion } from "framer-motion";
import { useState } from "react";
import { Cloud, Clock, TrendingUp } from "lucide-react";
import RailMap from "../components/map/RailMap";
import { useDarkMode } from "../contexts/DarkModeContext";

type PredictionResult = {
  trainNumber: string;
  stationCode: string;
  predictedDelay: number;
  confidence: number;
  weatherImpact: "Low" | "Moderate" | "High";
};

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

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const hours = ["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"];

const trainData: Record<string, LiveTrain> = {
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
      { name: "Bina Junction", code: "BINA", scheduledTime: "02:30 PM", actualTime: "" },
      { name: "Itarsi Junction", code: "ITR", scheduledTime: "04:00 PM", actualTime: "" },
      { name: "Kolkata", code: "KOL", scheduledTime: "08:30 PM", actualTime: "" },
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
      { name: "Bengaluru City", code: "SBC", scheduledTime: "08:30 PM", actualTime: "" },
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
      { name: "New Delhi", code: "NDLS", scheduledTime: "12:00 PM", actualTime: "" },
      { name: "Amritsar Junction", code: "ASR", scheduledTime: "10:30 PM", actualTime: "" },
    ],
  },
};

export default function TrainDelayPredictionPage() {
  const { isDark } = useDarkMode();
  const [formData, setFormData] = useState({
    trainNumber: "",
    stationCode: "",
    day: "Monday",
    month: "April",
    hour: "08:00 AM",
  });
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);

  function handleInputChange(e: any) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleRunSimulation() {
    if (!formData.trainNumber || !formData.stationCode) {
      alert("Please fill in all fields");
      return;
    }
    setLoading(true);
    window.setTimeout(() => {
      const predictedDelay = Math.floor(Math.random() * 25) + 5;
      const weatherOptions: ("Low" | "Moderate" | "High")[] = ["Low", "Moderate", "High"];
      setPrediction({
        trainNumber: formData.trainNumber,
        stationCode: formData.stationCode,
        predictedDelay,
        confidence: 80 + Math.random() * 15,
        weatherImpact: weatherOptions[Math.floor(Math.random() * 3)],
      });
      setLoading(false);
    }, 800);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      <div>
        <h2 className={`text-4xl font-semibold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
          Delay Predictor
        </h2>
        <p className={`text-sm mt-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
          Real-time network orchestration and AI-driven ETA confidence.
        </p>
      </div>

      {/* TOP ROW: Journey Parameters (Left) + Map (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: Journey Parameters Form */}
        <div className="lg:col-span-4">
          <motion.div
            whileHover={{ y: -2 }}
            className={`rounded-2xl p-6 shadow-[0_12px_40px_-10px_rgba(19,27,46,0.08)] ${isDark ? "bg-slate-800 border border-slate-700" : "bg-white border border-slate-200"}`}
          >
            <h3 className={`text-lg font-semibold mb-5 ${isDark ? "text-white" : "text-slate-900"}`}>
              Journey Parameters
            </h3>
            <form className="space-y-4">
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? "text-slate-400" : "text-slate-700"}`}>
                  Train Number
                </label>
                <select
                  name="trainNumber"
                  value={formData.trainNumber}
                  onChange={handleInputChange}
                  className={`w-full rounded-lg px-4 py-3 text-sm outline-none transition-all appearance-none ${isDark ? "bg-slate-700 border border-slate-600 text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30" : "bg-slate-50 border border-slate-300 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"}`}
                >
                  <option value="">Select a train...</option>
                  <option value="12001">12001 - Rajdhani Express</option>
                  <option value="12012">12012 - Shatabdi Express</option>
                  <option value="12657">12657 - Mysore Express</option>
                  <option value="12345">12345 - Intercity Express</option>
                  <option value="12904">12904 - Golden Temple Mail</option>
                </select>
              </div>

              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? "text-slate-400" : "text-slate-700"}`}>
                  Station Code
                </label>
                <input
                  type="text"
                  name="stationCode"
                  value={formData.stationCode}
                  onChange={handleInputChange}
                  placeholder="e.g. LDN-STP"
                  className={`w-full rounded-lg px-4 py-3 text-sm outline-none transition-all ${isDark ? "bg-slate-700 border border-slate-600 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30" : "bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? "text-slate-400" : "text-slate-700"}`}>
                    Day
                  </label>
                  <select
                    name="day"
                    value={formData.day}
                    onChange={handleInputChange}
                    className={`w-full rounded-lg px-4 py-3 text-sm outline-none transition-all appearance-none ${isDark ? "bg-slate-700 border border-slate-600 text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30" : "bg-slate-50 border border-slate-300 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"}`}
                  >
                    {days.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? "text-slate-400" : "text-slate-700"}`}>
                    Month
                  </label>
                  <select
                    name="month"
                    value={formData.month}
                    onChange={handleInputChange}
                    className={`w-full rounded-lg px-4 py-3 text-sm outline-none transition-all appearance-none ${isDark ? "bg-slate-700 border border-slate-600 text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30" : "bg-slate-50 border border-slate-300 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"}`}
                  >
                    {months.map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? "text-slate-400" : "text-slate-700"}`}>
                  Hour of Departure
                </label>
                <select
                  name="hour"
                  value={formData.hour}
                  onChange={handleInputChange}
                  className={`w-full rounded-lg px-4 py-3 text-sm outline-none transition-all appearance-none ${isDark ? "bg-slate-700 border border-slate-600 text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30" : "bg-slate-50 border border-slate-300 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"}`}
                >
                  {hours.map((hour) => (
                    <option key={hour} value={hour}>
                      {hour}
                    </option>
                  ))}
                </select>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleRunSimulation}
                disabled={loading}
                type="button"
                className={`w-full py-3.5 mt-2 rounded-xl font-semibold text-sm transition-all ${isDark ? "bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 text-white" : "bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white"}`}
              >
                {loading ? "Running..." : "Run Simulation"}
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* RIGHT: Map */}
        <div className="lg:col-span-8">
          <div className={`rounded-2xl flex-1 relative overflow-hidden shadow-[0_12px_40px_-10px_rgba(19,27,46,0.08)] min-h-[400px] ${isDark ? "bg-slate-800 border border-slate-700" : "bg-white border border-slate-200"}`}>
            {formData.trainNumber ? (
              <RailMap mode="passenger" filterTrainNumber={formData.trainNumber} compact />
            ) : (
              <div className={`flex items-center justify-center h-full ${isDark ? "bg-slate-900" : "bg-slate-50"}`}>
                <div className="text-center">
                  <TrendingUp size={48} className={isDark ? "text-slate-600 mx-auto mb-3" : "text-slate-400 mx-auto mb-3"} />
                  <p className={`${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    Select a train to view its route map
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* BOTTOM ROW: Predicted Delay (Left) + Live Tracking Journey (Right) */}
      {prediction && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT: Predicted Delay Card */}
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl p-6 shadow-[0_12px_40px_-10px_rgba(19,27,46,0.08)] bg-gradient-to-br relative overflow-hidden ${isDark ? "from-slate-800 to-slate-800 border border-slate-700" : "from-white to-slate-50 border border-slate-200"}`}
            >
              <div className={`absolute top-0 right-0 p-4 opacity-10 ${isDark ? "text-slate-600" : "text-slate-300"}`}>
                <Clock size={100} />
              </div>

              <h3 className={`text-lg font-semibold mb-2 relative z-10 ${isDark ? "text-white" : "text-slate-900"}`}>
                Predicted Delay
              </h3>
              <div className="flex items-baseline gap-2 mb-6 relative z-10">
                <span className={`text-5xl font-bold leading-none ${isDark ? "text-indigo-400" : "text-indigo-600"}`}>
                  {prediction.predictedDelay}
                </span>
                <span className={`text-lg ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  mins
                </span>
              </div>

              <div className="space-y-4 relative z-10">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-xs font-semibold uppercase ${isDark ? "text-slate-400" : "text-slate-700"}`}>
                      Model Confidence
                    </span>
                    <span className={`text-xs font-semibold ${isDark ? "text-indigo-400" : "text-indigo-600"}`}>
                      {prediction.confidence.toFixed(0)}%
                    </span>
                  </div>
                  <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? "bg-slate-700" : "bg-slate-200"}`}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${prediction.confidence}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full rounded-full ${isDark ? "bg-indigo-500" : "bg-indigo-600"}`}
                    />
                  </div>
                </div>

                <div className={`flex items-center justify-between p-3 rounded-lg ${isDark ? "bg-slate-700/50 border border-slate-600/50" : "bg-slate-100 border border-slate-200"}`}>
                  <div className="flex items-center gap-2">
                    <Cloud size={18} className={isDark ? "text-slate-400" : "text-slate-600"} />
                    <span className={`text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                      Weather Impact
                    </span>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${prediction.weatherImpact === "High" ? isDark ? "bg-red-900/50 text-red-300" : "bg-red-100 text-red-700" : prediction.weatherImpact === "Moderate" ? isDark ? "bg-amber-900/50 text-amber-300" : "bg-amber-100 text-amber-700" : isDark ? "bg-emerald-900/50 text-emerald-300" : "bg-emerald-100 text-emerald-700"}`}>
                    {prediction.weatherImpact}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT: Live Train Tracking - Journey Visualization */}
          {trainData[prediction.trainNumber] && (
            <div className="lg:col-span-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-2xl p-6 shadow-[0_12px_40px_-10px_rgba(19,27,46,0.08)] ${isDark ? "bg-slate-800 border border-slate-700" : "bg-white border border-slate-200"}`}
              >
                <h3 className={`text-lg font-semibold mb-6 ${isDark ? "text-white" : "text-slate-900"}`}>
                  {trainData[prediction.trainNumber].name} - Live Journey
                </h3>

                {/* Key Info Cards */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className={`rounded-lg p-3 ${isDark ? "bg-slate-700/50" : "bg-slate-100"}`}>
                    <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>Current Station</p>
                    <p className={`font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                      {trainData[prediction.trainNumber].currentStation}
                    </p>
                  </div>
                  <div className={`rounded-lg p-3 ${isDark ? "bg-slate-700/50" : "bg-slate-100"}`}>
                    <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>Delay</p>
                    <p className={`font-bold text-lg ${trainData[prediction.trainNumber].status === "Critical" ? isDark ? "text-red-400" : "text-red-600" : trainData[prediction.trainNumber].status === "Delayed" ? isDark ? "text-amber-400" : "text-amber-600" : isDark ? "text-emerald-400" : "text-emerald-600"}`}>
                      {trainData[prediction.trainNumber].currentDelay} min
                    </p>
                  </div>
                </div>

                {/* Journey Timeline */}
                <div className={`rounded-lg p-4 overflow-x-auto ${isDark ? "bg-slate-900/30" : "bg-slate-50"}`}>
                  <div className="flex items-center gap-2 min-w-max pb-2">
                    {trainData[prediction.trainNumber].stations.map((station, idx) => (
                      <div key={idx} className="flex items-center">
                        {/* Station Dot */}
                        <div className="flex flex-col items-center">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                            station.isCurrentStop
                              ? isDark ? "bg-indigo-500 border-indigo-400" : "bg-indigo-600 border-indigo-500"
                              : station.actualTime
                              ? isDark ? "bg-emerald-500 border-emerald-400" : "bg-emerald-600 border-emerald-500"
                              : isDark ? "bg-slate-600 border-slate-500" : "bg-slate-400 border-slate-300"
                          }`}>
                            {station.isCurrentStop && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                          <p className={`text-xs font-semibold mt-2 whitespace-nowrap ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                            {station.code}
                          </p>
                        </div>

                        {/* Connector Line */}
                        {idx < trainData[prediction.trainNumber].stations.length - 1 && (
                          <div className={`w-8 h-0.5 mx-1 ${
                            station.isCurrentStop || station.actualTime
                              ? isDark ? "bg-emerald-500" : "bg-emerald-600"
                              : isDark ? "bg-slate-600" : "bg-slate-300"
                          }`} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Station Details */}
                <div className={`mt-4 rounded-lg p-3 text-sm ${isDark ? "bg-slate-700/50" : "bg-slate-100"}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>Next Station</p>
                      <p className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                        {trainData[prediction.trainNumber].nextStation}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>Expected Arrival</p>
                      <p className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                        {trainData[prediction.trainNumber].expectedArrival}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
