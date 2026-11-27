"use client";

import { useEffect, useRef } from "react";

interface AmbientBackgroundProps {
  className?: string;
}

interface AmbientNode {
  baseX: number; // 0 to 1
  baseY: number; // 0 to 1
  radiusPercent: number;
  driftX: number;
  driftY: number;
  speedX: number;
  speedY: number;
  phase: number;
  alphaDark: number;
  alphaLight: number;
  colorDark: string;
  colorLight: string;
}

const AMBIENT_NODES: AmbientNode[] = [
  {
    // Upper-right focal light
    baseX: 0.72,
    baseY: 0.28,
    radiusPercent: 0.65,
    driftX: 0.08,
    driftY: 0.06,
    speedX: 0.00012,
    speedY: 0.00016,
    phase: 0,
    alphaDark: 0.075,
    alphaLight: 0.035,
    colorDark: "7, 85, 245",
    colorLight: "7, 85, 245",
  },
  {
    // Mid-left subtle fill light
    baseX: 0.22,
    baseY: 0.58,
    radiusPercent: 0.55,
    driftX: 0.07,
    driftY: 0.08,
    speedX: 0.00015,
    speedY: 0.00011,
    phase: Math.PI * 0.75,
    alphaDark: 0.055,
    alphaLight: 0.025,
    colorDark: "61, 120, 255",
    colorLight: "7, 85, 245",
  },
  {
    // Lower-right ambient counter-light
    baseX: 0.68,
    baseY: 0.85,
    radiusPercent: 0.58,
    driftX: 0.06,
    driftY: 0.05,
    speedX: 0.00011,
    speedY: 0.00014,
    phase: Math.PI * 1.5,
    alphaDark: 0.05,
    alphaLight: 0.02,
    colorDark: "0, 180, 240",
    colorLight: "6, 72, 199",
  },
];

export function AmbientBackground({ className = "" }: AmbientBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDarkRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;

    let scrollY = 0;
    let smoothScrollY = 0;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const render = (time: number) => {
      if (width === 0 || height === 0) return;

      // Smooth scroll parallax interpolation
      smoothScrollY += (scrollY - smoothScrollY) * 0.06;
      const parallaxOffsetY = (smoothScrollY * 0.07) % height;

      ctx.clearRect(0, 0, width, height);

      const dark = isDarkRef.current;
      const maxDim = Math.max(width, height);

      for (let i = 0; i < AMBIENT_NODES.length; i++) {
        const node = AMBIENT_NODES[i];
        const driftPosX =
          node.baseX + Math.cos(time * node.speedX + node.phase) * node.driftX;
        const driftPosY =
          node.baseY + Math.sin(time * node.speedY + node.phase) * node.driftY;

        const currentX = driftPosX * width;
        const currentY =
          ((driftPosY * height - parallaxOffsetY * 0.5) % height + height) %
          height;

        const baseRadius = maxDim * node.radiusPercent;
        const breathing = 1 + 0.06 * Math.sin(time * 0.0003 + node.phase);
        const radius = baseRadius * breathing;

        const alpha = dark ? node.alphaDark : node.alphaLight;
        const color = dark ? node.colorDark : node.colorLight;

        const grad = ctx.createRadialGradient(
          currentX,
          currentY,
          10,
          currentX,
          currentY,
          radius
        );

        grad.addColorStop(0, `rgba(${color}, ${alpha})`);
        grad.addColorStop(0.35, `rgba(${color}, ${alpha * 0.45})`);
        grad.addColorStop(0.7, `rgba(${color}, ${alpha * 0.12})`);
        grad.addColorStop(1, `rgba(${color}, 0)`);

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      }
    };

    const loop = (currentTime: number) => {
      if (document.hidden) return;
      render(currentTime);
      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(loop);
      }
    };

    const updateTheme = () => {
      isDarkRef.current = document.documentElement.classList.contains("dark");
      if (prefersReducedMotion) {
        render(1000);
      }
    };

    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });

    const handleScroll = () => {
      scrollY = window.scrollY || document.documentElement.scrollTop;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    const handleVisibility = () => {
      if (prefersReducedMotion) return;
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
      } else {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(loop);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    if (prefersReducedMotion) {
      render(1000);
    } else {
      animationFrameId = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-0 overflow-hidden select-none ${className}`}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
