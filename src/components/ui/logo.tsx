import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Official WIZZO Solutions Brand Assets
 * Directly referenced from the official `Wizzo Logo` repository directory.
 *
 * Light Background:
 *   - Full: 'First Logo With title.png' (Deep Navy & Cobalt Blue on white canvas)
 *   - Symbol: 'First Logo Without title.png'
 * Dark Background:
 *   - Full: 'Secondary Logo with title.png' (White & Cobalt Blue on black canvas)
 *   - Symbol: 'Secondary Logo without title.png'
 */

export const WIZZO_LOGOS = {
  lightFull: "/api/brand-asset/First%20Logo%20With%20title.png",
  lightSymbol: "/api/brand-asset/First%20Logo%20Without%20title.png",
  darkFull: "/api/brand-asset/Secondary%20Logo%20with%20title.png",
  darkSymbol: "/api/brand-asset/Secondary%20Logo%20without%20title.png",
  wordmarkLight: "/api/brand-asset/First%20Logo%20With%20title.png",
  wordmarkDark: "/api/brand-asset/Wizzo%202nd%20Logo%20w%20text.png",
} as const;

interface LogoProps {
  className?: string;
  onDark?: boolean;
  compact?: boolean;
  priority?: boolean;
  wordmark?: boolean;
}

/**
 * The official WIZZO Solutions logo component.
 * Maintains exact original proportions, colors, and asset integrity.
 */
export function Logo({ className, onDark = false, compact = false, priority = false, wordmark = false }: LogoProps) {
  if (compact) {
    return (
      <div className={cn("relative inline-flex items-center justify-center shrink-0", className)}>
        {onDark ? (
          <img
            src={WIZZO_LOGOS.darkSymbol}
            alt="WIZZO Solutions"
            width={44}
            height={44}
            className="h-10 w-10 object-contain mix-blend-screen"
            loading={priority ? "eager" : "lazy"}
          />
        ) : (
          <img
            src={WIZZO_LOGOS.lightSymbol}
            alt="WIZZO Solutions"
            width={44}
            height={44}
            className="h-10 w-10 object-contain mix-blend-multiply dark:hidden"
            loading={priority ? "eager" : "lazy"}
          />
        )}
        {!onDark && (
          <img
            src={WIZZO_LOGOS.darkSymbol}
            alt="WIZZO Solutions"
            width={44}
            height={44}
            className="hidden h-10 w-10 object-contain mix-blend-screen dark:block"
            loading={priority ? "eager" : "lazy"}
          />
        )}
      </div>
    );
  }

  if (wordmark) {
    return (
      <div className={cn("relative inline-flex items-center shrink-0 h-6 sm:h-7", className)}>
        {/* Light surfaces: navy wordmark logo (Wizzo Logo w text.svg) */}
        <div className="relative dark:hidden h-full overflow-hidden aspect-[1569/355]">
          <img
            src={WIZZO_LOGOS.wordmarkLight}
            alt="WIZZO Solutions"
            className="absolute left-1/2 top-1/2 w-[127.5%] max-w-none -translate-x-1/2 -translate-y-1/2"
            loading={priority ? "eager" : "lazy"}
          />
        </div>
        {/* Dark surfaces: white wordmark logo (Wizzo 2nd Logo w text.png) */}
        <div className="relative hidden dark:block h-full overflow-hidden aspect-[1569/355]">
          <img
            src={WIZZO_LOGOS.wordmarkDark}
            alt="WIZZO Solutions"
            className="absolute left-1/2 top-1/2 w-[127.5%] max-w-none -translate-x-1/2 -translate-y-1/2"
            loading={priority ? "eager" : "lazy"}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative inline-flex items-center shrink-0", className)}>
      {onDark ? (
        <div className="relative flex items-center h-10 sm:h-11">
          <img
            src={WIZZO_LOGOS.darkFull}
            alt="WIZZO Solutions"
            className="h-full w-auto max-w-[190px] sm:max-w-[210px] object-contain mix-blend-screen"
            loading={priority ? "eager" : "lazy"}
          />
        </div>
      ) : (
        <div className="relative flex items-center h-10 sm:h-11">
          {/* Light mode: First Logo With title */}
          <img
            src={WIZZO_LOGOS.lightFull}
            alt="WIZZO Solutions"
            className="h-full w-auto max-w-[190px] sm:max-w-[210px] object-contain mix-blend-multiply dark:hidden"
            loading={priority ? "eager" : "lazy"}
          />
          {/* Dark mode: Secondary Logo with title */}
          <img
            src={WIZZO_LOGOS.darkFull}
            alt="WIZZO Solutions"
            className="hidden h-full w-auto max-w-[190px] sm:max-w-[210px] object-contain mix-blend-screen dark:block"
            loading={priority ? "eager" : "lazy"}
          />
        </div>
      )}
    </div>
  );
}

export function LogoMark({ className, onDark = false }: { className?: string; onDark?: boolean }) {
  return <Logo className={className} onDark={onDark} compact />;
}
