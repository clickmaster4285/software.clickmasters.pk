// components/sections/PainPointsSolutions.tsx
'use client';

import { useState } from 'react';
import { 
  XCircle, 
  Clock, 
  ShieldAlert, 
  TrendingUp, 
  CheckCircle2,
  ArrowRight,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';
import SplitText from '../../ui/SplitText';

interface PainPoint {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  gradient: string;
}

const painPoints: PainPoint[] = [
  {
    id: 'cost',
    title: 'The Costly Cycle',
    description: 'You spend more maintaining legacy code than building new features. Technical debt is silently killing your margins.',
    icon: XCircle,
    gradient: 'from-primary to-rose-600',
  },
  {
    id: 'timeline',
    title: 'The Infinite Timeline',
    description: '"It’ll be ready next quarter..." Agency black-box development with zero visibility.',
    icon: Clock,
    gradient: 'from-primary toprimary/80',
  },
  {
    id: 'security',
    title: 'The Security Gamble',
    description: 'Vulnerable plugins and shortcuts put your customer data and reputation at constant risk.',
    icon: ShieldAlert,
    gradient: 'from-primary to-red-600',
  },
  {
    id: 'scalability',
    title: 'The Scalability Ceiling',
    description: 'Your app crashes during success. Legacy systems can’t handle real growth.',
    icon: TrendingUp,
    gradient: 'from-rose-500 toprimary/80',
  },
];

const solutions = [
  { title: 'Predictable ROI Architecture', description: 'Modern, maintainable stack (Node.js + React + Cloud-native) built to last.', metric: 'Up to 70% lower maintenance costs' },
  { title: 'Radical Transparency', description: 'Agile sprints with weekly demos. You always see real progress never surprises.', metric: '98% on-time delivery' },
  { title: 'Enterprise-Grade Security', description: 'OWASP Top 10, GDPR compliant, regular penetration testing by default.', metric: 'Zero security breaches' },
  { title: 'Built for 10x Growth', description: 'Auto-scaling AWS/Azure infrastructure designed for massive traffic from day one.', metric: '99.99% uptime SLA' },
];


interface PainPointsSolutionsProps {
  countryName?: string;
}


export default function PainPointsSolutions({ countryName }: PainPointsSolutionsProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const hasLocation = !!countryName;
  return (
    <section className="relative overflow-hidden py-24 md:py24 lg:px-14 bg-white sm:px-6 px-4 ">


<div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#a7f3d0] opacity-30 blur-3xl" /> 
      <div className="pointer-events-none absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-[#fdba74] opacity-25 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 -left-32 h-[550px] w-[550px] -translate-y-1/2 rounded-full bg-[#93c5fd] opacity-25 blur-3xl" />
      
      <div className="relative mx-auto  max-w-[1600px]">
        
        {/* Header */}
       

        


         <div className="mx-auto max-w-3xl text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
           <span className="h-[2px] w-8 rounded-full bg-primary" />
            
           <div className="inline-flex items-center gap-1.5">
  <SplitText
    as="h2"
    text={
      hasLocation
        ? `Problems Businesses Face in ${countryName}`
        : "Real Development Fixes"
    }
    className="text-2xl md:text-3xl font-bold uppercase tracking-[0.25em] text-primary"
    delay={50}
    duration={0.8}
    ease="power3.out"
    splitType="chars"
    from={{ opacity: 0, x: 40 }}
    to={{ opacity: 1, x: 0 }}
    threshold={0.2}
  />
</div>

           <span className="h-[2px] w-8 rounded-full bg-primary" />
          </div>

          {/* <h2 className="mt-5 font-display text-3xl font-bold tracking-tight sm:text-2xl lg:text-3xl leading-tight">
            {hasLocation 
              ? `Painful Development Realities in ${countryName} and How We Fix Them`
              : 'Painful Development Realities and How We Fix them'
            }
          </h2> */}

          <p className="mx-auto max-w-2xl text-xl leading-7 text-gray-900 sm:text-lg">
            {hasLocation 
              ? 'Common challenges that hinder business growth and efficiency'
              : 'Most agencies deliver headaches wrapped in pretty proposals. Here\'s the reality and why ClickMasters approaches development differently.'
            }
          </p>
        </div>

        {/* Pain → Solution Cards */}
        <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {painPoints.map((pain, idx) => {
            const Icon = pain.icon;
            const solution = solutions[idx];
            const isActive = activeIndex === idx;

            return (
              <motion.div
                key={pain.id}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="group relative h-full cursor-pointer"
                onMouseEnter={() => setActiveIndex(idx)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                <motion.div 
                  className="relative h-full flex flex-col rounded-3xl border border-slate-100 bg-white p-8 overflow-hidden shadow-lg
                    ${isActive ? 'shadow-2xl' : 'hover:shadow-xl'}"
                  animate={{ scale: isActive ? 1.03 : 1 }}
                  transition={{ duration: 0.4 }}
                >
                

                  {/* Icon */}
                  <motion.div 
                    className="mb-6 inline-flex rounded-2xl  p-4 text-red-600"
                    whileHover={{ scale: 1.12 }}
                  >
                    <Icon className="h-8 w-8" />
                  </motion.div>

                  {/* Pain Content */}
                  <motion.div 
                    className={`transition-all duration-500 ${isActive ? 'opacity-0 scale-95' : 'opacity-100'}`}
                    animate={{ opacity: isActive ? 0 : 1, scale: isActive ? 0.95 : 1 }}
                  >
                    <h3 className="text-2xl font-bold text-slate-900 mb-3 leading-tight">{pain.title}</h3>
                    <p className="text-gray-900 text-lg leading-relaxed font-medium">{pain.description}</p>
                  </motion.div>

                  {/* Solution Reveal */}
                  <motion.div 
                    className={`absolute inset-0 p-8 flex flex-col bg-white
                      ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                    animate={{ 
                      opacity: isActive ? 1 : 0,
                      y: isActive ? 0 : 48 
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-600">
                        <CheckCircle2 className="h-7 w-7" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">How We Fix It</p>
                        <p className="text-xl font-bold text-slate-900 leading-tight">{solution.title}</p>
                      </div>
                    </div>

                    <p className="text-gray-900 flex-1 text-lg leading-relaxed font-medium">{solution.description}</p>

                    {solution.metric && (
                      <div className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-primary/0 px-4 py-2.5 text-sm font-semibold text-primary">
                        📈 {solution.metric}
                      </div>
                    )}
                  </motion.div>

                  
                   <motion.div 
                    className="mt-auto w-full  flex items-center justify-center gap-2 rounded-2xl  py-3.5 text-xs font-semibold text-primary active:scale-95 transition-all"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                  >


                    Hover to see the fix
                  </motion.div>
                  
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}