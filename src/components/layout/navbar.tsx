"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { ThemeToggle } from "@/components/ui/theme";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

const navItems = [
  { label: "Home", section: "hero", hash: "#hero" },
  { label: "Services", section: "services", hash: "#services" },
  { label: "Solutions", section: "solutions", hash: "#solutions" },
  { label: "Process", section: "process", hash: "#process" },
  { label: "Projects", section: "projects", hash: "#projects" },
  { label: "Careers", section: "careers", hash: "#careers", pageHref: "/careers" },
  { label: "Contact", section: "contact", hash: "#contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const isCareersPage = pathname?.startsWith("/careers");

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const currentSection = isCareersPage ? "careers" : activeSection;
  const reduce = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      const next = window.scrollY > 24;
      setScrolled((prev) => (prev === next ? prev : next));
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isCareersPage || !isHomePage) return;

    const sectionIds = ["hero", "services", "solutions", "process", "projects", "careers", "contact"];
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-140px 0px -55% 0px", threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [isCareersPage, isHomePage]);

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

  const getHref = (item: (typeof navItems)[number]) => {
    if (isHomePage) {
      return item.hash;
    }
    if (item.pageHref) {
      return item.pageHref;
    }
    return `/${item.hash}`;
  };

  return (
    <>
      {/* Quiet navigation */}
      <header className="fixed inset-x-0 top-2 sm:top-4 z-[70] px-3 sm:px-6 pointer-events-none">
        <nav
          aria-label="Main Navigation"
          className={cn(
            "pointer-events-auto mx-auto flex max-w-7xl items-center justify-between rounded-[12px] border border-line px-3.5 sm:px-6 py-2 sm:py-2.5 transition-colors duration-200",
            scrolled
              ? "glass shadow-md"
              : "bg-surface/85 backdrop-blur-md shadow-xs"
          )}
        >
          {/* Brand Logo */}
          <Link
            href={isHomePage ? "#hero" : "/"}
            aria-label="WIZZO Solutions home"
            className="group flex items-center transition-opacity hover:opacity-95"
          >
            <Logo priority wordmark />
          </Link>

          {/* Desktop Navigation Links */}
          <ul className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => {
              const href = getHref(item);
              const isActive = currentSection === item.section;
              return (
                <li key={item.label}>
                  <Link
                    href={href}
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
              href={isHomePage ? "#contact" : "/#contact"}
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
            className="fixed inset-0 z-[65] flex flex-col overflow-y-auto bg-surface/98 px-6 pt-24 pb-8 backdrop-blur-2xl lg:hidden"
          >
            <div className="flex min-h-full flex-col justify-between">
              {/* Staggered Link Entrance (B7: Moving up Spacing-300 (24px), stepped 60ms, capped at 400ms) */}
              <nav className="flex flex-col space-y-1">
                {navItems.map((item, idx) => {
                  const delay = Math.min(idx * 0.06, 0.4);
                  const href = getHref(item);
                  return (
                    <motion.div
                      key={item.label}
                      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay, duration: 0.35, ease: EASE }}
                    >
                      <Link
                        href={href}
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
                  href={isHomePage ? "#contact" : "/#contact"}
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
