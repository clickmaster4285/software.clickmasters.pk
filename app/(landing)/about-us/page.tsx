import About from "@/src/components/landingPage/AboutPage/About";
import { breadcrumbSchema, metadataConfig } from '@/app/metadata-config';

export const metadata = metadataConfig.about();

export default function AboutPage() {
  return (
    <>
      <script
        id="about-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: 'Home', url: '/' },
              { name: 'About Us', url: '/about-us' },
            ]),
          ),
        }}
      />
      <About />
    </>
  );
}
