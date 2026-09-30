"use client";

import Image from "next/image";
import { useState } from "react";
import SplitText from "../../ui/SplitText";

const certifications = [
  { name: "Amazon", logo: "/images/certifications/c1.png" },
  { name: "Bing", logo: "/images/certifications/c2.webp" },
  { name: "CB", logo: "/images/certifications/c3.png" },
  { name: "Clarity", logo: "/images/certifications/c4.webp" },
  { name: "ClickUp", logo: "/images/certifications/c5.webp" },
  { name: "Clutch", logo: "/images/certifications/c6.webp" },
  { name: "Forbes", logo: "/images/certifications/c7.webp" },
  { name: "HubSpot", logo: "/images/certifications/c8.webp" },
  { name: "Shopify", logo: "/images/certifications/c9.png" },
  { name: "SpyFu", logo: "/images/certifications/c10.webp" },
];

function CertificationCard({ item }: { item: { name: string; logo: string } }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="group flex h-72 w-80 flex-shrink-0 items-center justify-center px-8 transition-all duration-300 hover:-translate-y-2">
      <div className="relative h-64 w-full max-w-[260px] transition-transform duration-500 group-hover:scale-110">
        {!imageError ? (
          <Image
            src={item.logo}
            alt={item.name}
            fill
            className="object-contain"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-2xl bg-gray-100 text-2xl font-semibold text-gray-400">
            {item.name}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CertificationsSection() {
  // Duplicate array for perfect infinite loop
  const marqueeItems = [...certifications, ...certifications];

  return (
    <>
      <style jsx>{`
        @keyframes marquee-left {
          from {
            transform: translateX(0%);
          }
          to {
            transform: translateX(-50%);
          }
        }

        .marquee-track {
          animation: marquee-left 65s linear infinite;
        }

        .marquee-track:hover {
          animation-play-state: paused;
        }

        @media (max-width: 768px) {
          .marquee-track {
            animation-duration: 85s;
          }
        }
      `}</style>

      <section className="relative overflow-hidden bg-white py-16">
        <div className="relative mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          
          {/* Header */}





           <div className="mx-auto max-w-3xl text-center mb-8 mt-12">
                      <div className="inline-flex items-center gap-2 mb-3">
                        <span className="h-[2px] w-8 rounded-full bg-primary" />
                        <SplitText
                          as="h2"
                          text="Certifications"
                          className="text-2xl md:text-3xl font-bold uppercase tracking-[0.25em] text-primary"
                          delay={60}
                          duration={0.8}
                          ease="power3.out"
                          splitType="chars"
                          from={{ opacity: 0, x: 60 }}
                          to={{ opacity: 1, x: 0 }}
                          threshold={0.2}
                        />
                        <span className="h-[2px] w-8 rounded-full bg-primary" />
                      </div>
          
                       <p className="mx-auto max-w-2xl text-base leading-7 text-slate-800 sm:text-lg">   
                     Our trusted certifications and partnerships
                               </p>
                    </div>

                  
          
     

          {/* Full Width Marquee */}
          <div className="relative overflow-hidden">
            {/* Fade Gradients */}
            <div className="pointer-events-none absolute left-0 top-0 z-20 h-full w-32 bg-gradient-to-r from-white to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 z-20 h-full w-32 bg-gradient-to-l from-white to-transparent" />

            {/* Marquee Slider - Never Ending Loop */}
            <div className="marquee-track flex w-max gap-12 md:gap-16">
              {marqueeItems.map((item, index) => (
                <CertificationCard
                  key={`${item.name}-${index}`}
                  item={item}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}