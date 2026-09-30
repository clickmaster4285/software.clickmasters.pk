"use client";

import { motion } from "motion/react";
import { PricingCard } from "@/components/ui/PricingCard";
import { useState } from "react";
import SplitText from "../../ui/SplitText";

interface PricingTier {
  type: string;
  investment: string;
  timeline: string;
  bestFor: string;
}

interface PricingSectionProps {
  serviceName: string;
  pricingTiers: PricingTier[];
}

const parseInvestment = (value: string) => {
  if (!value) return null;

  const isCustom = value.toLowerCase().includes("custom");

  const numbers = value
    .replace(/,/g, "")
    .match(/\d+/g)
    ?.map(Number);

  if (!numbers || numbers.length === 0) {
    return isCustom ? { min: 0, max: 0, isCustom: true } : null;
  }

  if (numbers.length >= 2) {
    return { min: numbers[0], max: numbers[1], isCustom };
  }

  return { min: numbers[0], max: numbers[0], isCustom };
};

export function PricingSection({ serviceName, pricingTiers }: PricingSectionProps) {
  const INITIAL_VISIBLE = 3;
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  
  const visibleTiers = pricingTiers.slice(0, visibleCount);
  const hasMore = visibleCount < pricingTiers.length;

  if (!pricingTiers || pricingTiers.length === 0) return null;

  const pricingCardsData = visibleTiers
    .map((tier, idx) => {
      // Make the 3rd card (index 2) a custom plan
      if (idx === 2) {
        return {
          title: "Custom Enterprise Plan",
          description: "Tailored solution for your unique business needs",
          price: 0,
          originalPrice: undefined,
          features: [
            {
              title: "Custom Package Includes",
              items: [
                "Fully customized solution",
                "Dedicated support team",
                "Unlimited revisions",
                "Priority response time",
                "SLA agreement",
                "On-site training available",
              ],
            },
          ],
          buttonText: "Contact Sales",
          onButtonClick: () => {
            console.log("Contact sales for custom plan");
          },
        };
      }
      
      const parsed = parseInvestment(tier.investment);
      if (!parsed) return null;

      const { min, max, isCustom } = parsed;

      return {
        title: tier.type,
        description: `Perfect for businesses that need ${tier.type.toLowerCase()} solutions`,
        price: isCustom ? 0 : min,
        originalPrice: isCustom
          ? undefined
          : max > min
          ? max
          : Math.round(min * 1.5),
        features: [
          {
            title: "Package Includes",
            items: [
              `Timeline: ${tier.timeline}`,
              `Best For: ${tier.bestFor}`,
              `Budget Range: ${
                isCustom
                  ? "Custom"
                  : `${min.toLocaleString()} – ${max.toLocaleString()} AUD`
              }`,
              "Dedicated Project Manager",
              "Quality Assurance Testing",
              "Documentation & Training",
            ],
          },
        ],
        buttonText: isCustom ? "Contact Us" : "Get Started",
        onButtonClick: () => {
          console.log(`Selected ${tier.type} plan`);
        },
      };
    })
    .filter(Boolean);

  const handleSeeMore = () => {
    setVisibleCount(prev => Math.min(prev + 3, pricingTiers.length));
  };

  return (
    <motion.section
      id="pricing"
      className="relative scroll-mt-24 py-6 sm:py-8 md:py-12 px-4 sm:px-6 md:mx-auto overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div
        className="absolute inset-0 opacity-[0.35] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(15,23,42,0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(15,23,42,0.08) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      <div className="mx-auto max-w-3xl text-center mb-12 sm:mb-14 md:mb-16">
        <div className="inline-flex max-w-full flex-wrap items-center justify-center gap-2 mb-3 px-1">
          <span className="hidden h-[2px] w-8 shrink-0 rounded-full bg-primary sm:block" />
          <div className="inline-flex max-w-full items-center justify-center gap-1.5">
            <SplitText
              as="h2"
              text={`${serviceName} Pricing`}
              className="text-center text-xl sm:text-2xl md:text-3xl font-bold uppercase tracking-[0.1em] sm:tracking-[0.25em] text-primary"
              delay={60}
              duration={0.8}
              ease="power3.out"
              splitType="words"
              from={{ opacity: 0, x: 60 }}
              to={{ opacity: 1, x: 0 }}
              threshold={0.2}
            />
          </div>
          <span className="hidden h-[2px] w-8 shrink-0 rounded-full bg-primary sm:block" />
        </div>

        <p className="mx-auto max-w-2xl text-base leading-7 text-slate-800 sm:text-lg">
          Transparent pricing tailored to your business needs
        </p>
      </div>

      <div className="mt-6 mx-auto max-w-[1600px] lg:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-center ">
        {pricingCardsData.map((cardData, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <PricingCard
              title={cardData?.title ?? ""}
              description={cardData?.description ?? ""}
              price={cardData?.price ?? 0}
              originalPrice={cardData?.originalPrice}
              features={cardData?.features ?? []}
              buttonText={cardData?.buttonText}
              onButtonClick={cardData?.onButtonClick}
              highlighted={index === 1}
            />
          </motion.div>
        ))}
      </div>

      {hasMore && (
        <motion.div
          className="flex justify-center mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={handleSeeMore}
            className="group px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            <span>See More Plans</span>
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </motion.div>
      )}

      <motion.div
        className="mt-12 sm:mt-16 flex flex-col items-center gap-5 sm:gap-6"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-slate-500 px-2">
          {[
            "Transparent Pricing",
            "No Hidden Costs",
            "Flexible Engagement",
            "30-Day Support",
          ].map((text, idx) => (
            <motion.div
              key={idx}
              className="flex items-center gap-1.5 sm:gap-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 + idx * 0.1 }}
            >
              <svg
                className="h-3 w-3 sm:h-4 sm:w-4 text-primary"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{text}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.section>
  );
}