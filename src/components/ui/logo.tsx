import { cn } from "@/lib/utils";

/**
 * Official WIZZO Solutions Brand Assets
 * Clean vector SVGs maintaining exact brand colors, typography, and proportions with zero whitespace.
 *
 * Light Background:
 *   - Full: '/wizzo-logo-light.svg' (Deep Navy & Cobalt Blue)
 *   - Symbol: '/wizzo-symbol-light.svg'
 * Dark Background:
 *   - Full: '/wizzo-logo-dark.svg' (Crisp White & Cobalt Blue)
 *   - Symbol: '/wizzo-symbol-dark.svg'
 */

export const WIZZO_LOGOS = {
  lightFull: "/wizzo-logo-light.svg",
  lightSymbol: "/wizzo-symbol-light.svg",
  darkFull: "/wizzo-logo-dark.svg",
  darkSymbol: "/wizzo-symbol-dark.svg",
  wordmarkLight: "/wizzo-logo-light.svg",
  wordmarkDark: "/wizzo-logo-dark.svg",
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
 * Renders crisp, perfectly-proportioned vector brand assets on both light & dark surfaces.
 */
export function Logo({
  className,
  onDark = false,
  compact = false,
  priority = false,
  wordmark = false,
}: LogoProps) {
  if (compact) {
    return (
      <div className={cn("relative inline-flex items-center justify-center shrink-0 h-9 w-9", className)}>
        {onDark ? (
          <img
            src={WIZZO_LOGOS.darkSymbol}
            alt="WIZZO Solutions"
            className="h-full w-auto object-contain"
            loading={priority ? "eager" : "lazy"}
          />
        ) : (
          <>
            <img
              src={WIZZO_LOGOS.lightSymbol}
              alt="WIZZO Solutions"
              className="h-full w-auto object-contain dark:hidden"
              loading={priority ? "eager" : "lazy"}
            />
            <img
              src={WIZZO_LOGOS.darkSymbol}
              alt="WIZZO Solutions"
              className="hidden h-full w-auto object-contain dark:block"
              loading={priority ? "eager" : "lazy"}
            />
          </>
        )}
      </div>
    );
  }

  return (
    <div className={cn("relative inline-flex items-center shrink-0 h-7 sm:h-8", className)}>
      {onDark ? (
        <img
          src={WIZZO_LOGOS.darkFull}
          alt="WIZZO Solutions"
          className="h-full w-auto object-contain"
          loading={priority ? "eager" : "lazy"}
        />
      ) : (
        <>
          <img
            src={WIZZO_LOGOS.lightFull}
            alt="WIZZO Solutions"
            className="h-full w-auto object-contain dark:hidden"
            loading={priority ? "eager" : "lazy"}
          />
          <img
            src={WIZZO_LOGOS.darkFull}
            alt="WIZZO Solutions"
            className="hidden h-full w-auto object-contain dark:block"
            loading={priority ? "eager" : "lazy"}
          />
        </>
      )}
    </div>
  );
}

export function LogoMark({ className, onDark = false }: { className?: string; onDark?: boolean }) {
  return <Logo className={className} onDark={onDark} compact />;
}
