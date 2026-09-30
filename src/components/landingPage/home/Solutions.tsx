"use client";

import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CardStack } from "@/components/ui/card-stack";
import { apiFetch } from "@/lib/api";
import { resolveImageUrl } from "@/lib/utils";
import SplitText from '../../ui/SplitText';
interface Project {
  _id: string;
  title: string;
  description: string;
  url?: string;
  thumbnail?: string;
}

function useResponsiveCardConfig() {
  const [config, setConfig] = useState({
    spreadDeg: 24,
    cardWidth: 380,
    cardHeight: 260,
    overlap: 0.52,
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setConfig({ spreadDeg: 10, cardWidth: 200, cardHeight: 180, overlap: 0.38 });
      } else if (width < 768) {
        setConfig({ spreadDeg: 14, cardWidth: 240, cardHeight: 200, overlap: 0.42 });
      } else if (width < 1024) {
        setConfig({ spreadDeg: 18, cardWidth: 300, cardHeight: 220, overlap: 0.46 });
      } else if (width < 1280) {
        setConfig({ spreadDeg: 22, cardWidth: 340, cardHeight: 240, overlap: 0.50 });
      } else {
        setConfig({ spreadDeg: 24, cardWidth: 380, cardHeight: 260, overlap: 0.52 });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return config;
}

export default function SolutionsPage() {
  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["projects-public"],
    queryFn: async () => {
      const res = await apiFetch("/api/projects");
      if (!res.ok) throw new Error("Failed to fetch projects");
      return res.json();
    },
  });

  const responsiveConfig = useResponsiveCardConfig();

  const cardStackItems = projects.slice(0, 9).map((project) => ({
    id: project._id,
    title: project.title || "Untitled Project",
    description:
      project.description?.length > 85
        ? `${project.description.substring(0, 85)}...`
        : project.description || "No description available",
    imageSrc: project.thumbnail
      ? resolveImageUrl(project.thumbnail)
      : "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
    href: project.url || "#",
  }));

  if (isLoading) {
    return <div className="py-24 text-center">Loading...</div>;
  }

  return (
    <main className="relative w-full bg-[#f5fbfb]">
      {/* overflow-x-clip prevents scrollbar without clipping bottom */}
      
  <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#a7f3d0] opacity-30 blur-3xl" /> 
           <div className="pointer-events-none absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-[#fdba74] opacity-25 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 -left-32 h-[550px] w-[550px] -translate-y-1/2 rounded-full bg-[#93c5fd] opacity-25 blur-3xl" />
      
      <section className="py-12 sm:py-16 md:py-24 overflow-x-clip">


        {/* max-w-7xl + px matches your navbar container exactly */}
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-12">

          {/* Heading */}
          <div className="mx-auto max-w-3xl text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="h-[2px] w-8 rounded-full bg-primary" />
                    <div className="inline-flex items-center gap-1.5">
  <SplitText
  as="h2"
  text="Our Solutions"
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

            {/* <h2 className="text-2xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">
              Our Work in Action
            </h2> */}

            <p className=" text-black text-xl">
              See how we&apos;ve helped businesses transform their ideas into
              successful digital products.
            </p>
          </div>

          {/* Card stack inner padding gives the visual left/right breathing room */}
          <div className="mx-auto max-w-4xl px-6 sm:px-10 lg:px-16">
            {cardStackItems.length > 0 ? (
              <CardStack
                items={cardStackItems}
                initialIndex={Math.min(2, cardStackItems.length - 1)}
                autoAdvance
                intervalMs={3000}
                pauseOnHover
                showDots
                {...responsiveConfig}
              />
            ) : (
              <p className="text-center py-20 text-gray-800">
                No projects available yet.
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}