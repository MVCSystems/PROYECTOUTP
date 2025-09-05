"use client";

import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export const ToggleTheme = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const isLightTheme = theme === "light";

  return (
    <Button
      variant="ghost"
      onClick={() => setTheme(isLightTheme ? "dark" : "light")}
    >
      {isLightTheme ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
      <span className="lg:hidden">{isLightTheme ? "Modo oscuro" : "Modo claro"}</span>
    </Button>
  );
};