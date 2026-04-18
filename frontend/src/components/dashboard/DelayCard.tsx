import { motion } from "framer-motion";
import { Clock, CloudRain } from "lucide-react";
import { useDarkMode } from "../../contexts/DarkModeContext";

type DelayCardProps = {
  trainNumber: string;
  trainName: string;
  predictedDelayMins: number;
  confidenceRange: string;
  weatherImpact: string;
};

export default function DelayCard({
  trainNumber,
  trainName,
  predictedDelayMins,
  confidenceRange,
  weatherImpact,
}: DelayCardProps) {
  const { isDark } = useDarkMode();

  const getDelayColor = (delay: number) => {
    if (delay <= 5) {
      return isDark ? "text-green-400 bg-green-950 border-green-800" : "text-green-600 bg-green-50 border-green-200";
    }
    if (delay <= 15) {
      return isDark ? "text-amber-400 bg-amber-950 border-amber-800" : "text-amber-600 bg-amber-50 border-amber-200";
    }
    return isDark ? "text-red-400 bg-red-950 border-red-800" : "text-red-600 bg-red-50 border-red-200";
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`rounded-2xl border p-6 transition-colors duration-300 ${getDelayColor(predictedDelayMins)}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{trainName}</h3>
          <p className={`text-sm ${isDark ? "opacity-70" : "opacity-70"}`}>Train #{trainNumber}</p>

          <div className="mt-4 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            <span className="font-medium">
              Predicted delay: {predictedDelayMins} minutes
            </span>
          </div>

          <div className={`mt-2 text-sm ${isDark ? "opacity-70" : "opacity-70"}`}>
            Confidence range: {confidenceRange}
          </div>

          <div className="mt-2 flex items-center gap-2 text-sm">
            <CloudRain className="h-4 w-4" />
            <span>Weather impact: {weatherImpact}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}