'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Rocket, Code2, Shield, Zap, Users } from 'lucide-react';
import SplitText from '../../ui/SplitText';
import { TiltCard } from '../../ui/tilt-card';

const steps = [
  {
    number: '01',
    icon: Rocket,
    title: 'Rapid Delivery',
    description:
      'Agile development methodology ensures your software is delivered on time, every time. We work in sprints with complete transparency.',
    features: ['2-Week Sprints', 'Daily Updates', 'Fast Turnaround', 'No Delays'],
    stats: '2x',
    statLabel: 'Faster Delivery',
  },
  {
    number: '02',
    icon: Code2,
    title: 'Clean Code',
    description:
      'Enterprise-grade code with best practices, design patterns, and comprehensive documentation. Built to scale with your business.',
    features: ['SOLID Principles', 'Unit Testing', 'Code Reviews', 'Documentation'],
    stats: '99.9%',
    statLabel: 'Code Quality',
  },
  {
    number: '03',
    icon: Shield,
    title: 'Security First',
    description:
      'Bank-grade security implementation with regular audits, encryption, and compliance standards including GDPR and SOC2.',
    features: ['End-to-End Encryption', 'Regular Audits', 'GDPR Compliant', 'Secure APIs'],
    stats: '100%',
    statLabel: 'Data Protection',
  },
  {
    number: '04',
    icon: Zap,
    title: 'Performance Optimized',
    description:
      'Lightning-fast applications with optimized databases, caching strategies, and CDN integration for global reach.',
    features: ['< 1s Load Time', 'Database Optimization', 'CDN Ready', 'Caching'],
    stats: '300%',
    statLabel: 'Speed Boost',
  },
  {
    number: '05',
    icon: Users,
    title: 'Long-Term Support',
    description:
      "We don't disappear after launch. Maintenance, updates, scaling, and 24/7 support to keep your software running smoothly.",
    features: ['24/7 Support', 'Regular Updates', 'Scaling Help', 'Bug Fixes'],
    stats: '5+ Years',
    statLabel: 'Avg Partnership',
  },
];

// Alternating vertical offsets — even indices go UP (negative), odd go DOWN (positive)
// matching the image: 01 low, 02 high, 03 low, 04 high, 05 low
const circleOffsets = [60, 0, 60, 0, 60]; // px from top — larger = lower

export function WhyChooseUs({
  subtitle = 'Why Choose ClickMasters',
}: {
  subtitle?: string;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [triggered, setTriggered] = useState(false);
  // activeStep drives the line fill and circle activation sequentially
  const [activeStep, setActiveStep] = useState(-1);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered) {
          setTriggered(true);
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [triggered]);

  // Once triggered, fire steps sequentially with a timer
  useEffect(() => {
    if (!triggered) return;

   steps.forEach((_, i) => {
  setTimeout(() => {
    setActiveStep(i);
  }, i * 900);
});
  }, [triggered]);

  // lineProgress: 0–100, advances as steps activate
  // step i completes at ((i+1)/5)*100
  const lineProgress = activeStep >= 0 ? Math.min(((activeStep + 1) / steps.length) * 100, 100) : 0;

  return (
    <section className="relative overflow-hiddenpy-16 lg:py-24 bg-[#f5fbfb]"  >

     {/* Background Blobs */}
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
   
  <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#a7f3d0] opacity-30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-[#fdba74] opacity-25 blur-3xl" />


      
      <div className="relative z-10 mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
        {/* Header */}
        <div className="mx-auto mb-12 max-w-3xl px-2 text-center lg:mb-20">
        
          <div className="flex max-w-full flex-wrap items-center justify-center gap-3">
            <span className="hidden h-[2px] w-8 rounded-full bg-primary/60 sm:block" />
            <SplitText
              as="h2"
              text={subtitle}
              className="text-center text-2xl font-bold text-primary md:text-4xl"
              delay={60}
              duration={0.8}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, x: 40 }}
              to={{ opacity: 1, x: 0 }}
              threshold={0.2}
            />
            <span className="hidden h-[2px] w-8 rounded-full bg-primary/60 sm:block" />
          </div>

            <p className="mx-auto max-w-2xl text-base leading-7 text-slate-800 sm:text-lg">   
Competitive differentiation that sets us apart
          </p>
        </div>

        {/* ── Track + Cards ───────────────────────────────────────────────── */}
        <div ref={sectionRef} className="relative px-0 sm:px-4 lg:min-h-[420px] lg:px-16">

          {/* 
            Wavy SVG line sits in the middle of the circle track.
            The wave amplitude is large so it visually connects 
            the high circles (top) and low circles (bottom) like the reference image.
            Circle centres: 01=low(~110px from top), 02=high(~50px), 03=low, 04=high, 05=low
            Path goes: start low → rise to high → fall to low → rise → fall
          */}

          {/* Base gray dashed wave */}
          <svg
            className="pointer-events-none absolute left-0 right-0 hidden w-full lg:block"
            style={{ top: 0, height: 170 }}
            preserveAspectRatio="none"
            viewBox="0 0 1000 170"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,110 C80,110 120,50 200,50 C280,50 320,110 400,110 C480,110 520,50 600,50 C680,50 720,110 800,110 C880,110 920,50 1000,50"
              fill="none"
              stroke="#d1d5db"
              strokeWidth="2"
              strokeDasharray="8 5"
            />
          </svg>

          {/* Primary filled wave — clips from left based on lineProgress */}
          <svg
            className="pointer-events-none absolute left-0 right-0 hidden w-full lg:block"
            style={{
              top: 0,
              height: 170,
              clipPath: `inset(0 ${100 - lineProgress}% 0 0)`,
              transition: 'clip-path 1.5s ease-in-out',
            }}
            preserveAspectRatio="none"
            viewBox="0 0 1000 170"
            xmlns="http://www.w3.org/2000/svg"
          >
 <path
  d="M0,110 C80,110 120,50 200,50 C280,50 320,110 400,110 C480,110 520,50 600,50 C680,50 720,110 800,110 C880,110 920,50 1000,50"
  fill="none"
  stroke="var(--color-primary, #00b4d8)"
  strokeWidth="4"
  strokeLinecap="round"
/>
          </svg>

          {/* 5-column grid */}
          <div className="relative z-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const isActive = i <= activeStep;
              const isHigh = circleOffsets[i] === 0; // high position (top)
              const circleTopPx = circleOffsets[i]; // 0=high(50px track), 60=low(110px track)

              return (
                <div
                  key={step.number}
                  className="min-w-0 flex flex-col items-center"
                >
                  {/* Spacer to push circle to correct vertical position */}
                  <div className="hidden lg:block" style={{ height: circleTopPx }} />

                  {/* Circle */}
                  <div
                    className={`
                      relative z-10 w-14 h-14 rounded-full flex items-center justify-center
                      text-sm font-bold border-2
                      transition-all duration-500
                      ${isActive
                        ? 'bg-primary border-primary text-white shadow-[0_0_20px_rgba(0,180,216,0.45)]'
                        : 'bg-white border-gray-300 text-gray-400'
                      }
                    `}
                  >
                    {step.number}
                  </div>

                  {/* Gap between circle and card */}
                  <div className="h-4 lg:h-6" />

                  {/* Card — fades in when step activates */}
               <div
  style={{
    opacity: isActive ? 1 : 0,
    transform: isActive ? 'translateY(0)' : 'translateY(20px)',
    transition: `opacity 0.45s ease, transform 0.45s ease`,
    width: '100%',
  }}
 
>
                    <TiltCard
                      tiltLimit={8}
                      scale={1.02}
                      perspective={900}
                      effect="gravitate"
                      spotlight={true}
                      className="w-full h-full rounded-2xl"
                    >
                     <div
  className="
    relative overflow-hidden rounded-2xl
    border border-gray-100
    bg-white
    shadow-[0_4px_24px_rgba(0,0,0,0.07)]
    group
    transition-all duration-500
    hover:border-primary/30
    hover:shadow-[0_8px_32px_rgba(0,148,173,0.15)]
    p-5
  "
>
                        {/* shine sweep */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden rounded-2xl">
                          <div className="absolute inset-y-0 -left-1/2 w-1/2 rotate-12 bg-white/10 blur-xl group-hover:translate-x-[350%] transition-transform duration-900" />
                        </div>

                        <div className="w-10 h-10 flex items-center justify-center rounded-xl mb-4">
                          <Icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
                        </div>

                        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-primary transition-colors">
                          {step.title}
                        </h3>

                     <p className="text-gray-800 text-lg leading-relaxed mb-4">
  {step.description}
</p>

{/* Features */}
<div className="flex flex-wrap gap-1.5 mt-3">
  {step.features.map((feature) => (
    <span
      key={feature}
      className="rounded-full bg-primary/10 px-2.5 py-1 text-sm font-medium text-primary"
    >
      {feature}
    </span>
  ))}
</div>


                      </div>
                    </TiltCard>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;
