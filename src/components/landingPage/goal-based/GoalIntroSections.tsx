"use client";

import { useMemo } from "react";
import type { CSSProperties } from "react";
import { TiltCard } from "@/components/ui/tilt-card";

interface ApproachIntro {
  eyebrow?: string;
  title: string;
  paragraphs: string[];
}

interface SpeedSection {
  heading: string;
  body: string;
}

interface Props {
  approachIntro?: ApproachIntro;
  speedSection?: SpeedSection;
  SECTION_INNER: string;
  fontHead: string;
  dark: string;
  text2: string;
  orange: string;
  bg: string;
  bg2: string;
  border: string;
}

// icons (FIXED array)
const approachIcons = ["🎯", "⚡", "🚀", "💡", "🎪", "🏆", "🔥", "💎", "🎨"];
const speedIcons = ["⏩", "⚡", "🚀", "🏃", "💨", "🎯", "⚙️", "📈"];

export default function GoalIntroSections({
  approachIntro,
  speedSection,
  SECTION_INNER,
  fontHead,
  dark,
  text2,
  orange,
  bg,
  bg2,
  border,
}: Props) {
  // ✅ stable icon (only once per mount)
  const randomApproachIcon = useMemo(
    () => approachIcons[Math.floor(Math.random() * approachIcons.length)],
    []
  );

  const randomSpeedIcon = useMemo(
    () => speedIcons[Math.floor(Math.random() * speedIcons.length)],
    []
  );

  return (
    <div style={{ background: bg, padding: "48px 0" }}>
      <div className={SECTION_INNER}>
        {/* HEADER */}
        <div className="mx-auto max-w-3xl text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="h-[2px] w-8 rounded-full bg-primary" />
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-orange-800">
              Approach
            </p>
            <span className="h-[2px] w-8 rounded-full bg-primary" />
          </div>

          <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-2xl lg:text-3xl">
            {approachIntro?.title ?? "The ClickMasters Approach"}
          </h2>
        </div>

        {/* GRID */}
        <div
          className="grid gap-8"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "32px",
          }}
        >
          {/* APPROACH */}
          {approachIntro && (
            <TiltCard
              tiltLimit={8}
              scale={1.02}
              perspective={1000}
              effect="gravitate"
              spotlight={true}
              className="w-full rounded-3xl border bg-card/80 p-8 shadow-2xl backdrop-blur-sm h-full"
              style={{
                background: `linear-gradient(135deg, ${bg} 0%, ${bg2} 100%)`,
                borderColor: border,
              }}
            >
              <div className="relative z-20">
                <div style={{ fontSize: 48, marginBottom: 20 }}>
                  {randomApproachIcon}
                </div>

                <h3
                  style={{
                    fontFamily: fontHead,
                    fontSize: "clamp(20px, 2.5vw, 28px)",
                    fontWeight: 700,
                    color: dark,
                    margin: "0 0 20px",
                    lineHeight: 1.25,
                  }}
                >
                  {approachIntro.eyebrow ?? "The ClickMasters Approach"}
                </h3>

                {approachIntro.paragraphs.map((paragraph, idx) => (
                  <p
                    key={idx}
                    style={{
                      fontSize: 15,
                      color: text2,
                      margin: "0 0 14px",
                      lineHeight: 1.65,
                    }}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </TiltCard>
          )}

          {/* SPEED */}
          {speedSection && (
            <TiltCard
              tiltLimit={8}
              scale={1.02}
              perspective={1000}
              effect="gravitate"
              spotlight={true}
              className="w-full rounded-3xl border bg-card/80 p-8 shadow-2xl backdrop-blur-sm h-full"
              style={{
                background: `linear-gradient(135deg, ${bg2} 0%, ${bg} 100%)`,
                borderColor: border,
              }}
            >
              <div className="relative z-20">
                <div style={{ fontSize: 48, marginBottom: 20 }}>
                  {randomSpeedIcon}
                </div>

                <h2
                  style={{
                    fontFamily: fontHead,
                 fontSize: "clamp(16px, 1.8vw, 22px)",
                    fontWeight: 700,
                    color: dark,
                    margin: "0 0 20px",
                    lineHeight: 1.25,
                  }}
                >
                  {speedSection.heading}
                </h2>

                <p
                  style={{
                    fontSize: 15,
                    color: text2,
                    margin: 0,
                    lineHeight: 1.65,
                  }}
                >
                  {speedSection.body}
                </p>
              </div>
            </TiltCard>
          )}
        </div>
      </div>

      {/* responsive */}
      <style>{`
        @media (min-width: 768px) {
          .grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
}