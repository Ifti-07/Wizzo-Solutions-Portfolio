"use client";

import { useEffect, useRef, useState } from "react";

interface FlowingDataWavesProps {
  className?: string;
  intensity?: "subtle" | "medium" | "vibrant";
}

interface WaveConfig {
  baseYPercent: number; // 0 to 1
  amplitude: number;
  frequency: number;
  speed: number;
  subWaves: number; // parallel ribbon strands
  subSpacing: number; // vertical spacing
  colorDark: string;
  colorLight: string;
  lineWidth: number;
  phaseOffset: number;
  direction: 1 | -1;
  tilt: number; // vertical slant across width (px)
  glow?: boolean;
}

interface DataPulse {
  waveIndex: number;
  subIndex: number;
  progress: number;
  speed: number;
  size: number;
  tailLength: number;
  colorDark: string;
  colorLight: string;
}

export function FlowingDataWaves({
  className = "",
  intensity = "medium",
}: FlowingDataWavesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
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
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;

    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let isVisible = true;
    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (isVisible && !prefersReducedMotion) {
            lastTime = performance.now();
            loop(lastTime);
          } else {
            cancelAnimationFrame(animationFrameId);
          }
        });
      },
      { threshold: 0.05 }
    );
    visibilityObserver.observe(container);

    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
    };

    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetMouseX = x * 2;
      targetMouseY = y * 2;
    };

    const handlePointerLeave = () => {
      targetMouseX = 0;
      targetMouseY = 0;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    container.addEventListener("pointerleave", handlePointerLeave);

    const mult =
      intensity === "vibrant" ? 1.25 : intensity === "medium" ? 1.0 : 0.75;

    // 5 Architectural Wave Streams
    const waves: WaveConfig[] = [
      {
        // 1. Deep atmospheric carrier wave (broad & slow)
        baseYPercent: 0.74,
        amplitude: 48,
        frequency: 0.0011,
        speed: 0.0004,
        subWaves: 3,
        subSpacing: 14,
        colorDark: `rgba(7, 85, 245, ${0.22 * mult})`,
        colorLight: `rgba(7, 85, 245, ${0.14 * mult})`,
        lineWidth: 1.1,
        phaseOffset: 0,
        direction: 1,
        tilt: -20,
      },
      {
        // 2. Primary electric-blue data ribbon (signature brand curve)
        baseYPercent: 0.62,
        amplitude: 42,
        frequency: 0.0017,
        speed: 0.00065,
        subWaves: 5,
        subSpacing: 8,
        colorDark: `rgba(61, 120, 255, ${0.48 * mult})`,
        colorLight: `rgba(7, 85, 245, ${0.28 * mult})`,
        lineWidth: 1.4,
        phaseOffset: Math.PI * 0.45,
        direction: 1,
        tilt: -12,
        glow: true,
      },
      {
        // 3. Counter-flowing cyan wave (subtle cross-harmonics)
        baseYPercent: 0.52,
        amplitude: 34,
        frequency: 0.0022,
        speed: 0.00052,
        subWaves: 4,
        subSpacing: 10,
        colorDark: `rgba(0, 212, 255, ${0.35 * mult})`,
        colorLight: `rgba(0, 160, 200, ${0.2 * mult})`,
        lineWidth: 1.2,
        phaseOffset: Math.PI * 1.2,
        direction: -1,
        tilt: 18,
      },
      {
        // 4. Foreground crisp light-trail stream
        baseYPercent: 0.82,
        amplitude: 36,
        frequency: 0.0026,
        speed: 0.00085,
        subWaves: 3,
        subSpacing: 9,
        colorDark: `rgba(138, 184, 255, ${0.42 * mult})`,
        colorLight: `rgba(7, 85, 245, ${0.24 * mult})`,
        lineWidth: 1.3,
        phaseOffset: Math.PI * 0.85,
        direction: 1,
        tilt: -8,
        glow: true,
      },
      {
        // 5. Upper subtle horizon contour
        baseYPercent: 0.42,
        amplitude: 24,
        frequency: 0.0014,
        speed: 0.00035,
        subWaves: 3,
        subSpacing: 12,
        colorDark: `rgba(61, 120, 255, ${0.2 * mult})`,
        colorLight: `rgba(16, 37, 66, ${0.12 * mult})`,
        lineWidth: 0.9,
        phaseOffset: Math.PI * 1.6,
        direction: -1,
        tilt: 14,
      },
    ];

    // Refined small luminous data points traveling slowly along selected wave paths
    const pulses: DataPulse[] = [
      {
        waveIndex: 1, // Primary electric-blue ribbon
        subIndex: 0,
        progress: 0.12,
        speed: 0.00034,
        size: 2.2,
        tailLength: 42,
        colorDark: "#93c5fd",
        colorLight: "#0755F5",
      },
      {
        waveIndex: 1,
        subIndex: 1,
        progress: 0.58,
        speed: 0.00028,
        size: 1.8,
        tailLength: 35,
        colorDark: "#bfdbfe",
        colorLight: "#0648c7",
      },
      {
        waveIndex: 1,
        subIndex: 3,
        progress: 0.88,
        speed: 0.00032,
        size: 2.0,
        tailLength: 38,
        colorDark: "#60a5fa",
        colorLight: "#0755F5",
      },
      {
        waveIndex: 2, // Cyan counter-flow ribbon
        subIndex: 1,
        progress: 0.76,
        speed: 0.0003,
        size: 2.1,
        tailLength: 40,
        colorDark: "#67e8f9",
        colorLight: "#0284c7",
      },
      {
        waveIndex: 2,
        subIndex: 2,
        progress: 0.28,
        speed: 0.00036,
        size: 1.9,
        tailLength: 36,
        colorDark: "#38bdf8",
        colorLight: "#0369a1",
      },
      {
        waveIndex: 3, // Foreground light-trail ribbon
        subIndex: 0,
        progress: 0.42,
        speed: 0.00038,
        size: 2.3,
        tailLength: 46,
        colorDark: "#ffffff",
        colorLight: "#0755F5",
      },
      {
        waveIndex: 3,
        subIndex: 1,
        progress: 0.06,
        speed: 0.00031,
        size: 1.9,
        tailLength: 34,
        colorDark: "#93c5fd",
        colorLight: "#3d78ff",
      },
      {
        waveIndex: 0, // Deep carrier ribbon
        subIndex: 1,
        progress: 0.68,
        speed: 0.00024,
        size: 1.7,
        tailLength: 30,
        colorDark: "#3b82f6",
        colorLight: "#0755F5",
      },
    ];

    const computeWaveY = (
      x: number,
      time: number,
      w: WaveConfig,
      subIndex: number
    ): number => {
      // Base elevation + subtle vertical perspective tilt across x
      const normalizedX = x / width;
      const tiltOffset = (normalizedX - 0.5) * w.tilt;
      const baseY = height * w.baseYPercent + subIndex * w.subSpacing + tiltOffset;

      const t = time * w.speed * w.direction + w.phaseOffset;
      const k = w.frequency;

      const h1 = Math.sin(x * k + t) * w.amplitude;
      const h2 = Math.cos(x * k * 1.55 - t * 0.75) * (w.amplitude * 0.45);
      const h3 = Math.sin(x * k * 2.7 + t * 1.25) * (w.amplitude * 0.18);

      // Smooth mouse parallax
      const mouseFactorX = (normalizedX - 0.5) * mouseX * 28;
      const mouseFactorY = mouseY * (22 * (1 - w.baseYPercent));

      return baseY + h1 + h2 + h3 + mouseFactorX + mouseFactorY;
    };

    let lastTime = performance.now();

    const render = (time: number) => {
      if (!ctx || width === 0 || height === 0) return;

      mouseX += (targetMouseX - mouseX) * 0.045;
      mouseY += (targetMouseY - mouseY) * 0.045;

      ctx.clearRect(0, 0, width, height);

      // 1. Atmospheric Ambient Radial Lighting
      const radialGlow = ctx.createRadialGradient(
        width * (0.68 + mouseX * 0.04),
        height * (0.5 + mouseY * 0.04),
        20,
        width * 0.65,
        height * 0.55,
        Math.max(width, height) * 0.75
      );

      if (isDark) {
        radialGlow.addColorStop(0, "rgba(7, 85, 245, 0.11)");
        radialGlow.addColorStop(0.35, "rgba(7, 85, 245, 0.035)");
        radialGlow.addColorStop(0.7, "rgba(6, 72, 199, 0.008)");
        radialGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      } else {
        radialGlow.addColorStop(0, "rgba(7, 85, 245, 0.06)");
        radialGlow.addColorStop(0.4, "rgba(7, 85, 245, 0.015)");
        radialGlow.addColorStop(1, "rgba(239, 232, 221, 0)");
      }

      ctx.fillStyle = radialGlow;
      ctx.fillRect(0, 0, width, height);

      // 2. Render Layered Flowing Waves
      const stepX = Math.max(5, Math.floor(width / 180));

      waves.forEach((w) => {
        const strokeColor = isDark ? w.colorDark : w.colorLight;

        // Subtle temporal wave brightness modulation (breathing effect)
        const waveBreathing = 0.86 + 0.14 * Math.sin(time * 0.00045 + w.phaseOffset);

        for (let sub = 0; sub < w.subWaves; sub++) {
          ctx.beginPath();

          const subFade = 1 - (sub / w.subWaves) * 0.42;

          // Horizontal gradient with smooth fade at boundaries
          const grad = ctx.createLinearGradient(0, 0, width, 0);
          grad.addColorStop(0, "rgba(0,0,0,0)");
          grad.addColorStop(0.08, strokeColor);
          grad.addColorStop(0.92, strokeColor);
          grad.addColorStop(1, "rgba(0,0,0,0)");

          ctx.strokeStyle = grad;
          ctx.lineWidth = w.lineWidth * (1 - sub * 0.1);
          ctx.globalAlpha = subFade * waveBreathing;

          if (w.glow && sub === 0 && isDark) {
            ctx.shadowBlur = 6;
            ctx.shadowColor = "rgba(61, 120, 255, 0.35)";
          } else {
            ctx.shadowBlur = 0;
          }

          let first = true;
          for (let x = -20; x <= width + 20; x += stepX) {
            const y = computeWaveY(x, time, w, sub);
            if (first) {
              ctx.moveTo(x, y);
              first = false;
            } else {
              ctx.lineTo(x, y);
            }
          }
          ctx.stroke();
        }
      });

      ctx.shadowBlur = 0;

      // 3. Render Flowing Data Packets & Light Trails
      pulses.forEach((p) => {
        if (!prefersReducedMotion) {
          p.progress += p.speed;
          if (p.progress > 1.0) p.progress = 0;
        }

        const w = waves[p.waveIndex];
        const currentX = p.progress * (width + 140) - 70;
        const currentY = computeWaveY(currentX, time, w, p.subIndex);

        const pulseColor = isDark ? p.colorDark : p.colorLight;
        const tailSegments = 10;
        const tailStep = p.tailLength / tailSegments;

        // Draw delicate luminous light trail
        for (let i = tailSegments; i >= 1; i--) {
          const tailX = currentX - i * tailStep * w.direction;
          if (tailX < 0 || tailX > width) continue;

          const tailY = computeWaveY(tailX, time, w, p.subIndex);
          const alpha = ((tailSegments - i) / tailSegments) * (isDark ? 0.42 : 0.32);
          const trailSize = p.size * (1 - (i / tailSegments) * 0.55);

          ctx.beginPath();
          ctx.arc(tailX, tailY, Math.max(0.6, trailSize), 0, Math.PI * 2);
          ctx.fillStyle = pulseColor;
          ctx.globalAlpha = alpha;
          ctx.fill();
        }

        // Main luminous data node
        if (currentX >= 0 && currentX <= width) {
          // Soft ambient halo (subtle, no harsh neon)
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
            isDark ? "rgba(96, 165, 250, 0.45)" : "rgba(7, 85, 245, 0.35)"
          );
          halo.addColorStop(
            0.5,
            isDark ? "rgba(7, 85, 245, 0.12)" : "rgba(7, 85, 245, 0.08)"
          );
          halo.addColorStop(1, "transparent");

          ctx.beginPath();
          ctx.arc(currentX, currentY, p.size * 3.5, 0, Math.PI * 2);
          ctx.fillStyle = halo;
          ctx.globalAlpha = 0.9;
          ctx.fill();

          // Crisp core point
          ctx.beginPath();
          ctx.arc(currentX, currentY, p.size, 0, Math.PI * 2);
          ctx.fillStyle = isDark ? "#ffffff" : "#0755F5";
          ctx.globalAlpha = 0.95;
          ctx.fill();
        }
      });

      // 4. Pure Transparency Falloff Mask at Top & Bottom (Zero hard edge or color mismatch)
      ctx.globalCompositeOperation = "destination-out";

      // Bottom fade out to transparent
      const bottomMask = ctx.createLinearGradient(0, height - 70, 0, height);
      bottomMask.addColorStop(0, "rgba(0, 0, 0, 0)");
      bottomMask.addColorStop(1, "rgba(0, 0, 0, 1)");
      ctx.fillStyle = bottomMask;
      ctx.globalAlpha = 1.0;
      ctx.fillRect(0, height - 70, width, 70);

      // Top fade out to transparent (near navbar)
      const topMask = ctx.createLinearGradient(0, 0, 0, 60);
      topMask.addColorStop(0, "rgba(0, 0, 0, 1)");
      topMask.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = topMask;
      ctx.globalAlpha = 1.0;
      ctx.fillRect(0, 0, width, 60);

      ctx.globalCompositeOperation = "source-over";
    };

    const loop = (currentTime: number) => {
      render(currentTime);
      if (isVisible && !prefersReducedMotion) {
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
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [isDark, intensity]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden select-none z-0 ${className}`}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
