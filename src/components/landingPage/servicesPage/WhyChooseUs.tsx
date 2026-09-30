"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import {
  Rocket,
  Layers,
  Target,
  Users,
  Eye,
  Building2,
  Globe2,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import SplitText from "../../ui/SplitText";

interface Differentiator {
  feature: string;
  description: string;
}

interface WhyChooseUsProps {
  slug: string;
  differentiators: Differentiator[];
}

type Theme = {
  // outer card gradient (soft pastel background)
  bg: string;
  // glow blob behind the illustration
  glow: string;
  // category badge
  badgeBg: string;
  badgeText: string;
  // arrow button
  btn: string;
  // illustration icon color
  icon: string;
  iconBg: string;
  ring: string;
  category: string;
  Icon: LucideIcon;
};

const THEMES: Theme[] = [
  {
    bg: "from-sky-50 via-white to-indigo-50",
    glow: "bg-sky-300/40",
    badgeBg: "bg-white/80 ring-1 ring-sky-200",
    badgeText: "text-sky-600",
    btn: "bg-sky-500 hover:bg-sky-600",
    icon: "text-sky-600",
    iconBg: "from-sky-200 to-indigo-200",
    ring: "ring-sky-200/60",
    category: "Enterprise",
    Icon: Rocket,
  },
  {
    bg: "from-rose-50 via-white to-pink-50",
    glow: "bg-pink-300/40",
    badgeBg: "bg-white/80 ring-1 ring-pink-200",
    badgeText: "text-pink-600",
    btn: "bg-pink-500 hover:bg-pink-600",
    icon: "text-pink-600",
    iconBg: "from-pink-200 to-rose-200",
    ring: "ring-pink-200/60",
    category: "Architecture",
    Icon: Layers,
  },
  {
    bg: "from-emerald-50 via-white to-teal-50",
    glow: "bg-emerald-300/40",
    badgeBg: "bg-white/80 ring-1 ring-emerald-200",
    badgeText: "text-emerald-600",
    btn: "bg-emerald-500 hover:bg-emerald-600",
    icon: "text-emerald-600",
    iconBg: "from-emerald-200 to-teal-200",
    ring: "ring-emerald-200/60",
    category: "KPI-Driven",
    Icon: Target,
  },
  {
    bg: "from-violet-50 via-white to-purple-50",
    glow: "bg-violet-300/40",
    badgeBg: "bg-white/80 ring-1 ring-violet-200",
    badgeText: "text-violet-600",
    btn: "bg-violet-500 hover:bg-violet-600",
    icon: "text-violet-600",
    iconBg: "from-violet-200 to-purple-200",
    ring: "ring-violet-200/60",
    category: "Intelligence",
    Icon: Users,
  },
  {
    bg: "from-amber-50 via-white to-orange-50",
    glow: "bg-amber-300/40",
    badgeBg: "bg-white/80 ring-1 ring-amber-200",
    badgeText: "text-amber-600",
    btn: "bg-amber-500 hover:bg-amber-600",
    icon: "text-amber-600",
    iconBg: "from-amber-200 to-orange-200",
    ring: "ring-amber-200/60",
    category: "Design",
    Icon: Eye,
  },
  {
    bg: "from-cyan-50 via-white to-blue-50",
    glow: "bg-cyan-300/40",
    badgeBg: "bg-white/80 ring-1 ring-cyan-200",
    badgeText: "text-cyan-600",
    btn: "bg-cyan-500 hover:bg-cyan-600",
    icon: "text-cyan-600",
    iconBg: "from-cyan-200 to-blue-200",
    ring: "ring-cyan-200/60",
    category: "DevSecOps",
    Icon: Building2,
  },
  {
    bg: "from-indigo-50 via-white to-blue-50",
    glow: "bg-indigo-300/40",
    badgeBg: "bg-white/80 ring-1 ring-indigo-200",
    badgeText: "text-indigo-600",
    btn: "bg-indigo-500 hover:bg-indigo-600",
    icon: "text-indigo-600",
    iconBg: "from-indigo-200 to-blue-200",
    ring: "ring-indigo-200/60",
    category: "Reliability",
    Icon: Globe2,
  },
  {
    bg: "from-teal-50 via-white to-emerald-50",
    glow: "bg-teal-300/40",
    badgeBg: "bg-white/80 ring-1 ring-teal-200",
    badgeText: "text-teal-600",
    btn: "bg-teal-500 hover:bg-teal-600",
    icon: "text-teal-600",
    iconBg: "from-teal-200 to-emerald-200",
    ring: "ring-teal-200/60",
    category: "Platform",
    Icon: ShieldCheck,
  },
];

// Bento spans matching the reference layout (4-col grid, 8 cards)
// Row 1: [span-2] [span-1] [span-1]
// Row 2: [span-1 row-2 (tall)] [span-1] [span-2]
// Row 3: (tall continues) [span-1] [span-1] [span-1]
const SPANS = [
  "md:col-span-2 md:row-span-1", // 1
  "md:col-span-1 md:row-span-1", // 2
  "md:col-span-1 md:row-span-1", // 3
  "md:col-span-1 md:row-span-2", // 4 (tall)
  "md:col-span-1 md:row-span-1", // 5
  "md:col-span-2 md:row-span-1", // 6
  "md:col-span-1 md:row-span-1", // 7
  "md:col-span-1 md:row-span-1", // 8
  "md:col-span-1 md:row-span-1", // 9 ← changed from col-span-2 to col-span-1
];
export const WhyChooseUs = ({ slug, differentiators }: WhyChooseUsProps) => {
  if (!differentiators || differentiators.length === 0) return null;

  const isEnterprise = slug.includes("enterprise");
  const isSaaS = slug.includes("saas");
  const isMVP = slug.includes("mvp");

  const getTitleText = () => {
    if (isEnterprise) return "Enterprise Organizations";
    if (isSaaS) return "SaaS Founders";
    if (isMVP) return "Founders";
    return "Companies";
  };

  // Helper to process multi-column descriptions for the bento layout
  // For bento, we only show the first part or combine meaningfully
  const getDisplayDescription = (description: string) => {
    const parts = description.split("|").map(s => s.trim());
    // If it's multi-column, for bento we'll show a summary or the first part
    if (parts.length > 1) {
      // For enterprise, show the ClickMasters advantage
      if (isEnterprise) return parts[0];
      // For SaaS, show the ClickMasters advantage (second column)
      if (isSaaS) return parts[1] || parts[0];
      // For MVP or others, show the first part
      return parts[0];
    }
    return description;
  };

  return (
    <section id="why-choose-us" className="relative overflow-hidden bg-[#f5fbfb] py-24 px-4 sm:px-8">
      {/* ambient background blobs */}
      {/* <div className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-sky-200/40 blur-3xl" /> */}
      <div className="pointer-events-none absolute -right-32 bottom-20 h-96 w-96 rounded-full bg-purple-200/40 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}



         <div className="mx-auto max-w-3xl text-center mb-12 sm:mb-14 md:mb-16">
                        <div className="inline-flex items-center gap-2 mb-3">
                          <span className="h-[2px] w-8 rounded-full bg-primary" />
                          <div className="inline-flex items-center gap-1.5">
                            <SplitText
                              as="h2"
                              text={`Why ${getTitleText()} Choose ClickMasters? `}
                              className="text-2xl md:text-3xl font-bold uppercase tracking-[0.25em] text-primary"
                              delay={60}
                              duration={0.8}
                              ease="power3.out"
                              splitType="words"
                              from={{ opacity: 0, x: 60 }}
                              to={{ opacity: 1, x: 0 }}
                              threshold={0.2}
                            />
                          </div>
                          <span className="h-[2px] w-8 rounded-full bg-primary" />
                        </div>
              
                        <p className="mx-auto max-w-2xl text-base leading-7 text-slate-800 sm:text-lg">
                          We blend deep engineering, design clarity, and business-aligned delivery to build
            products that define industries.
                        </p>
              </div>
              

        
     

        {/* Bento Grid */}
     <div className="grid auto-rows-[350px] grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-4 md:[grid-auto-flow:dense]">
          {differentiators.map((diff, idx) => {
            const theme = THEMES[idx % THEMES.length];
       const span = SPANS[idx] || "md:col-span-1 md:row-span-1";
            const Icon = theme.Icon;
            const isTall = span.includes("row-span-2");
            const isWide = span.includes("col-span-2");
            const displayDescription = getDisplayDescription(diff.description);

            return (
              <motion.div
  key={diff.feature}
  initial={{ opacity: 0, y: 24 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-50px" }}
  transition={{ duration: 0.5, delay: idx * 0.05 }}
  whileHover={{ y: -4 }}
  className={cn(
    "group relative flex flex-col overflow-hidden rounded-3xl bg-gradient-to-br p-6 pb-9 ring-1 shadow-sm transition-shadow hover:shadow-xl",
    theme.bg,
    theme.ring,
    span,
  )}
>
                {/* glow blob */}
                <div
                  className={cn(
                    "pointer-events-none absolute -top-10 right-1/2 h-56 w-56 translate-x-1/2 rounded-full blur-3xl transition-transform duration-500 group-hover:scale-110",
                    theme.glow,
                    isTall && "top-1/3",
                  )}
                />

                {/* Category badge */}
                <div
                  className={cn(
                    "relative inline-flex w-fit items-center gap-1.5 rounded-lg px-2.5 py-1 text-sm font-semibold uppercase tracking-wider backdrop-blur-sm",
                    theme.badgeBg,
                    theme.badgeText,
                  )}
                >
                  {/* <Sparkles className="h-3 w-3" /> */}
                  {theme.category}
                </div>

                {/* Illustration */}
                <div
                  className={cn(
                    "relative mx-auto my-4 flex items-center justify-center",
                    isTall ? "flex-1" : "flex-1",
                  )}
                >
                  <div
                    className={cn(
                      "relative flex items-center justify-center rounded-full bg-gradient-to-br shadow-inner",
                      theme.iconBg,
                      isTall ? "h-32 w-32" : isWide ? "h-24 w-24" : "h-20 w-20",
                    )}
                  >
                    <div className="absolute inset-2 rounded-full bg-white/40 backdrop-blur-sm" />
                    <Icon
                      className={cn(
                        "relative drop-shadow-sm",
                        theme.icon,
                        isTall ? "h-14 w-14" : isWide ? "h-11 w-11" : "h-9 w-9",
                      )}
                      strokeWidth={1.6}
                    />
                  </div>
                  {/* index pill */}
                  <span className="absolute -top-1 right-0 rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-bold text-slate-500 ring-1 ring-slate-200/60 backdrop-blur">
                    {(idx + 1).toString().padStart(2, "0")}
                  </span>
                </div>

               
              {/* Text content */}
<div className="relative mt-auto flex-1 flex flex-col justify-end">
  <h3 className="text-xl font-bold leading-snug text-slate-900 sm:text-xl">
    {diff.feature}
  </h3>
  <p className="mt-1.5 line-clamp-4 text-lg leading-relaxed text-slate-900">
    {displayDescription}
  </p>
  
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;