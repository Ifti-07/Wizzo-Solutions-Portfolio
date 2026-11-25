"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Who owns the intellectual property and source code?",
    answer:
      "Your company owns 100% of all intellectual property, source code repositories, architectural designs, and database schemas upon project completion. There are no licensing fees or proprietary locks.",
  },
  {
    question: "How do you handle project timelines and budget estimates?",
    answer:
      "Every project begins with a clear milestone roadmap and agreed deliverables. We provide transparent estimates with bi-weekly sprint reviews, ensuring scope and budget stay aligned throughout.",
  },
  {
    question: "Can you modernize or integrate with our existing legacy systems?",
    answer:
      "Yes. We specialize in building secure REST and GraphQL adapters that synchronize data between legacy ERPs, internal databases, and modern web applications without disrupting day-to-day operations.",
  },
  {
    question: "What technology stack do you build with?",
    answer:
      "We rely on battle-tested, modern technologies including Next.js, React, TypeScript, Node.js, PostgreSQL, and Tailwind CSS. We select tools for long term maintainability rather than short lived trends.",
  },
  {
    question: "How soon can our team test working software?",
    answer:
      "You receive access to a dedicated staging environment within the first two weeks of development, updated with every verified sprint release so you can test features as they are built.",
  },
  {
    question: "Do you provide ongoing maintenance and technical support after launch?",
    answer:
      "Yes. We offer structured Service Level Agreements (SLAs) that cover 24/7 uptime monitoring, database backups, security patches, framework upgrades, and responsive bug resolution.",
  },
  {
    question: "How do we communicate throughout the engagement?",
    answer:
      "You work directly with lead engineers via Slack or Teams for daily queries, paired with scheduled bi-weekly sprint demos and concise written progress summaries.",
  },
  {
    question: "What is the typical timeframe for a custom software build?",
    answer:
      "Focused web applications and workflow automation systems typically launch in 6 to 10 weeks, while complex enterprise platforms roll out in modular quarterly phases.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const reduce = useReducedMotion();

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section
      id="faq"
      className="relative w-full py-24"
      aria-labelledby="faq-heading"
    >
      <div className="mx-auto w-full max-w-5xl px-5 md:px-8">
        {/* Section Header */}
        <div className="text-center max-w-[680px] mx-auto">
          <h2
            id="faq-heading"
            className="heading-3 sm:heading-2 font-semibold tracking-tight text-ink [text-wrap:balance]"
          >
            Direct answers to common technical and commercial questions
          </h2>
          <p className="mt-4 text-base text-ink-2 [text-wrap:pretty]">
            Clear terms, straightforward delivery, and complete transparency from day one.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="mt-12 space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={cn(
                  "glass-card rounded-xl transition-colors duration-300",
                  isOpen ? "border-electric/40 shadow-xs" : ""
                )}
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left text-ink transition-colors"
                >
                  <span className="text-base font-semibold leading-snug">
                    {faq.question}
                  </span>
                  <ChevronDown
                    size={18}
                    className={cn(
                      "shrink-0 text-ink-3 transition-transform duration-300",
                      isOpen && "rotate-180 text-electric"
                    )}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
                      animate={reduce ? { opacity: 1 } : { opacity: 1, height: "auto" }}
                      exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
                      transition={{ duration: 0.35, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-1 text-sm text-ink-2 leading-relaxed border-t border-line/60 mt-1">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Bottom Contact Prompt */}
        <div className="mt-10 text-center">
          <p className="text-sm text-ink-3">
            Have a question not listed here?{" "}
            <a
              href="#contact"
              className="text-electric font-medium hover:underline inline-flex items-center gap-1"
            >
              Ask our engineering team directly
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
