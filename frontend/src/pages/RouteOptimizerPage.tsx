import { motion } from "framer-motion";
import { useState } from "react";
import { Calendar, MapPin, Flag, Search, Clock, ArrowRight, ChevronDown } from "lucide-react";
import { useDarkMode } from "../contexts/DarkModeContext";

type Route = {
  id: number;
  type: "fastest" | "cheapest" | "value";
  price: number;
  duration: string;
  stops: number;
  departureTime: string;
  arrivalTime: string;
  comfort: string;
  rating: number;
};

const STATIONS = [
  "New Delhi Terminal, ND1",
  "Mumbai Central, MC1",
  "Bangalore City, BC1",
  "Kolkata Railway, KR1",
  "Chennai Central, CC1",
  "Hyderabad Junction, HJ1",
  "Pune Station, PS1",
  "Ahmedabad Railway, AR1",
];

const SEAT_NUMBERS = ["12A", "12B", "12C", "12D", "12E", "13A", "13B", "13C", "13D", "14A", "14B", "14C"];

const DEPARTURE_DATES = [
  { label: "Today", value: "2026-04-18" },
  { label: "Tomorrow", value: "2026-04-19" },
  { label: "04-20-2026", value: "2026-04-20" },
  { label: "04-21-2026", value: "2026-04-21" },
  { label: "04-22-2026", value: "2026-04-22" },
  { label: "04-23-2026", value: "2026-04-23" },
  { label: "04-24-2026", value: "2026-04-24" },
];

const PRICE_RANGES = [
  { label: "No limit", value: "" },
  { label: "₹500 - ₹1000", value: "500-1000" },
  { label: "₹1000 - ₹2000", value: "1000-2000" },
  { label: "₹2000 - ₹3000", value: "2000-3000" },
  { label: "₹3000 - ₹5000", value: "3000-5000" },
  { label: "₹5000+", value: "5000+" },
];

export default function RouteOptimizerPage() {
  const { isDark } = useDarkMode();
  const [routeForm, setRouteForm] = useState({
    source_station: "New Delhi Terminal, ND1",
    destination_station: "Mumbai Central, MC1",
    departure_date: "2026-04-18",
    departure_time: "08:00",
    min_price: "",
    max_price: "",
  });

  const [routeResults, setRouteResults] = useState<Route[]>([]);
  const [loading, setLoading] = useState(false);

  const handleRouteChange = (e: any) => {
    setRouteForm({ ...routeForm, [e.target.name]: e.target.value });
  };

  const handleFindRoutes = () => {
    if (!routeForm.source_station || !routeForm.destination_station) {
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const mockRoutes: Route[] = [
        {
          id: 1,
          type: "fastest",
          price: 2850,
          duration: "2h 15m",
          stops: 0,
          departureTime: "08:30 AM",
          arrivalTime: "10:45 AM",
          comfort: "AC First Class",
          rating: 4.8,
        },
        {
          id: 2,
          type: "cheapest",
          price: 1200,
          duration: "3h 40m",
          stops: 2,
          departureTime: "09:00 AM",
          arrivalTime: "12:40 PM",
          comfort: "AC Second Class",
          rating: 4.2,
        },
        {
          id: 3,
          type: "value",
          price: 2050,
          duration: "2h 50m",
          stops: 1,
          departureTime: "08:45 AM",
          arrivalTime: "11:35 AM",
          comfort: "AC 3-Tier",
          rating: 4.5,
        },
      ];

      setRouteResults(mockRoutes);
      setLoading(false);
    }, 1000);
  };

  const getRouteTypeColor = (type: "fastest" | "cheapest" | "value") => {
    if (type === "fastest") {
      return {
        bg: isDark ? "bg-indigo-900/30" : "bg-indigo-100",
        text: isDark ? "text-indigo-300" : "text-indigo-800",
        border: isDark ? "border-indigo-500/30" : "border-indigo-300",
        label: isDark ? "bg-indigo-900 text-indigo-100" : "bg-indigo-600 text-white",
        indicator: "bg-indigo-500",
      };
    } else if (type === "cheapest") {
      return {
        bg: isDark ? "bg-slate-800/50" : "bg-slate-100",
        text: isDark ? "text-slate-300" : "text-slate-800",
        border: isDark ? "border-slate-600/30" : "border-slate-300",
        label: isDark ? "bg-slate-700 text-slate-100" : "bg-slate-600 text-white",
        indicator: "bg-slate-500",
      };
    } else {
      return {
        bg: isDark ? "bg-orange-900/30" : "bg-orange-100",
        text: isDark ? "text-orange-300" : "text-orange-800",
        border: isDark ? "border-orange-500/30" : "border-orange-300",
        label: isDark ? "bg-orange-900 text-orange-100" : "bg-orange-600 text-white",
        indicator: "bg-orange-500",
      };
    }
  };

  const getTypeLabel = (type: "fastest" | "cheapest" | "value") => {
    if (type === "fastest") return "Fastest";
    if (type === "cheapest") return "Cheapest";
    return "Best Value";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-8"
    >
      {/* HEADER */}
      <div>
        <h1 className={`text-3xl font-bold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
          Route Optimizer
        </h1>
        <p className={`text-sm mt-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
          Configure parameters to identify high-efficiency transit paths.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Input Panel */}
        <div className="xl:col-span-4 space-y-6">
          <div className={`rounded-2xl p-6 shadow-[0_12px_40px_-10px_rgba(19,27,46,0.04)] relative overflow-hidden ${isDark ? "bg-slate-800 border border-slate-700" : "bg-white border border-slate-200"}`}>
            {/* Subtle Gradient Background Element */}
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none ${isDark ? "bg-indigo-600/10" : "bg-indigo-500/10"}`}></div>

            <h3 className={`text-lg font-semibold mb-6 flex items-center gap-3 relative z-10 ${isDark ? "text-white" : "text-slate-900"}`}>
              <span className={`p-2 rounded-lg ${isDark ? "bg-indigo-900/50" : "bg-indigo-100"}`}>
                <MapPin className={`h-5 w-5 ${isDark ? "text-indigo-400" : "text-indigo-600"}`} />
              </span>
              Parameters
            </h3>

            <form className="space-y-5 relative z-10">
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? "text-slate-400" : "text-slate-700"}`}>
                  Source Station
                </label>
                <div className="relative">
                  <MapPin className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
                  <select
                    name="source_station"
                    value={routeForm.source_station}
                    onChange={handleRouteChange}
                    className={`w-full bg-transparent text-sm rounded-lg pl-10 pr-4 py-2.5 border transition-all outline-none appearance-none ${isDark ? "bg-slate-700 border-slate-600 text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30" : "bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"}`}
                  >
                    {STATIONS.map((station) => (
                      <option key={station} value={station}>
                        {station}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none ${isDark ? "text-slate-500" : "text-slate-400"}`} />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? "text-slate-400" : "text-slate-700"}`}>
                  Destination
                </label>
                <div className="relative">
                  <Flag className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
                  <select
                    name="destination_station"
                    value={routeForm.destination_station}
                    onChange={handleRouteChange}
                    className={`w-full bg-transparent text-sm rounded-lg pl-10 pr-4 py-2.5 border transition-all outline-none appearance-none ${isDark ? "bg-slate-700 border-slate-600 text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30" : "bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"}`}
                  >
                    {STATIONS.map((station) => (
                      <option key={station} value={station}>
                        {station}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none ${isDark ? "text-slate-500" : "text-slate-400"}`} />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? "text-slate-400" : "text-slate-700"}`}>
                  Departure Date
                </label>
                <div className="relative">
                  <Calendar className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
                  <input
                    type="date"
                    name="departure_date"
                    value={routeForm.departure_date}
                    onChange={handleRouteChange}
                    className={`w-full text-sm rounded-lg pl-10 pr-4 py-2.5 border transition-all outline-none ${isDark ? "bg-slate-700 border-slate-600 text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30" : "bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"}`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? "text-slate-400" : "text-slate-700"}`}>
                  Departure Time
                </label>
                <div className="relative">
                  <Clock className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
                  <input
                    type="time"
                    name="departure_time"
                    value={routeForm.departure_time}
                    onChange={handleRouteChange}
                    className={`w-full text-sm rounded-lg pl-10 pr-4 py-2.5 border transition-all outline-none ${isDark ? "bg-slate-700 border-slate-600 text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30" : "bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"}`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? "text-slate-400" : "text-slate-700"}`}>
                  Min Price (₹)
                </label>
                <input
                  type="number"
                  name="min_price"
                  value={routeForm.min_price}
                  onChange={handleRouteChange}
                  placeholder="Min price"
                  className={`w-full text-sm rounded-lg px-4 py-2.5 border transition-all outline-none ${isDark ? "bg-slate-700 border-slate-600 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30" : "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"}`}
                />
              </div>

              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? "text-slate-400" : "text-slate-700"}`}>
                  Max Price (₹)
                </label>
                <input
                  type="number"
                  name="max_price"
                  value={routeForm.max_price}
                  onChange={handleRouteChange}
                  placeholder="Max price"
                  className={`w-full text-sm rounded-lg px-4 py-2.5 border transition-all outline-none ${isDark ? "bg-slate-700 border-slate-600 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30" : "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"}`}
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleFindRoutes}
                disabled={loading}
                type="button"
                className={`w-full py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${isDark ? "bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 text-white" : "bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white"}`}
              >
                <Search className="h-4 w-4" />
                {loading ? "Optimizing..." : "Optimize Routes"}
              </motion.button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: Results Grid */}
        {routeResults.length > 0 && (
          <div className="xl:col-span-8 space-y-6">
            <div className={`rounded-2xl p-4 border ${isDark ? "bg-slate-800/50 border-slate-700/50" : "bg-indigo-50/50 border-indigo-200/50"}`}>
              <p className={`text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                <span className="font-semibold">Journey Details:</span>{" "}
                {routeForm.source_station.split(",")[0]} → {routeForm.destination_station.split(",")[0]} on{" "}
                <span className="font-medium">{new Date(routeForm.departure_date).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</span> at{" "}
                <span className="font-medium">{routeForm.departure_time}</span>
              </p>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
              <h2 className={`text-lg font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                Optimal Sequences Found
              </h2>
              <div className="flex gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${isDark ? "bg-slate-700 text-slate-300" : "bg-slate-200 text-slate-700"}`}>
                  {routeResults.length} Results
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${isDark ? "bg-emerald-900/50 text-emerald-300" : "bg-emerald-100 text-emerald-800"}`}>
                  ✓ All systems nominal
                </span>
              </div>
            </div>

            {/* Route Cards */}
            {routeResults.map((route, idx) => {
              const typeColor = getRouteTypeColor(route.type);
              return (
                <motion.div
                  key={route.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -4 }}
                  className={`rounded-2xl p-6 shadow-[0_12px_40px_-10px_rgba(19,27,46,0.06)] hover:shadow-[0_12px_40px_-10px_rgba(19,27,46,0.12)] transition-all duration-300 relative overflow-hidden group cursor-pointer border ${isDark ? "bg-slate-800 border-slate-700 hover:border-indigo-500/30" : "bg-white border-slate-200 hover:border-indigo-300"}`}
                >
                  {/* Colored Indicator Line */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${typeColor.indicator}`}></div>

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-2.5 py-0.5 rounded text-xs font-semibold uppercase tracking-wide ${typeColor.label}`}>
                          {getTypeLabel(route.type)}
                        </span>
                        <span className={`text-xs font-medium flex items-center gap-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                          <Clock className="h-4 w-4" />
                          {route.duration}
                        </span>
                      </div>
                      <div className={`text-3xl font-bold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                        ₹{route.price.toLocaleString('en-IN')}
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-full sm:w-auto rounded-xl px-6 py-2.5 font-semibold flex items-center justify-center gap-2 transition-all ${isDark ? "bg-slate-700 text-indigo-300 hover:bg-indigo-900/50 hover:text-indigo-200" : "bg-slate-100 text-indigo-600 hover:bg-indigo-600 hover:text-white"}`}
                    >
                      Select Path
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </motion.button>
                  </div>

                  {/* Timeline Section */}
                  <div className="mt-6 pt-6 border-t border-slate-700/50">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex-1">
                        <p className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                          {route.departureTime}
                        </p>
                        <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                          New Delhi Terminal
                        </p>
                      </div>

                      <div className="flex-1 flex flex-col items-center relative px-4">
                        <div className={`w-full h-px absolute top-1/2 -translate-y-1/2 ${isDark ? "bg-slate-600" : "bg-slate-300"}`}></div>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full relative z-10 ${isDark ? "bg-slate-800 text-slate-300" : "bg-white text-slate-700 border border-slate-300"}`}>
                          {route.stops === 0 ? "Direct" : `${route.stops} Stop${route.stops > 1 ? "s" : ""}`}
                        </span>
                      </div>

                      <div className="flex-1 text-right">
                        <p className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                          {route.arrivalTime}
                        </p>
                        <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                          Mumbai Central
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}
