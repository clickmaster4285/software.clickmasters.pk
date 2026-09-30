"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  Lightbulb,
  Code2,
  Rocket,
  ShieldCheck,
  RefreshCw,
  Users,
} from "lucide-react";
import ExpandOnHover from "@/components/ui/expand-cards";
import SplitText from '../../ui/SplitText';

export default function ProcessPage() {
  const metricsRef = useRef<HTMLDivElement>(null);
  const expandSectionRef = useRef<HTMLDivElement>(null);

  const metricsInView = useInView(metricsRef, { once: true });
  const expandInView = useInView(expandSectionRef, { once: true });

  const phases = [
    {
      step: "01",
      title: "Discovery & Strategy",
      icon: Lightbulb,
      color: "from-primary to-primary",
      bgLight: "bg-amber-50",
      description: "We align technology with business goals through deep discovery sessions, market analysis, and technical blueprinting.",
      deliverables: ["Requirements specification", "Technical architecture design", "Roadmap & sprint planning", "Risk assessment matrix"],
      duration: "1-2 weeks",
    },
    {
      step: "02",
      title: "UX/UI Design",
      icon: Users,
      color: "from-purple-500 to-indigo-600",
      bgLight: "bg-purple-50",
      description: "User-centered design that balances aesthetics with functionality. Wireframes to high-fidelity prototypes.",
      deliverables: ["User flow diagrams", "Interactive prototypes", "Design system & components", "Accessibility compliance"],
      duration: "2-4 weeks",
    },
    {
      step: "03",
      title: "Agile Development",
      icon: Code2,
      color: "from-blue-500 to-cyan-600",
      bgLight: "bg-blue-50",
      description: "Sprint-based engineering with continuous integration, code reviews, and test-driven development.",
      deliverables: ["Working software every sprint", "API documentation", "Unit & integration tests", "Code quality reports"],
      duration: "8-20 weeks",
    },
    {
      step: "04",
      title: "QA & Security",
      icon: ShieldCheck,
      color: "from-red-500 to-rose-600",
      bgLight: "bg-red-50",
      description: "Rigorous quality assurance, penetration testing, and compliance validation before release.",
      deliverables: ["Automated test suites", "Security audit report", "Performance benchmarks", "Cross-browser validation"],
      duration: "1-3 weeks",
    },
    {
      step: "05",
      title: "Deployment & Launch",
      icon: Rocket,
      color: "from-green-500 to-primary",
      bgLight: "bg-green-50",
      description: "Zero-downtime deployment, infrastructure scaling, and launch orchestration.",
      deliverables: ["CI/CD pipeline setup", "Load balancing configuration", "Backup & disaster recovery", "Launch day support"],
      duration: "1 week",
    },
    {
      step: "06",
      title: "Growth & Iteration",
      icon: RefreshCw,
      color: "from-indigo-500 to-purple-600",
      bgLight: "bg-indigo-50",
      description: "Post-launch analytics, feature expansion, and continuous optimization based on real usage.",
      deliverables: ["Performance monitoring", "User analytics dashboard", "Quarterly roadmap updates", "24/7 support SLA"],
      duration: "Ongoing",
    },
  ];

  const metrics = [
    { value: 98, suffix: "%", label: "Projects delivered on time" },
    { value: 3.5, suffix: "x", label: "Avg. client revenue growth", isFloat: true },
    { value: 40, suffix: "%", label: "Faster time-to-market*" },
    { value: 100, suffix: "%", label: "IP ownership & transparency" },
  ];

  const allProcessImages = [
    "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&h=600&fit=crop",
  ];

  // Animated Counter Component
  const AnimatedCounter = ({ value, suffix, isFloat = false }: { value: number; suffix: string; isFloat?: boolean }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!metricsInView) return;

      let start = 0;
      const duration = 1800;
      const increment = value / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(isFloat ? Math.round(start * 10) / 10 : Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }, [value, isFloat, metricsInView]);

    return (
      <span className="font-bold text-primary">
        {isFloat ? count.toFixed(1) : Math.floor(count)}{suffix}
      </span>
    );
  };

  return (
    <main className="bg-[#f5fbfb] overflow-x-hidden relative">
      {/* Background Decorative Blobs */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#a7f3d0] opacity-30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-[#fdba74] opacity-25 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 -left-32 h-[550px] w-[550px] -translate-y-1/2 rounded-full bg-[#93c5fd] opacity-25 blur-3xl" />

      <section ref={expandSectionRef} className="py-6 lg:py-12 px-4 lg:px-8">
        {/* Main Centered Container - Max 1600px */}
        <div className="mx-auto max-w-[1600px]">

          {/* Header Section */}
          <div className="mx-auto max-w-3xl text-center mb-8 mt-12">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="h-[2px] w-8 rounded-full bg-primary" />
              <SplitText
                as="h2"
                text="Visual Process Journey"
                className="text-2xl md:text-3xl font-bold uppercase tracking-[0.25em] text-primary"
                delay={60}
                duration={0.8}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, x: 60 }}
                to={{ opacity: 1, x: 0 }}
                threshold={0.2}
              />
              <span className="h-[2px] w-8 rounded-full bg-primary" />
            </div>

           
          </div>

          {/* Metrics Section */}
          <section ref={metricsRef} className="mb-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 px-4 lg:px-8">
              {metrics.map((metric, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  animate={metricsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: idx * 0.1, duration: 0.6 }}
                  className="text-center transition-all duration-300 hover:scale-105"
                >
                  <div className="text-4xl font-bold text-primary mb-2">
                    <AnimatedCounter 
                      value={metric.value} 
                      suffix={metric.suffix} 
                      isFloat={metric.isFloat} 
                    />
                  </div>
                  <p className="text-gray-900 text-md  font-medium">{metric.label}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ExpandOnHover Section */}
          {/* Desktop */}
<div className="hidden lg:block overflow-hidden">
  <ExpandOnHover
    images={allProcessImages}
    phases={phases}
    defaultExpandedIndex={3}
    containerHeight="28rem"
    onImageChange={(index, phase) => {
      console.log(`Viewing process stage ${index}: ${phase?.title}`);
    }}
  />
</div>

{/* Mobile */}
<div className="lg:hidden space-y-4 px-2">
  {phases.map((phase, index) => (
    <div
      key={phase.step}
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      <img
        src={allProcessImages[index]}
        alt={phase.title}
        className="h-48 w-full object-cover"
      />

      <div className="p-5">
        <div className="mb-2 text-sm font-bold text-primary">
          Step {phase.step}
        </div>

        <h3 className="mb-2 text-xl font-bold text-slate-900">
          {phase.title}
        </h3>

        <p className="mb-4 text-sm text-slate-900">
          {phase.description}
        </p>

        <div className="mb-4 flex flex-wrap gap-2">
          {phase.deliverables.slice(0, 3).map((item) => (
            <span
              key={item}
              className="rounded-full bg-primary/10 px-2.5 py-1 text-xs text-primary"
            >
              {item}
            </span>
          ))}
        </div>

        <div className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium">
          {phase.duration}
        </div>
      </div>
    </div>
  ))}
</div>

        </div>
      </section>
    </main>
  );
}