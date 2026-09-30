"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";
import SplitText from "../../ui/SplitText";

interface ChecklistItem {
  item: string;
  standard: string;
}

interface EngineeringBaselineProps {
  serviceName: string;
  checklist: ChecklistItem[];
}

export const EngineeringBaseline = ({ serviceName, checklist }: EngineeringBaselineProps) => {
  const [showAll, setShowAll] = useState(false);

  if (!checklist || checklist.length === 0) return null;

  const visibleItems = showAll ? checklist : checklist.slice(0, 6);
  const hasMore = checklist.length > 6;

  return (
    <section id="checklist" className="relative w-full bg-[#f8fbfa] py-16 md:py-20 overflow-hidden">
      {/* Background Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(15,23,42,0.06) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(15,23,42,0.06) 1px, transparent 1px)
          `,
          backgroundSize: "52px 52px",
        }}
      />

      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-12 sm:mb-14 md:mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="h-[2px] w-8 rounded-full bg-primary" />
            <div className="inline-flex items-center gap-1.5">
              <SplitText
                as="h2"
                text={`${serviceName} Engineering Baseline`}
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
        </div>

        {/* Checklist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="group"
            >
              <div className="h-full bg-white rounded-2xl border border-slate-200 p-8 flex flex-col transition-all duration-500 group-hover:border-primary/20 group-hover:shadow-xl group-hover:-translate-y-1">
                {/* Top Row: Number + Icon */}
                <div className="flex items-start justify-between mb-6">
                  <div className="text-5xl font-bold text-primary/60 group-hover:text-slate-200 transition-colors duration-300 select-none">
                    {(i + 1).toString().padStart(2, '0')}
                  </div>
                  <div className="text-primary/80 group-hover:text-primary transition-colors">
                    <CheckCircle2 className="w-9 h-9" strokeWidth={1.75} />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <Badge
                    variant="outline"
                    className="mb-4 text-lg font-medium border-primary/20 text-primary group-hover:border-primary/30 group-hover:text-primary transition-colors"
                  >
                    {item.standard}
                  </Badge>

                  <h3 className="text-xl font-semibold text-slate-900 leading-tight mb-3 group-hover:text-primary transition-colors">
                    {item.item}
                  </h3>

                  <p className="text-slate-800 text-md leading-relaxed">
                    Industry-standard compliance and best practice implementation.
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* See More / See Less Button */}
        {hasMore && (
          <div className="mt-10 flex justify-center">
            <button
              onClick={() => setShowAll((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-white px-6 py-2.5 text-sm font-medium text-primary shadow-sm hover:bg-primary hover:text-white transition-all duration-300"
            >
              {showAll ? "See Less" : `See More (${checklist.length - 6} more)`}
            </button>
          </div>
        )}

        {/* Bottom Accent */}
        <div className="mt-16 flex justify-center">
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
        </div>
      </div>
    </section>
  );
};