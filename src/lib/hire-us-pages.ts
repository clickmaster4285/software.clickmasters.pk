export type HireUsPageContent = {
  slug: string;
  title: string;
  metaDescription: string;
  lead: string;
  highlights: string[];
  sections: { heading: string; body: string }[];
};

const hireUsItems = [
  'Hire AI Developers',
  'AI Agent Development Services',
  'RAG Development Services',
  // 'Custom Software Development' — 301 to /software-development/custom-software-development (T7, see next.config.ts)
  'SaaS Development Services',
  'AI Development Healthcare',
  'AI Development Finance',
  'AI Development Logistics',
  'AI Agents for Customer Support',
  'AI Agents for Sales',
  'AI Agents for Lead Qualification',
  'AI Development Company USA',
  'AI Development Company UK',
  'AI Development Cost',
  'RAG Development Cost',
] as const;

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const pages: HireUsPageContent[] = hireUsItems.map((title) => {
  const slug = slugify(title);
  const normalized = title.toLowerCase();

  return {
    slug,
    title,
    metaDescription: `${title} by ClickMasters. Plan, build, and scale high-impact digital products with an experienced delivery team.`,
    lead: `Our ${normalized} offering helps you move from idea to production with clear milestones, quality engineering, and dependable support.`,
    highlights: [
      `Specialized delivery for ${normalized}`,
      'Senior engineering support across planning, build, and launch',
      'Transparent execution with measurable business outcomes',
    ],
    sections: [
      {
        heading: `What our ${normalized} includes`,
        body: 'We cover discovery, architecture, implementation, QA, and launch. You get practical recommendations, predictable delivery, and production-ready outcomes.',
      },
      {
        heading: 'How we work with your team',
        body: 'Our team collaborates in focused sprints with clear communication, milestone reviews, and documentation so stakeholders stay aligned at every stage.',
      },
    ],
  };
});

const bySlug = new Map(pages.map((page) => [page.slug, page]));

export function getAllHireUsSlugs(): string[] {
  return pages.map((page) => page.slug);
}

export function getHireUsPage(slug: string): HireUsPageContent | undefined {
  return bySlug.get(slug);
}

/**
 * Open item #6 — where each /hire page is linked from (it was orphaned). The value is the
 * matching sub-service (its "Resources" block links the hire page) or the hub / country page
 * the hire page links back to. All hire pages are also listed on /about-us ("Hire developers").
 * If Content decides to merge a page instead, add a 301 in next.config.ts, drop it from
 * hireUsItems and remove it here.
 */
const HIRE_PAGE_RELATED: Record<string, { href: string; label: string }> = {
  'hire-ai-developers': { href: '/artificial-intelligence-ai/ai-developers', label: 'AI Developers' },
  'ai-agent-development-services': { href: '/artificial-intelligence-ai/ai-agents-development', label: 'AI Agents Development' },
  'ai-agents-for-customer-support': { href: '/artificial-intelligence-ai/ai-agents-development', label: 'AI Agents Development' },
  'ai-agents-for-lead-qualification': { href: '/artificial-intelligence-ai/ai-agents-development', label: 'AI Agents Development' },
  'ai-agents-for-sales': { href: '/artificial-intelligence-ai/ai-agents-development', label: 'AI Agents Development' },
  'ai-development-company-uk': { href: '/locations/uk', label: 'Software development in the UK' },
  'ai-development-company-usa': { href: '/locations/usa', label: 'Software development in the USA' },
  'ai-development-cost': { href: '/artificial-intelligence-ai', label: 'Artificial Intelligence services' },
  'ai-development-finance': { href: '/artificial-intelligence-ai', label: 'Artificial Intelligence services' },
  'ai-development-healthcare': { href: '/artificial-intelligence-ai', label: 'Artificial Intelligence services' },
  'ai-development-logistics': { href: '/artificial-intelligence-ai', label: 'Artificial Intelligence services' },
  'rag-development-cost': { href: '/artificial-intelligence-ai/llm-applications-development', label: 'LLM Applications Development' },
  'rag-development-services': { href: '/artificial-intelligence-ai/llm-applications-development', label: 'LLM Applications Development' },
  'saas-development-services': { href: '/software-development/saas-product-development', label: 'SaaS Product Development' },
};

export function getHirePageRelated(hireSlug: string): { href: string; label: string } | undefined {
  return HIRE_PAGE_RELATED[hireSlug];
}

/** Hire pages whose related link is the given sub-service path, e.g. "/software-development/saas-product-development". */
export function getHirePagesForServicePath(servicePath: string): { href: string; label: string }[] {
  return pages
    .filter((page) => HIRE_PAGE_RELATED[page.slug]?.href === servicePath)
    .map((page) => ({ href: `/hire/${page.slug}`, label: page.title }));
}

export function getAllHireUsPages(): HireUsPageContent[] {
  return pages;
}
