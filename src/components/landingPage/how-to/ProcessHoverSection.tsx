"use client";

import React from "react";
import ExpandOnHover from "@/components/ui/expand-cards";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ArrowRight } from "lucide-react";



type Step = {
  num: number;
  title: string;
  body: string;
  duration: string;
  output?: string;
};

export default function ProcessHoverSection({
  steps,
}: {
  steps: Step[];
}) {
  const phases = steps.map((step) => ({
    step: String(step.num).padStart(2, "0"),
    title: step.title,
    icon: undefined,
    color: "from-primary to-orange-600",
    bgLight: "bg-amber-50",
    description: step.body,
    deliverables: step.output ? [step.output] : [],
    duration: step.duration,
  }));

const images = [
  "/images/process/photo-1555066931-4365d14bab8c.webp", // Dark code editor
  "/images/process/photo-1542831371-29b0f74f9713.webp", // Dark terminal with code
  "/images/process/photo-1555949963-ff9fe0c870eb.webp", // Dark laptop with code
  "/images/process/photo-1551033406-611cf9a28f67.webp", // Dark coding setup
  "/images/process/photo-1515879218367-8466d910aaa4.webp", // Dark blue code
  "/images/process/photo-1461749280684-dccba630e2f6.webp"  // Dark screen with code
];

  return (
      <div className="overflow-hidden">
          
  <div className="mx-auto max-w-3xl text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="h-[2px] w-8 rounded-full bg-primary" />
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary/80">
              The Complete Process
            </p>
            <span className="h-[2px] w-8 rounded-full bg-primary" />
          </div>

        <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-2xl lg:text-3xl">
Step-by-step guide

          </h2>
          

        
        </div>

          
          
      <ExpandOnHover
        images={images}
        phases={phases}
        defaultExpandedIndex={0}
        containerHeight="28rem"
        onImageChange={(index, phase) => {
          console.log(index, phase?.title);
        }}
      />
    </div>
  );
}