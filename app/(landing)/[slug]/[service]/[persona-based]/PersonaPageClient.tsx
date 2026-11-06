'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { FAQSection } from '@/src/components/landingPage/servicesPage/FAQSection';
import ChecklistCTAHero from '@/src/components/landingPage/checklist/ChecklistCTAHero';
import type { ServicePageData } from '@/src/lib/persona-text-utils';
import {
  cleanText,
  getFeatureSection,
  getLongFormSection,
  getPillarSections,
  getPricingCtaRow,
  getRealPricingRows,
  serviceDisplayName,
  splitBullets,
} from '@/src/lib/persona-text-utils';
import { cn } from '@/lib/utils';
import { ServiceSubpageBreadcrumb } from '@/src/components/landingPage/servicesPage/ServiceSubpageBreadcrumb';
import { subpageInnerPadding, subpageOuterPadding } from '@/src/components/landingPage/servicesPage/subpage-layout';

type PersonaPageClientProps = {
  page: ServicePageData;
  categorySlug: string;
  serviceSlug: string;
  serviceTitle?: string;
  categoryName?: string;
  serviceName?: string;
};

function useReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, visible };
}

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-700 ease-out',
        visible ? 'translate-y-0 opacity-100' : 'translate-y-7 opacity-0',
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-center gap-2.5">
      <span className="block h-0.5 w-7 rounded-full bg-primary" />
      <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
        {children}
      </span>
    </div>
  );
}

function Hero({ page }: { page: ServicePageData }) {
  const features = getFeatureSection(page);
  const checklist =
    page.topBullets.length > 0
      ? page.topBullets.map(cleanText)
      : splitBullets(features?.bullets);
  const intro = features?.body ? cleanText(features.body) : '';

  return (
    <section className="relative overflow-hidden bg-white pb-0">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_40%,#FDEEE3_0%,transparent_65%)]"
        aria-hidden
      />
      <div className={`relative ${subpageOuterPadding} py-24 lg:py-28`}>
        <div className={`relative grid items-center gap-12 lg:grid-cols-2 lg:gap-16 ${subpageInnerPadding}`}>
        <div>
          <SectionLabel>{page.subtitle}</SectionLabel>
          <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight text-stone-900 sm:text-5xl lg:text-[3.25rem]">
            {page.title}
          </h1>
          {intro && (
            <p className="mt-6 max-w-lg text-base leading-relaxed text-stone-600">{intro}</p>
          )}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/contact-us"
              className="inline-flex items-center rounded-lg bg-primary px-7 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-primary/90"
            >
              Book consultation
            </Link>
            <Link
              href="/contact-us"
              className="inline-flex items-center gap-2 rounded-lg border-2 border-primary/80 px-6 py-3 text-xs font-bold uppercase tracking-wider text-primary transition hover:bg-orange-50"
            >
              Contact us
            </Link>
          </div>
        </div>

        {checklist.length > 0 && (
          <div className="rounded-2xl border border-stone-200 bg-white p-8 shadow-lg lg:p-9">
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              What you get
            </p>
            <ul className="mt-5 space-y-3">
              {checklist.map((item) => (
                <li
                  key={item}
                  className="border-l-2 border-primary/60 pl-3 text-sm leading-snug text-stone-800"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
        </div>
      </div>
    </section>
  );
}

function Pillars({ page }: { page: ServicePageData }) {
  const pillars = getPillarSections(page);
  if (!pillars.length) return null;

  return (
    <section className="bg-stone-50 py-20 lg:py-24">
      <div className={subpageOuterPadding}>
        <div className={subpageInnerPadding}>
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_2fr] lg:gap-20">
          <Reveal>
            <SectionLabel>Core pillars</SectionLabel>
            <h2 className="font-display text-3xl font-semibold leading-tight text-stone-900 sm:text-4xl">
              Built for{' '}
              <span className="italic text-primary">
                {page.subtitle.replace(/^FOR\s+/i, '')}
              </span>
            </h2>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {pillars.map((section, i) => (
              <Reveal key={section.title} delay={i * 60}>
                <div className="h-full rounded-xl border border-stone-200 bg-white p-7 shadow-sm transition hover:border-primary/40 hover:shadow-md">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
                    {section.title}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-stone-600">
                    {cleanText(section.body)}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}

function LongFormContent({ page }: { page: ServicePageData }) {
  const section = getLongFormSection(page);
  if (!section?.body?.trim()) return null;

  const body = cleanText(section.body);
  const chunks = body.split(/(?=What [A-Z]|Key [A-Z][a-z])/).filter(Boolean);

  return (
    <section className="bg-white py-20 lg:py-24">
      <div className={subpageOuterPadding}>
        <div className={subpageInnerPadding}>
        <Reveal>
          <SectionLabel>Deep dive</SectionLabel>
          <h2 className="max-w-3xl font-display text-3xl font-semibold text-stone-900 sm:text-4xl">
            Why {page.subtitle.replace(/^FOR\s+/i, '')} choose ClickMasters
          </h2>
        </Reveal>
        <div className="prose prose-stone mt-10 max-w-none space-y-6 text-justify leading-relaxed text-stone-600">
          {chunks.length > 1 ? (
            chunks.map((chunk, i) => (
              <p key={i} className="text-sm sm:text-base">
                {chunk.trim()}
              </p>
            ))
          ) : (
            <p className="text-sm sm:text-base">{body}</p>
          )}
        </div>
      </div>
      </div>
    </section>
  );
}

function PersonaPricing({ page }: { page: ServicePageData }) {
  const rows = getRealPricingRows(page.pricing);
  if (!rows.length) return null;

  const name = serviceDisplayName(page);

  return (
    <section className="relative overflow-hidden bg-stone-950 py-20 lg:py-24">
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-[28rem] w-[28rem] rounded-full bg-primary/10 blur-3xl"
        aria-hidden
      />
      <div className={`relative ${subpageOuterPadding}`}>
        <div className={subpageInnerPadding}>
        <Reveal className="mb-12 text-center md:mb-14">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-orange-400">
            Transparent pricing
          </p>
          <h2 className="mt-4 font-display text-3xl font-semibold text-white sm:text-4xl">
            {name} pricing
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-white/55">
            Fixed-price engagements tailored to your scope. All amounts in USD.
          </p>
        </Reveal>
        <div className="flex flex-col gap-2.5">
          {rows.map((tier, i) => (
            <Reveal key={tier.engagement} delay={i * 50}>
              <div
                className={cn(
                  'grid gap-4 rounded-xl border px-6 py-5 transition-colors md:grid-cols-[1fr_auto_auto] md:items-center md:gap-8',
                  i === 1
                    ? 'border-primary bg-primary'
                    : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]'
                )}
              >
                <div>
                  <h3
                    className={cn(
                      'text-base font-semibold',
                      i === 1 ? 'text-white' : 'text-white'
                    )}
                  >
                    {tier.engagement}
                  </h3>
                  <p
                    className={cn(
                      'mt-1 text-sm',
                      i === 1 ? 'text-white/80' : 'text-white/55'
                    )}
                  >
                    {cleanText(tier.scope)}
                  </p>
                </div>
                <p
                  className={cn(
                    'text-center text-sm font-medium md:text-left',
                    i === 1 ? 'text-white/85' : 'text-white/50'
                  )}
                >
                  {tier.timeline}
                </p>
                <p
                  className={cn(
                    'text-right font-display text-xl font-bold md:text-2xl',
                    i === 1 ? 'text-white' : 'text-orange-400'
                  )}
                >
                  {tier.investment}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
      </div>
    </section>
  );
}

function InternalLinks({ page }: { page: ServicePageData }) {
  if (!page.internalLinks?.length) return null;

  return (
    <section className="border-t border-stone-200 bg-stone-50 py-12">
      <div className={subpageOuterPadding}>
        <div className={subpageInnerPadding}>
        <h3 className="text-lg font-semibold text-stone-900">Related pages</h3>
        <ul className="mt-4 flex flex-wrap gap-4">
          {page.internalLinks.map((link, i) => {
            const href = link.href ?? link.url ?? '#';
            const label = link.label ?? link.title ?? href;
            return (
              <li key={`${href}-${i}`}>
                <Link href={href} className="text-sm font-medium text-primary hover:underline">
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      </div>
    </section>
  );
}

export default function PersonaPageClient({
  page,
  categorySlug,
  serviceSlug,
  serviceTitle,
  categoryName,
  serviceName,
}: PersonaPageClientProps) {
  const ctaRow = getPricingCtaRow(page.pricing);
  const ctaText = cleanText(page.callToAction?.text ?? '');

  return (
    <div className="min-h-screen bg-white font-sans text-stone-900 antialiased">
      <ServiceSubpageBreadcrumb
        crumbs={[
          { label: 'Home', href: '/' },
          {
            label: categoryName ?? categorySlug.replace(/-/g, ' '),
            href: `/${categorySlug}`,
          },
          {
            label: serviceName ?? serviceTitle ?? serviceSlug.replace(/-/g, ' '),
            href: `/${categorySlug}/${serviceSlug}`,
          },
          { label: page.subtitle.replace(/^FOR\s+/i, '') },
        ]}
      />
      <Hero page={page} />
      <LongFormContent page={page} />
      <Pillars page={page} />
      <PersonaPricing page={page} />
      <FAQSection
        faqs={page.faqs.map((f) => ({
          question: cleanText(f.question),
          answer: cleanText(f.answer),
        }))}
      />
      <InternalLinks page={page} />
      <ChecklistCTAHero
        badge="Get started"
        title={ctaRow?.investment ?? `Talk to us about ${serviceDisplayName(page)}`}
        description={ctaRow?.timeline ?? ctaText ?? page.metaDescription}
        buttons={[
          {
            text: 'Book consultation',
            href: '/contact-us',
            variant: 'primary',
          },
          {
            text: 'Contact us',
            href: '/contact-us',
            variant: 'outline',
          },
        ]}
      />
    </div>
  );
}
