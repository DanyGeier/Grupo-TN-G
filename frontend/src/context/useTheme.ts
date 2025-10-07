import { useContext } from "react";
import { ThemeContext, type ThemeContextValue } from "./themeCore";

export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme debe usarse dentro de ThemeProvider");
  return ctx;
};

