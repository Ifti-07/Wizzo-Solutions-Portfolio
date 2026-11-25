"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, AlertCircle, ArrowLeft, ShieldCheck, UserRound } from "lucide-react";
import { login } from "@/lib/actions/auth";
import { Logo } from "@/components/ui/logo";
import { ThemeToggle } from "@/components/ui/theme";

export function LoginForm({ portal }: { portal: "team" | "admin" }) {
  const [state, action, pending] = useActionState(login, null);
  const router = useRouter();

  useEffect(() => {
    if (state?.ok && state.redirectTo) router.push(state.redirectTo);
  }, [state, router]);

  const isAdmin = portal === "admin";

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-16">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 grid-bg opacity-60 [mask-image:radial-gradient(ellipse_60%_55%_at_50%_40%,black,transparent)]" />
        <div className="animate-aurora absolute -top-40 left-1/2 h-[30rem] w-[46rem] -translate-x-1/2 rounded-full bg-electric/20 blur-[130px]" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-electric/10 blur-[110px]" />
      </div>

      <div className="absolute left-5 top-5 flex items-center gap-3 md:left-8 md:top-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-xs font-semibold text-ink-2 transition-colors hover:border-electric hover:text-electric"
        >
          <ArrowLeft size={14} /> Back to Website
        </Link>
      </div>
      <div className="absolute right-5 top-5 md:right-8 md:top-8">
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        <div className="rounded-[2rem] border border-line bg-surface p-8 shadow-[0_40px_90px_-35px_var(--glow)] md:p-10">
          <div className="flex flex-col items-center text-center">
            <Logo />
            <span
              className={`mt-6 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] ${
                isAdmin ? "bg-navy text-white dark:bg-electric" : "bg-electric-soft text-electric"
              }`}
            >
              {isAdmin ? <ShieldCheck size={13} /> : <UserRound size={13} />}
              {isAdmin ? "Admin Portal" : "Employee & Intern Portal"}
            </span>
            <h1 className="font-display mt-5 text-2xl font-bold text-ink">Welcome Back</h1>
            <p className="mt-2 text-sm text-ink-2">
              {isAdmin
                ? "Sign in to access the administration dashboard."
                : "Sign in with the credentials provided by your administrator."}
            </p>
          </div>

          <form action={action} className="mt-8 space-y-4">
            <input type="hidden" name="portal" value={portal} />
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-3" />
              <input
                name="email"
                type="email"
                required
                placeholder="Email address"
                autoComplete="email"
                className="w-full rounded-xl border border-line bg-surface-2 py-3.5 pl-11 pr-4 text-sm text-ink placeholder:text-ink-3 outline-none transition-all focus:border-electric focus:ring-4 focus:ring-electric/15 dark:bg-surface"
              />
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-3" />
              <input
                name="password"
                type="password"
                required
                placeholder="Password"
                autoComplete="current-password"
                className="w-full rounded-xl border border-line bg-surface-2 py-3.5 pl-11 pr-4 text-sm text-ink placeholder:text-ink-3 outline-none transition-all focus:border-electric focus:ring-4 focus:ring-electric/15 dark:bg-surface"
              />
            </div>

            {state && !state.ok && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 rounded-xl bg-red-500/10 px-4 py-3 text-sm font-medium text-red-500"
              >
                <AlertCircle size={15} /> {state.error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="btn-primary flex w-full items-center justify-center gap-2 rounded-full bg-electric py-4 text-sm font-semibold text-white shadow-[0_16px_40px_-12px_var(--glow)] transition-all hover:scale-[1.02] disabled:opacity-60"
            >
              {pending ? "Signing in..." : "Sign In"} <LogIn size={15} />
            </button>
          </form>

          <p className="mt-6 text-center text-xs leading-relaxed text-ink-3">
            Forgot your password? Contact your administrator to reset it.
            <br />
            {isAdmin ? (
              <Link href="/login" className="font-semibold text-electric hover:underline">
                Go to Employee / Intern Login
              </Link>
            ) : (
              <Link href="/admin/login" className="font-semibold text-electric hover:underline">
                Go to Admin Login
              </Link>
            )}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
