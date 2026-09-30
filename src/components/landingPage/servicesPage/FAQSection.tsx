"use client";
// components/landingPagePage/FAQSection.tsx
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SplitText from '../../ui/SplitText';

interface FAQ {
  question: string;
  answer: string;
  more?: { href: string; label: string };
}

interface FAQSectionProps {
  faqs: FAQ[];
}

export const FAQSection = ({ faqs }: FAQSectionProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (!faqs || faqs.length === 0) return null;

  return (
    <section 
      id="faq"
      className="relative overflow-hidden  py-16 sm:py-20" 
      aria-labelledby="faq-heading"
    >

           {/* SAME BLOBS AS TRUSTED CLIENTS */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#a7f3d0] opacity-30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-[#fdba74] opacity-25 blur-3xl" />
      


      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      </div>

      {/* Main Container - Max 1600px + Centered */}
      <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
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

        {/* FAQ List */}
        <div className="mx-auto">
          <div className="grid gap-4">
            {faqs.map((item, index) => (
              <div
                key={index}
                className="border-b border-primary/20 transition-all"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="flex w-full items-center justify-between py-6 text-left transition-colors rounded-xl"
                >
                  <h3 className="text-lg font-semibold leading-7 text-slate-900">
                    {item.question}
                  </h3>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-slate-800 transition-transform duration-300 ${
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
                      <div className="px-6 pb-6 pt-2">
                        <p className="text-base leading-7 text-slate-800">
                          {item.answer}
                          {item.more && (
                            <>
                              {' '}
                              <a
                                href={item.more.href}
                                className="font-medium text-primary hover:underline"
                                aria-label={`${item.more.label}`}
                              >
                                {item.more.label}
                              </a>
                            </>
                          )}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};