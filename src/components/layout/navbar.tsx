"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { ThemeToggle } from "@/components/ui/theme";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

const navLinks = [
  { label: "Home", href: "#hero" },
  { label: "Services", href: "#services" },
  { label: "Solutions", href: "#solutions" },
  { label: "Process", href: "#process" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);

      const sections = ["hero", "services", "solutions", "process", "projects", "contact"];
      const scrollPos = window.scrollY + 140;
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Quiet navigation */}
      <header className="fixed inset-x-0 top-3 sm:top-4 z-[70] px-3 sm:px-6 pointer-events-none">
        <nav
          aria-label="Main Navigation"
          className={cn(
            "pointer-events-auto mx-auto flex max-w-7xl items-center justify-between rounded-[12px] border border-line px-4 sm:px-6 py-2.5 transition-colors duration-200",
            scrolled
              ? "glass shadow-md"
              : "bg-surface/85 backdrop-blur-md shadow-xs"
          )}
        >
          {/* Brand Logo */}
          <Link
            href="#hero"
            aria-label="WIZZO Solutions home"
            className="group flex items-center transition-opacity hover:opacity-95"
          >
            <Logo priority wordmark />
          </Link>

          {/* Desktop Navigation Links */}
          <ul className="hidden items-center gap-1 lg:flex">
            {navLinks.map((item) => {
              const target = item.href.replace("#", "");
              const isActive = activeSection === target;
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={cn(
                      "relative rounded-md px-3 py-2 text-xs sm:text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric",
                      isActive
                        ? "text-electric font-semibold"
                        : "text-ink-2 hover:text-ink"
                    )}
                  >
                    {item.label}
                    {isActive && (
                      <motion.span
                        layoutId="activePill"
                        className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-electric"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Action CTAs and Theme Controls */}
          <div className="flex items-center gap-2.5">
            <ThemeToggle />

            {/* Single Primary Action Button with B2 button padding */}
            <Link
              href="#contact"
              className="hidden h-9 items-center gap-1.5 rounded-lg bg-electric px-4 text-xs sm:text-sm font-semibold text-white shadow-xs transition-all hover:bg-electric-dark active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-electric focus-visible:ring-offset-surface sm:inline-flex"
            >
              <span>Schedule Consultation</span>
              <ArrowRight size={13} />
            </Link>

            {/* Animated Menu Toggle per B7 */}
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen(!open)}
              className="relative flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface text-ink transition-colors hover:border-electric hover:text-electric focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric lg:hidden"
            >
              <div className="relative h-4 w-4">
                <motion.span
                  animate={open ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.25, ease: EASE }}
                  className="absolute left-0 top-0 block h-0.5 w-4 rounded-full bg-current"
                />
                <motion.span
                  animate={open ? { opacity: 0 } : { opacity: 1 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 top-[7px] block h-0.5 w-4 rounded-full bg-current"
                />
                <motion.span
                  animate={open ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.25, ease: EASE }}
                  className="absolute left-0 top-[14px] block h-0.5 w-4 rounded-full bg-current"
                />
              </div>
            </button>
          </div>
        </nav>
      </header>

      {/* Full-Height Mobile Menu Panel (B7) */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="fixed inset-0 z-[65] flex flex-col bg-surface/98 px-6 pt-24 pb-8 backdrop-blur-2xl lg:hidden"
          >
            <div className="flex flex-col justify-between h-full">
              {/* Staggered Link Entrance (B7: Moving up Spacing-300 (24px), stepped 60ms, capped at 400ms) */}
              <nav className="flex flex-col space-y-1">
                {navLinks.map((item, idx) => {
                  const delay = Math.min(idx * 0.06, 0.4);
                  return (
                    <motion.div
                      key={item.label}
                      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay, duration: 0.35, ease: EASE }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="group flex items-center justify-between border-b border-line/60 py-3 text-base font-medium text-ink transition-colors hover:text-electric"
                      >
                        <span>{item.label}</span>
                        <ArrowUpRight
                          size={16}
                          className="text-ink-3 transition-transform group-hover:translate-x-0.5 group-hover:text-electric"
                        />
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              <div className="pt-6">
                <Link
                  href="#contact"
                  onClick={() => setOpen(false)}
                  className="btn-primary flex w-full items-center justify-center gap-2 rounded-xl bg-electric py-3 text-sm font-semibold text-white shadow-md"
                >
                  Schedule Architecture Consultation
                  <ArrowRight size={14} />
                </Link>
                <p className="mt-4 text-center text-xs text-ink-3">
                  WIZZO Solutions Limited • Engineering & Digital Systems
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
