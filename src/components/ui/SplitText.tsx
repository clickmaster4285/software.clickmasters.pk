"use client";

import { useRef, useEffect, createElement } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

type SplitTypeOption = "chars" | "words" | "lines";

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: SplitTypeOption;
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  threshold?: number;
  as?: "p" | "h2" | "h3" | "span";
}

export default function SplitText({
  text,
  className = "",
  delay = 50,
  duration = 0.8,
  ease = "power3.out",
  splitType = "chars",
  from = { opacity: 0, x: 40 },
  to = { opacity: 1, x: 0 },
  threshold = 0.2,
  as = "p",
}: SplitTextProps) {
  const ref = useRef<HTMLElement>(null);
  const splitRef = useRef<SplitType | null>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    // Clean up previous instances
    if (splitRef.current) splitRef.current.revert();
    if (animationRef.current) animationRef.current.kill();

    const split = new SplitType(ref.current, {
      types: splitType,
    });
    splitRef.current = split;

    const targets =
      splitType === "words"
        ? split.words
        : splitType === "lines"
        ? split.lines
        : split.chars ?? [];

    const startPercent = (1 - threshold) * 100;

    // Create animation that replays every time it enters the viewport
    animationRef.current = gsap.fromTo(
      targets,
      from,
      {
        ...to,
        duration,
        ease,
        stagger: delay / 1000,
        scrollTrigger: {
          trigger: ref.current,
          start: `top ${startPercent}%`,
          toggleActions: "restart none none reverse", // ← This allows replay
          // once: false,  // explicitly not once
        },
      }
    );

    return () => {
      if (animationRef.current) animationRef.current.kill();
      if (splitRef.current) splitRef.current.revert();
    };
  }, [text, delay, duration, ease, splitType, threshold, from, to]);

  return createElement(
    as,
    { ref, className },
    text
  );
}