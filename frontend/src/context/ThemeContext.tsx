/* eslint-disable react-refresh/only-export-components */
import React, { useEffect, useMemo, useState } from "react";
import { ThemeContext } from "./themeCore";

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("theme-preference");
      if (saved === "dark") return true;
      if (saved === "light") return false;
      return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("theme-preference", isDark ? "dark" : "light");
    } catch {
      // no-op
    }
  }, [isDark]);

  useEffect(() => {
    const cls = "dark";
    const el = document.documentElement;
    if (isDark) el.classList.add(cls); else el.classList.remove(cls);
  }, [isDark]);

  const value = useMemo(() => ({
    isDark,
    toggleTheme: () => setIsDark((d) => !d),
  }), [isDark]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
