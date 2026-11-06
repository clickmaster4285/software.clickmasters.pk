import { notFound } from 'next/navigation';
import { getServiceData, getAllServiceSlugs } from '@/src/lib/services';
import { metadataConfig, faqSchema, homepageFaqSchema, serviceSchema, siteConfig, breadcrumbSchema, pakistanFirstServiceTitle, pakistanFirstDescription } from '@/app/metadata-config';

/** Hub names that read badly as a title on their own (T6). */
const HUB_TITLE_OVERRIDES: Record<string, string> = {
  'design-ui-ux': 'UI/UX Design',
  'data-services': 'Data Analytics & Engineering',
};
import ServiceClient from './ServiceClient';

// ISR (revalidate is set in app/layout.tsx). Unknown slugs 404 via notFound() (T5).

type Props = { params: Promise<{ slug: string }> };

/** Static routes under (landing) — must not be handled by this dynamic segment */
const RESERVED_SLUGS = new Set([
  'software-solutions',
  'blog',
  'case-studies',
  'about-us',
  'contact-us',
  'testimonials',
  'faqs',
  'careers',
  'locations',
  'privacy-policy',
  'terms-of-service',
  'cookie-policy',
  'admin',
  'hire',
]);

const categoryFaqs = homepageFaqSchema.mainEntity.map((item) => ({
  question: item.name,
  answer: item.acceptedAnswer.text,
}));

// Generate static paths for all services at build time
export async function generateStaticParams() {
  const slugs = getAllServiceSlugs().filter((slug) => !RESERVED_SLUGS.has(slug));
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;

  // Throwing notFound() here (before any HTML is streamed) guarantees a real HTTP 404
  // instead of a soft-404 "Service Not Found" page with HTTP 200.
  if (RESERVED_SLUGS.has(slug)) notFound();

  const serviceData = getServiceData(slug);
  if (!serviceData) notFound();

  return metadataConfig.serviceDetail(
    pakistanFirstServiceTitle(HUB_TITLE_OVERRIDES[slug] ?? serviceData.title),
    // Pakistan-first description (open item #4)
    pakistanFirstDescription(HUB_TITLE_OVERRIDES[slug] ?? serviceData.title, serviceData.description),
    slug
  );
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;

  if (RESERVED_SLUGS.has(slug)) {
    notFound();
  }
  
  // Get service data from our data file based on URL slug
  const serviceData = getServiceData(slug);
  
  // If no service data found for this slug, show 404
  if (!serviceData) {
    notFound();
  }

  const url = `${siteConfig.url}/${slug}`;
  const serviceJsonLd = serviceSchema(serviceData.title, serviceData.description, url, { areaServed: 'Pakistan' });
  const breadcrumbJsonLd = breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: serviceData.title, url: `/${slug}` },
  ]);
  const faqJsonLd = faqSchema(categoryFaqs);

  return (
    <>
      <script
        id={`service-schema-${slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        id={`faq-schema-${slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        id={`breadcrumb-schema-${slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ServiceClient serviceData={serviceData} />
    </>
  );
}