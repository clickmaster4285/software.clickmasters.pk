"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { resolveImageUrl } from "@/lib/utils";
import SplitText from "../../ui/SplitText";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface BlogPost {
  _id: string;
  slug?: string;
  published: boolean;
  title: string;
  excerpt: string;
  thumbnail?: string;
  category?: string;
  tags?: string[];
  createdAt?: string;
}

interface CaseStudy {
  _id: string;
  slug?: string;
  published?: boolean;
  title: string;
  excerpt: string;
  client?: string;
  thumbnail?: string;
  industry?: string;
  technologies?: string[];
  createdAt?: string;
}

interface InsightCard {
  id: string;
  type: "Case Study" | "Blog";
  title: string;
  thumbnail: string;
  href: string;
  index: number;
}

// ─── Unsplash image generator ─────────────────────────────────────────────────

const getUnsplashImage = (type: string, title: string, index: number): string => {
  const categories = {
    tech: ["technology", "computer", "coding", "software", "ai"],
    business: ["business", "office", "startup", "corporate"],
    design: ["design", "creative", "ui", "ux"],
    fintech: ["finance", "banking", "money"],
    ecommerce: ["shopping", "ecommerce", "retail"],
  };

  let selectedCategory = categories.tech;
  const lowerTitle = title.toLowerCase();

  if (lowerTitle.includes("fin") || lowerTitle.includes("bank")) selectedCategory = categories.fintech;
  else if (lowerTitle.includes("shop") || lowerTitle.includes("retail")) selectedCategory = categories.ecommerce;
  else if (lowerTitle.includes("design") || lowerTitle.includes("ui")) selectedCategory = categories.design;
  else if (lowerTitle.includes("business") || lowerTitle.includes("startup")) selectedCategory = categories.business;

  const keyword = selectedCategory[index % selectedCategory.length];
  const width = 800;
  const height = type === "Case Study" && index === 0 ? 1000 : 600;

  return `https://source.unsplash.com/featured/${width}x${height}/?${keyword}&sig=${index}`;
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

function thumb(raw: string | undefined, type: string, title: string, index: number): string {
  if (raw?.trim()) return resolveImageUrl(raw);
  return getUnsplashImage(type, title, index);
}

function blogHref(post: BlogPost): string {
  const slug = post.slug?.trim() || post._id;
  return `/blog/${encodeURIComponent(slug)}`;
}

function caseStudyHref(cs: CaseStudy): string {
  const slug = cs.slug?.trim() || cs._id;
  return `/case-studies/${encodeURIComponent(slug)}`;
}

// ─── Card Component ───────────────────────────────────────────────────────────

interface InsightCardItemProps {
  card: InsightCard;
  tall?: boolean;
}

const InsightCardItem = ({ card, tall = false }: InsightCardItemProps) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const [visible, setVisible] = useState(false);
  const [imgSrc, setImgSrc] = useState<string>("");
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => setImgSrc(card.thumbnail), [card.thumbnail]);

  useEffect(() => {
    const el = ref.current;
    if (!el || hasAnimated) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          const delay = (card.index % 3) * 100 + Math.floor(card.index / 3) * 50;
          setTimeout(() => {
            setVisible(true);
            setHasAnimated(true);
          }, delay);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [card.index, hasAnimated]);

  return (
    <Link
      ref={ref}
      href={card.href}
      className={`relative rounded-2xl overflow-hidden cursor-pointer group block transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
    >
      <div className={`w-full overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 ${tall ? "aspect-[4/5]" : "aspect-[16/10]"}`}>
        {imgSrc && (
          <img
            src={imgSrc}
            alt={card.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-3">
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent" />
        <div className="absolute inset-0 backdrop-blur-[3px]" />
        
        <div className="relative z-10">
          <p className="text-[11px] font-medium mb-1 text-primary/90">
            {card.type}
          </p>
          <p className="text-white text-[13px] font-medium leading-snug line-clamp-2">
            {card.title}
          </p>
        </div>
      </div>

      <div className="absolute inset-0 rounded-2xl transition-shadow duration-300 group-hover:shadow-[0_20px_48px_rgba(0,0,0,0.35)] pointer-events-none" />
    </Link>
  );
};

// ─── Skeleton ──────────────────────────────────────────────────────────────────

const SkeletonCard = ({ tall = false }: { tall?: boolean }) => (
  <div className={`rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse ${tall ? "aspect-[4/5]" : "aspect-[16/10]"}`} />
);

// ─── Header ────────────────────────────────────────────────────────────────────

const InsightsHeader = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setHeaderVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.1 });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={headerRef}
      className={`flex flex-col gap-5 lg:sticky lg:top-24 transition-all duration-700 ease-out ${
        headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <h2 className="mt-5 font-display text-3xl font-bold tracking-tight sm:text-2xl lg:text-5xl leading-tight">
        <SplitText
          as="span"
          text="Software Solutions"
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
            text="That Drives Growth"
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

      <p className="text-xl leading-8 text-gray-900  text-justify">
        From concept to completion, we craft enterprise-grade digital solutions that help modern businesses grow, scale, and stay ahead in a competitive market. Our team combines strategic thinking, cutting-edge technologies, and user-focused design to deliver impactful results across web development, mobile applications, AI-powered platforms, and custom software systems. Through our success stories, detailed case studies, and insightful blogs, we showcase how innovative execution transforms ideas into measurable business outcomes.
      </p>

      <Link
        href="/blog"
        className="w-fit px-6 py-2.5 rounded-full text-white text-sm font-medium bg-primary hover:bg-primary/90 transition-all duration-200"
      >
        Explore More
      </Link>
    </div>
  );
};

// ─── Cards Section ─────────────────────────────────────────────────────────────

interface InsightsCardsProps {
  cards: InsightCard[];
  isLoading: boolean;
}

const InsightsCards = ({ cards, isLoading }: InsightsCardsProps) => {
  const col1Cards = cards.slice(0, 2);
  const col2Cards = cards.slice(2, 5);
  const col3Cards = cards.slice(5, 8);

  return (
    <>
      <div className="flex flex-col gap-4 w-[260px] xl:w-[280px] justify-center">
        {isLoading ? (
          <><SkeletonCard /><SkeletonCard /></>
        ) : (
          col1Cards.map((card) => <InsightCardItem key={card.id} card={card} tall={false} />)
        )}
      </div>

      <div className="flex flex-col gap-4 w-[260px] xl:w-[280px]">
        {isLoading ? (
          <><SkeletonCard /><SkeletonCard /><SkeletonCard /></>
        ) : (
          col2Cards.map((card) => <InsightCardItem key={card.id} card={card} />)
        )}
      </div>

      <div className="flex flex-col gap-4 w-[260px] xl:w-[280px]">
        {isLoading ? (
          <><SkeletonCard /><SkeletonCard /><SkeletonCard /></>
        ) : (
          col3Cards.map((card) => <InsightCardItem key={card.id} card={card} />)
        )}
      </div>
    </>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────

export default function FeaturedInsights() {
  const { data: blogs = [], isLoading: blogsLoading } = useQuery<BlogPost[]>({
    queryKey: ["featured-insights-blogs"],
    queryFn: async () => {
      const res = await apiFetch("/api/blog");
      if (!res.ok) throw new Error("Failed to fetch blogs");
      return res.json();
    },
  });

  const { data: caseStudies = [], isLoading: csLoading } = useQuery<CaseStudy[]>({
    queryKey: ["featured-insights-case-studies"],
    queryFn: async () => {
      const res = await apiFetch("/api/case-studies");
      if (!res.ok) throw new Error("Failed to fetch case studies");
      return res.json();
    },
  });

  const isLoading = blogsLoading || csLoading;

  const publishedCS = caseStudies.filter((c) => c.published !== false).slice(0, 4);
  const publishedBlogs = blogs.filter((b) => b.published !== false).slice(0, 4);

  const slotOrder: Array<"cs" | "blog"> = ["cs", "blog", "cs", "blog", "cs", "blog", "cs", "blog"];

  const cards: InsightCard[] = [];
  let csIdx = 0, blogIdx = 0;

  for (const slot of slotOrder) {
    if (slot === "cs" && csIdx < publishedCS.length) {
      const cs = publishedCS[csIdx++];
      cards.push({
        id: cs._id,
        type: "Case Study",
        title: cs.title,
        thumbnail: thumb(cs.thumbnail, "Case Study", cs.title, cards.length),
        href: caseStudyHref(cs),
        index: cards.length,
      });
    } else if (slot === "blog" && blogIdx < publishedBlogs.length) {
      const blog = publishedBlogs[blogIdx++];
      cards.push({
        id: blog._id,
        type: "Blog",
        title: blog.title,
        thumbnail: thumb(blog.thumbnail, "Blog", blog.title, cards.length),
        href: blogHref(blog),
        index: cards.length,
      });
    }
  }

return (
  <section className="relative w-full bg-[#f5fbfb] py-12">
    {/* Background Blobs */}
    <div
    className="absolute inset-0 opacity-[0.45]"
    style={{
      backgroundImage: `
        linear-gradient(to right, rgba(15,23,42,0.06) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(15,23,42,0.06) 1px, transparent 1px)
      `,
      backgroundSize: "48px 48px",
    }}
  />

    {/* Centered Container */}
    <div className="mx-auto my-12 w-full max-w-[1700px] px-4 sm:px-6 lg:px-10">

      {/* Top Label */}
      <div className="mb-8 flex justify-center">
        <div className="flex max-w-full flex-wrap items-center justify-center gap-2">
          

          <div className="flex max-w-full flex-wrap items-center justify-center gap-1.5">

              <span className="hidden h-[2px] w-8 rounded-full bg-primary sm:block" />
            <SplitText
              as="h2"
              text="Sucess Stories"
              className="text-center text-xl font-bold uppercase tracking-[0.14em] text-primary sm:text-2xl sm:tracking-[0.25em] md:text-3xl"
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
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        <div className="mb-10">
          <InsightsHeader />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} tall={i === 0} />
            ))
          ) : (
            cards.map((card) => (
              <InsightCardItem
                key={card.id}
                card={card}
                tall={card.index === 0}
              />
            ))
          )}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex items-start justify-center gap-10 xl:gap-14">

        {/* Sticky Header */}
        <div className="sticky top-24 flex-shrink-0 w-[320px] xl:w-[520px]">
          <InsightsHeader />
        </div>

        {/* Cards */}
        <div className="flex gap-6 xl:gap-8 justify-center">
          <InsightsCards cards={cards} isLoading={isLoading} />
        </div>

      </div>
    </div>
  </section>
);
}
