/**
 * Pure text/formatting helpers for persona pages (T12).
 * NO data imports here — safe for 'use client' components. The 6.8 MB persona
 * dataset lives in persona-based.ts and must only be imported on the server.
 */
export interface ServiceSection {
  title: string;
  body: string;
  bullets?: string[];
}

export interface PricingTier {
  engagement: string;
  investment: string;
  timeline: string;
  scope: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ServicePageData {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  canonical: string;
  schema: string[];
  title: string;
  subtitle: string;
  topBullets: string[];
  sections: ServiceSection[];
  pricing: PricingTier[];
  faqs: FAQItem[];
  callToAction: Record<string, string>;
  internalLinks: Array<Record<string, string>>;
}

/** Strip emojis, dingbats, and decorative symbols from generated copy. */
export function stripEmojis(text: string): string {
  return text
    .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '')
    .replace(/[\u2600-\u27BF]/g, '')
    .replace(/[✓✔☑►▸•◦]/g, '')
    .replace(/\uFE0F/g, '');
}

export function cleanText(text: string): string {
  return stripEmojis(text)
    .replace(/\s*—\s*/g, ', ')
    .replace(/\s*–\s*/g, ', ')
    .replace(/\s*→\s*/g, ': ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function splitBullets(bullets?: string[]): string[] {
  if (!bullets?.length) return [];
  return bullets
    .flatMap((line) => line.split(/\s*✓\s*/))
    .map((s) => cleanText(s))
    .filter(Boolean);
}

export function toPricingTiers(pricing: PricingTier[]) {
  return pricing
    .filter((t) => /\$\d/.test(t.investment))
    .filter((t) => !/^all clickmasters/i.test(t.engagement))
    .map((t) => ({
      type: t.engagement,
      investment: t.investment,
      timeline: t.timeline,
      bestFor: t.scope,
    }));
}

export function getRealPricingRows(pricing: PricingTier[]) {
  return pricing.filter(
    (t) =>
      /\$\d/.test(t.investment) &&
      !/^all clickmasters/i.test(t.engagement)
  );
}

export function getPricingCtaRow(pricing: PricingTier[]) {
  return pricing.find(
    (t) =>
      /^all clickmasters/i.test(t.engagement) ||
      /book|request|consultation/i.test(t.investment)
  );
}

export function getFeatureSection(page: ServicePageData) {
  return page.sections.find((s) => s.title === 'Features');
}

export function getPillarSections(page: ServicePageData) {
  return page.sections.filter(
    (s) =>
      s.title !== 'Features' &&
      s.title !== 'Knowledge Transfer' &&
      s.body.length > 0 &&
      s.body.length < 900
  );
}

export function getLongFormSection(page: ServicePageData) {
  const knowledge = page.sections.find((s) => s.title === 'Knowledge Transfer');
  if (knowledge?.body && knowledge.body.length > 200) return knowledge;
  return (
    page.sections.find((s) => s.body.length >= 900) ??
    page.sections.filter((s) => s.title !== 'Features').at(-1)
  );
}

export function serviceDisplayName(page: ServicePageData): string {
  const t = page.title.replace(/\s+FOR\s+.+$/i, '').trim();
  return t || page.title;
}
