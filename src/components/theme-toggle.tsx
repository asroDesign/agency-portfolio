"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useSyncExternalStore } from "react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label="تغییر تم"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`btn btn-square btn-ghost relative border border-base-content/10 text-base-content/65 hover:border-primary/40 hover:text-primary ${className}`}
    >
      {mounted ? (
        isDark ? (
          <Sun className="h-5 w-5" />
        ) : (
          <Moon className="h-5 w-5" />
        )
      ) : (
        <span className="h-5 w-5" />
      )}
    </button>
  );
}
