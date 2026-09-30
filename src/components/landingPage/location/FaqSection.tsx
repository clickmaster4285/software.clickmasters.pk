"use client";

import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SplitText from '../../ui/SplitText';

type FaqItem = {
  question: string;
  answer: string;
  more?: { href: string; label: string };
};

type FaqSectionProps = {
  faqs: FaqItem[];
  location?: string;
  title?: string;
  subtitle?: string;
};

export function FaqSection({ 
  faqs, 
  location, 
  title = "Frequently Asked Questions",
  subtitle = 'Common questions about our services and process',
}: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // If no FAQs are provided, don't render the section
  if (!faqs || faqs.length === 0) {
    return null;
  }

  return (
  <section
  className="relative overflow-hidden bg-[#f5fbfb] py-16 sm:py-20 lg:px-10"
  aria-labelledby="faq-heading"    
>

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
      



  <div className="relative z-10 mx-auto max-w-[1600px] px-4 lg:px-4">
     {/* Header */}
           <div className="mx-auto max-w-3xl text-center mb-12">
             <div className="inline-flex items-center gap-2 mb-3">
               <span className="h-[2px] w-8 rounded-full bg-primary" />
               
               <div className="inline-flex items-center gap-1.5">
                 <SplitText
                   as="h2"
                   text="FAQ's"
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
   
             <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-800 sm:text-lg">
               Everything you need to know about our process, timelines, technology stack, and post-launch support.
             </p>
           </div>

  {/* FAQ Grid - 2 columns */}
        <div className="grid gap-4 sm:grid-cols-1">
          {faqs.map((item, index) => (
            <div
              key={item.question}
              className="border-b border-slate-200 transition-all"
              style={{ height: 'fit-content' }}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-slate-50"
              >
                <h3 className="pr-8 text-lg font-semibold leading-7 text-slate-900">
                  {item.question}
                </h3>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              <AnimatePresence mode="wait">
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-slate-100 px-6 pb-6 pt-4">
                      <p className="text-base leading-7 text-slate-800">
                        {item.answer}
                        {item.more ? (
                          <>
                            {' '}
                            <Link
                              href={item.more.href}
                              className="font-medium text-primary hover:underline"
                              aria-label={`${item.more.label} ${item.more.href}`}
                            >
                              {item.more.label}
                            </Link>
                          </>
                        ) : null}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
  </div>
</section>
  );
}

export default FaqSection;