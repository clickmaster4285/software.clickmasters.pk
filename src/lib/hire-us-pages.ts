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
