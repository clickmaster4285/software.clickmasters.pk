'use client';

import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from "next/link";
// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// ==================== TYPE DEFINITIONS ====================

interface AnimatedCounterProps {
  value: string;
  label: string;
  color: string;
  delay?: number;
}

interface StatItem {
  value: string;
  label: string;
}

// ==================== ANIMATED SECTION COMPONENTS ====================

// Animated Counter Component
const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ value, label, color, delay = 0 }) => {
  const [count, setCount] = useState<number>(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number | null>(null);

  const animate = useCallback((timestamp: number) => {
    if (!startTimeRef.current) startTimeRef.current = timestamp;
    const progress = timestamp - startTimeRef.current;
    const end = parseInt(value.toString().replace(/[^0-9]/g, ''));
    const duration = 2000;

    if (progress < duration) {
      const currentCount = Math.min(Math.floor((progress / duration) * end), end);
      setCount(currentCount);
      animationRef.current = requestAnimationFrame(animate);
    } else {
      setCount(end);
    }
  }, [value]);

  useEffect(() => {
    if (isInView) {
      animationRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isInView, animate]);

  const suffix = useMemo(() => 
    value.includes('+') ? '+' : value.includes('%') ? '%' : '',
  [value]);

  // CSS animation for glow (better performance)
  const glowStyle = useMemo(() => ({
    animation: isInView ? 'glowPulse 3s infinite ease-in-out' : 'none',
    animationDelay: `${delay}s`
  }), [isInView, delay]);

  const counterStyle = useMemo(() => ({
    animation: isInView ? 'textGlow 2s infinite ease-in-out' : 'none',
    animationDelay: `${delay}s`
  }), [isInView, delay]);

  return (
    <div ref={ref} className="text-center relative group">
      <div className="relative">
        {/* Glow effect with CSS animation */}
        <div 
          className={`absolute inset-0 bg-gradient-to-r ${color} rounded-full blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500`}
          style={glowStyle}
        />

        {/* Counter text */}
        <div 
          className={`relative sm:text-3xl lg:5xl font-bold text-white mb-1`}
          style={counterStyle}
        >
          {count}{suffix}
        </div>
      </div>
      <div className="text-sm text-white mt-2">{label}</div>
    </div>
  );
};

// Hero Section with Background Image
export const HeroSection: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null);
  const isInView = useInView(heroRef, { once: true });
  
  // Typer animation state
  const [displayText, setDisplayText] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [loopNum, setLoopNum] = useState<number>(0);
  const [typingSpeed, setTypingSpeed] = useState<number>(150);

const phrases: string[] = [
  'Building the Future, One Line at a Time',
  'Innovating Through Code',
  'Your Technology Partners',
  'Turning Ideas into Software',
  'Where Innovation Meets Excellence',
  'Crafting Scalable Solutions',
  'Engineering Your Vision',
  'Code that Powers Your Business',
];

  useEffect(() => {
    const handleTyping = () => {
      const i = loopNum % phrases.length;
      const fullText = phrases[i];

      setDisplayText(
        isDeleting
          ? fullText.substring(0, displayText.length - 1)
          : fullText.substring(0, displayText.length + 1)
      );

      setTypingSpeed(isDeleting ? 75 : 150);

      if (!isDeleting && displayText === fullText) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && displayText === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, loopNum, typingSpeed, phrases]);

  return (
    <motion.section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.8 }}
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80")',
          }}
        />
        {/* Dark overlay for better text visibility */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <motion.div
        className="container mx-auto max-w-6xl px-4 relative z-10"
        initial={{ y: 50 }}
        animate={isInView ? { y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <motion.div className="text-center">
          <motion.h1
            className="text-5xl md:text-7xl font-bold text-white mb-6"
            initial={{ scale: 0.9 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div>Clickmasters</div>
            <motion.div
              className="text-gray-200 mt-4 text-3xl md:text-4xl"
              animate={{
                scale: [1, 1.02, 1],
              }}
              transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 2 }}
            >
              {displayText}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="inline-block w-[3px] h-[40px] bg-primary ml-2 align-middle"
              />
            </motion.div>
          </motion.h1>


        <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={isInView ? { opacity: 1, y: 0 } : {}}
  transition={{ duration: 0.6, delay: 0.8 }}
  className="mt-8"
>
  <Link
    href="/contact-us"
    className="bg-primary hover:bg-primary text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 inline-block text-center"
  >
    Get Started
  </Link>
</motion.div>


        </motion.div>
      </motion.div>

    </motion.section>
  );
};

// Stats Section with GSAP

export const StatsSection: React.FC = () => {
  const statsRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(textRef, { once: true });

  const [numLines, setNumLines] = useState(10);
  const [numParticles, setNumParticles] = useState(30);
  const [isClient, setIsClient] = useState(false); // check for browser

  // Detect client/browser
  useEffect(() => {
    setIsClient(true);
    if (window.innerWidth <= 768) {
      setNumLines(5);
      setNumParticles(15);
    }
  }, []);

  // GSAP scroll animation
  useEffect(() => {
    const elements = gsap.utils.toArray('.stat-item');
    gsap.fromTo(
      elements,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: statsRef.current,
          start: 'top center+=100',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }, []);

  // Add CSS animations
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes glowPulse {
        0%, 100% { opacity: 0.1; transform: scale(1); }
        50% { opacity: 0.2; transform: scale(1.2); }
      }
      @keyframes textGlow {
        0%, 100% { text-shadow: 0 0 8px rgba(249,115,22,0); }
        50% { text-shadow: 0 0 8px rgba(249,115,22,0.15); }
      }
      @keyframes float {
        0%,100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(5deg); }
      }
      @keyframes floatReverse {
        0%,100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(20px) rotate(-5deg); }
      }
      @keyframes pulse {
        0%,100% { opacity: 0.3; transform: scale(1); }
        50% { opacity: 0.6; transform: scale(1.1); }
      }
      @keyframes slide {
        0% { transform: translateX(-100%) rotate(0deg); }
        100% { transform: translateX(1000%) rotate(360deg); }
      }
      @keyframes shimmer {
        0% { background-position: -1000px 0; }
        100% { background-position: 1000px 0; }
      }
      @media (max-width: 768px) {
        @keyframes float { 0%,100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-10px) rotate(3deg); } }
        @keyframes floatReverse { 0%,100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(10px) rotate(-3deg); } }
      }
    `;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || window.innerWidth <= 768) return;

      const { clientX, clientY } = e;
      const { width, height, left, top } = containerRef.current.getBoundingClientRect();
      const x = (clientX - left) / width - 0.5;
      const y = (clientY - top) / height - 0.5;

      const elements = containerRef.current.querySelectorAll('.parallax-item');
      elements.forEach((el: any) => {
        const speed = parseFloat(el.dataset.speed || '20');
        el.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const stats: StatItem[] = [
    { value: '1,860+', label: 'Current Projects' },
    { value: '3,500+', label: 'Happy Clients' },
    { value: '75+', label: 'Awards Winning' },
    { value: '5+', label: 'Years Experience' },
  ];

  const gradients: string[] = [
    'from-white to-white',
    'from-white to-white',
    'from-white to-white',
    'from-white to-white',
  ];

  return (
    <section
      ref={statsRef}
      className="max-w-6xl mx-auto px-4 py-12 md:py-20 relative z-20 -mt-20 md:-mt-40 mb-8 md:mb-10"
    >
      {/* Background Container */}
      <div
        ref={containerRef}
        className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none"
        style={{ background: '#000000' }}
      >
        {/* Animated gradient orbs */}
        <div className="absolute inset-0 opacity-30">
          <div
            className="absolute w-48 h-48 md:w-96 md:h-96 rounded-full bg-primary blur-2xl md:blur-3xl"
            style={{ top: '20%', left: '10%', animation: 'float 20s infinite ease-in-out' }}
          />
          <div
            className="absolute w-48 h-48 md:w-96 md:h-96 rounded-full bg-blue-white blur-2xl md:blur-3xl"
            style={{ bottom: '10%', right: '15%', animation: 'floatReverse 25s infinite ease-in-out' }}
          />
          <div
            className="absolute w-32 h-32 md:w-64 md:h-64 rounded-full bg-white blur-2xl md:blur-3xl"
            style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', animation: 'pulse 15s infinite ease-in-out' }}
          />
        </div>

        {/* Animated lines */}
        {isClient &&
          [...Array(numLines)].map((_, i) => (
            <div
              key={i}
              className="absolute h-px bg-white"
              style={{
                top: `${i * 10}%`,
                left: 0,
                right: 0,
                opacity: 0.05,
                transform: `rotate(${i * 2}deg)`,
                animation: `slide ${15 + i * 2}s infinite linear`,
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}

        {/* Floating particles */}
        {isClient &&
          [...Array(numParticles)].map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-0.5 md:w-1 md:h-1 bg-white rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.3,
                animation: `float ${5 + Math.random() * 10}s infinite ease-in-out`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}

        {/* Shimmer overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
            backgroundSize: '1000px 100%',
            animation: 'shimmer 5s infinite linear',
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-30">
        <div ref={textRef} className="text-white">
          <motion.h2
            className="text-2xl md:text-4xl mb-4 md:mb-6 text-center font-medium leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Leading Software Development Company
          </motion.h2>

          <motion.p
            className="text-sm md:text-lg max-w-4xl mx-auto text-center px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            Clickmasters – Crafting custom software solutions to empower businesses worldwide.
          </motion.p>

          <motion.p
            className="text-sm md:text-lg max-w-4xl mx-auto text-center px-4 mt-2 md:mt-0"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            From web and mobile apps to enterprise systems, we deliver scalable, reliable, and innovative software.
          </motion.p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-8 md:mt-12">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item text-center relative group">
              <div
                className={`absolute inset-0 bg-gradient-to-r ${gradients[index % gradients.length]} rounded-full blur-xl md:blur-2xl`}
                style={{
                  opacity: 0.1,
                  animation: 'glowPulse 3s infinite ease-in-out',
                  animationDelay: `${index * 0.2}s`,
                }}
              />
              <div className="relative">
                <AnimatedCounter
                  value={stat.value}
                  label={stat.label}
                  color="from-primary/80 to-primary"
                  delay={index * 0.2}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Main component that combines both sections
const HomePage: React.FC = () => {
  return (
    <main className="bg-white">
      <HeroSection />
      <StatsSection />
    </main>
  );
};

export default HomePage;