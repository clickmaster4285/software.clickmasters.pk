import { breadcrumbSchema, metadataConfig } from '@/app/metadata-config';
import CaseStudy from '../../../lib/models/CaseStudy';
import '../../../lib/models/Project';
import '../../../lib/models/Category';
import dbConnect from '../../../lib/mongoose';
import CaseStudiesClient, { type CaseStudyCard } from './CaseStudiesClient';

export const metadata = metadataConfig.caseStudies();

// Per-request render: never freeze a build-time empty list into the cache (T13).
export const dynamic = 'force-dynamic';

export default async function CaseStudiesPage() {
  let initialCaseStudies: CaseStudyCard[] = [];

  try {
    await dbConnect();
    const raw = await CaseStudy.find({ published: true })
      .populate({
        path: 'project',
        select: 'title description thumbnail url category status',
        populate: { path: 'category', select: 'name description' },
      })
      .sort({ createdAt: -1 })
      .lean();

    initialCaseStudies = JSON.parse(JSON.stringify(raw)) as CaseStudyCard[];
  } catch (err) {
    console.error('CaseStudiesPage Error:', err);
    // DB unavailable during build or at runtime client will refetch from /api/case-studies
  }

  return (
    <>
      <script
        id="case-studies-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: 'Home', url: '/' },
              { name: 'Case Studies', url: '/case-studies' },
            ]),
          ),
        }}
      />
      <CaseStudiesClient initialCaseStudies={initialCaseStudies} />
    </>
  );
}
