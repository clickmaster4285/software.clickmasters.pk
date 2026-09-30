"use client";

import { useEffect, useRef, useState } from "react";
import {
  Heart,
  Landmark,
  Building2,
  Factory,
  Truck,
  Cpu,
  type LucideIcon,
} from "lucide-react";

import SplitText from "../../ui/SplitText";

interface IndustryUseCase {
  name: string;
}

interface IndustriesSectionProps {
  industryUseCases: IndustryUseCase[];
}

/* ---------------- ICON MAP ---------------- */
const iconMap: Record<string, LucideIcon> = {
  "Manufacturing & Industrial Operations": Factory,
  "Healthcare & MedTech": Heart,
  "Logistics & Supply Chain": Truck,
  "Fintech & Financial Services": Landmark,
  "Real Estate & PropTech": Building2,
  "SaaS & Technology Companies": Cpu,
  Manufacturing: Factory,
  Healthcare: Heart,
  Logistics: Truck,
  Fintech: Landmark,
  "Real Estate": Building2,
  SaaS: Cpu,
  Technology: Cpu,
};

const getIcon = (name: string): LucideIcon => iconMap[name] || Building2;

/* ---------------- INVIEW HOOK ---------------- */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

/* ---------------- CARD ---------------- */
function IndustryCard({
  name,
  index,
  visible,
}: {
  name: string;
  index: number;
  visible: boolean;
}) {
  const Icon = getIcon(name);

  return (
    <div
      className="group relative bg-white/40 hover:bg-white transition-colors duration-200 p-8 flex flex-col items-center justify-center gap-5 min-h-[180px]"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.4s ease ${index * 60}ms, transform 0.4s ease ${index * 60}ms`,
      }}
    >
      {/* bottom hover line */}
      <span
        className="absolute bottom-0 left-0 w-full h-[3px] bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      />

      {/* icon */}
      <div className="w-16 h-16 flex items-center justify-center rounded-xl group-hover:bg-primary/10 transition-all duration-200">
        <Icon size={28} className="text-primary" strokeWidth={1.5} />
      </div>

      {/* text */}
      <div className="text-center">
        <p className="text-xl font-semibold text-gray-900 leading-snug">
          {name}
        </p>
      </div>
    </div>
  );
}

/* ---------------- SECTION ---------------- */
export const IndustriesSection = ({
  industryUseCases,
}: IndustriesSectionProps) => {
  const { ref, visible } = useInView();

  if (!industryUseCases?.length) return null;

  return (
    <section id="industries" ref={ref} className="relative w-full bg-[#f5fbfb] py-14">
      
      <div
    className="absolute inset-0 opacity-[0.45]"
    style={{
      backgroundImage: `
        linear-gradient(to right, rgba(15,23,42,0.06) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(15,23,42,0.06) 1px, transparent 1px)
      `,
      backgroundSize: "48px 48px",
    }}
  />

      <div className="mx-auto max-w-[1600px] px-6 lg:px-8">
        {/* ✅ EXACT SAME HEADER STYLE (Split header like TrustedClients) */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="h-[2px] w-8 rounded-full bg-primary" />

            <div className="inline-flex items-center gap-1.5 mt-6">
              <SplitText
                as="h2"
                text="Industry Expertise"
                className="text-2xl md:text-3xl font-bold uppercase tracking-[0.25em] text-primary"
                delay={60}
                duration={0.8}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, x: 60 }}
                to={{ opacity: 1, x: 0 }}
                threshold={0.2}
              />
            </div>

            <span className="h-[2px] w-8 rounded-full bg-primary" />
          </div>

          <p className="text-gray-800 max-w-2xl mx-auto text-base md:text-lg">
            Deep expertise across multiple industries with tailored AI and software solutions
          </p>
        </div>

        {/* GRID SAME STYLE */}
        <div className="border border-gray-200 rounded-xl overflow-hidden grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-x divide-y divide-gray-200">
          {industryUseCases.map((item, idx) => (
            <IndustryCard
              key={item.name}
              name={item.name}
              index={idx}
              visible={visible}
            />
          ))}
        </div>
      </div>
    </section>
  );
};