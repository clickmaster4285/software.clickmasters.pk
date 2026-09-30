import dynamic from 'next/dynamic';
import { Suspense } from "react";
import SchemaMarkup from '@/components/SchemaMarkup';
import { FaqSection } from '@/components/landingPage/home/FaqSection';
import { LandingHomeDeferredHeavy } from '@/components/landingPage/home/LandingHomeDeferredHeavy';
import { HeroSection } from '@/components/landingPage/home/hero-section';
import { RobotMascot } from '@/components/ui/RobotMascot';
import {  LucideIcon,} from 'lucide-react';
import {
  homepageFaqSchema,
  organizationSchema,
  homepageServiceSchema,
  webSiteSchema,
  metadataConfig,
} from '@/app/metadata-config';
import TrustedBySection from '@/src/components/landingPage/home/TrustedBySection';
import TrustedClientsSection from '@/src/components/landingPage/home/TrustedClientsSection';
import TechStackSection from '@/src/components/landingPage/home/TechStackSection';
import { CaseStudySection } from '@/src/components/landingPage/servicesPage/CaseStudySection';
import ProcessPage from '@/src/components/landingPage/home/ProcessPage';
import PainPointsSolutions from '@/src/components/landingPage/home/PainPointsSolutions';
import SolutionsPage from '@/src/components/landingPage/home/Solutions';
import FeaturedInsights from '@/src/components/landingPage/home/FeaturedInsights';
import ExploreSection from '@/src/components/landingPage/home/ExploreSection';
import {ProjectCTAHero} from '@/src/components/landingPage/home/info-cts';
import CTASectionImage from '@/src/components/landingPage/home/CTASectionImage';
import WhyChooseUs from '@/src/components/landingPage/home/whyUs';
import HelpSection from '@/src/components/landingPage/home/help-section';
import { FinalCTA } from '@/src/components/landingPage/home/finalCta';
import { TestimonialsSection } from '@/src/components/landingPage/home/TestimonialsSection';
import CertificationsSection from '@/src/components/landingPage/home/Certifications';

export const metadata = metadataConfig.home();

type HomeExploreLink = {
  href: string;
  title: string;
  desc: string;
  ariaLabel: string;
  icon?: LucideIcon;
  color?: string;
  highlight?: boolean;
};

const homeExploreLinks: HomeExploreLink[] = [
  {
    href: '/software-solutions',
    title: 'Services overview',
    desc: 'Full list of development capabilities.',
    ariaLabel: 'Open the services overview page listing all development capabilities.',
  },
  {
    href: '/software-development/custom-software-development',
    title: 'Custom Software Development',
    desc: 'End-to-end product delivery.',
    ariaLabel: 'Learn about custom software development and end-to-end product delivery.',
  },
  {
    href: '/web-development/web-application-development',
    title: 'Web Application Development',
    desc: 'SPAs, dashboards, portals.',
    ariaLabel: 'Explore web application development for SPAs, dashboards, and portals.',
  },
  {
    href: '/mobile-development/mobile-app-development',
    title: 'Mobile App Development',
    desc: 'Native + cross-platform builds.',
    ariaLabel: 'Read about native and cross-platform mobile app development.',
  },
  {
    href: '/database-services/database-design',
    title: 'Database Design & Management',
    desc: 'Modeling, migrations, tuning.',
    ariaLabel: 'See database design and management services including modeling and tuning.',
  },
  {
    href: '/cloud-and-devops/cloud-solutions',
    title: 'Cloud Solutions & DevOps',
    desc: 'CI/CD, containers, observability.',
    ariaLabel: 'Discover cloud solutions and DevOps services including CI/CD and observability.',
  },
  {
    href: '/cybersecurity/cybersecurity-services',
    title: 'Cybersecurity & Compliance',
    desc: 'Secure SDLC + audit readiness.',
    ariaLabel: 'Review cybersecurity and compliance offerings and secure SDLC practices.',
  },
  {
    href: '/case-studies',
    title: 'Case studies',
    desc: 'Proof of delivery & outcomes.',
    ariaLabel: 'Browse case studies with proof of delivery and client outcomes.',
  },
  {
    href: '/software-solutions',
    title: 'Software solutions',
    desc: 'Portfolio by industry.',
    ariaLabel: 'View software solutions portfolio organized by industry.',
  },
  {
    href: '/testimonials',
    title: 'Client testimonials',
    desc: 'What businesses say after launch.',
    ariaLabel: 'Read client testimonials from businesses after product launch.',
  },
  {
    href: '/blog',
    title: 'Blog insights',
    desc: 'Engineering best practices.',
    ariaLabel: 'Open the engineering blog for best practices and technical insights.',
  },
  {
    href: '/about-us',
    title: 'About ClickMasters',
    desc: 'Team, values, and approach.',
    ariaLabel: 'Learn about the ClickMasters team, values, and delivery approach.',
  },
  {
    href: '/contact-us',
    title: 'Contact us',
    desc: 'Get a free consultation.',
    ariaLabel: 'Go to the contact page to request a free consultation.',
    highlight: true,
  },
];

const AboutSection = dynamic(
  () => import('@/components/landingPage/home/AboutSection'),
  {
    loading: () => (
      <div className="h-96 animate-pulse rounded-lg bg-gray-100" />
    ),
  }
);

const AppsSection = dynamic(
  () =>
    import('@/components/landingPage/home/AppsSection').then(
      (m) => m.AppsSection
    ),
  {
    loading: () => (
      <div className="h-96 animate-pulse rounded-lg bg-gray-100" />
    ),
  }
);

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-x-clip">
      <SchemaMarkup data={organizationSchema} />
      <SchemaMarkup data={homepageServiceSchema} />
      <SchemaMarkup data={homepageFaqSchema} />
      <SchemaMarkup data={webSiteSchema} />

       <div className="min-h-screen">  <HeroSection /> </div>
       


      {/* Content - starts TRANSPARENT, becomes white as you scroll */}
      <div className="relative z-20 w-full overflow-x-clip">
        
        {/* White background starts building from here */}
        <div className="">
          
          <Suspense fallback={<div className="h-96 animate-pulse rounded-lg bg-gray-100" />}>
            <AboutSection />
          </Suspense>

        
          

          <Suspense fallback={<div className="h-96 animate-pulse rounded-lg bg-gray-100" />}>
            <PainPointsSolutions />
          </Suspense>

          <ExploreSection />


         

          <Suspense fallback={<div className="h-96 animate-pulse rounded-lg bg-white lg:px-10" />}>
            <TrustedClientsSection />
          </Suspense>

          <Suspense fallback={<div className="h-96 animate-pulse rounded-lg bg-gradient-to-b from-white to-gray-50" />}>
            <FeaturedInsights />
          </Suspense>

          <Suspense fallback={<div className="h-96 animate-pulse rounded-lg bg-white" />}>
            <SolutionsPage />
          </Suspense>

          

          <Suspense fallback={<div className="h-96 animate-pulse rounded-lg bg-gray-100" />}>
            <TechStackSection />
          </Suspense>


          <Suspense fallback={<div className="h-96 animate-pulse rounded-lg bg-gray-100" />}>
            <ProcessPage />
          </Suspense>

 <CertificationsSection />
   <TestimonialsSection />


          
          <Suspense fallback={<div className="h-96 animate-pulse rounded-lg bg-gray-100" />}>
            <WhyChooseUs />
          </Suspense>




              <FaqSection />
        

          <Suspense fallback={<div className="h-96 animate-pulse rounded-lg bg-gray-100" />}>
            <HelpSection />
          </Suspense>

       
          <CTASectionImage/>
          
        </div>
      </div>

    </main>
  );
}
