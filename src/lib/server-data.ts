/**
 * Server-side, cached CMS reads for pages that must have their content in the
 * server-rendered HTML (T13). SERVER-ONLY — never import from a client component.
 *
 * Results are cached for an hour (matching the site-wide revalidate). Pages that
 * use these are rendered dynamically so a build without database access can never
 * freeze an empty page into the cache.
 */
import { unstable_cache } from 'next/cache';
import dbConnect from '../../lib/mongoose';
import CaseStudy from '../../lib/models/CaseStudy';
import Testimonial from '../../lib/models/Testimonial';
import '../../lib/models/Project';
import '../../lib/models/Category';

export type CaseStudyLink = {
  href: string;
  title: string;
  industry: string;
  summary: string;
};

export type TestimonialText = {
  id: string;
  authorName: string;
  authorRole: string;
  authorCompany: string;
  content: string;
  rating: number;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Same rule as app/(landing)/case-studies/[slug]/page.tsx getCaseStudyCanonicalSlug. */
function caseStudySlug(doc: { slug?: string; title?: string; _id?: unknown }) {
  const stored = typeof doc.slug === 'string' ? doc.slug.trim() : '';
  return stored || slugify(String(doc.title ?? '')) || String(doc._id ?? '');
}

function categoryName(category: unknown): string {
  if (!category) return '';
  if (typeof category === 'string') return '';
  return String((category as { name?: string }).name ?? '');
}

const cachedCaseStudyLinks = unstable_cache(
  async (): Promise<CaseStudyLink[]> => {
    {
      await dbConnect();
      const docs = (await CaseStudy.find({ published: true })
        .select('slug title excerpt results project')
        .populate({ path: 'project', select: 'category', populate: { path: 'category', select: 'name' } })
        .sort({ createdAt: -1 })
        .lean()) as Array<{
        slug?: string;
        title: string;
        excerpt?: string;
        _id: unknown;
        project?: { category?: unknown };
      }>;
      return docs.map((doc) => ({
        href: `/case-studies/${caseStudySlug(doc)}`,
        title: doc.title,
        industry: categoryName(doc.project?.category),
        summary: (doc.excerpt ?? '').replace(/\s+/g, ' ').trim(),
      }));
    }
  },
  ['published-case-study-links'],
  { revalidate: 3600, tags: ['case-studies'] },
);

/** Errors are not cached: a DB outage returns [] for this request only. */
export async function getPublishedCaseStudyLinks(): Promise<CaseStudyLink[]> {
  try {
    return await cachedCaseStudyLinks();
  } catch (error) {
    console.error('getPublishedCaseStudyLinks failed:', error);
    return [];
  }
}

const cachedTestimonials = unstable_cache(
  async (): Promise<TestimonialText[]> => {
    {
      await dbConnect();
      const docs = (await Testimonial.find({ isActive: { $ne: false } })
        .sort({ createdAt: -1 })
        .lean()) as Array<{
        _id: unknown;
        authorName: string;
        authorRole?: string;
        authorCompany?: string;
        content: string;
        rating?: number;
      }>;
      return docs.map((doc) => ({
        id: String(doc._id),
        authorName: doc.authorName,
        authorRole: doc.authorRole ?? '',
        authorCompany: doc.authorCompany ?? '',
        content: doc.content,
        rating: doc.rating ?? 5,
      }));
    }
  },
  ['active-testimonials'],
  { revalidate: 3600, tags: ['testimonials'] },
);

export async function getActiveTestimonials(): Promise<TestimonialText[]> {
  try {
    return await cachedTestimonials();
  } catch (error) {
    console.error('getActiveTestimonials failed:', error);
    return [];
  }
}
