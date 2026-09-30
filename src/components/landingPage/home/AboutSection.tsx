"use client";

import { Lightbulb, Rocket, ShieldCheck, Headphones, ArrowRight } from "lucide-react";
import { StackedCards, type GlassCardItem } from "@/components/ui/glass-cards";
import SplitText from "../../ui/SplitText";
import Link from "next/link";



const values: GlassCardItem[] = [
  {
    id: 1,
    icon: <Lightbulb className="h-6 w-6" />,
    title: "Agile Software Development",
    description:
      "Sprint-based delivery with full transparency. Our software developers ship faster, iterate smarter, and keep you in control at every milestone. We follow agile methodologies to ensure continuous improvement, faster feedback loops, and predictable delivery cycles for every project.",
    color: "rgba(156, 163, 175, 0.8)",
    cta: { label: "Learn more", href: "#" },
  },
  {
    id: 2,
    icon: <Rocket className="h-6 w-6" />,
    title: "Scalable & Future-Proof Architecture",
    description:
      "We engineer software solutions on proven stacks React, Node.js, and cloud-native infrastructure built to scale without costly rewrites. Our architecture is designed to handle growth, high traffic, and evolving business needs while maintaining performance and stability.",
    color: "rgba(156, 163, 175, 0.8)",
    cta: { label: "Learn more", href: "#" },
  },
  {
    id: 3,
    icon: <ShieldCheck className="h-6 w-6" />,
    title: "Enterprise Security & Compliance",
    description:
      "Every product from our software house follows OWASP standards, GDPR best practices, and rigorous QA so your business and users stay protected. We implement multi-layer security, encrypted data handling, and continuous vulnerability testing to ensure maximum protection.",
    color: "rgba(156, 163, 175, 0.8)",
    cta: { label: "Learn more", href: "#" },
  },
  {
    id: 4,
    icon: <Headphones className="h-6 w-6" />,
    title: "24/7 Dedicated Support",
    description:
      "Our software development company stays with you post-launch monitoring performance, deploying updates, and resolving issues around the clock. We ensure uninterrupted operations, proactive maintenance, and fast response support whenever you need assistance.",
    color: "rgba(156, 163, 175, 0.8)",
    cta: { label: "Learn more", href: "#" },
  },
];

export function AboutSection() {
  return (
    <section className="relative w-full bg-[#f5fbfb]">

      {/* Background blobs */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#a7f3d0] opacity-30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-[#fdba74] opacity-25 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 -left-32 h-[550px] w-[550px] -translate-y-1/2 rounded-full bg-[#93c5fd] opacity-25 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-180px] left-1/4 h-[480px] w-[480px] rounded-full bg-[#a7f3d0] opacity-20 blur-3xl" />

      {/* Sticky centered label - ABOVE the grid */}
      <div className=" z-10 flex justify-center pt-8 pb-4 ">
        <div className="flex max-w-full flex-wrap items-center justify-center gap-1.5 px-4">

           <span className="hidden h-[2px] w-8 rounded-full bg-primary sm:block" />
          <SplitText
            as="h2"
            text="About ClickMasters"
            className="text-center text-xl font-bold uppercase tracking-[0.12em] text-primary sm:text-2xl sm:tracking-[0.25em] md:text-3xl"
            delay={60}
            duration={0.8}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, x: 60 }}
            to={{ opacity: 1, x: 0 }}
            threshold={0.2}
          />
 <span className="hidden h-[2px] w-8 rounded-full bg-primary sm:block" />
        </div>
      </div>

      {/* ── MAIN GRID ── */}
      <div className="mx-auto lg:px-24 px-6 pb-12 max-w-[1750px]">



        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-start">

          {/* LEFT COPY (sticky) */}
          <div className="min-w-0 max-w-2xl space-y-5 pt-10 lg:sticky lg:top-24 lg:self-start lg:pt-24">
            {/* About label removed from here */}

            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-2xl lg:text-5xl leading-tight">
              <SplitText
                as="span"
                text="We Don't Just Build Software"
                className="inline-block"
                delay={50}
                duration={0.8}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 30 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.2}
              />

              {" "}

              <span className="relative inline-block text-primary">
                <SplitText
                  as="span"
                  text="We Build Revenue Systems"
                  className="inline-block text-primary"
                  delay={50}
                  duration={0.9}
                  ease="power3.out"
                  splitType="chars"
                  from={{ opacity: 0, y: 30 }}
                  to={{ opacity: 1, y: 0 }}
                  threshold={0.2}
                />
                <span className="absolute -bottom-2 left-0 h-[3px] w-full rounded-md bg-gradient-to-r from-primary/60 to-primary" />
              </span>
            </h2>

            <p className="text-xl leading-relaxed text-justify text-gray-900">
              ClickMasters is a{" "}
              <span className="font-semibold text-primary">
                professional software development company
              </span>{" "}
              with a proven track record delivering custom software solutions across
              manufacturing, healthcare, retail, real estate, and education sectors. Our team of experienced{" "}
              <span className="font-semibold">software developers</span> works as a
              seamless extension of your business translating complex requirements into
              reliable, scalable digital products that perform under real-world conditions.
            </p>

            <p className="text-xl leading-relaxed text-justify text-gray-900">
              As a full-service <span className="font-semibold">software house</span>,
              we handle everything from discovery and UI/UX design to backend
              development, QA testing, cloud deployment, and long-term maintenance end
              to end, under one roof. Explore our{" "}
              <a className="text-primary underline-offset-2 hover:underline" href="#">web application development</a>,{" "}
              <a className="text-primary underline-offset-2 hover:underline" href="#">mobile app development</a>, and{" "}
              <a className="text-primary underline-offset-2 hover:underline" href="#">custom software development</a>{" "}
              services, or browse the{" "}
              <a className="text-primary underline-offset-2 hover:underline" href="#">software solutions portfolio</a>{" "}
              by industry.
            </p>

          <div className="flex flex-wrap gap-3 pt-3">
  <Link
    href="/contact-us"
    className="group inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-primary to-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-[1.05] hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98]"
  >
    Start Your Project
    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
  </Link>

  <Link
    href="/software-solutions"
    className="group inline-flex items-center gap-2 rounded-xl border border-white/50 bg-white/30 backdrop-blur-md px-7 py-3 text-sm font-semibold text-foreground shadow-sm transition-all duration-300 hover:scale-[1.05] hover:bg-white/40 hover:border-white/70 hover:shadow-md active:scale-[0.98]"
  >
    View Our Work
    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
  </Link>
</div>
          </div>

          {/* RIGHT GLASS STACKED CARDS - stacking behavior unchanged */}
          <div className="pt-8">
            <StackedCards items={values} />
          </div>
        </div>
      </div>

    </section>
  );
}

export default AboutSection;
