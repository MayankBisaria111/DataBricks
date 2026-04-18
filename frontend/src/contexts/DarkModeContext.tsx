import { createContext, useContext, useState, ReactNode } from "react";

type DarkModeContextType = {
  isDark: boolean;
  toggleDarkMode: () => void;
};

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

export function DarkModeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("rail_drishti_dark_mode");
    return saved ? JSON.parse(saved) : false;
  });

  const toggleDarkMode = () => {
    setIsDark((prev) => {
      const newValue = !prev;
      localStorage.setItem("rail_drishti_dark_mode", JSON.stringify(newValue));
      return newValue;
    });
  };

  return (
    <DarkModeContext.Provider value={{ isDark, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}

export function useDarkMode() {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error("useDarkMode must be used within DarkModeProvider");
  }
  return context;
}
