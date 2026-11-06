import { breadcrumbSchema, metadataConfig } from '@/app/metadata-config';
import SolutionsClient from './SolutionsClient';
import dbConnect from '../../../lib/mongoose';
import Project from '../../../lib/models/Project';
import Link from 'next/link';
import { getPublishedCaseStudyLinks } from '@/src/lib/server-data';

export const metadata = metadataConfig.solutions();

// Rendered per request so the solutions/case-study list is always in the server HTML;
// a build without DB access previously froze an empty page into the cache (T13).
export const dynamic = 'force-dynamic';

export default async function SolutionsPage() {
  let initialProjects: Awaited<ReturnType<typeof Project.find>> = [];

  try {
    await dbConnect();
    initialProjects = await Project.find()
      .populate('category', 'name description showOnHome')
      .sort({ createdAt: -1 })
      .lean();
  } catch (error) {
    console.error('SolutionsPage SSR project fetch failed:', error);
  }

  const caseStudies = await getPublishedCaseStudyLinks();

  return (
    <>
      <script
        id="solutions-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: 'Home', url: '/' },
              { name: 'Software Solutions', url: '/software-solutions' },
            ]),
          ),
        }}
      />
      <SolutionsClient initialProjects={JSON.parse(JSON.stringify(initialProjects))} />

      {/* Server-rendered portfolio: every published case study, linked (T13). */}
      {caseStudies.length > 0 && (
        <section
          aria-labelledby="solutions-case-studies-heading"
          className="mx-auto max-w-[1600px] px-4 pb-20 sm:px-6 lg:px-10"
        >
          <h2 id="solutions-case-studies-heading" className="text-2xl font-semibold text-slate-900 sm:text-3xl">
            Software we have delivered: {caseStudies.length} published case studies
          </h2>
          <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {caseStudies.map((cs) => (
              <li key={cs.href} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                {cs.industry && (
                  <p className="text-xs font-semibold uppercase tracking-widest text-primary">{cs.industry}</p>
                )}
                <h3 className="mt-2 text-lg font-semibold leading-snug text-slate-900">
                  <Link href={cs.href} className="hover:text-primary">
                    {cs.title}
                  </Link>
                </h3>
                {cs.summary && <p className="mt-2 text-sm leading-6 text-slate-700">{cs.summary}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
