"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { site } from "@/lib/site";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application runtime error:", error);
  }, [error]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-5 py-24 text-center">
      <div className="glass-card relative mx-auto max-w-lg rounded-3xl p-8 sm:p-12 shadow-2xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500">
          <AlertTriangle className="h-8 w-8" />
        </div>

        <span className="mt-6 inline-block rounded-full bg-rose-500/10 px-3 py-1 font-mono text-xs font-semibold uppercase tracking-wider text-rose-500">
          Unexpected Error
        </span>

        <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
          Something went wrong
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-ink-muted">
          An unexpected condition occurred while processing this request. Our engineering team has been notified.
        </p>

        {error?.digest && (
          <p className="mt-2 font-mono text-xs text-ink-faint">
            Error Reference ID: {error.digest}
          </p>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-electric px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-electric/25 transition-all hover:bg-electric-hover active:scale-[0.98]"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-card/60 px-6 py-3 text-sm font-medium text-ink transition-all hover:bg-card active:scale-[0.98]"
          >
            <Home className="h-4 w-4" />
            Return Home
          </Link>
        </div>

        <p className="mt-8 text-xs text-ink-faint">
          © {new Date().getFullYear()} {site.name}. All systems operational.
        </p>
      </div>
    </div>
  );
}
