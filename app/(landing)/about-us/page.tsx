import About from "@/src/components/landingPage/AboutPage/About";
import Link from 'next/link';
import { breadcrumbSchema, metadataConfig } from '@/app/metadata-config';
import { getAllHireUsPages } from '@/lib/hire-us-pages';

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
      {/* Open item #6 — server-rendered links to every /hire page */}
      <section aria-labelledby="hire-developers-heading" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 id="hire-developers-heading" className="text-2xl font-semibold text-slate-900 sm:text-3xl">
          Hire developers from ClickMasters
        </h2>
        <ul className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
          {getAllHireUsPages().map((page) => (
            <li key={page.slug}>
              <Link
                href={`/hire/${page.slug}`}
                className="text-[15px] font-medium text-slate-900 underline-offset-4 hover:text-primary hover:underline"
              >
                {page.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
