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
  defaultExpandedIndex = 3,
  containerHeight = "28rem",
  onImageChange,
}: ExpandOnHoverProps) => {
  const [expandedImage, setExpandedImage] = useState(defaultExpandedIndex);

  const [hoveredPhase, setHoveredPhase] = useState<PhaseContent | null>(
    phases[defaultExpandedIndex - 1] || null
  );

  // Default Images
  const defaultImages = [
    "/images/process/photo-1498050108023-c5249f4df085.webp",
    "/images/process/photo-1519389950473-47ba0277781c.webp",
    "/images/process/photo-1522071820081-009f0129c71c.webp",
    "/images/process/photo-1522075469751-3a6694fb2f61.webp",
    "/images/process/photo-1557804506-669a67965ba0.webp",
    "/images/process/photo-1531403009284-440f080d1e12.webp",
  ];

  const imageArray = customImages || defaultImages;

  const hasPhases = phases.length > 0;

  // PERFECT WIDTHS FOR 6 IMAGES
  // 1 expanded = 50%
  // 5 collapsed = 10% each
  // Total = 100%
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
    <div className="w-full overflow-hidden ">
      <div className="w-full p-4 md:p-8">
        {/* IMAGE ROW */}
        <div className="flex w-full gap-3">
          {imageArray.map((src, idx) => {
            const phaseContent = hasPhases ? phases[idx] : null;

            const isExpanded = idx + 1 === expandedImage;

            return (
              <div
                key={idx}
                onMouseEnter={() => handleImageHover(idx + 1)}
                className="group relative cursor-pointer overflow-hidden rounded-[24px] transition-all duration-500 ease-in-out"
                style={{
                  width: getImageWidth(idx + 1),
                  height: containerHeight,
                  flexShrink: 0,
                }}
              >
                {/* IMAGE */}
                <img
                  src={src}
                  alt={`Process ${idx + 1}`}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* OVERLAY */}
                <div
                  className={`absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent transition-all duration-500 ${
                    isExpanded
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100"
                  }`}
                />

                {/* STEP BADGE */}
                {phaseContent && (
                  <div
                    className={`absolute left-4 top-4 z-20 rounded-full bg-black/50 px-3 py-2 backdrop-blur-md transition-all duration-500 ${
                      isExpanded
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100"
                    }`}
                  >
                    <span className="text-xs font-bold text-white">
                      {phaseContent.step}
                    </span>
                  </div>
                )}

              {/* CONTENT */}
{phaseContent && (
  <div
    className={`absolute bottom-0 left-0 right-0 z-10 p-5 text-white transition-all duration-500 ${
      isExpanded
        ? "translate-y-0 opacity-100"
        : "translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
    }`}
  >
    <div className="mb-2 text-sm font-semibold text-orange-400">
      {phaseContent.step}
    </div>

    <h3 className="text-2xl font-bold leading-tight">
      {phaseContent.title}
    </h3>

    <p className="mt-2 text-sm text-gray-200 line-clamp-2">
      {phaseContent.description}
    </p>

    {/* 👇 ADD POINTS INSIDE CARD */}
    <div className="mt-3 flex flex-wrap gap-2">
      {phaseContent.deliverables.slice(0, 3).map((d, i) => (
        <span
          key={i}
          className="rounded-full bg-white/10 px-2 py-1 text-[10px] text-white backdrop-blur-sm"
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