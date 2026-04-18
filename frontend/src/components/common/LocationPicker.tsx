import { useDarkMode } from "../../contexts/DarkModeContext";
import { MapPin } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type LocationPickerProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
};

const popularStations = [
  "Delhi Central",
  "New Delhi",
  "Mumbai Central",
  "Bangalore City",
  "Kolkata Central",
  "Chennai Central",
  "Hyderabad",
  "Jaipur",
  "Lucknow",
  "Ahmedabad",
  "Pune",
  "Bhopal",
];

export default function LocationPicker({ value, onChange, placeholder = "Select location...", label }: LocationPickerProps) {
  const { isDark } = useDarkMode();
  const [isOpen, setIsOpen] = useState(false);
  const [filtered, setFiltered] = useState(popularStations);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value.trim() === "") {
      setFiltered(popularStations);
    } else {
      setFiltered(
        popularStations.filter((s) =>
          s.toLowerCase().includes(value.toLowerCase())
        )
      );
    }
  }, [value]);

  return (
    <div className="relative">
      {label && (
        <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
          {label}
        </label>
      )}
      <div
        className={`relative rounded-xl border transition-colors duration-300 ${
          isOpen
            ? isDark
              ? "border-violet-500 bg-slate-700"
              : "border-indigo-500 bg-white"
            : isDark
            ? "border-slate-600 bg-slate-700"
            : "border-slate-300 bg-white"
        }`}
      >
        <div className="flex items-center gap-2 px-4 py-3">
          <MapPin className={`h-4 w-4 ${isDark ? "text-slate-400" : "text-slate-500"}`} />
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            className={`flex-1 bg-transparent outline-none ${isDark ? "text-white placeholder:text-slate-500" : "text-slate-900 placeholder:text-slate-400"}`}
          />
        </div>

        {/* Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className={`absolute top-full left-0 right-0 z-50 mt-2 rounded-xl border shadow-lg ${isDark ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-white"}`}
              onMouseLeave={() => setIsOpen(false)}
            >
              <div className="max-h-64 overflow-y-auto p-2">
                {filtered.length > 0 ? (
                  filtered.map((station) => (
                    <motion.button
                      key={station}
                      whileHover={{ x: 4 }}
                      onClick={() => {
                        onChange(station);
                        setIsOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-lg transition ${isDark ? "hover:bg-slate-700 text-slate-200" : "hover:bg-indigo-50 text-slate-900"}`}
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 opacity-50" />
                        {station}
                      </div>
                    </motion.button>
                  ))
                ) : (
                  <div className={`px-3 py-4 text-center text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    No stations found
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
