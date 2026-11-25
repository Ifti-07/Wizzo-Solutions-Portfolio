"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Users,
  GraduationCap,
  Briefcase,
  Layers3,
  CheckSquare,
  Settings,
  Home,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { ThemeToggle } from "@/components/ui/theme";
import { logout } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/admin/messages", label: "Inquiries", icon: MessageSquare },
  { href: "/admin/applications", label: "Applications", icon: GraduationCap },
  { href: "/admin/jobs", label: "Job Openings", icon: Briefcase },
  { href: "/admin/content", label: "Website Content", icon: Layers3 },
  { href: "/admin/users", label: "Team & Interns", icon: Users },
  { href: "/admin/tasks", label: "Task Assignment", icon: CheckSquare },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
      {nav.map((item) => {
        const active =
          pathname === item.href ||
          (item.href !== "/admin" && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all",
              active
                ? "bg-electric text-white shadow-[0_10px_25px_-10px_var(--glow)]"
                : "text-white/70 hover:bg-white/10 hover:text-white"
            )}
          >
            <item.icon size={17} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminShell({ children, name }: { children: React.ReactNode; name: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg lg:flex">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-navy lg:flex dark:bg-abyss dark:border-r dark:border-line">
        <div className="px-5 pb-4 pt-6">
          <Logo onDark />
          <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.24em] text-white/40">
            Administration Suite
          </p>
        </div>
        <NavLinks />
        <SidebarFooter />
      </aside>

      {/* Mobile topbar + drawer */}
      <div className="glass sticky top-0 z-40 flex items-center justify-between border-b border-line px-5 py-3 lg:hidden">
        <Logo compact={false} />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            aria-label="Open admin menu"
            onClick={() => setOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface text-ink"
          >
            <Menu size={16} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[80] bg-abyss/60 backdrop-blur-sm lg:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              className="fixed inset-y-0 left-0 z-[85] flex w-72 flex-col bg-navy lg:hidden"
            >
              <div className="flex items-center justify-between px-5 pb-4 pt-6">
                <Logo onDark />
                <button
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                  className="text-white/70"
                >
                  <X size={20} />
                </button>
              </div>
              <NavLinks onNavigate={() => setOpen(false)} />
              <SidebarFooter />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1">
        <div className="sticky top-0 z-30 hidden items-center justify-end gap-3 border-b border-line bg-bg/80 px-8 py-3.5 backdrop-blur lg:flex">
          <span className="text-xs text-ink-3">
            Signed in as <span className="font-bold text-ink">{name}</span>
          </span>
          <ThemeToggle />
        </div>
        <main className="p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}

function SidebarFooter() {
  return (
    <div className="space-y-1 border-t border-white/10 p-3">
      <Link
        href="/"
        className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white"
      >
        <Home size={17} /> View Website
      </Link>
      <button
        onClick={async () => {
          await logout();
          window.location.href = "/admin/login";
        }}
        className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-red-300 transition-colors hover:bg-red-500/10"
      >
        <LogOut size={17} /> Sign Out
      </button>
    </div>
  );
}
