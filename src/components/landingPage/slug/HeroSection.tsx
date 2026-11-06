'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { ServiceData } from '@/src/lib/services';
import dynamic from 'next/dynamic';
// T12 — WebGL background (three.js) is decorative: load it after hydration in its own chunk.
const PixelBlast = dynamic(() => import('../../ui/pixelBlast'), { ssr: false });


// Counter component with animation
function Counter({ targetValue }: { targetValue: string }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  
  const parseValue = (val: string): number => {
    const match = val.match(/\d+(?:\.\d+)?/);
    return match ? parseFloat(match[0]) : 0;
  };
  
  const rawNumber = parseValue(targetValue);
  const displaySuffix = targetValue.replace(/\d+(?:\.\d+)?/, '');
  
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

interface HeroSectionProps {
  serviceData: ServiceData;
}

export default function HeroSection({ serviceData }: HeroSectionProps) {
  // Create typewriter phrases from service title and tagline
  const typewriterPhrases = [
    serviceData.title,
    serviceData.tagline,
    "Innovation Delivered",
    "Excellence Guaranteed",
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* PixelBlast Background */}
      <div className="absolute inset-0 -z-10">
        <PixelBlast
          variant="square"
          pixelSize={4}
          color="#cffafe"
          patternScale={2}
          patternDensity={1}
          pixelSizeJitter={0}
          enableRipples
          rippleSpeed={0.4}
          rippleThickness={0.12}
          rippleIntensityScale={1.5}
          liquid={false}
          liquidStrength={0.12}
          liquidRadius={1.2}
          liquidWobbleSpeed={5}
          speed={0.5}
          edgeFade={0.25}
          transparent
        />
      </div>

      {/* Breadcrumb */}
      <motion.div
        className="absolute top-0 left-0 right-0 z-20 border-b border-white/10 w-full"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 py-3.5 backdrop-blur-md">
          <nav className="flex items-center gap-1.5 text-sm">
            <Link
              href="/"
              className="text-gray-800 hover:text-primary transition-colors font-medium"
            >
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-gray-800" />
            <span className="font-bold text-primary">
              {serviceData.title}
            </span>
          </nav>
        </div>
      </motion.div>

      <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 pb-20 z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Left Content */}
          <div className="flex-1 text-left">
            {/* Badge */}
            {/* <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6 border border-primary/30 animate-[fadeInUp_0.6s_ease-out_forwards] opacity-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-sm font-medium text-primary">{serviceData.heroBadge}</span>
            </div> */}

            {/* Main Heading with Typewriter */}
            <div className="mb-6 animate-[fadeInUp_0.6s_ease-out_0.1s_forwards] opacity-0">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-primary">
                {serviceData.title}  
              </h1>
              <p className="mt-4 text-lg md:text-xl text-primary border-primary/30 bg-white/20 rounded-md max-w-xl">
                <TypewriterText texts={typewriterPhrases} delay={120} />
              </p>
            </div>

            {/* Description */}
            <p className="text-lg md:text-xl text-gray-800 max-w-2xl mb-8 leading-relaxed animate-[fadeInUp_0.6s_ease-out_0.2s_forwards] opacity-0">
              {serviceData.description} Responsive websites and web applications that captivate audiences and drive conversions. Using latest frameworks and technologies, we deliver lightning-fast, SEO-optimized web experiences. Responsive websites and web applications that captivate audiences and drive conversions. Using latest frameworks and technologies, we deliver lightning-fast, SEO-optimized web experiences.
            </p>

            {/* CTA Buttons */}
           <div className="flex flex-col sm:flex-row gap-4 mb-20 animate-[fadeInUp_0.6s_ease-out_0.3s_forwards] opacity-0">
  <Link
    href="/contact-us"
    className="group relative px-8 py-3.5 bg-gradient-to-r from-primary to-primary rounded-md text-white font-semibold text-lg shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 overflow-hidden text-center"
  >
    <span className="relative z-10">{serviceData.ctaText}</span>
    <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
  </Link>

  <Link
    href="/about-us"
    className="px-8 py-3.5 bg-transparent border border-primary/20 rounded-md text-primary font-semibold text-lg hover:bg-primary/10 hover:text-white transition-all duration-300 hover:-translate-y-0.5 text-center"
  >
    About ClickMasters
  </Link>
</div>

            {/* Stats Grid - Left aligned */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl">
  {serviceData.stats.map((stat, index) => (
    <div
      key={index}
      className="text-left group animate-[fadeInUp_0.6s_ease-out_forwards] opacity-0"
      style={{ animationDelay: `${400 + index * 100}ms` }}
    >
      <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary drop-shadow-[0_0_12px_rgba(14,116,144,0.45)] group-hover:drop-shadow-[0_0_20px_rgba(14,116,144,0.65)] transition-all duration-300">
        <Counter targetValue={stat.value} />
      </div>

      <div className="text-xs md:text-sm text-gray-800 mt-1.5 font-medium tracking-wide">
        {stat.label}
      </div>
    </div>
  ))}
</div>
          </div>

          {/* Right Image */}
          <div className="flex-1 flex justify-center lg:justify-end animate-[fadeInUp_0.6s_ease-out_0.2s_forwards] opacity-0">
            <div className="relative w-full max-w-md lg:max-w-lg xl:max-w-xl">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-primary/20 backdrop-blur-sm bg-white/5">
                <Image
                  src="/images/webApp.webp"
                  alt="Hero Image"
                  width={600}
                  height={600}
                  className="w-full h-auto object-cover"
                  priority
                />
                {/* Gradient overlay on image */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse" />
        </div>
      </div>

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