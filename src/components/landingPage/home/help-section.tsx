'use client';

import Link from 'next/link';
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  MessageCircle,
  Video,
  FileQuestion,
  Headphones,
  Search,
  ArrowRight,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitText from '../../ui/SplitText';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Define types
interface HelpResource {
  icon: React.ElementType;
  title: string;
  description: string;
  color?: string;
  stat?: string;
}

// YOUR ORIGINAL CONTENT - NOT CHANGED
const helpResources: HelpResource[] = [
  {
    icon: BookOpen,
    title: 'Documentation',
    description: 'Technical documentation and developer guides for our software and APIs.',
    stat: '150+',
    color: 'from-primary to primary/80',
  },
  {
    icon: Video,
    title: 'Video Tutorials',
    description: 'Step-by-step videos to get started with your software and features.',
    stat: '200+',
    color: 'from-primary to primary/80',
  },
  {
    icon: MessageCircle,
    title: 'Live Chat',
    description:
      'Chat with our support team in real-time. Get help with development and technical questions.',
    stat: '24/7',
    color: 'from-primary to primary/80',
  },
  {
    icon: FileQuestion,
    title: 'FAQ',
    description: 'Common questions about our software development services, pricing, and process.',
    stat: '50+',
    color: 'from-primary to primary/80',
  },
  {
    icon: Headphones,
    title: 'Contact Support',
    description:
      'Request a callback or submit a ticket. Our development team responds within 24 hours.',
    stat: '24h',
    color: 'from-primary to primary/80',
  },
];

export function HelpSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Clean hover animation for cards
  const handleCardHover = (index: number, isHovering: boolean) => {
    setHoveredIndex(isHovering ? index : null);

    const card = cardsRef.current[index];
    if (!card) return;

    if (isHovering) {
      gsap.to(card, {
        y: -8,
        scale: 1.01,
        boxShadow: '0 20px 40px -12px rgba(0,0,0,0.1)',
        borderColor: 'rgba(0, 148, 173, 0.3)',
        duration: 0.3,
        ease: 'power2.out',
      });
    } else {
      gsap.to(card, {
        y: 0,
        scale: 1,
        boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
        borderColor: 'rgba(0, 148, 173, 0.3)',
        duration: 0.4,
        ease: 'power3.out',
      });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="help"
      className="relative py-24 overflow-hidden bg-[#f5fbfb]  font-sans lg:px-12 sm:px-6 px-4"
    >

 <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#a7f3d0] opacity-30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-[#fdba74] opacity-25 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 -left-32 h-[550px] w-[550px] -translate-y-1/2 rounded-full bg-[#93c5fd] opacity-25 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-180px] left-1/4 h-[480px] w-[480px] rounded-full bg-[#a7f3d0] opacity-20 blur-3xl" />


      <div className="relative z-10 mx-auto max-w-[1600px]">
        
        {/* Header Section - Matching FAQ Style */}
        <div ref={headerRef} className="mx-auto max-w-3xl text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="h-[2px] w-8 rounded-full bg-primary" />
             <div className="inline-flex items-center gap-1.5">
  <SplitText
  as="h2"
  text="Resources & Support"
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

          {/* <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-2xl lg:text-3xl">
            Resources & <span className="text-primary">Developer Support</span>
          </h2> */}

          <p className="mx-auto max-w-2xl text-base leading-7 text-slate-800 sm:text-lg">
            Documentation, tutorials, and technical support for your software. Need a custom
            solution? Get in touch with our development team.
          </p>
        </div>

        {/* Resources Grid - Width matched to FAQ (3 cols on lg, 4 on xl) */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3  mx-auto">
          {helpResources.map((resource, index) => {
            const Icon = resource.icon;
            return (
              <div
                key={resource.title}
                ref={(el) => {
                  cardsRef.current[index] = el;
                }}
                onMouseEnter={() => handleCardHover(index, true)}
                onMouseLeave={() => handleCardHover(index, false)}
                className="group relative cursor-pointer"
              >
                {/* Premium Card Design */}
                <div className="relative bg-white rounded-2xl p-6 border border-primary/10 shadow-[0_4px_20px_rgb(0,0,0,0.02)] h-full overflow-hidden transition-all duration-300">
                  
                  {/* Header with Icon and Stat */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="relative">
                      <div className="relative w-12 h-12 flex items-center justify-center bg-gray-50 rounded-xl group-hover:bg-primary/10 transition-colors duration-300">
                        <Icon className="w-6 h-6 text-black/70 group-hover:text-primary transition-colors duration-300" strokeWidth={1.5} />
                      </div>
                    </div>

                    {resource.stat && (
                      <div className="text-right">
                        <p className="text-2xl font-bold text-black group-hover:text-primary transition-colors duration-300">{resource.stat}</p>
                        <p className="text-xs uppercase tracking-wider text-gray-800">Resources</p>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-primary transition-colors duration-300">
                    {resource.title}
                  </h3>

                  <p className="text-gray-800 text-lg leading-relaxed mb-4">
                    {resource.description}
                  </p>

                  {/* Bottom Corner Accent */}
                  <div className="absolute bottom-3 right-3 w-6 h-6">
                    <motion.div
                      className="w-full h-full border-b border-r border-primary/20 group-hover:border-primary transition-all duration-300"
                      animate={{
                        rotate: hoveredIndex === index ? 90 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

    
      </div>
    </section>
  );
}

export default HelpSection;