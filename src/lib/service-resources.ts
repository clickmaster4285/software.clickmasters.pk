/**
 * Programmatic child pages of a sub-service (T3).
 *
 * Reads the SAME collections the sitemap generator uses (persona, goal, how-to,
 * checklist, FAQ), so every child URL listed in the sitemaps is linked from its
 * parent sub-service page.
 *
 * SERVER-ONLY: this pulls in the large persona/goal/how-to/checklist data files.
 * Never import it from a 'use client' component.
 */
import { getAllPersonaStaticParams } from './persona-utils';
import { getAllGoalStaticParams } from './goal-based-utils';
import { howToGuides } from './how-to';
import { checklists } from './service_checklist';

export type ServiceResourceLink = { href: string; label: string };

export type ServiceResources = {
  personas: ServiceResourceLink[];
  goals: ServiceResourceLink[];
  guides: ServiceResourceLink[];
};

const PERSONA_LABELS: Record<string, string> = {
  'for-ctos': 'For CTOs',
  'for-enterprise-it-directors': 'For Enterprise IT Directors',
  'for-non-technical-ceos': 'For Non-Technical CEOs',
  'for-product-managers': 'For Product Managers',
  'for-startup-founders': 'For Startup Founders',
};

function personaLabel(personaSlug: string, serviceSlug: string): string {
  const suffix = personaSlug.startsWith(`${serviceSlug}-`)
    ? personaSlug.slice(serviceSlug.length + 1)
    : personaSlug;
  if (PERSONA_LABELS[suffix]) return PERSONA_LABELS[suffix];
  const words = suffix.replace(/-/g, ' ');
  return words.charAt(0).toUpperCase() + words.slice(1);
}

function goalLabel(goalSlug: string): string {
  // "to-increase-revenue" -> "To increase revenue"
  const words = goalSlug.replace(/-/g, ' ').trim();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

type ChildIndex = Map<string, { personas: ServiceResourceLink[]; goals: ServiceResourceLink[] }>;

let childIndex: ChildIndex | null = null;

/** Build once per server process — the source collections are static. */
function getChildIndex(): ChildIndex {
  if (childIndex) return childIndex;
  const index: ChildIndex = new Map();
  const bucket = (service: string) => {
    let entry = index.get(service);
    if (!entry) {
      entry = { personas: [], goals: [] };
      index.set(service, entry);
    }
    return entry;
  };

  for (const p of getAllPersonaStaticParams()) {
    bucket(p.service).personas.push({
      href: `/${p.slug}/${p.service}/${p['goal-based']}`,
      label: personaLabel(p['goal-based'], p.service),
    });
  }
  for (const g of getAllGoalStaticParams()) {
    bucket(g.service).goals.push({
      href: `/${g.slug}/${g.service}/${g['goal-based']}`,
      label: goalLabel(g['goal-based']),
    });
  }
  for (const entry of index.values()) {
    entry.personas.sort((a, b) => a.label.localeCompare(b.label));
    entry.goals.sort((a, b) => a.label.localeCompare(b.label));
  }
  childIndex = index;
  return index;
}

export function getServiceResources(
  categorySlug: string,
  serviceSlug: string,
  serviceName: string,
): ServiceResources {
  const children = getChildIndex().get(serviceSlug);
  const guides: ServiceResourceLink[] = [];

  if (howToGuides[serviceSlug]) {
    guides.push({ href: `/${categorySlug}/${serviceSlug}/how-to`, label: `How to plan ${serviceName}` });
  }
  if (checklists[serviceSlug]) {
    guides.push({ href: `/${categorySlug}/${serviceSlug}/checklist`, label: `${serviceName} checklist` });
  }
  // /faqs/{slug} is generated for every sub-service.
  guides.push({ href: `/faqs/${serviceSlug}`, label: `${serviceName} FAQs` });

  return {
    personas: children?.personas ?? [],
    goals: children?.goals ?? [],
    guides,
  };
}
