"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggler() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = theme === "dark" || (theme === "system" && resolvedTheme === "dark");

  return (
    <button
      aria-label="Toggle Dark Mode"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`
        p-2 rounded-full transition-colors duration-200
        bg-white text-black
        hover:bg-gray-100 hover:text-black
        dark:bg-black dark:text-[#FFD301]
        dark:hover:bg-[#232323] dark:hover:text-[#FFD301]
        border border-gray-200 dark:border-[#FFD3011A]
        shadow
      `}
      style={{ minWidth: 40, minHeight: 40 }}
    >
      {isDark ? (
        // Sun icon (for switching to light)
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="#FFD301" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="5" />
          <g stroke="#FFD301" strokeWidth="2">
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </g>
        </svg>
      ) : (
        // Moon icon (for switching to dark) - always yellow
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="#FFD301" viewBox="0 0 24 24">
          <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"/>
        </svg>
      )}
    </button>
  );
}
