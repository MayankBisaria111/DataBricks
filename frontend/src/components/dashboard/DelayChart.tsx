import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useDarkMode } from "../../contexts/DarkModeContext";

type DelayChartProps = {
  data: Array<{ time: string; delay: number }>;
};

export default function DelayChart({ data }: DelayChartProps) {
  const { isDark } = useDarkMode();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`p-6 rounded-3xl shadow transition-colors duration-300 ${isDark ? "bg-slate-800 border border-slate-700" : "bg-white"}`}
    >
      <h3 className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : ""}`}>Delay Trend Today</h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#f1f5f9"} />
          <XAxis
            dataKey="time"
            stroke={isDark ? "#9ca3af" : "#64748b"}
            fontSize={12}
          />
          <YAxis
            stroke={isDark ? "#9ca3af" : "#64748b"}
            fontSize={12}
            label={{ value: 'Delay (min)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? '#1f2937' : '#ffffff',
              border: `1px solid ${isDark ? '#374151' : '#e2e8f0'}`,
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              color: isDark ? '#ffffff' : '#000000'
            }}
          />
          <Line
            type="monotone"
            dataKey="delay"
            stroke="#8b5cf6"
            strokeWidth={3}
            dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#8b5cf6', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}