import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { howToGuides, type HowToGuide } from '@/src/lib/how-to';
import { getAllServicePages, getServicePage } from '@/lib/service-pages';
import { ServiceSubpageBreadcrumb } from '@/src/components/landingPage/servicesPage/ServiceSubpageBreadcrumb';
import { subpageInnerPadding, subpageOuterPadding } from '@/src/components/landingPage/servicesPage/subpage-layout';
import { ChecklistCTAHero } from '@/src/components/landingPage/checklist/ChecklistCTAHero';
import { siteConfig, buildPageMetadata } from '@/app/metadata-config';
import WhyChooseUs from '@/src/components/landingPage/home/whyUs';
import MistakeCard from '@/src/components/landingPage/how-to/mistakeCard';
import { EngineeringBaseline } from '@/src/components/landingPage/servicesPage/EngineeringBaseline';
import ProcessHoverSection from '@/src/components/landingPage/how-to/ProcessHoverSection';
import GuideHero from '@/src/components/landingPage/how-to/GuideHero';

type Props = { params: Promise<{ slug: string; service: string }> };

export function generateStaticParams(): { slug: string; service: string }[] {
  // Pre-render how-to pages only for services that have a guide
  return getAllServicePages()
    .filter((p) => !!howToGuides[p.slug])
    .map((p) => ({ slug: p.categorySlug, service: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, service } = await params;
  const guide = howToGuides[service];
  if (!guide) notFound();
  return buildPageMetadata({
    title: guide.title,
    description: `Step-by-step ${guide.title.toLowerCase()} guide from ClickMasters — process, best practices, and expert tips for successful software delivery.`,
    canonical: `${siteConfig.url}/${slug}/${service}/how-to`,
  });
}

// --- Simple inline SVG icons (stateless) ---
const IcoClock = ({ size = 13, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const IcoCheckCircle = ({ size = 13, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);
const IcoAlertTriangle = ({ size = 15, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

function StepCard({ step }: { step: HowToGuide['steps'][number] }) {
  return (
    <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', padding: '28px', border: '1px solid #E4E6EF', borderRadius: 12, background: '#fff' }}>
      <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: step.accent, color: step.iconFg, fontWeight: 800 }}>
          {step.num}
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0, marginBottom: 8 }}>{step.title}</h3>
        <p style={{ marginTop: 6, marginBottom: 12, color: '#5A5A72', lineHeight: 1.6, textAlign: 'justify' }}>{step.body}</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#F2F4F8', border: '1px solid #E4E6EF', padding: '6px 12px', borderRadius: 999, color: '#5A5A72', fontWeight: 600 }}>
            <IcoClock color="#E8692A" /> Duration: {step.duration}
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#F0FDF4', border: '1px solid #A7F3D0', padding: '6px 12px', borderRadius: 999, color: '#059669', fontWeight: 600 }}>
            <IcoCheckCircle color="#059669" /> {step.output}
          </div>
        </div>
      </div>
    </div>
  );
}



export default async function HowToPage({ params }: Props) {
  const { slug, service } = await params;
  const guide = howToGuides[service];
  if (!guide) return notFound();

  const serviceName = guide.title.split(':')[0].replace(/^How to\s+/i, '').trim();
  const servicePage = getServicePage(service);

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <ServiceSubpageBreadcrumb
        crumbs={[
          { label: 'Home', href: '/' },
          {
            label: servicePage?.category ?? slug.replace(/-/g, ' '),
            href: `/${servicePage?.categorySlug ?? slug}`,
          },
          {
            label: servicePage?.serviceName ?? serviceName,
            href: `/${slug}/${service}`,
          },
          { label: 'How-to' },
        ]}
      />

      






      
 <GuideHero 
  guide={guide}
  subpageOuterPadding={subpageOuterPadding}
  subpageInnerPadding={subpageInnerPadding}
/>
      
















      <main>
        <div className={`${subpageOuterPadding} py-20`}>
          <div className={subpageInnerPadding}>
         
         <ProcessHoverSection steps={guide.steps} />

      
         
          <div className="">
  <MistakeCard
   // heading="What to Avoid"
    subtitle="Common mistakes that can hurt your project"
    items={guide.mistakes.map((m) => ({
      title: m.title,
      desc: m.desc,
    }))}
  />
        </div>
         

       
        </div>
        </div>
      </main>
         <div className="-mb-12 ">
            <ChecklistCTAHero
              variant="combined"
              title={`Start ${serviceName} with ClickMasters`}
              description="Fixed-price. 8–16 weeks. Working software every 2 weeks."
              buttons={[{ text: 'Book a Free Consultation', href: '/contact-us', variant: 'primary' }]}
            />
          </div>
    </div>
  );
}
