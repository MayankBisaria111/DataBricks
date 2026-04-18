import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import MessageInput from "./MessageInput";
import MessageList, { ChatMessage } from "./MessageList";
import SuggestedPrompts from "./SuggestedPrompts";
import { useDarkMode } from "../../contexts/DarkModeContext";

type ChatbotPanelProps = {
  compact?: boolean;
};

const prompts = [
  "Check delay for train 12345",
  "Best route from Indore to Delhi",
  "Will my train be delayed?",
];

const botReplies: Record<string, string> = {
  "check delay for train 12345":
    "Train 12345 is currently running around 18 minutes late. The next update is expected in 5 minutes.",
  "best route from indore to delhi":
    "For Indore to Delhi, the fastest available route is via Bhopal Junction with one transfer and an estimated journey of 11h 20m.",
  "will my train be delayed?":
    "Based on current corridor traffic and weather, there is a moderate chance of a short delay (10-20 minutes).",
};

const fallbackReply =
  "I can help with train delay checks, route suggestions, and expected arrival status. Try one of the suggested prompts.";

const initialMessages: ChatMessage[] = [
  {
    id: "bot-welcome",
    role: "bot",
    text: "Hi! I am Rail Drishti Assistant. Ask me about train delays and route planning.",
  },
];

export default function ChatbotPanel({ compact = false }: ChatbotPanelProps) {
  const { isDark } = useDarkMode();
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isTyping, setIsTyping] = useState(false);

  const panelHeightClass = useMemo(() => (compact ? "h-[420px]" : "h-[72vh] min-h-[520px]"), [compact]);

  function getBotReply(userText: string): string {
    const normalized = userText.toLowerCase().trim();
    return botReplies[normalized] ?? fallbackReply;
  }

  function pushUserMessage(input: string) {
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: input,
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    const waitMs = 1000 + Math.floor(Math.random() * 1000);
    window.setTimeout(() => {
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: "bot",
        text: getBotReply(input),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, waitMs);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`overflow-hidden rounded-3xl border shadow-[0_10px_40px_rgba(15,23,42,0.09)] backdrop-blur transition-colors duration-300 ${isDark ? "border-slate-700 bg-gradient-to-b from-slate-800/90 to-slate-900/90" : "border-white/80 bg-gradient-to-b from-white/90 to-slate-50/90"} ${panelHeightClass}`}
    >
      <div className="flex h-full flex-col">
        <div className={`border-b px-4 py-3 md:px-6 transition-colors duration-300 ${isDark ? "border-slate-700 bg-slate-800/70" : "border-white/70 bg-white/70"}`}>
          <div className="mx-auto flex w-full max-w-3xl items-center justify-between">
            <p className={`inline-flex items-center gap-2 text-sm font-medium ${isDark ? "text-slate-300" : "text-slate-700"}`}>
              <Sparkles size={14} className={isDark ? "text-violet-400" : "text-indigo-500"} />
              Rail Drishti Assistant
            </p>
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors duration-300 ${isDark ? "bg-violet-900/30 text-violet-300" : "bg-indigo-50 text-indigo-700"}`}>
              <span className={`h-1.5 w-1.5 animate-pulse rounded-full ${isDark ? "bg-violet-400" : "bg-indigo-500"}`} />
              Mock mode
            </span>
          </div>
        </div>
        <MessageList messages={messages} isTyping={isTyping} />
        <div className={`border-t px-4 py-3 backdrop-blur md:px-6 transition-colors duration-300 ${isDark ? "border-slate-700 bg-slate-800/92" : "border-white/70 bg-white/92"}`}>
          <SuggestedPrompts prompts={prompts} onSelect={pushUserMessage} disabled={isTyping} />
          <div className="mt-3">
            <MessageInput onSend={pushUserMessage} disabled={isTyping} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
