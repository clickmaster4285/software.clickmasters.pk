// src/components/landingPage/servicesPage/ServicesSection.tsx
"use client";

import { LargeStackedCards, LargeGlassCardItem } from "@/components/ui/large-stacked-cards";
import SplitText from "../../ui/SplitText";

interface ServiceCard {
  title: string;
  description: string;
}

interface ServicesSectionProps {
  serviceName: string;
  servicesCards: ServiceCard[];
}

export const ServicesSection = ({ serviceName, servicesCards }: ServicesSectionProps) => {
  const stackedCardsItems: LargeGlassCardItem[] = servicesCards.map((card, index) => ({
    id: index,
    title: card.title,
    description: card.description,
  }));

  return (
    <section id="our-services" className="relative w-full overflow-visible bg-[#f5fbfb] py-14">

      {/* Background Grid */}
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

      {/* Header */}
      <div className="mx-auto max-w-3xl px-4 text-center mb-12 sm:mb-14 md:mb-16">
        <div className="inline-flex items-center gap-2 mb-3 flex-wrap justify-center">
          <span className="h-[2px] w-8 rounded-full bg-primary hidden sm:block" />
          <div className="inline-flex items-center gap-1.5">
            <SplitText
              as="h2"
              text={`${serviceName} Services We Deliver`}
              className="text-xl sm:text-2xl md:text-3xl font-bold uppercase tracking-[0.15em] sm:tracking-[0.25em] text-primary text-center"
              delay={60}
              duration={0.8}
              ease="power3.out"
              splitType="words"
              from={{ opacity: 0, x: 60 }}
              to={{ opacity: 1, x: 0 }}
              threshold={0.2}
            />
          </div>
          <span className="h-[2px] w-8 rounded-full bg-primary hidden sm:block" />
        </div>

        <p className="mx-auto max-w-2xl text-sm sm:text-base leading-7 text-slate-800 sm:text-lg px-2">
          ClickMasters operates as a full-stack{" "}
          <span className="font-black">{serviceName.toLowerCase()}</span> partner. Our
          team handles every layer of the software delivery lifecycle — product strategy,
          UI/UX design, backend engineering, cloud infrastructure, QA, and ongoing support.
        </p>
      </div>

      {/* Large Stacked Cards */}
      <div className="relative mt-12 overflow-visible px-3 sm:px-4 md:px-6 lg:px-0">
        <LargeStackedCards items={stackedCardsItems} />
      </div>

      {/* Bottom Divider */}
      <div className="my-16 flex items-center gap-4 px-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      </div>
    </section>
  );
};