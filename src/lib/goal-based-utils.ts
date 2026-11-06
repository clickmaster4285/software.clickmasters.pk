import { getServicePage } from '@/lib/service-pages';
import {
  goalPages,
  type GoalApproachIntro,
  type GoalMidCta,
  type GoalPageContent,
  type MarketStat,
  type PricingTier,
  type ServiceSection,
  type ServicesCard,
} from '@/lib/goal-based';

const GOAL_URL_SUFFIXES = ['to-increase-revenue', 'to-launch-faster', 'to-reduce-costs'] as const;

const GOAL_SERVICE_ALIASES: Record<string, string> = {
  'ecommerce-development': 'e-commerce-development',
  'enterprise-software': 'enterprise-software-development',
  'headless-ecommerce': 'headless-e-commerce',
  'uiux-design-services': 'ui-ux-design-services',
};

export type NormalizedGoalSection = {
  heading: string;
  body: string;
  bullets?: string[];
};

export type NormalizedPricingTier = {
  type: string;
  investment: string;
  timeline: string;
  bestFor: string;
};

export type NormalizedGoalPage = Omit<GoalPageContent, 'sections' | 'pricingTiers' | 'canonicalPath'> & {
  categorySlug: string;
  serviceSlug: string;
  serviceName: string;
  category: string;
  goalLabel: string;
  goalUrlSlug: string;
  lead: string;
  subheadline?: string;
  heroCtaLabel?: string;
  heroServiceBadge?: string;
  highlights: string[];
  marketStats: MarketStat[];
  approachIntro?: GoalApproachIntro;
  midCta?: GoalMidCta;
  servicesCards: ServicesCard[];
  serviceAreasHeading?: string;
  sections: NormalizedGoalSection[];
  pricingTiers: NormalizedPricingTier[];
  pricingFootnote?: string;
  workshopClosing?: { title: string; body: string; ctaLabel: string };
  canonicalPath: string;
};

export function resolveGoalServiceSlug(serviceParam: string): string {
  return GOAL_SERVICE_ALIASES[serviceParam] ?? serviceParam;
}

export function parseGoalSlug(compositeSlug: string): { serviceSlug: string; goalUrlSlug: string } {
  for (const suffix of GOAL_URL_SUFFIXES) {
    if (compositeSlug.endsWith(`-${suffix}`)) {
      return {
        serviceSlug: compositeSlug.slice(0, -(suffix.length + 1)),
        goalUrlSlug: suffix,
      };
    }
  }
  return { serviceSlug: compositeSlug, goalUrlSlug: compositeSlug };
}

function findRawGoal(goalParam: string, serviceParam?: string): GoalPageContent | undefined {
  const byExact = goalPages.find((g) => g.slug === goalParam);
  if (byExact) return byExact;

  if (serviceParam) {
    const resolved = resolveGoalServiceSlug(serviceParam);
    const composite = `${resolved}-${goalParam}`;
    const match = goalPages.find((g) => g.slug === composite);
    if (match) return match;
  }

  return goalPages.find((g) => {
    const { goalUrlSlug, serviceSlug } = parseGoalSlug(g.slug);
    const goalMatches = goalUrlSlug === goalParam || g.slug === goalParam;
    if (!goalMatches) return false;
    if (!serviceParam) return true;
    const resolved = resolveGoalServiceSlug(serviceParam);
    return serviceSlug === resolved || serviceSlug === serviceParam;
  });
}

function parseGoalLabel(title: string): string {
  const match = title.match(/^GOAL:\s*([^|]+)/i);
  return match ? match[1].trim() : '';
}

function parseDisplayTitle(title: string, serviceName: string, goalLabel: string): string {
  if (serviceName && goalLabel) {
    const words = goalLabel
      .toLowerCase()
      .split(/\s+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1));
    return `${serviceName} to ${words.join(' ')}`;
  }
  return title.replace(/^GOAL:\s*[^|]+\s*\|\s*/i, '').trim() || title;
}

function cleanHighlight(text: string): string {
  return text
    .replace(/✓/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseHighlights(sections: ServiceSection[]): string[] {
  const features = sections.find((s) => s.title === 'Features');
  if (!features) return [];

  const fromBullets = (features.bullets ?? []).flatMap((bullet) => {
    const parts = bullet.split(/\s*✓\s*/).map(cleanHighlight).filter(Boolean);
    return parts.length > 1 ? parts : [cleanHighlight(bullet)];
  });

  if (fromBullets.length > 0) return fromBullets;
  return [];
}

function parseMarketStats(sections: ServiceSection[]): MarketStat[] {
  const stats: MarketStat[] = [];
  const features = sections.find((s) => s.title === 'Features');

  if (features?.body) {
    const body = features.body;
    const matches = [
      ...body.matchAll(
        /([\d][\d\w-]*(?:\s+[A-Za-z][\w-]*)?)\s+([A-Z][^0-9]+?)(?=[\d][\d\w-]*\s+[A-Za-z]|$)/g
      ),
    ];
    for (const match of matches) {
      const value = match[1]?.trim();
      const label = match[2]?.trim();
      if (value && label && value.length <= 24 && label.length > 12) {
        stats.push({ value, label });
      }
    }
  }

  const approachIdx = sections.findIndex((s) => /ClickMasters Approach/i.test(s.title));
  const featuresIdx = sections.findIndex((s) => s.title === 'Features');
  if (featuresIdx >= 0) {
    const end = approachIdx >= 0 ? approachIdx : sections.length;
    for (let i = featuresIdx + 1; i < end; i++) {
      const section = sections[i];
      if (
        section.title &&
        section.title.length <= 28 &&
        section.body &&
        section.title !== 'Features'
      ) {
        stats.push({ value: section.title, label: section.body });
      }
    }
  }

  return stats;
}

function findApproachIntro(sections: ServiceSection[]): GoalApproachIntro | undefined {
  const section = sections.find((s) => /ClickMasters Approach/i.test(s.title));
  if (!section) return undefined;
  // Source titles read "{Service} to {Goal} The ClickMasters Approach"; make the H2 page-specific
  // instead of the same string on all 300 goal pages (open item #14).
  const subject = section.title.replace(/[\s:|-]*The ClickMasters Approach\s*$/i, '').trim();
  return {
    eyebrow: 'The ClickMasters Approach',
    title: subject ? `How ClickMasters Delivers ${subject}` : 'The ClickMasters Approach',
    paragraphs: [section.body],
  };
}

const SPEED_SECTION_EMOJI_PREFIXES = ['\u{1F4C8}', '\u{1F680}', '\u{1F4B0}'] as const;

function titleStartsWithSpeedEmoji(title: string): boolean {
  const first = title.codePointAt(0);
  if (first === undefined) return false;
  return SPEED_SECTION_EMOJI_PREFIXES.some((prefix) => title.startsWith(prefix));
}

function findSpeedSection(sections: ServiceSection[]): NormalizedGoalSection | undefined {
  const section = sections.find(
    (s) =>
      (/Why|How Software|ROI Framework|Reduces Costs|Generates Revenue|matters/i.test(s.title) &&
        !/Approach/i.test(s.title)) ||
      titleStartsWithSpeedEmoji(s.title)
  );
  if (!section) return undefined;
  return { heading: section.title.replace(/^[^\w]+/, '').trim(), body: section.body };
}

function findServiceAreasHeading(sections: ServiceSection[]): string | undefined {
  const section = sections.find((s) => /Key Service Areas/i.test(s.title));
  return section?.title;
}

function parseServiceCards(sections: ServiceSection[]): ServicesCard[] {
  const startIdx = sections.findIndex((s) => /Key Service Areas/i.test(s.title));
  if (startIdx < 0) return [];

  const cards: ServicesCard[] = [];
  for (let i = startIdx + 1; i < sections.length; i++) {
    const section = sections[i];
    if (
      /Fixed-Price.*(?:Delivery|ROI)|Scope defined|Book a/i.test(`${section.title} ${section.body}`)
    ) {
      break;
    }
    if (section.body && section.body.length > 40) {
      cards.push({
        title: section.title,
        description: section.body,
      });
    }
  }
  return cards;
}

function findMidCta(sections: ServiceSection[]): GoalMidCta | undefined {
  const section = sections.find((s) =>
    /Fixed-Price.*(?:Delivery|ROI|Week)|ROI-Modelled/i.test(s.title)
  );
  if (!section) return undefined;

  const title = section.title.includes('Fixed-Price')
    ? section.title
    : `${section.title} — Fixed-Price Delivery`;

  return {
    title,
    body: section.body,
    primaryLabel: 'Book a Free Consultation',
  };
}

function mapPricingTiers(tiers: PricingTier[]): {
  tiers: NormalizedPricingTier[];
  footnote?: string;
  workshopClosing?: { title: string; body: string; ctaLabel: string };
} {
  const footnoteIdx = tiers.findIndex((t) => /All (engagements|ClickMasters)/i.test(t.engagement));
  const ctaIdx = tiers.findIndex((t) => /Book a/i.test(t.investment));

  const footnote = footnoteIdx >= 0 ? tiers[footnoteIdx].engagement : undefined;

  const displayTiers = tiers
    .filter((_, i) => i !== footnoteIdx && i !== ctaIdx)
    .map((t) => ({
      type: t.engagement,
      investment: t.investment,
      timeline: t.timeline,
      bestFor: t.scope,
    }));

  const ctaTier = ctaIdx >= 0 ? tiers[ctaIdx] : undefined;
  const workshopClosing = ctaTier
    ? {
        title: ctaTier.investment,
        body: [ctaTier.timeline, ctaTier.scope].filter(Boolean).join(' '),
        ctaLabel: 'Book a Free Consultation',
      }
    : undefined;

  return { tiers: displayTiers, footnote, workshopClosing };
}

export function normalizeGoalPage(
  raw: GoalPageContent,
  servicePage?: ReturnType<typeof getServicePage>
): NormalizedGoalPage {
  const { serviceSlug, goalUrlSlug } = parseGoalSlug(raw.slug);
  const service = servicePage ?? getServicePage(serviceSlug);
  const sections = raw.sections ?? [];
  const goalLabel = parseGoalLabel(raw.title ?? '');
  const serviceName = service?.serviceName ?? service?.title ?? 'Service';
  const { tiers, footnote, workshopClosing } = mapPricingTiers(raw.pricingTiers ?? []);
  const speedSection = findSpeedSection(sections);
  const normalizedSections = speedSection ? [speedSection] : [];

  const displayTitle = parseDisplayTitle(raw.title ?? '', serviceName, goalLabel);
  const categorySlug = service?.categorySlug ?? 'services';
  const canonicalPath = `/${categorySlug}/${serviceSlug}/${goalUrlSlug}`;

  return {
    ...raw,
    slug: goalUrlSlug,
    title: displayTitle,
    categorySlug,
    category: service?.category ?? 'Services',
    serviceSlug,
    serviceName,
    goalLabel,
    goalUrlSlug,
    lead:
      sections.find((s) => s.title === 'Overview')?.body ??
      sections[0]?.body ??
      raw.subtitle ??
      raw.metaDescription ??
      '',
    subheadline: raw.subtitle || undefined,
    heroCtaLabel: raw.callToAction?.text?.includes('Book')
      ? 'Book a Free Consultation'
      : undefined,
    heroServiceBadge: serviceName,
    highlights: parseHighlights(sections),
    marketStats: parseMarketStats(sections),
    approachIntro: findApproachIntro(sections),
    midCta: findMidCta(sections),
    servicesCards: parseServiceCards(sections),
    serviceAreasHeading: findServiceAreasHeading(sections),
    sections: normalizedSections,
    pricingTiers: tiers,
    pricingFootnote: footnote,
    workshopClosing,
    faqs: raw.faqs ?? [],
    canonicalPath,
    metaTitle: raw.metaTitle,
    metaDescription: raw.metaDescription,
  };
}

export function getGoalPage(
  goalParam: string,
  serviceParam?: string
): NormalizedGoalPage | undefined {
  const raw = findRawGoal(goalParam, serviceParam);
  if (!raw) return undefined;
  const { serviceSlug } = parseGoalSlug(raw.slug);
  return normalizeGoalPage(raw, getServicePage(serviceSlug));
}

type GoalRouteInfo = Pick<NormalizedGoalPage, 'serviceSlug' | 'canonicalPath' | 'goalUrlSlug' | 'categorySlug'>;

export function goalPageMatchesService(goal: GoalRouteInfo, serviceParam: string): boolean {
  const resolved = resolveGoalServiceSlug(serviceParam);
  return goal.serviceSlug === resolved || goal.serviceSlug === serviceParam;
}

export function getGoalCanonicalUrl(goal: GoalRouteInfo): string {
  if (goal.canonicalPath.startsWith('/')) return goal.canonicalPath;
  if (goal.goalUrlSlug && goal.serviceSlug && goal.categorySlug) {
    return `/${goal.categorySlug}/${goal.serviceSlug}/${goal.goalUrlSlug}`;
  }
  return goal.canonicalPath;
}

export function getAllGoalStaticParams(): {
  slug: string;
  service: string;
  'goal-based': string;
}[] {
  return goalPages
    .map((raw) => {
      const normalized = normalizeGoalPage(raw, getServicePage(parseGoalSlug(raw.slug).serviceSlug));
      if (!normalized.categorySlug || !normalized.serviceSlug) return null;
      return {
        slug: normalized.categorySlug,
        service: normalized.serviceSlug,
        'goal-based': normalized.goalUrlSlug,
      };
    })
    .filter((p): p is { slug: string; service: string; 'goal-based': string } => p !== null);
}

/** Canonical path segments for every goal-based landing page (for sitemaps). */
export function getAllGoalSitemapPaths(): string[] {
  return getAllGoalStaticParams().map(
    (p) => `/${p.slug}/${p.service}/${p['goal-based']}`
  );
}
