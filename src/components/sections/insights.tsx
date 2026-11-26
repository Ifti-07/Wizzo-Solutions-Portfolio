"use client";

import { insightsArticles } from "@/lib/site";
import { ArrowUpRight, Clock, Calendar } from "lucide-react";

export function InsightsSection() {
  return (
    <section id="insights" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <h2 className="font-display mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
              Practical Technology Insights &amp; Architectural Thinking
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-ink-2">
            Perspectives from our team on modern web platforms, practical automation, and software
            engineering decisions that protect business velocity.
          </p>
        </div>

        {/* 3 Editorial Cards */}
        <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {insightsArticles.map((article) => (
            <article
              key={article.id}
              className="glass-card group flex flex-col justify-between rounded-3xl p-7 transition-all duration-300 hover:shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between border-b border-line pb-3 text-[11px] text-ink-3">
                  <span className="rounded-full bg-electric-soft px-2.5 py-0.5 font-mono font-semibold text-electric">
                    {article.category}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} className="text-ink-3" />
                      {article.publishedDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} className="text-ink-3" />
                      {article.readTime}
                    </span>
                  </div>
                </div>

                <h3 className="font-display mt-5 text-xl font-bold leading-snug text-ink transition-colors group-hover:text-electric">
                  {article.title}
                </h3>

                <p className="mt-3 text-xs leading-relaxed text-ink-2 sm:text-sm">
                  {article.excerpt}
                </p>
              </div>

              <div className="mt-8 border-t border-line/60 pt-4 flex items-center justify-between text-xs text-ink-3">
                <span className="font-medium text-ink-2">{article.author}</span>
                <span className="inline-flex items-center gap-1 font-semibold text-electric group-hover:underline">
                  Read Article
                  <ArrowUpRight size={13} />
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
