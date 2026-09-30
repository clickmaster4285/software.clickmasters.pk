"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from 'next/link';
import { getServicePath } from '@/lib/service-pages';
import type { ServiceData } from '@/src/lib/services';
import {
  Code2, Smartphone, Cloud, Brain, ArrowRight, Glasses,
  CpuIcon, Globe, ShieldCheck, Workflow, BarChart3, Eye,
  Bot, LucideIcon, DatabaseZap, Headphones, TestTube,
  Link2, Palette, Database, ChevronDown, ChevronUp, Target,
  Building, Rocket, Monitor, Plug, Puzzle, Server, Layers3,
  Globe2, Zap, ShoppingCart, Package, Store, ShoppingBag,
  Sparkles, Search, Edit3, LayoutDashboard, Users, BotMessageSquare,
  Cpu, FileText, UserCheck, MessageCircle, Microscope, BarChartIcon,
  HardDrive, DatabaseIcon, FileSpreadsheet, FileTextIcon, Cog, Webhook,
  Box, CreditCard, Coins, Factory, Gamepad2, Wrench, WrenchIcon,
  Bug, Users2, Headset, Settings,
} from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const serviceIcons: Record<string, LucideIcon> = {
  "software-development": Code2,
  "web-development": Globe,
  "mobile-development": Smartphone,
  "design-ui-ux": Palette,
  "artificial-intelligence-ai": Brain,
  "machine-learning-ml": CpuIcon,
  "nlp-computer-vision": Eye,
  "data-services": Database,
  "data-and-intelligence": BarChart3,
  "automation-and-chatbot": Bot,
  "automation-and-integration": Workflow,
  "cloud-and-devops": Cloud,
  "database-services": DatabaseZap,
  "cybersecurity": ShieldCheck,
  "testing-and-qa": TestTube,
  "support-and-outsourcing": Headphones,
  "blockchain-and-web3": Link2,
  "iot-and-emerging-tech": CpuIcon,
  "immersive-tech": Glasses,
};

const services = [
  {
    id: "software-development",
    icon: serviceIcons["software-development"],
    title: "Software Development",
    desc: "Custom enterprise software solutions built with modern architectures and best practices.",
    gradient: "linear-gradient(135deg, #fda4af 0%, #fbcfe8 50%, #f9a8d4 100%)",
    accent: "#fef3c7",
    slug: "software-development",
  },
  {
    id: "web-development",
    icon: serviceIcons["web-development"],
    title: "Web Application Development",
    desc: "Scalable web apps built with modern stacks—React, Next.js, Node, and edge-first architectures.",
    gradient: "linear-gradient(135deg, #a7f3d0 0%, #a5f3fc 50%, #bae6fd 100%)",
    accent: "#d1fae5",
    slug: "web-development",
  },
  {
    id: "mobile-development",
    icon: serviceIcons["mobile-development"],
    title: "Mobile App Development",
    desc: "Native and cross-platform iOS & Android apps engineered for performance and delightful UX.",
    gradient: "linear-gradient(135deg, #ddd6fe 0%, #c7d2fe 50%, #bfdbfe 100%)",
    accent: "#ede9fe",
    slug: "mobile-development",
  },
  {
    id: "design-ui-ux",
    icon: serviceIcons["design-ui-ux"],
    title: "UI / UX Design",
    desc: "Research-led product design, design systems, and interfaces that users genuinely love.",
    gradient: "linear-gradient(135deg, #fed7aa 0%, #fecaca 50%, #ddd6fe 100%)",
    accent: "#fef3c7",
    slug: "design-ui-ux",
  },
  {
    id: "artificial-intelligence-ai",
    icon: serviceIcons["artificial-intelligence-ai"],
    title: "AI & Machine Learning",
    desc: "LLM integrations, computer vision, and intelligent automation that move the revenue needle.",
    gradient: "linear-gradient(135deg, #bbf7d0 0%, #99f6e4 50%, #bae6fd 100%)",
    accent: "#dcfce7",
    slug: "artificial-intelligence-ai",
  },
  {
    id: "machine-learning-ml",
    icon: serviceIcons["machine-learning-ml"],
    title: "Machine Learning",
    desc: "Custom ML models, predictive analytics, and intelligent systems for business transformation.",
    gradient: "linear-gradient(135deg, #fecaca 0%, #fed7aa 50%, #fef08a 100%)",
    accent: "#fef9c3",
    slug: "machine-learning-ml",
  },
  {
    id: "nlp-computer-vision",
    icon: serviceIcons["nlp-computer-vision"],
    title: "NLP & Computer Vision",
    desc: "Advanced text analysis, image recognition, and visual intelligence solutions.",
    gradient: "linear-gradient(135deg, #fbcfe8 0%, #f5d0fe 50%, #ddd6fe 100%)",
    accent: "#fce7f3",
    slug: "nlp-computer-vision",
  },
  {
    id: "data-services",
    icon: serviceIcons["data-services"],
    title: "Data Services",
    desc: "Comprehensive data solutions from collection to insights and visualization.",
    gradient: "linear-gradient(135deg, #bae6fd 0%, #a5f3fc 50%, #c7d2fe 100%)",
    accent: "#e0f2fe",
    slug: "data-services",
  },

  // Remaining Services — Reusing Same Soft Palette

  // {
  //   id: "data-and-intelligence",
  //   icon: serviceIcons["data-and-intelligence"],
  //   title: "Data & Intelligence",
  //   desc: "Business intelligence dashboards, analytics, and data-driven decision making.",
  //   gradient: "linear-gradient(135deg, #fda4af 0%, #fbcfe8 50%, #f9a8d4 100%)",
  //   accent: "#fef3c7",
  //   slug: "data-and-intelligence",
  // },
  {
    id: "automation-and-chatbot",
    icon: serviceIcons["automation-and-chatbot"],
    title: "Automation & Chatbots",
    desc: "Intelligent chatbots and workflow automation for enhanced customer engagement.",
    gradient: "linear-gradient(135deg, #a7f3d0 0%, #a5f3fc 50%, #bae6fd 100%)",
    accent: "#d1fae5",
    slug: "automation-and-chatbot",
  },
  {
    id: "automation-and-integration",
    icon: serviceIcons["automation-and-integration"],
    title: "Automation & Integration",
    desc: "Seamless system integrations and process automation across your tech stack.",
    gradient: "linear-gradient(135deg, #ddd6fe 0%, #c7d2fe 50%, #bfdbfe 100%)",
    accent: "#ede9fe",
    slug: "automation-and-integration",
  },
  {
    id: "cloud-and-devops",
    icon: serviceIcons["cloud-and-devops"],
    title: "Cloud & DevOps",
    desc: "AWS, GCP, Azure infrastructure with CI/CD pipelines, IaC, and 99.9% uptime SLAs.",
    gradient: "linear-gradient(135deg, #fed7aa 0%, #fecaca 50%, #ddd6fe 100%)",
    accent: "#fef3c7",
    slug: "cloud-and-devops",
  },
  {
    id: "database-services",
    icon: serviceIcons["database-services"],
    title: "Database Services",
    desc: "Database design, optimization, migration, and management for peak performance.",
    gradient: "linear-gradient(135deg, #bbf7d0 0%, #99f6e4 50%, #bae6fd 100%)",
    accent: "#dcfce7",
    slug: "database-services",
  },
  {
    id: "cybersecurity",
    icon: serviceIcons["cybersecurity"],
    title: "Cybersecurity",
    desc: "Pen-testing, hardening, and compliance—SOC2, ISO, GDPR—baked into your stack.",
    gradient: "linear-gradient(135deg, #fecaca 0%, #fed7aa 50%, #fef08a 100%)",
    accent: "#fef9c3",
    slug: "cybersecurity",
  },
  {
    id: "testing-and-qa",
    icon: serviceIcons["testing-and-qa"],
    title: "Testing & QA",
    desc: "Automated testing, quality assurance, and performance testing for reliable software.",
    gradient: "linear-gradient(135deg, #fbcfe8 0%, #f5d0fe 50%, #ddd6fe 100%)",
    accent: "#fce7f3",
    slug: "testing-and-qa",
  },
  {
    id: "support-and-outsourcing",
    icon: serviceIcons["support-and-outsourcing"],
    title: "Support & Outsourcing",
    desc: "24/7 technical support, maintenance, and managed IT services.",
    gradient: "linear-gradient(135deg, #bae6fd 0%, #a5f3fc 50%, #c7d2fe 100%)",
    accent: "#e0f2fe",
    slug: "support-and-outsourcing",
  },
  {
    id: "blockchain-and-web3",
    icon: serviceIcons["blockchain-and-web3"],
    title: "Blockchain & Web3",
    desc: "Smart contracts, dApps, and decentralized solutions for the new internet.",
    gradient: "linear-gradient(135deg, #99f6e4 0%, #bbf7d0 50%, #d9f99d 100%)",
    accent: "#ccfbf1",
    slug: "blockchain-and-web3",
  },
  {
    id: "iot-and-emerging-tech",
    icon: serviceIcons["iot-and-emerging-tech"],
    title: "IoT & Emerging Tech",
    desc: "Connected devices, sensor networks, and cutting-edge technology solutions.",
    gradient: "linear-gradient(135deg, #fda4af 0%, #fbcfe8 50%, #f9a8d4 100%)",
    accent: "#fef3c7",
    slug: "iot-and-emerging-tech",
  },
  {
    id: "immersive-tech",
    icon: serviceIcons["immersive-tech"],
    title: "Immersive Tech",
    desc: "AR/VR experiences, metaverse solutions, and spatial computing applications.",
    gradient: "linear-gradient(135deg, #a7f3d0 0%, #a5f3fc 50%, #bae6fd 100%)",
    accent: "#d1fae5",
    slug: "immersive-tech",
  },
];
// Sub-service icon mappings
const subServiceIcons: Record<string, LucideIcon> = {
  // Software Development
  'Custom Software Development': Target,
  'Enterprise Software Development': Building,
  'SaaS Product Development': Cloud,
  'MVP Development': Rocket,
  'Desktop Application Development': Monitor,
  'API Development & Integration': Plug,
  'Microservices Architecture': Puzzle,
  'Backend Development': Server,
  'Frontend Development': Code2,
  'Full Stack Development': Layers3,
  
  // Web Development
  'Web Application Development': Globe,
  'Website Development': Globe2,
  'Progressive Web App Development': Smartphone,
  'PWA Development': Smartphone,
  'Headless CMS Development': Database,
  'JAMstack Development': Zap,
  'E-commerce Development': ShoppingCart,
  'Headless E-commerce': Package,
  'Shopify Development': Store,
  'WooCommerce Development': ShoppingBag,
  
  // Mobile Development
  'Mobile App Development': Smartphone,
  'Android App Development': Bot,
  'iOS App Development': Target,
  'Cross-Platform App Development': Layers3,
  'Flutter App Development': Sparkles,
  'React Native Development': Code2,
  
  // Design UI/UX
  'UI/UX Design': Palette,
  'UI/UX Design Services': Palette,
  'Product Design': Package,
  'Web Design': Globe,
  'Mobile App Design': Smartphone,
  'UX Research': Search,
  'Wireframing & Prototyping': Edit3,
  'Design Systems': LayoutDashboard,
  
  // AI
  'Generative AI Solutions': Brain,
  'AI Experts': Users,
  'AI Developers': Code2,
  'AI Prompt Engineers': Edit3,
  'AI Chatbot Development': BotMessageSquare,
  'AI Agents Development': Bot,
  'AI Automation Systems': Workflow,
  'AI Integration Services': Plug,
  'AI Model Development': Cpu,
  'LLM Applications Development': FileText,
  
  // Machine Learning
  'Machine Learning Solutions': Brain,
  'Machine Learning Experts': Users,
  'Predictive Analytics': BarChart3,
  'Recommendation Systems': Target,
  'Model Training & Optimization': Settings,
  'Deep Learning Solutions': Cpu,
  'Deep Learning Experts': UserCheck,
  
  // NLP & Computer Vision
  'Natural Language Processing (NLP)': MessageCircle,
  'Speech Recognition Systems': Microscope,
  'Text Analytics': FileText,
  'Computer Vision Solutions': Eye,
  'Image Processing': Monitor,
  'Video Analytics': Monitor,
  
  // Data Services
  'Data Science & Analytics': BarChart3,
  'Business Intelligence (BI)': BarChartIcon,
  'Data Engineering': Database,
  'Data Warehousing': HardDrive,
  'Data Visualization': BarChart3,
  'Big Data Solutions': DatabaseIcon,
  
  // Data & Intelligence
  'Data Scraping Specialists': Search,
  'Web Scraping Specialists': Globe2,
  'Excel Experts': FileSpreadsheet,
  'Google Sheets Experts': FileTextIcon,
  'Power BI Developers': BarChartIcon,
  'Data Scientists': Brain,
  'Data Engineers': Database,
  'Tableau Developers': BarChart3,
  'SQL Database Developers': DatabaseIcon,
  
  // Automation & Chatbot
  'Chatbot Developers': BotMessageSquare,
  'Chatbot Marketing Experts': Target,
  'Chatbot UX Writers': Edit3,
  'Process Automation Experts': Workflow,
  'Python Automation Experts': Code2,
  'Software Automation Experts': Cog,
  'Web Automation Experts': Webhook,
  'Marketing Automation Experts': MessageCircle,
  
  // Automation & Integration
  'Business Process Automation': Workflow,
  'Workflow Automation': Cog,
  'Robotic Process Automation (RPA)': Bot,
  'System Integration': Link2,
  'API Integration': Plug,
  'Web Scraping & Data Extraction': Search,
  
  // Cloud & DevOps
  'Cloud Solutions': Cloud,
  'Cloud-Native Development': Rocket,
  'DevOps Services': Workflow,
  'DevSecOps': ShieldCheck,
  'CI/CD Pipeline Setup': Settings,
  'Serverless Architecture': Zap,
  'Containerization (Docker & Kubernetes)': Box,
  'Infrastructure as Code (IaC)': FileText,
  
  // Database Services
  'Database Design': Database,
  'Database Management': Settings,
  'Data Migration': ArrowRight,
  'Database Optimization': Zap,
  'SQL & NoSQL Solutions': DatabaseIcon,
  
  // Cybersecurity
  'Cybersecurity Services': ShieldCheck,
  'Security Audits': Search,
  'Penetration Testing': Target,
  'Vulnerability Assessment': Bug,
  'Compliance & Risk Management': FileText,
  'Application Security': ShieldCheck,
  
  // Testing & QA
  'QA & Software Testing': TestTube,
  'Automated Testing': Bot,
  'Manual Testing': Users2,
  'Performance Testing': Zap,
  'Load Testing': BarChart3,
  'Bug Fixing': WrenchIcon,
  
  // Support & Outsourcing
  'Maintenance & Support': Wrench,
  'Dedicated Development Teams': Users2,
  'IT Outsourcing': Globe,
  'Staff Augmentation': UserCheck,
  'Technical Support': Headset,
  
  // Blockchain & Web3
  'Blockchain Development': Link2,
  'Smart Contract Development': FileText,
  'Decentralized App (DApp) Development': Globe2,
  'Web3 Development': Brain,
  'Crypto Wallet Development': CreditCard,
  'NFT Marketplace Development': Package,
  'Token Development': Coins,
  
  // IoT & Emerging Tech
  'IoT Development': Cpu,
  'Smart Systems Development': Brain,
  'Industrial IoT': Factory,
  'Embedded Systems Development': Server,
  
  // Immersive Tech
  'AR Development': Smartphone,
  'VR Development': Headset,
  'Mixed Reality (MR) Solutions': Glasses,
  'Mixed Reality Solutions': Glasses,
  'DApp Development': Link2,
  '3D Application Development': Gamepad2,
};

const origins = ["right", "left", "center"] as const;

type ExploreItem = {
  id: string;
  icon: LucideIcon;
  title: string;
  desc: string;
  gradient: string;
  accent: string;
  href: string;
};

function buildExploreItems(serviceData?: ServiceData): ExploreItem[] {
  if (serviceData?.subServices?.length) {
    return serviceData.subServices.map((subService, index) => {
      const palette = services[index % services.length];
      return {
        id: `${serviceData.slug}-${index}`,
        icon: subServiceIcons[subService.title] || Code2,
        title: subService.title,
        desc: subService.description,
        gradient: palette.gradient,
        accent: palette.accent,
        href: getServicePath(serviceData.title, subService.title),
      };
    });
  }

  return services.map((service) => ({
    id: service.id,
    icon: service.icon,
    title: service.title,
    desc: service.desc,
    gradient: service.gradient,
    accent: service.accent,
    href: `/${service.slug}`,
  }));
}

function GridCard({ service, index, total }: { service: ExploreItem; index: number; total: number }) {
  const { icon: Icon, title, desc, gradient, accent, href } = service;

  return (
    <div
      className="group relative overflow-hidden rounded-2xl p-7 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col min-h-[260px]"
      style={{ background: gradient }}
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-60 blur-2xl"
        style={{ background: accent }}
      />
      <div className="pointer-events-none absolute -bottom-12 -left-10 h-32 w-32 rounded-full bg-white/50 opacity-40 blur-2xl" />

      <div className="relative flex flex-col h-full">
        {/* Icon */}
        <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/40 text-foreground ring-1 ring-white/60 backdrop-blur-md">
          <Icon className="h-5 w-5" />
        </div>

        {/* Number */}
        <div className="mt-4 text-[11px] font-semibold tracking-[0.3em] text-foreground/60">
          {String(8 + index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </div>

        {/* Title */}
        <h3 className="mt-2 font-serif text-[21px] leading-tight font-bold text-foreground">
          {title}
        </h3>

     <p className="text-[15px] leading-relaxed text-foreground/75">
  {desc}
</p>

<Link
  href={href}
  className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-all group-hover:gap-3 self-start"
>
  Learn more
  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
</Link>
      </div>
    </div>
  );
}


function MobileCard({ service }: { service: ExploreItem }) {
  const { icon: Icon, title, desc, gradient, accent, href } = service;

  return (
    <div
      className="group relative overflow-hidden rounded-3xl p-8 shadow-lg transition-all hover:shadow-xl flex flex-col min-h-[280px]"
      style={{ background: gradient }}
    >
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-60 blur-2xl" style={{ background: accent }} />
      
      <div className="relative flex flex-col h-full">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/30 text-foreground ring-1 ring-white/50 backdrop-blur-md">
          <Icon className="h-6 w-6" />
        </div>

        <h3 className="mt-6 font-serif text-2xl font-bold text-foreground leading-tight">
          {title}
        </h3>

        <p className="mt-3 text-[15px] leading-relaxed text-gray-900 flex-1">
          {desc}
        </p>

        <Link
          href={href}
          className="inline-flex items-center gap-2 text-sm font-semibold text-foreground mt-4 group-hover:gap-3 transition-all"
        >
          Learn more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}

export default function ExploreSection({ serviceData }: { serviceData?: ServiceData }) {
  const sectionRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);

  const exploreItems = useMemo(() => buildExploreItems(serviceData), [serviceData]);
  const animatedServices = exploreItems.slice(0, 8);
  const extraServices = exploreItems.slice(8);
  const isServicePage = Boolean(serviceData);

  // GSAP Animation - Desktop Only
  useEffect(() => {
    if (window.innerWidth < 768) return; // Skip animation on mobile

    const section = sectionRef.current;
    const inner = innerRef.current;
    if (!section || !inner) return;

    const cards = gsap.utils.toArray<HTMLElement>("[data-depth-card]", section);
    if (cards.length === 0) return;

    cards.forEach((card) => {
      gsap.set(card, {
        xPercent: -50,
        yPercent: -50,
        left: "50%",
        top: "50%",
        position: "absolute",
        opacity: 0,
        scale: 0.85,
      });
    });

    const stepPx = () => window.innerHeight;
    const totalSteps = cards.length;

    const offFor = (origin: string | undefined) => {
      if (origin === "right") return { x: window.innerWidth * 0.8, y: 0, rotate: 10 };
      if (origin === "left") return { x: -window.innerWidth * 0.8, y: 0, rotate: -10 };
      return { x: 0, y: window.innerHeight * 0.7, rotate: 0 };
    };

    const FINAL_SCALE = 0.6;
    const COL = 400;
    const ROW = 160;

    const finals = [
      { x: -1.5 * COL, y: -ROW }, { x: -0.5 * COL, y: -ROW },
      { x: 0.5 * COL, y: -ROW },  { x: 1.5 * COL, y: -ROW },
      { x: -1.5 * COL, y: ROW },  { x: -0.5 * COL, y: ROW },
      { x: 0.5 * COL, y: ROW },   { x: 1.5 * COL, y: ROW },
    ];

    const tl = gsap.timeline({
      defaults: { ease: "none" },
    scrollTrigger: {
  trigger: section,
  pin: inner,
  start: "top top",
  end: () => "+=" + totalSteps * stepPx() * 0.65,
  scrub: 0.8,
  invalidateOnRefresh: true,
  anticipatePin: 1,
  snap: { snapTo: 1 / totalSteps, duration: 0.4, ease: "power2.inOut" },
},
    });

    cards.forEach((card, i) => {
      const origin = card.dataset.origin;
      const from = offFor(origin);
      const final = finals[i] ?? { x: 0, y: 0 };

      tl.fromTo(card, 
        { x: from.x, y: from.y, rotate: from.rotate, opacity: 0, scale: 0.85 },
        { x: 0, y: 0, rotate: 0, opacity: 1, scale: 1, duration: 0.5, ease: "power3.out" },
        i
      );
      tl.to(card, 
        { x: final.x, y: final.y, scale: FINAL_SCALE, duration: 0.5, ease: "power2.inOut" },
        i + 0.5
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
      tl.kill();
    };
  }, [exploreItems.length]);

       return (
    <section
      ref={sectionRef}
      id="services"
      className="relative overflow-hidden bg-foreground text-background py-14"
    >
      <h2 className="sr-only">Our Software Development Services</h2>
      {/* Desktop: GSAP Animated Section (First 8) */}
      <div className="hidden md:block">
        <div ref={innerRef} className="relative h-screen">
          <div className="pointer-events-none absolute inset-0 [perspective:1600px] [transform-style:preserve-3d]">
            {animatedServices.map(({ icon: Icon, title, desc, gradient, accent, href }, i) => (
              <div
                key={`${title}-${i}`}
                data-depth-card
                data-origin={origins[i % origins.length]}
                className="pointer-events-auto absolute w-[520px] md:w-[560px] lg:w-[600px] min-h-[420px] overflow-hidden rounded-3xl p-10 shadow-2xl shadow-black/30"
                style={{ background: gradient }}
              >
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-60 blur-3xl" style={{ background: accent }} />
                <div className="absolute -bottom-16 -left-12 h-40 w-40 rounded-full bg-white/50 opacity-40 blur-3xl" />

                <div className="relative">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/40 text-foreground ring-1 ring-white/60 backdrop-blur-md">
                    <Icon className="h-7 w-7" />
                  </div>
                  <div className="mt-5 text-sm font-semibold tracking-[0.3em] text-foreground/60">
                    {String(i + 1).padStart(2, "0")} / {String(exploreItems.length).padStart(2, "0")}
                  </div>
                  <h3 className="mt-2 font-serif text-2xl lg:text-3xl font-bold leading-tight text-foreground">
                    {title}
                  </h3>
                  <p className="mt-3 text-2xl leading-relaxed text-gray-900">{desc}</p>
                  <Link
                    href={href}
                    className="mt-5 inline-flex items-center gap-2 text-xl font-semibold text-foreground hover:gap-3 transition-all"
                  >
                    Learn more <ArrowRight className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ==================== MOBILE ==================== */}
      <div className="md:hidden px-5">
        <div className="grid grid-cols-1 gap-6">
          {exploreItems.slice(0, 4).map((service) => (
            <MobileCard key={service.id} service={service} />
          ))}
        </div>

        {/* See More Button */}
        {!expanded && exploreItems.length > 4 && (
          <div className="flex justify-center mt-12">
            <button
              onClick={() => setExpanded(true)}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-8 py-3.5 text-sm font-semibold text-background backdrop-blur-md transition hover:bg-white/20 hover:scale-105"
            >
              See More Services <ChevronDown className="h-4 w-4" />
              <span className="ml-1 rounded-full bg-primary/30 px-2 py-0.5 text-xs">+{exploreItems.length - 4}</span>
            </button>
          </div>
        )}

        {/* All remaining cards together */}
        {expanded && (
          <>
            <div className="grid grid-cols-1 gap-6 mt-8">
              {exploreItems.slice(4).map((service) => (
                <MobileCard key={service.id} service={service} />
              ))}
            </div>

            {/* See Less at the END */}
            <div className="flex justify-center mt-12">
              <button
                onClick={() => setExpanded(false)}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-8 py-3.5 text-sm font-semibold text-background backdrop-blur-md transition hover:bg-white/20 hover:scale-105"
              >
                See Less <ChevronUp className="h-4 w-4" />
              </button>
            </div>
          </>
        )}
      </div>

      {/* ==================== DESKTOP EXTRA SERVICES - FIXED SPACING ==================== */}
      {extraServices.length > 0 && (
        <div className="hidden md:block relative z-10 bg-foreground px-6 pb-16">
          <div className="mx-auto max-w-[1600px]">
            
            {/* See More Button */}
            {!expanded && (
              <div className="flex justify-center mb-12">
                <button
                  onClick={() => setExpanded(true)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-8 py-3.5 text-sm font-semibold text-background backdrop-blur-md transition hover:bg-white/20 hover:scale-105"
                >
                  See More Services <ChevronDown className="h-4 w-4" />
                  <span className="ml-1 rounded-full bg-primary/30 px-2 py-0.5 text-xs">+{extraServices.length}</span>
                </button>
              </div>
            )}

            {/* Extra Cards + See Less at the bottom */}
            {expanded && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {extraServices.map((service, i) => (
                    <GridCard key={service.id} service={service} index={i} total={exploreItems.length} />
                  ))}
                </div>

                {/* See Less Button at the END */}
                <div className="flex justify-center mt-16">
                  <button
                    onClick={() => setExpanded(false)}
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-8 py-3.5 text-sm font-semibold text-background backdrop-blur-md transition hover:bg-white/20 hover:scale-105"
                  >
                    See Less <ChevronUp className="h-4 w-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}