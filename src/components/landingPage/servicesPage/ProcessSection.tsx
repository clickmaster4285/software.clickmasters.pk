// components/landingPage/servicesPage/ProcessSection.tsx

"use client";

import { Badge } from '@/components/ui/badge';
import { Search, Zap, Target, Rocket, LucideIcon, ArrowRight, Clock, Gem, Code, BarChart } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import SplitText from '../../ui/SplitText';

interface ProcessPhase {
  phase: string;
  title: string;
  timeline: string;
  text: string;
}

interface ProcessSectionProps {
  serviceName: string;
  processPhases: ProcessPhase[];
}

// Expanded Icon Mapping for up to 6+ phases
const getPhaseIcon = (phaseNumber: number): LucideIcon => {
  const icons: Record<number, LucideIcon> = {
    1: Search,
    2: Zap,
    3: Target,
    4: Rocket,
    5: Code,
    6: BarChart,
  };
  return icons[phaseNumber] || Search;
};

const getPhaseGradient = (phaseNumber: number): string => {
  const gradients: Record<number, string> = {
    1: "linear-gradient(135deg, #f97316 0%, #f59e0b 100%)",
    2: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
    3: "linear-gradient(135deg, #ec4899 0%, #a855f7 100%)",
    4: "linear-gradient(135deg, #10b981 0%, #14b8a6 100%)",
    5: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
    6: "linear-gradient(135deg, #ef4444 0%, #f97316 100%)",
  };
  return gradients[phaseNumber] || "linear-gradient(135deg, #f97316 0%, #f59e0b 100%)";
};

const getPhaseColor = (phaseNumber: number) => {
  const colors: Record<number, { from: string; to: string }> = {
    1: { from: 'from-primary', to: 'to-primary' },
    2: { from: 'from-cyan-500', to: 'to-blue-500' },
    3: { from: 'from-purple-500', to: 'to-pink-500' },
    4: { from: 'from-emerald-500', to: 'to-teal-500' },
    5: { from: 'from-indigo-500', to: 'to-violet-500' },
    6: { from: 'from-red-500', to: 'to-primary' },
  };
  return colors[phaseNumber] || { from: 'from-primary', to: 'to-primary' };
};


const CARD_DURATION = 0.45; // was 0.8
const PIPE_DURATION = 0.45; // was 1.0
const STEP_GAP = CARD_DURATION + PIPE_DURATION;
const HOLD_DURATION = 5; // 5 second hold before restarting

const HPipe = ({ delay, reverse = false, startAnimation }: { delay: number; reverse?: boolean; startAnimation: boolean }) => (
  <div className="relative flex items-center">
    {!reverse && (
      <motion.div
        initial={{ opacity: 0, scale: 0, x: 15 }}
        animate={startAnimation ? { opacity: 1, scale: 1, x: 0 } : { opacity: 0, scale: 0, x: 15 }}
        transition={{ delay: delay + PIPE_DURATION, duration: 0.3, type: "spring", stiffness: 200 }}
        className="hidden lg:block order-last -ml-4"
      >
        <div className="w-0 h-0 border-y-[14px] border-y-transparent border-l-[24px] border-l-primary" />
      </motion.div>
    )}
    
    <div className="relative flex-1 h-3 mx-2 rounded-full bg-primary/10 overflow-hidden min-w-[200px] hidden lg:block">
      <div className="absolute inset-0 bg-primary/10 rounded-full" />
      <motion.div
        initial={{ scaleX: 0 }}
        animate={startAnimation ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ delay, duration: PIPE_DURATION, ease: "easeInOut" }}
        style={{ transformOrigin: reverse ? "right" : "left" }}
        className="absolute inset-0 bg-gradient-to-r from-primary to-secondaryrounded-full"
      />
    </div>
    
    {reverse && (
      <motion.div
        initial={{ opacity: 0, scale: 0, x: -15 }}
        animate={startAnimation ? { opacity: 1, scale: 1, x: 0 } : { opacity: 0, scale: 0, x: -15 }}
        transition={{ delay: delay + PIPE_DURATION, duration: 0.3, type: "spring", stiffness: 200 }}
        className="hidden lg:block order-first -mr-4"
      >
        <div className="w-0 h-0 border-y-[14px] border-y-transparent border-r-[24px] border-r-primary" />
      </motion.div>
    )}
  </div>
);

const VPipe = ({ delay, startAnimation }: { delay: number; startAnimation: boolean }) => (
  <div className="relative flex flex-col items-center">
    <div className="relative w-3 h-12 my-2 rounded-full bg-primary/10 overflow-hidden hidden lg:block">
      <div className="absolute inset-0 bg-primary/10 rounded-full" />
      <motion.div
        initial={{ scaleY: 0 }}
        animate={startAnimation ? { scaleY: 1 } : { scaleY: 0 }}
        transition={{ delay, duration: PIPE_DURATION, ease: "easeInOut" }}
        style={{ transformOrigin: "top" }}
        className="absolute inset-0 bg-gradient-to-b from-primary to-secondaryrounded-full"
      />
    </div>
    <motion.div
      initial={{ opacity: 0, scale: 0, y: -10 }}
      animate={startAnimation ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0, y: -10 }}
      transition={{ delay: delay + PIPE_DURATION, duration: 0.3, type: "spring", stiffness: 200 }}
      className="hidden lg:block -mt-3"
    >
      <div className="w-0 h-0 border-x-[12px] border-x-transparent border-t-[20px] border-t-primary" />
    </motion.div>
  </div>
);

// Desktop Animated Card Component (with full animations)
const DesktopProcessCard = ({ phase, delay, side, startAnimation }: { phase: any; delay: number; side: "left" | "right"; startAnimation: boolean }) => {
  const Icon = phase.icon;
  const colors = getPhaseColor(phase.index);
  const initialX = side === "left" ? -60 : 60;

  const getIconColor = (index: number) => {
    const colors: Record<number, string> = {
      1: "text-primary",
      2: "text-cyan-500",
      3: "text-purple-500",
      4: "text-emerald-500",
      5: "text-indigo-500",
      6: "text-red-500",
    };
    return colors[index] || "text-primary";
  };

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, rotate: -8, x: initialX }}
      animate={startAnimation ? { scale: 1, opacity: 1, rotate: 0, x: 0 } : { scale: 0, opacity: 0, rotate: -8, x: initialX }}
      transition={{
        delay,
        type: "spring",
        stiffness: 360,
        damping: 16,
        mass: 0.7,
      }}
      className="relative w-96 lg:w-[350px] xl:w-[400px]  rounded-2xl bg-white border border-primary/20 shadow-lg hover:shadow-xl transition-shadow duration-300 p-5 md:p-6 flex flex-col gap-3 md:gap-4"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            {phase.phase}
          </span>
          <div className="flex items-center gap-2 mt-1 md:mt-2">
            <Badge variant="outline" className="border-primary bg-primary/10 text-primary text-sm px-2 py-0.5 md:py-1 font-medium">
              <Clock className="h-3 w-3 mr-1" />
              {phase.timeline}
            </Badge>
          </div>
        </div>
        <motion.div 
          className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shrink-0"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Icon className={`h-5 w-5 md:h-6 md:w-6 ${getIconColor(phase.index)}`} />
        </motion.div>
      </div>

      <div className="flex-1">
        <motion.h3 
          initial={{ opacity: 0 }}
          animate={startAnimation ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: delay + 0.25 }}
          className="text-xl md:text-xl lg:text-2xl font-bold text-slate-900 leading-tight mb-2 md:mb-3"
        >
          {phase.title}
        </motion.h3>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={startAnimation ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: delay + 0.35 }}
          className="text-lg text-gray-900 leading-relaxed"
        >
          {phase.text}
        </motion.p>

        <motion.div 
          initial={{ scaleX: 0 }}
          animate={startAnimation ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ delay: delay + 0.45, duration: 0.4 }}
          className={`mt-3 md:mt-4 h-1 w-12 md:w-16 bg-gradient-to-r ${colors.from} ${colors.to} rounded-full origin-left`}
        />
      </div>
    </motion.div>
  );
};

// Mobile Card Component (simple fade-in, no complex animations)
const MobileProcessCard = ({ phase, index, startAnimation }: { phase: any; index: number; startAnimation: boolean }) => {
  const Icon = phase.icon;
  const colors = getPhaseColor(phase.index);

  const getIconColor = (index: number) => {
    const colors: Record<number, string> = {
      1: "text-primary",
      2: "text-cyan-500",
      3: "text-purple-500",
      4: "text-emerald-500",
      5: "text-indigo-500",
      6: "text-red-500",
    };
    return colors[index] || "text-primary";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={startAnimation ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{
        duration: 0.5,
        delay: index * 0.15,
        ease: "easeOut"
      }}
      className="rounded-2xl bg-white border border-primary/20 shadow-lg p-7 flex flex-col gap-3"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            {phase.phase}
          </span>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="border-primary bg-primary/10 text-primary text-xs px-2 py-0.5 font-medium">
              <Clock className="h-3 w-3 mr-1" />
              {phase.timeline}
            </Badge>
          </div>
        </div>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
          <Icon className={`h-5 w-5 ${getIconColor(phase.index)}`} />
        </div>
      </div>

      <div className="flex-1">
        <h3 className="text-lg lg:text-xl font-bold text-slate-900 leading-tight mb-2">
          {phase.title}
        </h3>
        
        <p className="text-sm text-gray-900 leading-relaxed">
          {phase.text}
        </p>

        <div className={`mt-3 h-1 w-12 bg-gradient-to-r ${colors.from} ${colors.to} rounded-full`} />
      </div>
    </motion.div>
  );
};

// Helper to calculate animation delays for N phases
const calculateDelays = (numPhases: number) => {
  const delays = [];
  let currentDelay = 0;
  
  for (let i = 0; i < numPhases; i++) {
    delays.push(currentDelay);
    currentDelay += CARD_DURATION;
    if (i < numPhases - 1) {
      currentDelay += PIPE_DURATION;
    }
  }
  
  return delays;
};

export const ProcessSection = ({ serviceName, processPhases }: ProcessSectionProps) => {
  const [startAnimation, setStartAnimation] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const [cycle, setCycle] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const phases = processPhases.map((phase, index) => ({
    ...phase,
    index: index + 1,
    icon: getPhaseIcon(index + 1),
    gradient: getPhaseGradient(index + 1),
  }));

  const TOTAL_DURATION = (phases.length - 1) * STEP_GAP + CARD_DURATION + 1.2;
  const delays = calculateDelays(phases.length);

  // Check if desktop view
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024); // lg breakpoint
    };
    
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // Start animation when section comes into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !startAnimation) {
          setStartAnimation(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [startAnimation]);

  // Auto-loop the animation with 5 second hold for desktop only
  useEffect(() => {
    if (!startAnimation || !isDesktop) return;
    
    const scheduleNextCycle = () => {
      timeoutRef.current = setTimeout(() => {
        setCycle((c) => c + 1);
      }, HOLD_DURATION * 1000);
    };
    
    // Schedule the next cycle after the current cycle completes
    const timer = setTimeout(() => {
      scheduleNextCycle();
    }, TOTAL_DURATION * 1000);
    
    return () => {
      clearTimeout(timer);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [cycle, startAnimation, isDesktop, TOTAL_DURATION]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Generate rows for desktop layout (supports 2, 4, 6 phases)
  const renderDesktopRows = () => {
    const rows = [];
    
    if (phases.length === 2) {
      rows.push(
        <div key="row-0" className="flex flex-row items-center justify-center gap-6 flex-wrap">
          <DesktopProcessCard key={0} phase={phases[0]} delay={delays[0]} side="left" startAnimation={startAnimation} />
          <HPipe delay={delays[0] + CARD_DURATION} startAnimation={startAnimation} />
          <DesktopProcessCard key={1} phase={phases[1]} delay={delays[1]} side="right" startAnimation={startAnimation} />
        </div>
      );
    } 
    else if (phases.length === 4) {
      rows.push(
        <div key="row-top" className="flex flex-row items-center justify-center gap-6 flex-wrap">
          <DesktopProcessCard phase={phases[0]} delay={delays[0]} side="left" startAnimation={startAnimation} />
          <HPipe delay={delays[0] + CARD_DURATION} startAnimation={startAnimation} />
          <DesktopProcessCard phase={phases[1]} delay={delays[1]} side="right" startAnimation={startAnimation} />
        </div>
      );
      rows.push(
        <div key="v-pipe" className="flex justify-center lg:justify-end pr-[15%] lg:pr-[18%] my-2 md:my-4">
          <VPipe delay={delays[1] + CARD_DURATION} startAnimation={startAnimation} />
        </div>
      );
      rows.push(
        <div key="row-bottom" className="flex flex-row items-center justify-center gap-6 flex-wrap">
          <DesktopProcessCard phase={phases[3]} delay={delays[3]} side="left" startAnimation={startAnimation} />
          <HPipe delay={delays[2] + CARD_DURATION} reverse startAnimation={startAnimation} />
          <DesktopProcessCard phase={phases[2]} delay={delays[2]} side="right" startAnimation={startAnimation} />
        </div>
      );
    }
    else if (phases.length === 6) {
      rows.push(
        <div key="row-1" className="flex flex-row items-center justify-center gap-6 flex-wrap">
          <DesktopProcessCard phase={phases[0]} delay={delays[0]} side="left" startAnimation={startAnimation} />
          <HPipe delay={delays[0] + CARD_DURATION} startAnimation={startAnimation} />
          <DesktopProcessCard phase={phases[1]} delay={delays[1]} side="right" startAnimation={startAnimation} />
        </div>
      );
      
      rows.push(
        <div key="v-pipe-1-2" className="flex justify-center lg:justify-end pr-[15%] lg:pr-[18%] my-2 md:my-4">
          <VPipe delay={delays[1] + CARD_DURATION} startAnimation={startAnimation} />
        </div>
      );
      
      rows.push(
        <div key="row-2" className="flex flex-row items-center justify-center gap-6 flex-wrap">
          <DesktopProcessCard phase={phases[3]} delay={delays[3]} side="left" startAnimation={startAnimation} />
          <HPipe delay={delays[2] + CARD_DURATION} reverse startAnimation={startAnimation} />
          <DesktopProcessCard phase={phases[2]} delay={delays[2]} side="right" startAnimation={startAnimation} />
        </div>
      );
      
      rows.push(
        <div key="v-pipe-2-3" className="flex justify-center lg:justify-start pl-[15%] lg:pl-[18%] my-2 md:my-4">
          <VPipe delay={delays[3] + CARD_DURATION} startAnimation={startAnimation} />
        </div>
      );
      
      rows.push(
        <div key="row-3" className="flex flex-row items-center justify-center gap-6 flex-wrap">
          <DesktopProcessCard phase={phases[4]} delay={delays[4]} side="left" startAnimation={startAnimation} />
          <HPipe delay={delays[4] + CARD_DURATION} startAnimation={startAnimation} />
          <DesktopProcessCard phase={phases[5]} delay={delays[5]} side="right" startAnimation={startAnimation} />
        </div>
      );
    }
    
    return rows;
  };

  return (
    <section 
      key={cycle} 
      ref={sectionRef}
      id="our-process" 
      className="scroll-mt-24 py-8 md:py-12 lg:py-16 bg-[#f5fbfb] w-full px-4 md:px-0 relative "
    >




      {/* SAME BLOBS AS TRUSTED CLIENTS */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#a7f3d0] opacity-30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-[#fdba74] opacity-25 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 -left-32 h-[550px] w-[550px] -translate-y-1/2 rounded-full bg-[#93c5fd] opacity-25 blur-3xl" />




    <div className="mx-auto max-w-3xl text-center mb-12 sm:mb-14 md:mb-16">
                <div className="inline-flex items-center gap-2 mb-3">
                  <span className="h-[2px] w-8 rounded-full bg-primary" />
                  <div className="inline-flex items-center gap-1.5">
                    <SplitText
                      as="h2"
                      text={`Our ${serviceName} Process`}
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
      
                <p className="mx-auto max-w-2xl text-base leading-7 text-slate-900 sm:text-lg">
                    A proven methodology that transforms your vision into reality
                </p>
      </div>






      
    <div className="mx-auto w-full max-w-[1600px]">
        

        {/* Mobile Layout - Simple fade-in one by one */}
        <div className="block lg:hidden space-y-4 md:space-y-5 mt-6 md:mt-8">
          {phases.map((phase, idx) => (
            <MobileProcessCard 
              key={idx}
              phase={phase} 
              index={idx}
              startAnimation={startAnimation} 
            />
          ))}
        </div>

        {/* Desktop Layout with full animations */}
        <div className="hidden lg:block mt-8 md:mt-12">
          {renderDesktopRows()}
        </div>

        {/* CTA Button */}
        <motion.div 
          className="mt-10 md:mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={startAnimation ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: TOTAL_DURATION - 1, duration: 0.5 }}
        >
          <motion.button 
            className="inline-flex w-full sm:w-auto bg-primary text-white justify-center items-center gap-2 px-6 md:px-8 py-3 md:py-3.5 rounded-md bg-secondarytext-white font-semibold shadow-md hover:bg-primary/80 hover:text-white transition-all duration-300 text-sm md:text-base"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Your Journey
            <motion.div
              animate={startAnimation ? { x: [0, 5, 0] } : {}}
              transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 2 }}
            >
              <ArrowRight className="h-4 w-4" />
            </motion.div>
          </motion.button>
        </motion.div>

        {/* Bottom Divider */}
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={startAnimation ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ delay: TOTAL_DURATION - 0.5, duration: 0.6 }}
          className="mt-10 md:mt-16 flex items-center gap-4  mx-auto"
        >
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
          <motion.div
            animate={startAnimation && isDesktop ? { rotate: 360 } : {}}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Gem className="h-3 w-3 text-slate-300" />
          </motion.div>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
};