import { Sparkles } from "lucide-react";

const keywords = [
  "Web Development", "Mobile Apps", "UI/UX Design", "Cloud Solutions", "Cybersecurity",
  "E-commerce", "Digital Marketing", "Business Automation", "IT Consultancy", "Technology Integration",
];

export function KeywordsMarquee() {
  const doubled = [...keywords, ...keywords];
  return (
    <div className="marquee-mask relative overflow-hidden border-y border-line bg-surface py-5">
      <div className="animate-marquee-slow flex w-max items-center gap-8 pr-8">
        {doubled.map((k, i) => (
          <span key={`${k}-${i}`} className="flex shrink-0 items-center gap-8">
            <span className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-ink-3">
              {k}
            </span>
            <Sparkles size={13} className="text-electric/60" />
          </span>
        ))}
      </div>
    </div>
  );
}
