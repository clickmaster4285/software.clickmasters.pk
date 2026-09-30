"use client";

import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

type FaqItem = {
  question: string;
  answer: string;
};

// Default FAQs
const defaultFaqItems: FaqItem[] = [
  {
    question: 'How much does custom software development cost?',
    answer:
      'Custom software development costs vary based on complexity, features, and timeline. A basic web application typically starts from $5,000-$15,000, while enterprise systems range from $30,000-$200,000+. We provide free consultations to give accurate project estimates.',
  },
  {
    question: 'How long does it take to build a custom software application?',
    answer:
      'Development timelines depend on the project scope. An MVP takes 6-12 weeks, a full web or mobile application takes 3-6 months, and enterprise systems can take 6-18 months. We use agile sprints to deliver working software every 2 weeks.',
  },
  {
    question: 'What technologies does ClickMasters use?',
    answer:
      "We use modern, proven technologies including React, Next.js, Node.js, Python, Flutter, React Native, PostgreSQL, MongoDB, AWS, Google Cloud, and Azure. We choose the best stack for each project's specific needs.",
  },
  {
    question: 'Do you provide post-launch support and maintenance?',
    answer:
      'Yes. ClickMasters provides 24/7 post-launch support, security updates, performance monitoring, and feature development. We offer monthly maintenance plans to keep your software running smoothly.',
  },
  {
    question: 'Can ClickMasters work with international clients?',
    answer:
      'Yes. We work with clients across the USA, Europe, Middle East, and worldwide. Our team operates across time zones and uses agile project management tools to ensure seamless collaboration regardless of location.',
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section 
      className="relative  bg-[#f5fbfb] py-16 sm:py-20" 
      aria-labelledby="homepage-faq-heading"
    >
      {/* Background Blobs */}
      {/* <div
        className="absolute inset-0 opacity-[0.45]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(15,23,42,0.06) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(15,23,42,0.06) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      /> */}
     
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      </div>

      {/* Main Container - Max 1600px + Centered */}
      <div className="mx-auto max-w-[1600px] px-6 lg:px-12">

        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="h-[2px] w-8 rounded-full bg-primary" />
            <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-[0.25em] text-primary">
              FAQ's
            </h2>
            <span className="h-[2px] w-8 rounded-full bg-primary" />
          </div>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-800 sm:text-lg">
            Everything you need to know about our process, timelines, technology stack, and post-launch support.
          </p>
        </div>

        {/* FAQ List */}
        <div className="mx-auto">
          <div className="grid gap-4">
            {defaultFaqItems.map((item, index) => (
              <div
                key={index}
                className="border-b border-primary/20 transition-all"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="flex w-full items-center justify-between py-6 text-left transition-colors rounded-xl hover:bg-slate-50/50 px-4"
                  type="button"
                >
                  <h3 className="text-lg font-semibold leading-7 text-slate-900">
                    {item.question}
                  </h3>
                  {openIndex === index ? (
                    <ChevronUp className="h-5 w-5 shrink-0 text-slate-800 transition-transform duration-300" />
                  ) : (
                    <ChevronDown className="h-5 w-5 shrink-0 text-slate-800 transition-transform duration-300" />
                  )}
                </button>
                
                {/* Answer section */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openIndex === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-4 pb-6 pt-2">
                    <p className="text-base leading-7 text-slate-800">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

export default FaqSection;