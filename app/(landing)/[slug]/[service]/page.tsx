import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';

import { TableOfContents } from '@/components/table-of-contents';
import { breadcrumbSchema, faqSchema, homepageFaqSchema, serviceSchema, siteConfig, buildPageMetadata, pakistanFirstServiceTitle, pakistanFirstDescription } from '@/app/metadata-config';
import {
  getAllServicePages,
  getServicePage,
  getServiceTechnologies,
  slugify,
  type ServicePageContent,
} from '@/lib/service-pages';

import { ServiceHero } from '@/components/landingPage/servicesPage/service-hero';
import { ServicesSection } from '@/src/components/landingPage/servicesPage/ServicesSection';
import { ProcessSection } from '@/src/components/landingPage/servicesPage/ProcessSection';
import { IndustriesSection } from '@/src/components/landingPage/servicesPage/IndustriesSection';

import { FAQSection } from '@/src/components/landingPage/servicesPage/FAQSection';

import { EngineeringBaseline } from '@/src/components/landingPage/servicesPage/EngineeringBaseline';
import { WhyChooseUs } from '@/src/components/landingPage/servicesPage/WhyChooseUs';

import { PricingSection } from '@/src/components/landingPage/servicesPage/PricingSection';


import { CeoVision } from '@/src/components/landingPage/servicesPage/CeoVision';
import FeaturedInsights from '@/src/components/landingPage/home/FeaturedInsights';
import TechStackSection from '@/src/components/landingPage/home/TechStackSection';
import { TestimonialsSection } from '@/src/components/landingPage/home/TestimonialsSection';
import { SectionContent } from '@/src/components/landingPage/servicesPage/SectionContent';
import SolutionsPage from '@/src/components/landingPage/home/Solutions';
import CTASectionImage from '@/src/components/landingPage/home/CTASectionImage';
import { WhoWeAre } from '@/src/components/landingPage/servicesPage/WhoWeAre';
import { ServiceResources } from '@/src/components/landingPage/servicesPage/ServiceResources';
import { getServiceResources } from '@/src/lib/service-resources';
import { serviceHreflangAlternates } from '@/src/lib/hreflang';

type Props = { params: Promise<{ slug: string; service: string }> };

const defaultFaqs = homepageFaqSchema.mainEntity.map((item) => ({
  question: item.name,
  answer: item.acceptedAnswer.text,
}));

export function generateStaticParams(): { slug: string; service: string }[] {
  return getAllServicePages().map((page) => ({
    slug: page.categorySlug,
    service: page.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, service } = await params;
  const page = getServicePage(service);
  // Unknown slugs: 404 before streaming starts (T5).
  if (!page) notFound();
  // A service requested under a hub that is not its parent never renders as a duplicate URL:
  // redirect to the canonical path before any HTML is sent.
  if (page.categorySlug !== slug) permanentRedirect(getCanonicalPath(page));

  const canonicalPath = getCanonicalPath(page);
  const canonical = `${siteConfig.url}${canonicalPath}`;

  return buildPageMetadata({
    // Pakistan-first title, full length, never truncated (T6)
    title: pakistanFirstServiceTitle(page.serviceName, page.metaTitle),
    // Pakistan-first description (open item #4); /locations/* keep the international copy
    description: pakistanFirstDescription(page.serviceName, page.metaDescription),
    canonical,
    ogImage: `${siteConfig.url}/og/services.webp`,
    ogImageAlt: `${page.title} ClickMasters software services`,
    // T2 — reciprocal hreflang to the /locations/* versions; this page is x-default
    languages: serviceHreflangAlternates(page.slug),
  });
}

function getCanonicalPath(page: ServicePageContent): string {
  return `/${page.categorySlug}/${page.slug}`;
}

export default async function ServiceByCategoryPage({ params }: Props) {
  const { slug, service } = await params;
  const page = getServicePage(service);
  // console.log('Category slug:', slug);  
  // console.log('Service slug:', service);


  if (!page) notFound();

  // If the category slug doesn't match, redirect to the correct one (canonical URL)
  if (page.categorySlug !== slug) {
    permanentRedirect(getCanonicalPath(page));
  }       

  const sections = page.sections || [];
  const faqs = page.faqs || [];
  const canonicalPath = getCanonicalPath(page);
  const url = `${siteConfig.url}${canonicalPath}`;
  const techStack = getServiceTechnologies(service);

  // Helper function to make service name bold in text
  const makeBoldServiceName = (text: string, serviceName: string): string => {
    if (!text || !serviceName) return text || "";
    const regex = new RegExp(`(${serviceName})`, 'gi');
    return text.replace(regex, '<strong>$1</strong>');
  };

  // Standardized TOC items built dynamically
  const tocItems = [
    { id: 'overview', title: 'Overview', level: 2 as const },
  ];

  // Helper to find and assign IDs to sections
  const getSectionId = (heading: string, index: number) => {
    const h = heading.toLowerCase();
    if (h.includes('what is')) return 'what-is';
    if (h.includes('services we deliver') || h.includes('includes')) return 'our-services';
    if (h.includes('why b2b companies') || h.includes('why choose')) return 'why-choose-us';
    if (h.includes('process')) return 'our-process';
    if (h.includes('technology stack') || h.includes('tech stack')) return 'tech-stack';
    if (h.includes('industry use cases') || h.includes('industries')) return 'industries';
    if (h.includes('pricing')) return 'pricing';
    if (h.includes('testimonials')) return 'testimonials';
    if (h.includes('case study')) return 'case-study';
    return `section-${index}-${slugify(heading)}`;
  };

  
  // Add generic sections to TOC
  sections.forEach((section, index) => {
    const id = getSectionId(section.heading, index);
    if (!tocItems.find(item => item.id === id)) {
      tocItems.push({ id, title: section.heading, level: 2 as const });
    }
  });

  if (page.servicesCards && !tocItems.find(item => item.id === 'our-services')) {
    tocItems.push({ id: 'our-services', title: 'Our Services', level: 2 as const });
  }

  if (page.differentiators && !tocItems.find(item => item.id === 'why-choose-us')) {
    tocItems.push({ id: 'why-choose-us', title: 'Why Choose Us', level: 2 as const });
  }

  if (page.checklist) {
    tocItems.push({ id: 'checklist', title: 'Engineering Baseline', level: 2 as const });
  }

  if (page.processPhases && !tocItems.find(item => item.id === 'our-process')) {
    tocItems.push({ id: 'our-process', title: 'Our Process', level: 2 as const });
  }

  if (techStack.length > 0 && !tocItems.find(item => item.id === 'tech-stack')) {
    tocItems.push({ id: 'tech-stack', title: 'Technology Stack', level: 2 as const });
  }

  if (page.industryUseCases && !tocItems.find(item => item.id === 'industries')) {
    tocItems.push({ id: 'industries', title: 'Industries', level: 2 as const });
  }

  if (page.pricingTiers && !tocItems.find(item => item.id === 'pricing')) {
    tocItems.push({ id: 'pricing', title: 'Pricing', level: 2 as const });
  }

  if (page.tables) {
    page.tables.forEach((table) => {
      const id = slugify(table.title);
      if (!tocItems.find(item => item.id === id)) {
        tocItems.push({ id, title: table.title, level: 2 as const });
      }
    });
  }

  tocItems.push({ id: 'testimonials', title: 'Testimonials', level: 2 as const });
  tocItems.push({ id: 'case-study', title: 'Case Study', level: 2 as const });

  if (faqs.length > 0) {
    tocItems.push({ id: 'faq', title: 'FAQ', level: 2 as const });
  }

  // T3 — links to every programmatic child page (persona, goal, how-to, checklist, FAQ)
  const resources = getServiceResources(page.categorySlug, page.slug, page.serviceName);
  tocItems.push({ id: 'resources', title: 'Resources', level: 2 as const });

  const serviceJsonLd = serviceSchema(page.serviceName, page.metaDescription, url, {
    areaServed: 'Pakistan',
    serviceType: page.category,
  });
  // FAQPage must mirror exactly the questions rendered on the page (T11).
  const faqJsonLd = faqs.length > 0 ? faqSchema(faqs) : null;

  return (
    <>
      <script
        id={`service-schema-${page.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      {faqJsonLd && (
        <script
          id={`faq-schema-${page.slug}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <script
        id={`breadcrumb-${page.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: 'Home', url: '/' },
              { name: page.category, url: `/${page.categorySlug}` },
              { name: page.serviceName, url: canonicalPath },
            ])
          ),
        }}
      />

      <div className="min-h-screen text-slate-900 bg-[#f5fbfb] overflow-x-clip w-full">


    <ServiceHero page={page} />

    

        {/* Main Content with Table of Contents */}
       <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-10">
    
          


    <div className="relative grid grid-cols-1 items-start gap-8 sm:gap-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-16 w-full">
      
            
      {/* MAIN CONTENT */}
            <div className="min-w-0 w-full py-8 sm:py-10 lg:py-12">
              

    <WhoWeAre
      slug={slug}
      heading={page.subheadline ?? `${page.serviceName} for businesses in Pakistan and worldwide`}
    />
              {/* Section Content */}
              
           <SectionContent sections={sections} serviceName={page.serviceName} />

              



                <div className="my-6 flex items-center">
                            <div className="h-px w-full " />
              </div>
              
                 {/* Our Services Section */}
{page.servicesCards && (
  <ServicesSection 
    serviceName={page.serviceName} 
    servicesCards={page.servicesCards} 
  />
)}

{/* Why Choose Us Section */}
{page.differentiators && (
  <WhyChooseUs 
    slug={page.slug} 
    differentiators={page.differentiators} 
  />
)}

              <SolutionsPage />    
              
{/* Launch Readiness Checklist */}
{page.checklist && (
  <EngineeringBaseline 
    serviceName={page.serviceName} 
    checklist={page.checklist} 
  />
)}
              {/* Our Process Section */}
             {page.processPhases && (
  <ProcessSection 
    serviceName={page.serviceName} 
    processPhases={page.processPhases} 
  />
)}

             {/* Tech Stack Section */}

 <TechStackSection />
              {/* Industries Section */}
           {page.industryUseCases && (
                <IndustriesSection industryUseCases={page.industryUseCases} />
              )}




            {page.pricingTiers && (
  <PricingSection 
    serviceName={page.serviceName} 
    pricingTiers={page.pricingTiers} 
  />
              )}
              

              <CeoVision slug={service} />
              
              {/* Generic Tables Section */}
              {page.tables && page.tables.map((table) => (
                <section key={table.title} id={slugify(table.title)} className="scroll-mt-24 pt-16">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-1 rounded-full bg-primary" />
                    <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
                      {table.title}
                    </h2>
                  </div>
                  <div className="mt-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50">
                            {table.headers.map((header) => (
                              <th key={header} className="px-6 py-4 font-semibold text-slate-900 border-b border-slate-200">
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {table.rows.map((row, i) => (
                            <tr key={i} className="hover:bg-slate-50/50 text-sm sm:text-base">
                              {row.map((cell, j) => (
                                <td key={j} className="px-6 py-4 text-gray-900 border-b border-slate-100">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="my-16 flex items-center gap-4">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                  </div>
                </section>
              ))}

             {/*  */}
          {/* Testimonials Section */}

   <TestimonialsSection />


           

              
             

              {/* FAQ Section */}
            {faqs.length > 0 && <FAQSection faqs={faqs} />}

              {/* Resources for this service (T3) */}
              <ServiceResources serviceName={page.serviceName} resources={resources} />

              
           
              
            </div>

            {/* Sticky Table of Contents - stays through full article scroll */}
            <aside className="hidden lg:sticky lg:top-24 lg:block lg:z-10 lg:w-[280px] lg:shrink-0 lg:self-start">
              <div className="py-8 sm:py-10 lg:py-12">
                <TableOfContents items={tocItems} scrollOffset={96} />
              </div>
            </aside>

          </div>
        </div>

      
    
      
        {/* Footer CTA */}
        <CTASectionImage/>
      </div>
    </>
  );
}
