"use client";

import { useEffect, useRef, useState } from "react";

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

interface SubtleWave {
  baseYPercent: number;
  amplitude: number;
  frequency: number;
  speed: number;
  phaseOffset: number;
  direction: 1 | -1;
  colorDark: string;
  colorLight: string;
  lineWidth: number;
}

interface AmbientDataPoint {
  waveIndex: number;
  progress: number;
  speed: number;
  size: number;
}

export function AmbientBackground({ className = "" }: AmbientBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const updateTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
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
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const handleScroll = () => {
      scrollY = window.scrollY || document.documentElement.scrollTop;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // 1. Three gently shifting ambient radial light nodes (electric-blue & deep charcoal)
    const ambientNodes: AmbientNode[] = [
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

    // 2. Continuous subtle background data streams (persisting across the entire site)
    const subtleWaves: SubtleWave[] = [
      {
        baseYPercent: 0.45,
        amplitude: 24,
        frequency: 0.0012,
        speed: 0.00028,
        phaseOffset: 0.8,
        direction: 1,
        colorDark: "rgba(7, 85, 245, 0.14)",
        colorLight: "rgba(7, 85, 245, 0.08)",
        lineWidth: 1.0,
      },
      {
        baseYPercent: 0.78,
        amplitude: 20,
        frequency: 0.0015,
        speed: 0.00024,
        phaseOffset: 2.4,
        direction: -1,
        colorDark: "rgba(61, 120, 255, 0.12)",
        colorLight: "rgba(7, 85, 245, 0.07)",
        lineWidth: 0.9,
      },
    ];

    // 3. Small luminous points traveling along subtle background streams
    const dataPoints: AmbientDataPoint[] = [
      { waveIndex: 0, progress: 0.15, speed: 0.00018, size: 1.8 },
      { waveIndex: 0, progress: 0.65, speed: 0.00022, size: 1.6 },
      { waveIndex: 1, progress: 0.38, speed: 0.00019, size: 1.9 },
      { waveIndex: 1, progress: 0.85, speed: 0.00021, size: 1.5 },
    ];

    const computeSubtleY = (
      x: number,
      time: number,
      w: SubtleWave,
      parallaxY: number
    ): number => {
      const baseY = height * w.baseYPercent - parallaxY;
      const t = time * w.speed * w.direction + w.phaseOffset;
      const h1 = Math.sin(x * w.frequency + t) * w.amplitude;
      const h2 = Math.cos(x * w.frequency * 1.6 - t * 0.8) * (w.amplitude * 0.4);
      return baseY + h1 + h2;
    };

    const render = (time: number) => {
      if (!ctx || width === 0 || height === 0) return;

      // Smooth scroll parallax interpolation
      smoothScrollY += (scrollY - smoothScrollY) * 0.06;
      // Cyclic subtle parallax offset so it creates continuous depth without drifting off-screen
      const parallaxOffsetY = (smoothScrollY * 0.07) % height;

      ctx.clearRect(0, 0, width, height);

      // --- 1. RENDER SOFT SHIFTING AMBIENT RADIAL LIGHTING ---
      ambientNodes.forEach((node) => {
        const driftPosX =
          node.baseX + Math.cos(time * node.speedX + node.phase) * node.driftX;
        const driftPosY =
          node.baseY + Math.sin(time * node.speedY + node.phase) * node.driftY;

        const currentX = driftPosX * width;
        // Subtle vertical scroll parallax shift
        const currentY =
          ((driftPosY * height - parallaxOffsetY * 0.5) % height + height) %
          height;

        const baseRadius = Math.max(width, height) * node.radiusPercent;
        // Breathing radius pulsation
        const breathing = 1 + 0.06 * Math.sin(time * 0.0003 + node.phase);
        const radius = baseRadius * breathing;

        const alpha = isDark ? node.alphaDark : node.alphaLight;
        const color = isDark ? node.colorDark : node.colorLight;

        const grad = ctx.createRadialGradient(
          currentX,
          currentY,
          10,
          currentX,
          currentY,
          radius
        );

        // Smooth cubic multi-stop falloff (prevents harsh gradient boundaries or blobs)
        grad.addColorStop(0, `rgba(${color}, ${alpha})`);
        grad.addColorStop(0.35, `rgba(${color}, ${alpha * 0.45})`);
        grad.addColorStop(0.7, `rgba(${color}, ${alpha * 0.12})`);
        grad.addColorStop(1, `rgba(${color}, 0)`);

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      });

      // --- 2. RENDER SUBTLE CONTINUOUS DATA WAVE STREAMS ---
      subtleWaves.forEach((w) => {
        const strokeColor = isDark ? w.colorDark : w.colorLight;
        const waveBreath = 0.88 + 0.12 * Math.sin(time * 0.00035 + w.phaseOffset);

        ctx.beginPath();
        const grad = ctx.createLinearGradient(0, 0, width, 0);
        grad.addColorStop(0, "rgba(0,0,0,0)");
        grad.addColorStop(0.12, strokeColor);
        grad.addColorStop(0.88, strokeColor);
        grad.addColorStop(1, "rgba(0,0,0,0)");

        ctx.strokeStyle = grad;
        ctx.lineWidth = w.lineWidth;
        ctx.globalAlpha = waveBreath;

        const stepX = Math.max(6, Math.floor(width / 160));
        let first = true;

        for (let x = -20; x <= width + 20; x += stepX) {
          const y = computeSubtleY(x, time, w, parallaxOffsetY);
          if (first) {
            ctx.moveTo(x, y);
            first = false;
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      });

      ctx.globalAlpha = 1.0;

      // --- 3. RENDER SMALL LUMINOUS DATA POINTS ---
      dataPoints.forEach((p) => {
        if (!prefersReducedMotion) {
          p.progress += p.speed;
          if (p.progress > 1.0) p.progress = 0;
        }

        const w = subtleWaves[p.waveIndex];
        const currentX = p.progress * (width + 100) - 50;
        const currentY = computeSubtleY(currentX, time, w, parallaxOffsetY);

        if (currentX >= 0 && currentX <= width && currentY >= 0 && currentY <= height) {
          // Delicate halo
          const halo = ctx.createRadialGradient(
            currentX,
            currentY,
            0,
            currentX,
            currentY,
            p.size * 3.5
          );
          halo.addColorStop(
            0,
            isDark ? "rgba(96, 165, 250, 0.35)" : "rgba(7, 85, 245, 0.22)"
          );
          halo.addColorStop(1, "transparent");

          ctx.beginPath();
          ctx.arc(currentX, currentY, p.size * 3.5, 0, Math.PI * 2);
          ctx.fillStyle = halo;
          ctx.globalAlpha = 0.85;
          ctx.fill();

          // Crisp core point
          ctx.beginPath();
          ctx.arc(currentX, currentY, p.size, 0, Math.PI * 2);
          ctx.fillStyle = isDark ? "#ffffff" : "#0755F5";
          ctx.globalAlpha = 0.9;
          ctx.fill();
        }
      });

      ctx.globalAlpha = 1.0;
    };

    const loop = (currentTime: number) => {
      render(currentTime);
      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(loop);
      }
    };

    if (prefersReducedMotion) {
      render(1000);
    } else {
      animationFrameId = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isDark]);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-0 overflow-hidden select-none ${className}`}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
