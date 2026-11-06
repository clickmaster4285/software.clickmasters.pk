import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllServiceSlugs, getServicePage } from '@/lib/service-pages';
import { siteConfig, buildPageMetadata, breadcrumbSchema, faqSchema } from '@/app/metadata-config';
import SchemaMarkup from '@/src/components/SchemaMarkup';

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams(): { slug: string }[] {
  return getAllServiceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getServicePage(slug);

  if (!service) {
    notFound();
  }

  return buildPageMetadata({
    title: `${service.serviceName} FAQs`,
    description: `Answers to common questions about ${service.serviceName} — pricing, timelines, process, and how ClickMasters delivers ${service.serviceName} projects.`,
    canonical: `${siteConfig.url}/faqs/${service.slug}`,
  });
}

export default async function FaqDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = getServicePage(slug);

  if (!service) notFound();

  const faqs = service.faqs ?? [];

  return (
    <main className="mx-auto mt-24 max-w-4xl px-4 pb-20 sm:px-6 lg:px-8">
      {/* FAQPage mirrors exactly the Q&A rendered below */}
      {faqs.length > 0 && <SchemaMarkup data={faqSchema(faqs)} />}
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: service.category, url: `/${service.categorySlug}` },
          { name: service.serviceName, url: `/${service.categorySlug}/${service.slug}` },
          { name: 'FAQs', url: `/faqs/${service.slug}` },
        ])}
      />
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm">
        <Link href="/" className="font-medium text-gray-800 hover:text-primary">Home</Link>
        <span aria-hidden className="text-gray-400">/</span>
        <Link href={`/${service.categorySlug}`} className="font-medium text-gray-800 hover:text-primary">
          {service.category}
        </Link>
        <span aria-hidden className="text-gray-400">/</span>
        <Link href={`/${service.categorySlug}/${service.slug}`} className="font-medium text-gray-800 hover:text-primary">
          {service.serviceName}
        </Link>
        <span aria-hidden className="text-gray-400">/</span>
        <span className="font-semibold text-gray-900">FAQs</span>
      </nav>

      <header className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary/80">
          {service.category}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {service.title} FAQs
        </h1>
        <p className="mt-4 text-[15px] leading-7 text-slate-800">
          Common questions about our{' '}
          <Link href={`/${service.categorySlug}/${service.slug}`} className="font-semibold text-primary underline underline-offset-4">
            {service.serviceName} services
          </Link>
          . Browse <Link href="/faqs" className="text-primary underline underline-offset-4">all service FAQs</Link>.
        </p>
      </header>

      <h2 className="sr-only">Common questions about {service.serviceName}</h2>

      {faqs.length === 0 ? (
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 text-slate-900">
          FAQs for this service are coming soon.
        </section>
      ) : (
        <section className="mt-8 space-y-4">
          {faqs.map((faq, index) => (
            <article
              key={`${faq.question}-${index}`}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-lg font-semibold text-slate-900">{faq.question}</h2>
              <p className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-900">
                {faq.answer}
              </p>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
