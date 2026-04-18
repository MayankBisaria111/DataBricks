import { FormEvent, useState } from "react";
import { FiSend } from "react-icons/fi";
import { useDarkMode } from "../../contexts/DarkModeContext";

type MessageInputProps = {
  onSend: (message: string) => void;
  disabled?: boolean;
};

export default function MessageInput({ onSend, disabled = false }: MessageInputProps) {
  const { isDark } = useDarkMode();
  const [value, setValue] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = value.trim();
    if (!next || disabled) return;
    onSend(next);
    setValue("");
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-3xl items-end gap-2">
      <textarea
        value={value}
        onChange={(event) => setValue(event.target.value)}
        rows={1}
        placeholder="Ask about delays, routes, and train status..."
        className={`max-h-32 min-h-11 flex-1 resize-y rounded-2xl border px-4 py-2.5 text-sm shadow-sm outline-none transition ${isDark ? "border-slate-600 bg-slate-700/95 text-white placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-900/30" : "border-slate-200 bg-white/95 text-slate-900 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"}`}
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-[0_8px_20px_rgba(79,70,229,0.35)] transition hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:shadow-none ${isDark ? "bg-gradient-to-r from-violet-600 to-violet-500 disabled:from-slate-700 disabled:to-slate-700" : "bg-gradient-to-r from-indigo-600 to-violet-600 disabled:from-slate-300 disabled:to-slate-300"}`}
        aria-label="Send message"
        title="Send message"
      >
        <FiSend />
      </button>
    </form>
  );
}
