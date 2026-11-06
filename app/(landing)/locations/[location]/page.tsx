// app/locations/[location]/page.tsx
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { siteConfig, buildPageMetadata, stripBrandSuffix } from '@/app/metadata-config';
import { getCountryData, getAllCountrySlugs } from '@/lib/country';
import Link from 'next/link';
import { servicesByCountry, buildCountryServiceSlugMap, deriveServiceName } from '@/lib/country-services';

import { ProcessSection } from '@/src/components/landingPage/servicesPage/ProcessSection';
import FeaturedInsights from '@/src/components/landingPage/home/FeaturedInsights';

import TechStackSection from '@/src/components/landingPage/home/TechStackSection';

import ProjectCTAHero from '@/src/components/landingPage/location/ProjectCTAHero';
import WhyChooseUs from '@/src/components/landingPage/home/whyUs';
import TrustedClientsSection from '@/src/components/landingPage/home/TrustedClientsSection';
import PainPointsSolutions from '@/src/components/landingPage/home/PainPointsSolutions';
import SolutionsPage from '@/src/components/landingPage/home/Solutions';
import CountryServicesSection from '@/src/components/landingPage/location/CountryServicesSection';
import { HeroSection } from '@/src/components/landingPage/location/LocationHero';
import CTASectionImage from '@/src/components/landingPage/home/CTASectionImage';
import FaqSection from '@/src/components/landingPage/location/FaqSection';
import { ChecklistCTAHero } from '@/src/components/landingPage/checklist/ChecklistCTAHero';
import { PricingSection } from '@/src/components/landingPage/servicesPage/PricingSection';
import { TestimonialsSection } from '@/src/components/landingPage/home/TestimonialsSection';
import TrustedBySection from '@/src/components/landingPage/home/TrustedBySection';
import { StatsCard } from '@/src/components/landingPage/location/StatsCard';
import { countryHubHreflangAlternates } from '@/src/lib/hreflang';
//import WorldMapHero from '@/src/components/landingPage/location/AnimatedPins';


type Props = { params: Promise<{ location: string }> };

// Generate static paths
export async function generateStaticParams() {
  const slugs = getAllCountrySlugs();
  return slugs.map((location) => ({ location }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { location } = await params;
  const country = getCountryData(location);

  if (!country) notFound();

  return buildPageMetadata({
    title: stripBrandSuffix(country.title),
    description: country.description,
    canonical: `${siteConfig.url}/locations/${location}`,
    robots: { index: true, follow: true },
    languages: countryHubHreflangAlternates(),
  });
}

export default async function CountryPage({ params }: Props) {
  const { location } = await params;

  const country = getCountryData(location);

  if (!country) {
    notFound();
  }


  // ✅ EXTRACT PRICING FROM SERVICES ONLY
 const countryPricingTiers =
  servicesByCountry[country.name]?.[0]?.countryPricingTiers || [];

const serviceData = servicesByCountry[country.name] || [];
  const faqs = serviceData.flatMap(service => service.faqs);
 const countryFaqs =
  servicesByCountry[country.name]?.[0]?.faqs || [];

  
  // Map service display names to actual slugs from country-services data
  const serviceSlugMap = buildCountryServiceSlugMap(country.name, location);

  // T2 — every country service page (same data as {country}-services-sitemap.xml)
  const allCountryServices = serviceData
    .map((service) => ({ name: deriveServiceName(service), href: `/locations/${location}/${service.slug}` }))
    .filter((s, i, arr) => arr.findIndex((x) => x.href === s.href) === i)
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="min-h-screen w-full overflow-x-clip">
      {/* HERO */}
      <HeroSection country={country} location={location} />
      <StatsCard country={country}  />
<TrustedBySection/>
      

      {/* <StatsCard country={country}/> */}
      {/* <WorldMapHero/> */}
      <PainPointsSolutions countryName={country.name} />

      {/* SERVICES */}
      <CountryServicesSection
        countryName={country.name}
        location={location}
        servicesByCategory={country.servicesByCategory}
        
        serviceSlugMap={serviceSlugMap}
      />


      {/* All services A–Z: server-rendered links to every country service page (T2) */}
      {allCountryServices.length > 0 && (
        <section
          aria-labelledby="all-country-services-heading"
          className="mx-auto max-w-[1600px] px-4 py-16 sm:px-6 lg:px-10"
        >
          <h2 id="all-country-services-heading" className="text-2xl font-semibold text-slate-900 sm:text-3xl">
            All software development services in {country.name}
          </h2>
          <ul className="mt-8 grid grid-cols-1 gap-x-8 gap-y-2.5 text-[15px] sm:grid-cols-2 lg:grid-cols-4">
            {allCountryServices.map((s) => (
              <li key={s.href}>
                <Link href={s.href} className="text-slate-800 underline-offset-4 hover:text-primary hover:underline">
                  {s.name} in {country.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* OTHER SECTIONS */}
      <TrustedClientsSection />
 
      <SolutionsPage />

      <WhyChooseUs />

      {/* <ProjectCTAHero
        variant="combined"
        badge="Build Your Project"
        title="Ready to Transform Your Business? Let's Build Something Amazing Together"
        description="Get started with a free consultation..."
        location={location}
        buttons={[
          { text: "Book Free Consultation", href: `/contact-us?location=${location}`, variant: "primary" },
          { text: "Call Us Now", href: "tel:+1234567890", variant: "outline" },
        ]}
        sliderCards={[
          { title: "100+", subtitle: "Projects Delivered" },
          { title: "Agile", subtitle: "Development" },
          { title: "On-time", subtitle: "Delivery" },
          { title: "24/7", subtitle: "Support" },
          { title: "50+", subtitle: "Happy Clients" },
        ]}
      /> */}

      <div className="px-0">
        <PricingSection
          serviceName={`Software Development in ${country.name}`}
          pricingTiers={countryPricingTiers}
        />
      </div>





   



      <TechStackSection />
      <FeaturedInsights />
    

     <TestimonialsSection />

    
       <FaqSection
  faqs={countryFaqs}
  location={location}
  title="Frequently Asked Questions"
  subtitle="Answers before you start"
/>
     

     {/* <div className="lg:-mb-12"> <ChecklistCTAHero
        title={`Looking for a reliable software development company in ${country.name}?`}
        description="Let's build something amazing together"
        buttons={[
          { text: "Start Your Project", href: `/contact-us?location=${location}`, variant: "primary" },
          { text: "Book Free Consultation", href: "#services", variant: "outline" },
        ]}
      /></div> */}


     <CTASectionImage />
      
    </div>
  );
}