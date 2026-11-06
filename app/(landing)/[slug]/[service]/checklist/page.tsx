import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { checklists, type Checklist } from '@/src/lib/service_checklist';
import { getAllServicePages, getServicePage, type ServicePageContent } from '@/lib/service-pages';
import { siteConfig, buildPageMetadata, breadcrumbSchema, itemListSchema } from '@/app/metadata-config';
import SchemaMarkup from '@/src/components/SchemaMarkup';
import { ChecklistPageClient } from '@/src/components/landingPage/checklist/ChecklistHero';

type Props = { params: Promise<{ slug: string; service: string }> };

export function generateStaticParams(): { slug: string; service: string }[] {
  return getAllServicePages()
    .filter((page) => !!checklists[page.slug])
    .map((page) => ({ slug: page.categorySlug, service: page.slug }));
}

/**
 * Resolve the checklist and its parent service; 404 unknown services and redirect a
 * checklist requested under the wrong hub to its canonical path (no duplicate URLs).
 */
function resolveChecklist(slug: string, service: string): { checklist: Checklist; servicePage: ServicePageContent } {
  const checklist = checklists[service];
  const servicePage = getServicePage(service);
  if (!checklist || !servicePage) notFound();
  if (servicePage.categorySlug !== slug) {
    permanentRedirect(`/${servicePage.categorySlug}/${servicePage.slug}/checklist`);
  }
  return {
    servicePage,
    // The generated data carries categorySlug "services" and a doubled title in serviceName;
    // take hub + service name from the service catalogue instead.
    checklist: {
      ...checklist,
      category: servicePage.category,
      categorySlug: servicePage.categorySlug,
      serviceName: servicePage.serviceName,
      // The hero drops the last word of heroTitleMain and renders heroTitleHighlight in its place,
      // so the H1 reads "{Service} Checklist" (matches the <title>).
      heroTitleMain: `${servicePage.serviceName} Checklist`,
      heroTitleHighlight: 'Checklist',
      heroDescription: `The complete checklist for ${servicePage.serviceName}: what to verify before starting, during development, before launch, and after launch. Every item is specific and binary: it is done or it is not.`,
    },
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, service } = await params;
  const { servicePage } = resolveChecklist(slug, service);

  return buildPageMetadata({
    // Single pass: "{Service} Checklist" — buildPageMetadata appends the brand once.
    title: `${servicePage.serviceName} Checklist`,
    description: `The complete ${servicePage.serviceName} checklist: pre-project, sprint-by-sprint, pre-launch and post-launch verification items. Every item is specific and binary: done or not done.`,
    canonical: `${siteConfig.url}/${slug}/${service}/checklist`,
  });
}

export default async function ChecklistPage({ params }: Props) {
  const { slug, service } = await params;
  const { checklist, servicePage } = resolveChecklist(slug, service);
  const path = `/${slug}/${service}/checklist`;
  const items = checklist.phases.flatMap((phase) => phase.items.map((item) => item.text));

  return (
    <>
      <SchemaMarkup data={itemListSchema(`${servicePage.serviceName} Checklist`, path, items)} />
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: servicePage.category, url: `/${servicePage.categorySlug}` },
          { name: servicePage.serviceName, url: `/${slug}/${service}` },
          { name: 'Checklist', url: path },
        ])}
      />
      <ChecklistPageClient slug={slug} service={service} checklist={checklist} />
    </>
  );
}
