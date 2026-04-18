import { motion } from "framer-motion";
import { useDarkMode } from "../../contexts/DarkModeContext";

type MessageBubbleProps = {
  role: "user" | "bot";
  text?: string;
  isTyping?: boolean;
};

export default function MessageBubble({ role, text, isTyping = false }: MessageBubbleProps) {
  const { isDark } = useDarkMode();
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className={`chat-message-enter flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[84%] rounded-3xl px-4 py-3.5 text-sm leading-relaxed shadow-[0_6px_18px_rgba(15,23,42,0.08)] transition-colors duration-300 ${
          isUser
            ? isDark
              ? "rounded-br-lg bg-gradient-to-br from-violet-600 to-violet-500 text-white"
              : "rounded-br-lg bg-gradient-to-br from-slate-900 to-slate-700 text-white"
            : isDark
            ? "rounded-bl-lg border border-slate-700 bg-slate-700/90 text-slate-100 backdrop-blur"
            : "rounded-bl-lg border border-white/80 bg-white/90 text-slate-800 backdrop-blur"
        }`}
      >
        {isTyping ? (
          <div className="flex items-center gap-2 py-1">
            <span className="typing-dot" />
            <span className="typing-dot [animation-delay:120ms]" />
            <span className="typing-dot [animation-delay:240ms]" />
            <span className={`ml-1 text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>Thinking...</span>
          </div>
        ) : (
          text
        )}
      </div>
    </motion.div>
  );
}
