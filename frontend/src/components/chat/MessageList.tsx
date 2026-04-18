import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import { useDarkMode } from "../../contexts/DarkModeContext";

export type ChatMessage = {
  id: string;
  role: "user" | "bot";
  text: string;
};

type MessageListProps = {
  messages: ChatMessage[];
  isTyping: boolean;
};

export default function MessageList({ messages, isTyping }: MessageListProps) {
  const { isDark } = useDarkMode();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className="premium-scrollbar flex-1 overflow-y-auto px-4 py-4 md:px-6">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-3">
        {messages.length === 0 ? (
          <div className={`rounded-2xl border border-dashed p-6 text-center text-sm transition-colors duration-300 ${isDark ? "border-slate-600 bg-slate-700/70 text-slate-400" : "border-slate-300 bg-white/70 text-slate-500"}`}>
            No messages yet. Start by sending a prompt below.
          </div>
        ) : null}
        {messages.map((message) => (
          <MessageBubble key={message.id} role={message.role} text={message.text} />
        ))}
        {isTyping ? <MessageBubble role="bot" isTyping /> : null}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
