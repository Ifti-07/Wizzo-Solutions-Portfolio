"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

interface WordProps {
  children: string;
  progress: any;
  range: [number, number];
  reduce: boolean | null;
  highlight?: boolean;
}

const HIGHLIGHT_WORDS = new Set(["engineer", "software", "business"]);

function Word({ children, progress, range, reduce, highlight = false }: WordProps) {
  const opacity = useTransform(progress, range, [0.28, 1]);
  const color = highlight ? "text-blue-600 dark:text-blue-500" : "text-ink";

  if (reduce) {
    return <span className={`inline-block mr-[0.28em] ${color}`}>{children}</span>;
  }

  return (
    <span className="relative inline-block mr-[0.28em]">
      <motion.span
        style={{ opacity }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={color}
      >
        {children}
      </motion.span>
    </span>
  );
}

export function TaglineRevealSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const text =
    "We engineer high performance software that cuts through operational complexity so your business can move faster with complete confidence.";

  const words = text.split(" ");

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.85", "end 0.45"],
  });

  return (
    <section
      ref={containerRef}
      className="relative w-full py-24 sm:py-32"
      aria-label="Core Benefit Statement"
    >
      <div className="mx-auto w-full max-w-7xl px-5 md:px-8">
        <div className="mx-auto max-w-[680px] text-center">
          <p className="caption-3 uppercase tracking-widest text-electric mb-5 font-semibold">
            Our Core Commitment
          </p>
          <h2 className="heading-3 sm:heading-2 font-semibold tracking-tight text-ink leading-tight [text-wrap:balance]">
            {words.map((word, i) => {
              const start = i / words.length;
              const end = start + 1 / words.length;
              return (
                <Word
                  key={i}
                  progress={scrollYProgress}
                  range={[start, end]}
                  reduce={reduce}
                  highlight={HIGHLIGHT_WORDS.has(word.replace(/[^a-z]/gi, "").toLowerCase())}
                >
                  {word}
                </Word>
              );
            })}
          </h2>
          <p className="mt-6 text-sm text-ink-3 max-w-md mx-auto [text-wrap:pretty]">
            Practical architecture engineered for long term scale and business resilience.
          </p>
        </div>
      </div>
    </section>
  );
}
