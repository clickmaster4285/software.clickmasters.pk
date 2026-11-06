import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

import { TableOfContents } from '@/components/table-of-contents';
import { breadcrumbSchema, serviceSchema, siteConfig, buildPageMetadata } from '@/app/metadata-config';
import { baseServiceSlug, serviceHreflangAlternates } from '@/src/lib/hreflang';

import {
  getAllCountryServicePages,
  getCountryServicePage,
  getCountryServiceTechnologies,
  slugify,
  type CountryServicePageContent,
} from '@/lib/country-services';

import { ServiceHero } from '@/components/landingPage/servicesPage/service-hero';
import { ServicesSection } from '@/src/components/landingPage/servicesPage/ServicesSection';
import { ProcessSection } from '@/src/components/landingPage/servicesPage/ProcessSection';
import { PricingSection } from '@/src/components/landingPage/servicesPage/PricingSection';

import { CeoVision } from '@/src/components/landingPage/servicesPage/CeoVision';
import TechStackSection from '@/src/components/landingPage/home/TechStackSection';
import FeaturedInsights from '@/src/components/landingPage/home/FeaturedInsights';
import FaqSection from '@/src/components/landingPage/location/FaqSection';
import { TestimonialsSection } from '@/src/components/landingPage/servicesPage/TestimonialsSection';
import DynamicSections from '@/src/components/landingPage/servicesPage/DynamicSections';
import { ProjectCTAHero } from '@/src/components/landingPage/home/info-cts';

type Props = { params: Promise<{ location: string; service: string }> };

export function generateStaticParams(): { location: string; service: string }[] {
  return getAllCountryServicePages().map((page: CountryServicePageContent) => ({
    location: page.categorySlug,
    service: page.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { location, service } = await params;
  const page = getCountryServicePage(service, location);

  if (!page || page.categorySlug !== location) {
    notFound();
  }

  const canonical = `${siteConfig.url}/locations/${page.categorySlug}/${page.slug}`;

  return buildPageMetadata({
    title: page.metaTitle ?? `${page.title} in ${page.countryName}`,
    description: page.metaDescription,
    canonical,
    ogImage: `${siteConfig.url}/og/services.webp`,
    ogImageAlt: `${page.title} services by ClickMasters`,
    robots: { index: true, follow: true },
    // T2 — reciprocal hreflang with the Pakistan default page (x-default)
    languages: serviceHreflangAlternates(baseServiceSlug(page.slug, location)),
  });
}

export default async function CountryServicePage({ params }: Props) {
  const { location, service } = await params;
  const page = getCountryServicePage(service, location);

  if (!page) notFound();
  if (page.categorySlug !== location) {
    redirect(`/locations/${page.categorySlug}/${page.slug}`);
  }

  const sections = page.sections || [];
  const faqs = page.faqs || [];
  const techStack = getCountryServiceTechnologies(service, location);

  // ==================== TOC ====================
  const tocItems = [{ id: 'overview', title: 'Overview', level: 2 as const }];

  const getSectionId = (heading: string, index: number): string => {
    const h = heading.toLowerCase();
    if (h.includes('what is')) return 'what-is';
    if (h.includes('services we deliver') || h.includes('includes')) return 'our-services';
    if (h.includes('why b2b') || h.includes('why choose')) return 'why-choose-us';
    if (h.includes('process')) return 'our-process';
    if (h.includes('technology') || h.includes('tech stack')) return 'tech-stack';
    if (h.includes('industry')) return 'industries';
    if (h.includes('pricing')) return 'pricing';
    if (h.includes('testimonial')) return 'testimonials';
    if (h.includes('case study')) return 'case-study';
    return `section-${index}-${slugify(heading)}`;
  };

  sections.forEach((section: any, index: number) => {
    const id = getSectionId(section.heading, index);
    if (!tocItems.some((item) => item.id === id)) {
      tocItems.push({ id, title: section.heading, level: 2 as const });
    }
  });

  if (page.servicesCards) tocItems.push({ id: 'our-services', title: 'Our Services', level: 2 as const });
  if (page.differentiators) tocItems.push({ id: 'why-choose-us', title: 'Why Choose Us', level: 2 as const });
  if (page.processPhases) tocItems.push({ id: 'our-process', title: 'Our Process', level: 2 as const });
  if (techStack.length > 0) tocItems.push({ id: 'tech-stack', title: 'Technology Stack', level: 2 as const });
  if (page.industryUseCases) tocItems.push({ id: 'industries', title: 'Industries', level: 2 as const });
  
  if (page.countryPricingTiers) tocItems.push({ id: 'pricing', title: 'Pricing', level: 2 as const });


  if (page.tables) {
    page.tables.forEach((table: any) => {
      const id = slugify(table.title);
      if (!tocItems.some((item) => item.id === id)) {
        tocItems.push({ id, title: table.title, level: 2 as const });
      }
    });
  }

  tocItems.push({ id: 'testimonials', title: 'Testimonials', level: 2 as const });
  tocItems.push({ id: 'case-study', title: 'Case Study', level: 2 as const });
  if (faqs.length > 0) tocItems.push({ id: 'faq', title: 'FAQ', level: 2 as const });

  // ==================== Schema ====================
  const url = `${siteConfig.url}/locations/${page.categorySlug}/${page.slug}`;

  const jsonLd = serviceSchema(page.title, page.metaDescription, url, { areaServed: page.countryName });
  const professionalServiceSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'ClickMasters',
    serviceType: page.title,
    url,
    areaServed: [page.countryCode],
  };

  const faqSchema = faqs.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq: any) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      }
    : null;

  return (
    <>
      <script
        id={`schema-${page.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        id={`breadcrumb-${page.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Services', url: '/software-solutions' }, { name: page.countryName, url: `/locations/${page.categorySlug}` }, { name: page.serviceName, url: `/locations/${page.categorySlug}/${page.slug}` }])) }}
      />
      <script
        id={`professional-${page.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalServiceSchema) }}
      />
      {faqSchema && (
        <script
          id={`faq-${page.slug}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <div className="min-h-screen  text-slate-900 ">
        <ServiceHero
          page={{
            category: page.countryName,
            categorySlug: page.categorySlug,
            serviceName: page.serviceName,
            title: page.title,
            lead: page.lead ?? page.metaDescription,
            highlights: page.highlights ?? [],
            marketStats: [],
          }}
        />

        <div className="mx-4 max-w-full px-6 md:px-8 lg:px-10 xl:px-24">
          <div className="relative lg:grid lg:grid-cols-[1fr_280px] lg:gap-12 xl:gap-16">
            <main className="py-12 lg:py-10 min-w-0">
              {/* Overview - matches first TOC item */}
              <div id="overview" />

              <DynamicSections 
                sections={sections as any[]}     
                serviceName={page.serviceName} 
              />

              {page.servicesCards && (
                <div id="our-services">
                  <ServicesSection serviceName={page.serviceName} servicesCards={page.servicesCards} />
                </div>
              )}

              {page.processPhases && (
                <div id="our-process" className="lg:-ml-20 -pl-4">
                  <ProcessSection serviceName={page.serviceName} processPhases={page.processPhases} />
                </div>
              )}

              {techStack.length > 0 && (
                <div id="tech-stack" className="lg:-mx-20 -px-4">
                  <TechStackSection />
                </div>
              )}

              {page.countryPricingTiers && (
                <div id="pricing">
                  <PricingSection serviceName={page.serviceName} pricingTiers={page.countryPricingTiers} />
                </div>
              )}

              <div className="lg:-mx-20 -px-4">
                <CeoVision />
              </div>

              <div id="testimonials">
                <TestimonialsSection sectionTitle={`${page.title} in ${page.countryName}`} />
              </div>

              <div id="case-study" className="lg:-ml-20 -pl-4">
                <FeaturedInsights />
              </div>

              {faqs.length > 0 && (
                <div id="faq" className="lg:-mx-20 -px-4">
                  <FaqSection faqs={faqs} />
                </div>
              )}
            </main>

            <aside className="hidden lg:block sticky top-24 self-start z-10 flex-shrink-0">
              <div className="py-12 lg:py-10">
                <TableOfContents items={tocItems} />
              </div>
            </aside>
          </div>
        </div>

        <div className={"-mb-14"}>  
          <ProjectCTAHero />
        </div>
      </div>
    </>
  );
}