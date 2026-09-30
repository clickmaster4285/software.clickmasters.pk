"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import SplitText from '../../ui/SplitText';

type Client = {
  name: string;
  industry: string;
  image: any;
  description: string;
};

const trustedClients: Client[] = [
  {
    name: "TechCorp",
    industry: "Manufacturing",
    image: "/images/industries/manufacturing.jpg",
    description: "Automate production lines and streamline factory operations with intelligent control systems.",
  },
  {
    name: "HealthPlus",
    industry: "Healthcare",
    image: "/images/industries/healthcare.jpg",
    description: "Build intelligent diagnostic tools and automated patient management systems to improve care accuracy and streamline clinical workflows.",
  },
  {
    name: "RetailHub",
    industry: "Retail",
    image: "/images/industries/retail.jpg",
    description: "Modernize storefronts and online shops with smart inventory, checkout, and loyalty experiences.",
  },
  {
    name: "EstatePro",
    industry: "Real Estate",
    image: "/images/industries/realestate.jpg",
    description: "Manage listings, contracts, and tenant relationships with unified property platforms.",
  },
  {
    name: "EduSmart",
    industry: "Education",
    image: "/images/industries/education.jpg",
    description: "Deliver adaptive learning experiences and digital classrooms that scale with every student.",
  },
  {
    name: "FinTrust",
    industry: "Finance",
    image: "/images/industries/finance.jpg",
    description: "Secure trading platforms and analytics dashboards built for speed, accuracy, and compliance.",
  },
  {
    name: "LogiFlow",
    industry: "Logistics",
    image: "/images/industries/logistics.jpg",
    description: "Track shipments end-to-end and optimize fleets with real-time routing intelligence.",
  },
  {
    name: "MediaWave",
    industry: "Media",
    image: "/images/industries/media.jpg",
    description: "Power broadcasting, streaming, and content workflows with high-performance production tools.",
  },
  {
    name: "NovaBank",
    industry: "Banking",
    image: "/images/industries/banking.jpg",
    description: "Modern core banking, digital onboarding, and fraud protection for next-generation institutions.",
  },
  {
    name: "GreenField",
    industry: "Agriculture",
    image: "/images/industries/agriculture.jpg",
    description: "Precision farming software that turns sensor data into higher yields and lower waste.",
  },
  {
    name: "Skyline Hotels",
    industry: "Hospitality",
    image: "/images/industries/hospitality.jpg",
    description: "Reservation, guest experience, and operations platforms for premium hotel brands.",
  },
  {
    name: "Pulse Fitness",
    industry: "Health & Fitness",
    image: "/images/industries/fitness.jpg",
    description: "Member apps, class booking, and performance tracking to grow modern fitness communities.",
  },
  {
    name: "Quantum Dynamics",
    industry: "Technology",
    image: "/images/industries/technology.jpg",
    description: "Cutting-edge platforms, APIs, and infrastructure for software-first technology companies.",
  },
  {
    name: "Lumina Insurance",
    industry: "Insurance",
    image: "/images/industries/insurance.jpg",
    description: "Quote, underwrite, and service policies faster with automated insurance workflows.",
  },
  {
    name: "Vertex Solutions",
    industry: "Consulting",
    image: "/images/industries/consulting.jpg",
    description: "Client portals, analytics, and engagement tooling tailored for high-performing consultancies.",
  },
];

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

function ClientCard({
  client,
  index,
  visible,
  isActive,
  onHover,
  onLeave,
}: {
  client: Client;
  index: number;
  visible: boolean;
  isActive: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  return (
    <div
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onFocus={onHover}
      onBlur={onLeave}
      tabIndex={0}
      className="group relative overflow-hidden min-h-[320px] cursor-pointer outline-none border border-black/20"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.5s ease ${index * 40}ms, transform 0.5s ease ${index * 40}ms`,
      }}
    >
      {/* Only active card gets PURE BLUR - no color filling! */}
      {isActive && (
        <div
          className="absolute inset-0 backdrop-blur-md transition-all duration-500"
          aria-hidden="true"
        />
      )}

      {/* Content */}
      <div className="relative z-10 flex h-full min-h-[320px] flex-col justify-end p-7 text-white">
        <h3 className="text-2xl font-semibold tracking-tight">{client.industry}</h3>

        {/* Description: only visible on the active card */}
        <div
          className={[
            "grid transition-[grid-template-rows] duration-500 ease-out",
            isActive ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
          ].join(" ")}
        >
          <div className="overflow-hidden">
            <p className="mt-4 text-lg leading-relaxed text-white/90">
              {client.description}
            </p>
          </div>
        </div>

        {/* Explore More: only on the active card */}
        {/* <div
          className={[
            "mt-5 flex items-center gap-2 text-sm font-medium transition-all duration-500 delay-100",
            isActive ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1",
          ].join(" ")}
        >
          <span>Explore More</span>
          <ArrowRight size={16} />
        </div> */}
      </div>
    </div>
  );
}

export function TrustedClientsSection() {
  const { ref, visible } = useInView();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section ref={ref} className="relative w-full bg-[#f5fbfb] py-16">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-8">
        {/* Header - Exact same as your original */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="h-[2px] w-8 rounded-full bg-primary" />
            <div className="inline-flex items-center gap-1.5 mt-6">
              <SplitText
                as="h2"
                text="Trusted By Industry Leaders"
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

          <p className="text-gray-800 max-w-2xl mx-auto text-base md:text-lg">
            Join 3,500+ businesses that trust ClickMasters to deliver exceptional software solutions
          </p>
        </div>

        {/* Client Grid with shared background image */}
        <div className="relative rounded-xl overflow-hidden border border-white/60 shadow-lg">
          {/* Shared background — swaps to the hovered card's image */}
          {trustedClients.map((c, i) => (
            <div
              key={c.name}
              className="absolute inset-0 transition-opacity duration-700 ease-out"
              style={{
                opacity: (activeIndex === null && i === 0) || activeIndex === i ? 1 : 0,
              }}
            >
              <Image
                src={c.image}
                alt=""
                fill
                className="object-cover"
                priority={i === 0}
              />
            </div>
          ))}

          <div className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-[1px]">
            {trustedClients.map((client, idx) => (
              <ClientCard
                key={client.name}
                client={client}
                index={idx}
                visible={visible}
                isActive={activeIndex === idx}
                onHover={() => setActiveIndex(idx)}
                onLeave={() => setActiveIndex((curr) => (curr === idx ? null : curr))}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default TrustedClientsSection;