"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

/**
 * Lenis smooth scrolling with anchor-link integration.
 * Automatically skips users who prefer reduced motion.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    let hashTimer: ReturnType<typeof setTimeout> | undefined;
    if (window.location.hash) {
      const targetId = window.location.hash.slice(1);
      hashTimer = setTimeout(() => {
        const target = document.getElementById(targetId);
        if (target) {
          lenis.scrollTo(target, { offset: -84, immediate: true });
        }
      }, 100);
    }

    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest?.('a[href^="#"], a[href^="/#"]');
      if (!anchor) return;
      const href = anchor.getAttribute("href") || "";
      const id = href.replace(/^\//, "");
      if (!id.startsWith("#") || id.length < 2) return;
      const el = document.getElementById(id.slice(1));
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el, { offset: -84, duration: 1.4 });
      window.history.pushState(null, "", id);
    };
    document.addEventListener("click", onClick);

    return () => {
      if (hashTimer) clearTimeout(hashTimer);
      cancelAnimationFrame(raf);
      document.removeEventListener("click", onClick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!lenisRef.current) return;
    const hash = window.location.hash;
    if (hash && hash.length > 1) {
      const timer = setTimeout(() => {
        const el = document.getElementById(hash.slice(1));
        if (el && lenisRef.current) {
          lenisRef.current.scrollTo(el, { offset: -84, duration: 1.2 });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  return <>{children}</>;
}
