import { getServicePage } from '@/lib/service-pages';
import {
  servicePages,
  type ServicePageData,
  type PricingTier,
  type ServiceSection,
} from '@/src/lib/persona-based';

export type { ServicePageData, PricingTier, ServiceSection };

export const PERSONA_SUFFIXES = [
  '-for-enterprise-it-directors',
  '-for-non-technical-ceos',
  '-for-product-managers',
  '-for-startup-founders',
  '-for-ctos',
] as const;

export type PersonaRouteParams = {
  slug: string;
  service: string;
  'goal-based': string;
};

export type ResolvedPersonaRoute = {
  personaPage: ServicePageData;
  serviceSlug: string;
  servicePage: NonNullable<ReturnType<typeof getServicePage>>;
  canonicalPath: string;
};

export function baseServiceSlugFromPersona(personaSlug: string): string {
  for (const suffix of PERSONA_SUFFIXES) {
    if (personaSlug.endsWith(suffix)) {
      return personaSlug.slice(0, -suffix.length);
    }
  }
  return personaSlug;
}

export function getPersonaPage(slug: string): ServicePageData | undefined {
  return servicePages.find((p) => p.slug === slug);
}

export function getAllPersonaSlugs(): string[] {
  return servicePages
    .map((p) => p.slug)
    .filter((s) => s.includes('-for-'));
}

export function isPersonaSlug(slug: string): boolean {
  return PERSONA_SUFFIXES.some((suffix) => slug.endsWith(suffix));
}

export function getPersonaCanonicalPath(
  personaSlug: string,
  servicePage: NonNullable<ReturnType<typeof getServicePage>>
): string {
  return `/${servicePage.categorySlug}/${servicePage.slug}/${personaSlug}`;
}

export function resolvePersonaRoute(
  personaSlug: string,
  serviceParam: string
): ResolvedPersonaRoute | undefined {
  const personaPage = getPersonaPage(personaSlug);
  if (!personaPage) return undefined;

  const serviceSlug = baseServiceSlugFromPersona(personaSlug);
  if (serviceParam !== serviceSlug) return undefined;

  const servicePage = getServicePage(serviceSlug);
  if (!servicePage) return undefined;

  return {
    personaPage,
    serviceSlug,
    servicePage,
    canonicalPath: getPersonaCanonicalPath(personaSlug, servicePage),
  };
}

export function getAllPersonaStaticParams(): PersonaRouteParams[] {
  return getAllPersonaSlugs()
    .map((personaSlug) => {
      const serviceSlug = baseServiceSlugFromPersona(personaSlug);
      const servicePage = getServicePage(serviceSlug);
      if (!servicePage) return null;
      return {
        slug: servicePage.categorySlug,
        service: serviceSlug,
        'goal-based': personaSlug,
      };
    })
    .filter((p): p is PersonaRouteParams => p !== null);
}

export function getAllPersonaSitemapPaths(): string[] {
  return getAllPersonaStaticParams().map(
    (p) => `/${p.slug}/${p.service}/${p['goal-based']}`
  );
}

export {
  stripEmojis,
  cleanText,
  splitBullets,
  toPricingTiers,
  getRealPricingRows,
  getPricingCtaRow,
  getFeatureSection,
  getPillarSections,
  getLongFormSection,
  serviceDisplayName,
} from './persona-text-utils';
