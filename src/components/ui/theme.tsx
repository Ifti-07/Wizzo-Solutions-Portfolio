"use client";

import { useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun } from "lucide-react";

/** Blocking script injected before paint to apply the saved theme (no flash). Defaults to dark navy corporate theme. */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("wizzo-theme");if(t!=="light"){document.documentElement.classList.add("dark");}}catch(e){}})();`;

export function toggleTheme() {
  const isDark = document.documentElement.classList.toggle("dark");
  try {
    localStorage.setItem("wizzo-theme", isDark ? "dark" : "light");
  } catch {}
  return isDark;
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}

function getSnapshot() {
  return typeof document !== "undefined" && document.documentElement.classList.contains("dark");
}

function getServerSnapshot() {
  return true;
}

export function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <button
      aria-label="Toggle light / night mode"
      onClick={() => toggleTheme()}
      className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-line bg-surface text-ink-2 transition-colors hover:border-electric hover:text-electric focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={dark ? "moon" : "sun"}
          initial={{ y: 14, opacity: 0, rotate: -60 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -14, opacity: 0, rotate: 60 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="flex"
        >
          {dark ? <Moon size={16} strokeWidth={2.2} /> : <Sun size={16} strokeWidth={2.2} />}
        </motion.span>
      </AnimatePresence>
      <span
        className={`pointer-events-none absolute inset-0 rounded-full transition-opacity duration-300 ${
          dark ? "opacity-100" : "opacity-0"
        }`}
        style={{ boxShadow: "inset 0 0 12px rgba(7,85,245,0.35)" }}
      />
    </button>
  );
}
