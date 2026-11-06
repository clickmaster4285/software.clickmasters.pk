"use client";

import { useState } from "react";

interface PhaseContent {
  step: string;
  title: string;
  description: string;
  deliverables: string[];
  duration: string;
  color: string;
  bgLight: string;
}

interface ExpandOnHoverProps {
  images?: string[];
  phases?: PhaseContent[];
  defaultExpandedIndex?: number;
  containerHeight?: string;
  onImageChange?: (index: number, phase?: PhaseContent) => void;
}

const ExpandOnHover = ({
  images: customImages,
  phases = [],
  defaultExpandedIndex = 1, // Changed from 3 to 1 to open step 1 by default
  containerHeight = "28rem",
  onImageChange,
}: ExpandOnHoverProps) => {
  const [expandedImage, setExpandedImage] = useState(defaultExpandedIndex);
  const [hoveredPhase, setHoveredPhase] = useState<PhaseContent | null>(
    phases[defaultExpandedIndex - 1] || null
  );

  // Dark software/tech images with black backgrounds
  const defaultImages = [
    "/images/process/photo-1555066931-4365d14bab8c.webp",
    "/images/process/photo-1542831371-29b0f74f9713.webp",
    "/images/process/photo-1555949963-ff9fe0c870eb.webp",
    "/images/process/photo-1551033406-611cf9a28f67.webp",
    "/images/process/photo-1515879218367-8466d910aaa4.webp",
    "/images/process/photo-1461749280684-dccba630e2f6.webp",
  ];

  const imageArray = customImages || defaultImages;
  const hasPhases = phases.length > 0;

  const getImageWidth = (index: number) => {
    return index === expandedImage ? "50%" : "10%";
  };

  const handleImageHover = (index: number) => {
    setExpandedImage(index);
    const phase = hasPhases ? phases[index - 1] : undefined;
    setHoveredPhase(phase || null);
    onImageChange?.(index, phase);
  };

  return (
    <div className="w-full overflow-hidden">
      <div className="w-full p-4 md:p-8">
        {/* IMAGE ROW */}
        <div className="flex w-full gap-3">
          {imageArray.map((src, idx) => {
            const phaseContent = hasPhases ? phases[idx] : null;
            const isExpanded = idx + 1 === expandedImage;
            const stepNumber = idx + 1;

            return (
              <div
                key={idx}
                onMouseEnter={() => handleImageHover(stepNumber)}
                className="group relative cursor-pointer overflow-hidden rounded-[24px] transition-all duration-500 ease-in-out"
                style={{
                  width: getImageWidth(stepNumber),
                  height: containerHeight,
                  flexShrink: 0,
                }}
              >
                {/* IMAGE */}
                <img
                  src={src}
                  alt={`Process ${stepNumber}`}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* DARK OVERLAY - ALWAYS VISIBLE, STRONGER WHEN EXPANDED */}
                <div
                  className={`absolute inset-0 bg-black transition-all duration-500 ${
                    isExpanded ? "bg-opacity-60" : "bg-opacity-70"
                  }`}
                />

                {/* GRADIENT OVERLAY FOR BETTER TEXT READABILITY */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60" />

                {/* STEP BADGE - VERTICAL WHEN COLLAPSED, HORIZONTAL WHEN EXPANDED */}
                {phaseContent && (
                  <>
                    {/* Vertical step indicator (shown when collapsed) */}
                    <div
                      className={`absolute left-1/2 top-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 transform flex-col items-center justify-center transition-all duration-500 ${
                        isExpanded
                          ? "opacity-0 scale-50"
                          : "opacity-100 scale-100 group-hover:opacity-0"
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-4xl font-black text-white">
                          {stepNumber}
                        </span>
                        <span className="text-xs font-medium uppercase tracking-wider text-white/80">
                          STEP
                        </span>
                        {phaseContent.title && (
                          <span className="mt-1 text-center text-[10px] font-medium text-white/60">
                            {phaseContent.title.split(" ").slice(0, 2).join(" ")}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Horizontal step badge (shown when expanded) */}
                    <div
                      className={`absolute left-4 top-4 z-20 rounded-full bg-black/60 px-4 py-2 backdrop-blur-md transition-all duration-500 ${
                        isExpanded
                          ? "opacity-100 translate-x-0"
                          : "opacity-0 -translate-x-4 pointer-events-none"
                      }`}
                    >
                      <span className="text-sm font-bold text-white">
                        {phaseContent.step}
                      </span>
                    </div>
                  </>
                )}

                {/* CONTENT - Only shown when expanded */}
                {phaseContent && (
                  <div
                    className={`absolute bottom-0 left-0 right-0 z-10 p-5 text-white transition-all duration-500 ${
                      isExpanded
                        ? "translate-y-0 opacity-100"
                        : "translate-y-full opacity-0"
                    }`}
                  >
                    <h3 className="text-2xl font-bold leading-tight">
                      {phaseContent.title}
                    </h3>

                    <p className="mt-2 text-lg text-gray-200">
                      {phaseContent.description}
                    </p>

                    {/* Deliverables */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {phaseContent.deliverables.slice(0, 3).map((d, i) => (
                        <span
                          key={i}
                          className="rounded-full bg-white/10 px-2 py-1 text-md text-white backdrop-blur-sm"
                        >
                          {d}
                        </span>
                      ))}
                    </div>

                    <div className="mt-3 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                      {phaseContent.duration}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* MOBILE TEXT */}
        <div className="mt-5 text-center text-sm text-gray-800 md:hidden">
          👆 Tap images to explore stages
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease forwards;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default ExpandOnHover;