"use client";

import { useState } from "react";
import { Tabs } from "@ark-ui/react/tabs";
import {
  Layout, Smartphone, Cloud, Shield, BarChart3, Code, Database, Globe,
  Cpu, Layers, Zap, Rocket, Paintbrush, Settings, Briefcase, Server,
  Lock, Workflow, ArrowUpRight, ChevronDown, ChevronUp,
} from "lucide-react";
import Image from "next/image";
import SplitText from "../../ui/SplitText";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const heroImages = [
  "/location/ai.png",
  "/location/cat-mobile.png",
  "/location/cat-web.png",
  "/location/backend.png",
  "/location/db.png",
 "/location/crypto.png",
  "/location/testing.png",
 "/location/cat-security.png",
  "/location/buisness.png",


  
  "/location/specialized.png",
      "/location/pc.png",

  "/location/cat-cloud.png",

"/location/msg.png",
  "/location/design.png",
  "/location/other.png",

 
 
];

type ServiceCategory = { category: string; services: string[] };
type ServiceSlugMap = Record<string, string>;

interface Props {
  countryName: string;
  location?: string;
  servicesByCategory: ServiceCategory[];
  serviceSlugMap: ServiceSlugMap;
}

const iconPool = [
  Layout, Smartphone, Cloud, Shield, BarChart3, Code, Database, Globe,
  Cpu, Layers, Zap, Rocket, Paintbrush, Settings, Briefcase, Server, Lock, Workflow,
];

const statPool = [
  { value: "1,860+", label: "Projects Delivered" },
  { value: "3,500+", label: "Happy Clients" },
  { value: "75+", label: "Industry Awards" },
  { value: "5+", label: "Years Experience" },
  { value: "API", label: "Expertise" },
  { value: "24/7", label: "Reliability" },
  { value: "99.9%", label: "Uptime" },
  { value: "150+", label: "Engineers" },
];

interface ServiceCardProps {
  service: string;
  slug: string;
  idx: number;
  countryName: string;
  location?: string;
}

// Define themes matching your bento style
const THEMES = [
  {
    bg: "from-sky-50 via-white to-indigo-50",
    glow: "bg-sky-300/40",
    badgeBg: "bg-white/80 ring-1 ring-sky-200",
    badgeText: "text-sky-600",
    icon: "text-sky-600",
    iconBg: "from-sky-200 to-indigo-200",
    ring: "ring-sky-200/60",
  },
  {
    bg: "from-rose-50 via-white to-pink-50",
    glow: "bg-pink-300/40",
    badgeBg: "bg-white/80 ring-1 ring-pink-200",
    badgeText: "text-pink-600",
    icon: "text-pink-600",
    iconBg: "from-pink-200 to-rose-200",
    ring: "ring-pink-200/60",
  },
  {
    bg: "from-emerald-50 via-white to-teal-50",
    glow: "bg-emerald-300/40",
    badgeBg: "bg-white/80 ring-1 ring-emerald-200",
    badgeText: "text-emerald-600",
    icon: "text-emerald-600",
    iconBg: "from-emerald-200 to-teal-200",
    ring: "ring-emerald-200/60",
  },
  {
    bg: "from-violet-50 via-white to-purple-50",
    glow: "bg-violet-300/40",
    badgeBg: "bg-white/80 ring-1 ring-violet-200",
    badgeText: "text-violet-600",
    icon: "text-violet-600",
    iconBg: "from-violet-200 to-purple-200",
    ring: "ring-violet-200/60",
  },
];

export function ServiceCard({ service, slug, idx, countryName, location }: ServiceCardProps) {
  const theme = THEMES[idx % THEMES.length];
  const CardIcon = iconPool[(idx + 3) % iconPool.length];
  const stat = statPool[idx % statPool.length];

  const href = location
    ? `/locations/${location}/${slug}`
    : `/${slug}`;

  return (
    <motion.a
      href={href}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: idx * 0.05 }}
      whileHover={{ y: -4 }}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl bg-gradient-to-br p-6 transition-all duration-500 hover:shadow-xl h-full ",
        theme.bg,
        theme.ring,
      )}
      style={{ animationDelay: `${idx * 70}ms` }}
    >
      {/* Glow blob */}
      <div
        className={cn(
          "pointer-events-none absolute -top-10 right-1/2 h-56 w-56 translate-x-1/2 rounded-full blur-3xl transition-transform duration-500 group-hover:scale-110",
          theme.glow,
        )}
      />

      {/* Top row: icon + stat */}
      <div className="relative mb-6 flex items-start justify-between">
        <div
          className={cn(
            "relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-inner",
            theme.iconBg,
          )}
        >
          <div className="absolute inset-1 rounded-lg bg-white/40 backdrop-blur-sm" />
          <CardIcon className={cn("relative h-5 w-5", theme.icon)} strokeWidth={1.6} />
        </div>
        <div className="text-right">
          <div
            className="text-2xl font-bold leading-none bg-clip-text text-transparent"
            style={{ backgroundImage: "var(--gradient-primary)" }}
          >
            {stat.value}
          </div>
          <div className="mt-1 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
            {stat.label}
          </div>
        </div>
      </div>

      {/* Title */}
      <h3 className="relative text-xl font-semibold text-slate-900 transition-colors duration-300 group-hover:text-primary">
        {service}
      </h3>

      {/* Description */}
      <p className="relative mt-2 flex-1 text-lg  text-slate-900">
        Professional {service.toLowerCase()} solutions designed to scale your business
        efficiently in {countryName}.
      </p>

      {/* Learn More link */}
      <div className="relative mt-5 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
        <span className="relative">
          Learn More
          <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100" />
        </span>
        <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
    </motion.a>
  );
}

export default function CountryServicesSection({
  countryName,
  location,
  servicesByCategory,
  serviceSlugMap,
}: Props) {
  const tabs = servicesByCategory.map((category, index) => ({
    value: `tab-${index}`,
    label: category.category,
    Icon: iconPool[index % iconPool.length],
    services: category.services,
    layoutImage: heroImages[index % heroImages.length],
  }));

  const [activeTab, setActiveTab] = useState(tabs[0]?.value ?? "tab-0");
  const [animKey, setAnimKey] = useState(0);
  const [showAllCards, setShowAllCards] = useState<Record<string, boolean>>({});

  const toggleShowAll = (tabValue: string) => {
    setShowAllCards(prev => ({ ...prev, [tabValue]: !prev[tabValue] }));
  };

  return (
    <section className="relative overflow-hidden bg-background py-24 sm:py-32">
      {/* Ambient glow background */}
      <div className="pointer-events-none absolute inset-0 -z-0">
        <div
          className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full opacity-60 blur-3xl"
          style={{ background: "var(--gradient-glow)" }}
        />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(var(--color-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <style jsx>{`
        @keyframes csTabIn { from { opacity:0; transform: translateY(18px) } to { opacity:1; transform: translateY(0) } }
        @keyframes csCardIn { from { opacity:0; transform: translateY(24px) scale(.96) } to { opacity:1; transform: none } }
        @keyframes csShimmer { 0% { background-position: -200% 0 } 100% { background-position: 200% 0 } }
        @keyframes csFloat { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-6px) } }
        @keyframes csPulse { 0%,100% { opacity:.6 } 50% { opacity:1 } }
        @keyframes csLayoutIn { from { opacity:0; transform: translateY(20px) scale(.94) } to { opacity:1; transform: none } }
        @keyframes csLayoutFloat { 0%,100% { transform: translateY(0) rotate(0) } 50% { transform: translateY(-14px) rotate(-1deg) } }

        .cs-tab-panel { animation: csTabIn .45s cubic-bezier(.22,1,.36,1) both; }
        .cs-card { animation: csCardIn .55s cubic-bezier(.22,1,.36,1) both; }
        .cs-layout { animation: csLayoutIn .7s cubic-bezier(.22,1,.36,1) both; }
        .cs-layout-img { animation: csLayoutFloat 6s ease-in-out infinite; }

        .cs-trigger {
          position: relative;
          isolation: isolate;
        }
        .cs-trigger::before {
          content: "";
          position: absolute; inset: 0;
          border-radius: 9999px;
          background: var(--gradient-primary);
          opacity: 0;
          transition: opacity .3s ease;
          z-index: -1;
        }
        .cs-trigger[data-selected]::before { opacity: 1; }
        .cs-trigger[data-selected] .cs-trigger-icon { animation: csFloat 2.4s ease-in-out infinite; }

        .cs-shimmer {
          background: linear-gradient(90deg, transparent, oklch(1 0 0 / .08), transparent);
          background-size: 200% 100%;
          animation: csShimmer 3s linear infinite;
        }

        .cs-card-glow::before {
          content: "";
          position: absolute; inset: -1px;
          border-radius: inherit;
          padding: 1px;
          background: linear-gradient(135deg, var(--color-primary), transparent 40%, var(--color-primary-glow) 100%);
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
                  mask-composite: exclude;
          opacity: 0;
          transition: opacity .4s ease;
          pointer-events: none;
        }
        .cs-card:hover .cs-card-glow::before { opacity: 1; }

        .cs-dot { animation: csPulse 2s ease-in-out infinite; }
      `}</style>

      <div className="relative z-10 mx-auto max-w-[1600px] px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="h-[2px] w-8 rounded-full bg-primary" />
            <div className="inline-flex items-center gap-1.5">
              <SplitText
                as="h2"
                text={`Services We Provide in ${countryName}`}
                className="text-2xl md:text-3xl font-bold uppercase tracking-[0.25em] text-primary"
                delay={60}
                duration={0.8}
                ease="power3.out"
                splitType="words"
                from={{ opacity: 0, x: 60 }}
                to={{ opacity: 1, x: 0 }}
                threshold={0.2}
              /> 
            </div>
            <span className="h-[2px] w-8 rounded-full bg-primary" />
          </div>
        </div>

        {/* Tabs */}
        <Tabs.Root
          value={activeTab}
          onValueChange={(d) => {
            setActiveTab(d.value);
            setAnimKey((k) => k + 1);
          }}
          className="mt-16"
        >
         
      

{/* Tab triggers */}
<div className="relative mx-auto w-full max-w-7xl px-4">
  <div className="absolute inset-0 -z-10 rounded-[32px] bg-card/40 backdrop-blur-xl" />

  <Tabs.List
    className="
      flex flex-wrap justify-center gap-2
      rounded-[32px]
      border border-border/60
      bg-card/60
      p-2 sm:p-3 md:p-4
      shadow-[var(--shadow-card)]

      max-h-[240px] overflow-y-auto
      md:max-h-none md:overflow-visible
    "
  >
    {tabs.map((tab) => {
      const Icon = tab.Icon;

      return (
        <Tabs.Trigger
          key={tab.value}
          value={tab.value}
          className="
            cs-trigger group inline-flex items-center gap-2 rounded-full
            px-3 py-2 text-sm
            sm:px-4 sm:py-2.5 sm:text-base
            font-medium
            text-muted-foreground
            transition-all duration-300
            hover:text-foreground
            data-[selected]:bg-primary/10
            data-[selected]:text-primary
          "
        >
          <Icon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
          <span className="whitespace-nowrap">
            {tab.label}
          </span>
        </Tabs.Trigger>
      );
    })}
  </Tabs.List>
</div>

          {/* Tab panels */}
          {tabs.map((tab) => {
            const validServices = tab.services.filter((s) => serviceSlugMap[s]);
            const showAll = showAllCards[tab.value] || false;
            const displayedServices = showAll ? validServices : validServices.slice(0, 4);
            
            // Split services for layout
            const firstFourServices = displayedServices.slice(0, 4);
            const remainingServices = displayedServices.slice(4);

            return (
              <Tabs.Content key={tab.value} value={tab.value} className="mt-14 focus:outline-none">
                <div key={animKey} className="cs-tab-panel">
                  {/* First 4 cards with image beside them */}
                  <div className="grid gap-10 lg:grid-cols-[1fr_minmax(0,550px)] lg:items-start">
                    {/* First 4 cards — 2 columns grid */}
                    <div className="grid gap-5 sm:grid-cols-2">
                      {firstFourServices.map((service, idx) => (
                        <ServiceCard
                          key={service}
                          service={service}
                          slug={serviceSlugMap[service]}
                          idx={idx}
                          countryName={countryName}
                          location={location}
                        />
                      ))}
                    </div>

                    {/* Layout image column */}
                    <div className="cs-layout relative hidden lg:block lg:sticky lg:top-24">
                      <div className="relative aspect-square w-full">
                        <div
                          className="absolute inset-0 rounded-full blur-3xl opacity-70"
                          style={{ background: "var(--gradient-glow)" }}
                        />
                        <Image
                          src={tab.layoutImage}
                          alt={`${tab.label} illustration`}
                          width={700}
                          height={700}
                          priority={false}
                          className="cs-layout-img relative h-full w-full object-contain drop-shadow-[0_30px_60px_oklch(0.70_0.18_40_/_0.35)]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Remaining cards (same size as first 4) */}
                  {remainingServices.length > 0 && (
                    <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                      {remainingServices.map((service, idx) => (
                        <ServiceCard
                          key={service}
                          service={service}
                          slug={serviceSlugMap[service]}
                          idx={idx + 4}
                          countryName={countryName}
                          location={location}
                        />
                      ))}
                    </div>
                  )}

                  {/* See More / See Less Button */}
                  {validServices.length > 4 && (
                    <div className="mt-10 flex justify-center">
                      <motion.button
                        onClick={() => toggleShowAll(tab.value)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 px-6 py-3 text-sm font-semibold text-primary backdrop-blur-sm transition-all duration-300 hover:from-primary/20 hover:to-primary/10 hover:shadow-lg"
                      >
                        {showAll ? (
                          <>
                            <span>Show Less</span>
                            <ChevronUp className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
                          </>
                        ) : (
                          <>
                            <span>See More Services</span>
                            <ChevronDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
                          </>
                        )}
                      </motion.button>
                    </div>
                  )}
                </div>
              </Tabs.Content>
            );
          })}
        </Tabs.Root>
      </div>
    </section>
  );
}