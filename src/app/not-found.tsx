import Link from "next/link";
import { ArrowLeft, Home, Compass } from "lucide-react";
import { site } from "@/lib/site";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-5 py-24 text-center">
      <div className="glass-card relative mx-auto max-w-lg rounded-3xl p-8 sm:p-12 shadow-2xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-electric/10 text-electric">
          <Compass className="h-8 w-8 animate-pulse" />
        </div>

        <span className="mt-6 inline-block rounded-full bg-electric/10 px-3 py-1 font-mono text-xs font-semibold uppercase tracking-wider text-electric">
          404 — Page Not Found
        </span>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          Lost in cyberspace?
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-ink-muted sm:text-base">
          The page or system resource you requested doesn&apos;t exist, has been relocated, or is temporarily unavailable.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-electric px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-electric/25 transition-all hover:bg-electric-hover active:scale-[0.98]"
          >
            <Home className="h-4 w-4" />
            Return Home
          </Link>
          <Link
            href="/#contact"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-card/60 px-6 py-3 text-sm font-medium text-ink transition-all hover:bg-card active:scale-[0.98]"
          >
            <ArrowLeft className="h-4 w-4" />
            Contact Support
          </Link>
        </div>

        <p className="mt-8 text-xs text-ink-faint">
          © {new Date().getFullYear()} {site.name}. All systems operational.
        </p>
      </div>
    </div>
  );
}
