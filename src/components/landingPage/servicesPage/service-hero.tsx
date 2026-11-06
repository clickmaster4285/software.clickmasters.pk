"use client";

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, Star, Award, Layers3, Users, Headphones } from 'lucide-react';
import dynamic from 'next/dynamic';
// T12 — WebGL background (three.js) is decorative: load it after hydration in its own chunk.
const Aurora = dynamic(() => import('../../ui/Aurora'), { ssr: false });

// Counter component with animation
function Counter({ targetValue }: { targetValue: string | number }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  
  const parseValue = (val: string | number): number => {
    const strVal = String(val);
    const match = strVal.match(/\d+(?:\.\d+)?/);
    return match ? parseFloat(match[0]) : 0;
  };
  
  const rawNumber = parseValue(targetValue);
  const displaySuffix = String(targetValue).replace(/\d+(?:\.\d+)?/, '');
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const duration = 2000;
          const increment = rawNumber / (duration / 16);
          const timer = setInterval(() => {
            start += increment;
            if (start >= rawNumber) {
              setCount(rawNumber);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
          return () => clearInterval(timer);
        }
      },
      { threshold: 0.3 }
    );
    
    if (elementRef.current) {
      observer.observe(elementRef.current);
    }
    
    return () => observer.disconnect();
  }, [rawNumber, hasAnimated]);
  
  return (
    <div ref={elementRef}>
      {hasAnimated ? count.toLocaleString() : '0'}{displaySuffix}
    </div>
  );
}

// Typewriter component
function TypewriterText({ texts, delay = 100 }: { texts: string[]; delay?: number }) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);

  useEffect(() => {
    const currentText = texts[currentIndex];
    
    if (isWaiting) {
      const waitTimer = setTimeout(() => {
        setIsWaiting(false);
        setIsDeleting(true);
      }, 2000);
      return () => clearTimeout(waitTimer);
    }

    let timer: NodeJS.Timeout;
    
    if (isDeleting) {
      if (displayText.length === 0) {
        setIsDeleting(false);
        setCurrentIndex((prev) => (prev + 1) % texts.length);
      } else {
        timer = setTimeout(() => {
          setDisplayText(prev => prev.slice(0, -1));
        }, delay / 2);
      }
    } else {
      if (displayText.length === currentText.length) {
        setIsWaiting(true);
      } else {
        timer = setTimeout(() => {
          setDisplayText(currentText.slice(0, displayText.length + 1));
        }, delay);
      }
    }
    
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, isWaiting, currentIndex, texts, delay]);

  return (
    <>
      {displayText}
      <span className="animate-pulse text-primary">|</span>
    </>
  );
}

interface ServiceHeroProps {
  page: {
    category: string;
    categorySlug: string;
    serviceName: string;
    title: string;
    lead: string;
    highlights?: string[];
    marketStats?: Array<{ label: string; value: string }>;
    currentPageLabel?: string;
    parentService?: { label: string; href: string };
    boldTerms?: string[];
  };
}

export function ServiceHero({ page }: ServiceHeroProps) {
  const isGoalPage = Boolean(page.parentService && page.currentPageLabel);
  const boldTerms = page.boldTerms?.filter(Boolean) ?? (page.serviceName ? [page.serviceName] : []);

  // Create typewriter phrases
  const typewriterPhrases = [
    "MVP to Enterprise",
    "Fixed + Agile Engagements",
    "Post-Launch Support",
  ];

  // Helper function to emphasize key terms in text
  const makeBoldInText = (text: string, terms: string[]) => {
    if (!text || terms.length === 0) return text;

    const escaped = terms
      .filter(Boolean)
      .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    if (escaped.length === 0) return text;

    const regex = new RegExp(`(${escaped.join("|")})`, "gi");
    const split = text.split(regex);

    return split.map((part, index) => {
      const isBold = terms.some((t) => part.toLowerCase() === t.toLowerCase());
      if (isBold) {
        return (
          <span key={index} className="font-black text-primary">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  const stats = [
    { icon: Award, value: "8+", label: "Years Experience" },
    { icon: Layers3, value: "150+", label: "Projects Delivered" },
    { icon: Users, value: "98%", label: "Client Satisfaction" },
    { icon: Headphones, value: "24/7", label: "Support Available" },
  ];

  return (
    <section id="overview" className="relative min-h-screen flex flex-col overflow-hidden bg-[#f5fbfb] ">
     

      {/* SAME BLOBS AS TRUSTED CLIENTS */}
            <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#a7f3d0] opacity-30 blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-[#fdba74] opacity-25 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 -left-32 h-[550px] w-[550px] -translate-y-1/2 rounded-full bg-[#93c5fd] opacity-25 blur-3xl" />
      


{/* <div className="absolute inset-0 -z-10 h-[140vh]">
  <Aurora
    colorStops={["#7cff67", "#B497CF", "#5227FF"]}
    blend={0.5}
    amplitude={1.0}
    speed={1}
  />
</div> */}
      {/* Breadcrumbs - positioned below navbar, not overlapping */}
      <div className="w-full pt-14 md:pt-28 lg:pt-28">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-8">
          <motion.nav
            className="flex items-center gap-1.5 text-md flex-wrap"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link
              href="/"
              className="text-gray-800 hover:text-primary transition-colors font-medium"
            >
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-gray-800" />
            <Link
              href={`/${page.categorySlug}`}
              className="text-gray-800 hover:text-primary transition-colors font-medium"
            >
              {page.category}
            </Link>
            {page.parentService && (
              <>
                <ChevronRight className="h-3.5 w-3.5 text-gray-800" />
                <Link
                  href={page.parentService.href}
                  className="text-gray-800 hover:text-primary transition-colors font-medium"
                >
                  {page.parentService.label}
                </Link>
              </>
            )}
            <ChevronRight className="h-3.5 w-3.5 text-gray-800" />
            {isGoalPage && page.parentService ? (
              <>
                <Link
                  href={page.parentService.href}
                  className="text-gray-800 hover:text-primary transition-colors font-medium"
                >
                  {page.parentService.label}
                </Link>
                <ChevronRight className="h-3.5 w-3.5 text-gray-800" />
                <span className="font-bold text-primary">{page.currentPageLabel}</span>
              </>
            ) : (
              <span className="font-bold text-primary">{page.serviceName}</span>
            )}
          </motion.nav>
        </div>
      </div>

      {/* Main Content - Vertically Centered */}
      <div className="flex-1 flex items-center justify-center py-12 md:py-16 lg:-mt-6">
        <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 lg:px-8 ">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Left Content */}
            <div className="flex-1 text-left">
              {/* Main Heading with Typewriter */}
              <div className="mb-6 animate-[fadeInUp_0.6s_ease-out_0.1s_forwards] opacity-0">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary">
                  {page.title}
                </h1>
                <div className="mt-4 text-lg md:text-xl text-primary border-primary/30 bg-white/20 rounded-md max-w-xl">
                  <TypewriterText texts={typewriterPhrases} delay={120} />
                </div>
              </div>

              {/* Description */}
              <p className="text-lg md:text-xl lg:text-2xl text-gray-800 max-w-2xl mb-8 leading-relaxed animate-[fadeInUp_0.6s_ease-out_0.2s_forwards] opacity-0">
                {makeBoldInText(page.lead, boldTerms)}
              </p>

              {/* Market Stats */}
              {page.marketStats && page.marketStats.length > 0 && (
                <div className="grid grid-cols-2 gap-4 rounded-2xl border border-primary/20 bg-white/5 p-5 backdrop-blur-sm mb-8 animate-[fadeInUp_0.6s_ease-out_0.3s_forwards] opacity-0 sm:grid-cols-4">
                  {page.marketStats.map((stat) => (
                    <div key={stat.label} className="text-center sm:text-left">
                      <p className="text-2xl font-extrabold text-primary sm:text-3xl">
                        {stat.value}
                      </p>
                      <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-gray-800">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* CTA Buttons */}
             <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-[fadeInUp_0.6s_ease-out_0.35s_forwards] opacity-0">
  <Link
    href="/contact-us"
    className="group relative px-8 py-3.5 bg-gradient-to-r from-primary to-primary rounded-md text-white font-semibold text-lg shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 overflow-hidden text-center"
  >
    <span className="relative z-10">Get your free strategy call</span>
    <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
  </Link>

  <Link
    href="/about-us"
    className="px-8 py-3.5 bg-transparent border border-primary/20 rounded-md text-primary font-semibold text-lg hover:bg-primary/10 transition-all duration-300 hover:-translate-y-0.5 text-center"
  >
    About ClickMasters
  </Link>
</div>

              {/* Stats Grid - Left aligned */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="text-left group animate-[fadeInUp_0.6s_ease-out_forwards] opacity-0"
                    style={{ animationDelay: `${400 + index * 100}ms` }}
                  >
                    <div className="flex items-center gap-2">
                      {/* <stat.icon className="h-6 w-6 text-primary" /> */}
                      <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary drop-shadow-[0_0_12px_rgba(14,116,144,0.45)] group-hover:drop-shadow-[0_0_20px_rgba(14,116,144,0.65)] transition-all duration-300">
                        <Counter targetValue={stat.value} />
                      </div>
                    </div>
                    <div className="text-xs md:text-sm text-gray-900  mt-1.5 font-medium tracking-wide">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Trust Indicators */}
              {/* <div className="flex flex-wrap items-center gap-5 mt-8 text-sm text-gray-800 animate-[fadeInUp_0.6s_ease-out_0.5s_forwards] opacity-0">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                  <span className="ml-1">
                    <strong className="text-gray-900">4.9/5</strong> rating
                  </span>
                </div>
              </div> */}
            </div>

            {/* Right Image */}
            <div className="flex-1 flex justify-center lg:justify-end animate-[fadeInUp_0.6s_ease-out_0.2s_forwards] opacity-0">
              <div className="relative w-full max-w-md lg:max-w-lg xl:max-w-xl">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-primary/20 backdrop-blur-sm bg-white/5">
                  <Image
                    src="/images/webApp.webp"
                    alt={page.title}
                    width={600}
                    height={600}
                    className="w-full h-auto object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
{/* <div className="absolute inset-0 -z-10 h-[140vh]">
  <Aurora
    colorStops={["#7cff67", "#B497CF", "#5227FF"]}
    blend={0.5}
    amplitude={1.0}
    speed={1}
  />
</div> */}
      {/* Scroll indicator */}
      {/* <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse" />
        </div>
      </div> */}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}