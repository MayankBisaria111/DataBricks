import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker } from "react-leaflet";
import { motion } from "framer-motion";
import { useDarkMode } from "../../contexts/DarkModeContext";
import { AlertTriangle, Clock, MapPin, Train } from "lucide-react";
import L from "leaflet";

type RailMapProps = {
  filterTrainNumber?: string;
  filterStation?: string;
  compact?: boolean;
  mode?: "passenger" | "controller";
};

type TrainStatus = "On Time" | "Delayed" | "Critical";

type TrainEntry = {
  id: number;
  number: string;
  name: string;
  pos: [number, number];
  destination: [number, number];
  status: TrainStatus;
  delay: number;
  station: string;
  route: [number, number][];
};

const trains: TrainEntry[] = [
  {
    id: 1,
    number: "12001",
    name: "Rajdhani Express",
    pos: [28.6139, 77.209],
    destination: [22.5726, 88.3639],
    status: "On Time",
    delay: 3,
    station: "Delhi Central",
    route: [
      [28.6139, 77.209],
      [26.9124, 75.7873],
      [23.2599, 77.4126],
      [22.5726, 88.3639],
    ],
  },
  {
    id: 2,
    number: "12012",
    name: "Shatabdi Express",
    pos: [19.076, 72.8777],
    destination: [21.1458, 79.0882],
    status: "Delayed",
    delay: 18,
    station: "Mumbai Central",
    route: [
      [19.076, 72.8777],
      [21.1458, 79.0882],
    ],
  },
  {
    id: 3,
    number: "12657",
    name: "Mysore Express",
    pos: [13.0827, 80.2707],
    destination: [12.9716, 77.5946],
    status: "Delayed",
    delay: 22,
    station: "Chennai Central",
    route: [
      [13.0827, 80.2707],
      [12.9716, 77.5946],
    ],
  },
  {
    id: 4,
    number: "12345",
    name: "Intercity Express",
    pos: [28.5355, 77.391],
    destination: [26.9124, 75.7873],
    status: "On Time",
    delay: 0,
    station: "Delhi Central",
    route: [
      [28.5355, 77.391],
      [26.9124, 75.7873],
    ],
  },
  {
    id: 5,
    number: "12904",
    name: "Golden Temple Mail",
    pos: [26.8467, 80.9462],
    destination: [22.7196, 75.8577],
    status: "Critical",
    delay: 41,
    station: "Lucknow",
    route: [
      [26.8467, 80.9462],
      [25.3176, 82.9739],
      [22.7196, 75.8577],
    ],
  },
];

function statusTone(status: TrainStatus) {
  if (status === "Critical") return { color: "#dc2626", bg: "bg-rose-500", text: "text-rose-600" };
  if (status === "Delayed") return { color: "#d97706", bg: "bg-amber-500", text: "text-amber-600" };
  return { color: "#16a34a", bg: "bg-emerald-500", text: "text-emerald-600" };
}

export default function RailMap({ filterTrainNumber, filterStation, compact = false, mode = "controller" }: RailMapProps) {
  const { isDark } = useDarkMode();

  // Filter trains based on props
  let filteredTrains = trains;
  if (filterTrainNumber) {
    filteredTrains = trains.filter((t) => t.number === filterTrainNumber);
  } else if (filterStation) {
    filteredTrains = trains.filter((t) => t.station === filterStation);
  }

  // Dark mode tile layer
  const tileUrl = isDark
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  const createTrainIcon = (status: TrainStatus) => {
    const color = statusTone(status).color.replace("#", "%23");
    return new L.Icon({
      iconUrl: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 42 42'%3E%3Crect x='1' y='1' width='40' height='40' rx='10' fill='${color}' stroke='white' stroke-width='2'/%3E%3Cpath d='M12 16c0-1 1-2 2-2h14c1 0 2 1 2 2v8c0 1-1 2-2 2h-1v2h-2v-2h-8v2h-2v-2h-1c-1 0-2-1-2-2v-8z' fill='white'/%3E%3Ccircle cx='14' cy='27' r='2' fill='white'/%3E%3Ccircle cx='28' cy='27' r='2' fill='white'/%3E%3C/svg%3E`,
      iconSize: [42, 42],
      iconAnchor: [21, 21],
      popupAnchor: [0, -18],
    });
  };

  return (
    <div className="space-y-4">
      {mode === "controller" && filteredTrains.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {filteredTrains.map((train) => (
            <div
              key={train.id}
              className={`rounded-2xl border p-3 shadow-sm ${isDark ? "border-slate-700 bg-slate-800/70" : "border-slate-200 bg-white/90"}`}
            >
              <p className={`text-sm font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>{train.name}</p>
              <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>#{train.number}</p>
              <p className={`mt-2 inline-flex items-center gap-1 text-xs font-semibold ${statusTone(train.status).text}`}>
                <Clock size={12} />
                {train.status} ({train.delay} min)
              </p>
            </div>
          ))}
        </div>
      ) : null}

      {/* Map */}
      <div
        className={`w-full overflow-hidden rounded-3xl border-2 shadow-lg transition-all ${
          compact ? "h-[280px]" : "h-[500px]"
        } ${isDark ? "border-slate-700" : "border-slate-300"}`}
      >
        {filteredTrains.length > 0 ? (
          <MapContainer
            center={filteredTrains[0].pos}
            zoom={filterTrainNumber ? 7 : 5}
            className="h-full w-full"
          >
            <TileLayer
              url={tileUrl}
              attribution={isDark ? '&copy; <a href="https://carto.com/attributions">CARTO</a>' : '&copy; OpenStreetMap contributors'}
            />

            {filteredTrains.map((train) => (
              <div key={train.id}>
                {/* Route Line */}
                <Polyline
                  positions={train.route}
                  color={statusTone(train.status).color}
                  weight={3}
                  opacity={0.7}
                  dashArray={train.status !== "On Time" ? "8, 6" : ""}
                />

                {/* Current Position Marker */}
                <Marker position={train.pos} icon={createTrainIcon(train.status)}>
                  <Popup>
                    <div className="text-sm font-semibold text-slate-900">
                      <p className="font-bold">{train.name}</p>
                      <p className="text-xs">Train #{train.number}</p>
                      <p className={`mt-1 text-xs ${statusTone(train.status).text}`}>
                        Status: {train.status} {train.delay > 0 ? `(+${train.delay} min)` : ""}
                      </p>
                      <p className="mt-1 text-xs">Current station: {train.station}</p>
                    </div>
                  </Popup>
                </Marker>

                {/* Destination Marker */}
                <CircleMarker
                  center={train.destination}
                  radius={8}
                  fillColor={isDark ? "#6366f1" : "#4f46e5"}
                  fillOpacity={0.3}
                  weight={2}
                  color={isDark ? "#6366f1" : "#4f46e5"}
                >
                  <Popup>
                    <div className={`text-sm font-semibold ${isDark ? "text-slate-900" : ""}`}>
                      <p className="font-bold">Destination</p>
                      <p className="text-xs">{train.destination[0].toFixed(4)}°N, {train.destination[1].toFixed(4)}°E</p>
                    </div>
                  </Popup>
                </CircleMarker>

                {/* Pulsing Animation for delayed/critical */}
                {train.status !== "On Time" && (
                  <CircleMarker
                    center={train.pos}
                    radius={16}
                    fillColor={statusTone(train.status).color}
                    fillOpacity={0.2}
                    weight={0}
                  />
                )}
              </div>
            ))}
          </MapContainer>
        ) : (
          <div className={`h-full w-full flex items-center justify-center ${isDark ? "bg-slate-900" : "bg-slate-50"}`}>
            <p className={isDark ? "text-slate-400" : "text-slate-500"}>No trains found for this selection</p>
          </div>
        )}
      </div>

      {/* Legend */}
      {filteredTrains.length > 0 && (
        <div className={`rounded-2xl p-4 border-2 ${isDark ? "border-slate-700 bg-slate-800/50" : "border-slate-300 bg-slate-50"}`}>
          <p className={`text-xs font-semibold mb-3 ${isDark ? "text-slate-300" : "text-slate-700"}`}>MAP LEGEND</p>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-emerald-500" />
              <span className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>On Time</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-amber-500" />
              <span className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>Delayed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-rose-500" />
              <span className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>Critical</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-4 bg-indigo-500" />
              <span className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>Route</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full border-2 border-indigo-500" />
              <span className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>Destination</span>
            </div>
          </div>
        </div>
      )}

      {mode === "controller" && filterStation ? (
        <div className={`rounded-2xl border p-4 ${isDark ? "border-slate-700 bg-slate-800/60" : "border-slate-200 bg-white/90"}`}>
          <p className={`mb-2 inline-flex items-center gap-2 text-sm font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
            <AlertTriangle size={14} />
            Trains approaching {filterStation}
          </p>
          <div className="grid gap-2 md:grid-cols-2">
            {filteredTrains.map((train) => (
              <div key={`${train.id}-station`} className={`rounded-xl border px-3 py-2 ${isDark ? "border-slate-700 bg-slate-900/50" : "border-slate-200 bg-slate-50/80"}`}>
                <p className={`text-sm font-semibold ${isDark ? "text-slate-100" : "text-slate-800"}`}>
                  {train.number} - {train.name}
                </p>
                <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  Live location: {train.pos[0].toFixed(2)}N, {train.pos[1].toFixed(2)}E
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}