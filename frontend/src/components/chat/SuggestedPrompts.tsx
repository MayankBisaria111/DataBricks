import { useDarkMode } from "../../contexts/DarkModeContext";

type SuggestedPromptsProps = {
  prompts: string[];
  onSelect: (prompt: string) => void;
  disabled?: boolean;
};

export default function SuggestedPrompts({ prompts, onSelect, disabled = false }: SuggestedPromptsProps) {
  const { isDark } = useDarkMode();

  return (
    <div className="mx-auto w-full max-w-3xl">
      <p className={`mb-2 text-xs font-medium uppercase tracking-wide ${isDark ? "text-slate-400" : "text-slate-500"}`}>Suggested prompts</p>
      <div className="flex flex-wrap gap-2">
        {prompts.map((prompt) => (
          <button
            key={prompt}
            disabled={disabled}
            onClick={() => onSelect(prompt)}
            className={`rounded-full border px-3 py-1.5 text-xs shadow-sm transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 ${isDark ? "border-slate-600/90 bg-slate-700/90 text-slate-300 hover:border-violet-500 hover:bg-violet-900/30 hover:text-violet-300" : "border-slate-200/90 bg-white/90 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 hover:shadow"}`}
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}
