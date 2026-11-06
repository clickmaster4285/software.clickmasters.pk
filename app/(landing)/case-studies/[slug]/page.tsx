import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import mongoose from 'mongoose';
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import CaseStudy from '../../../../lib/models/CaseStudy';
import '../../../../lib/models/Project';
import '../../../../lib/models/Category';
import dbConnect from '../../../../lib/mongoose';
import { resolveImageUrl, getCategoryName } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { articleSchema, breadcrumbSchema, metadataConfig, siteConfig, truncateMetaDescription } from '@/app/metadata-config';

/** Placeholder / test domains must never be linked as a "live product" (T14). */
function isRealProductUrl(url?: string): url is string {
  if (!url) return false;
  try {
    const { hostname, protocol } = new URL(url);
    if (!/^https?:$/.test(protocol)) return false;
    return !/(^|\.)(example(-[a-z]+)?\.(com|org|net)|localhost|127\.0\.0\.1|test|invalid)$/i.test(hostname)
      && !/placeholder|lorem/i.test(url);
  } catch {
    return false;
  }
}
import { TableOfContents } from '@/components/table-of-contents';

type LeanProject = {
  _id?: mongoose.Types.ObjectId;
  title?: string;
  thumbnail?: string;
  url?: string;
  category?: { name?: string } | string;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getCaseStudyCanonicalSlug(doc: {
  slug?: string;
  title?: string;
  _id?: mongoose.Types.ObjectId | string;
}): string {
  const stored = typeof doc.slug === 'string' ? doc.slug.trim() : '';
  if (stored) return stored;

  const fromTitle = slugify(String(doc.title ?? ''));
  if (fromTitle) return fromTitle;

  return String(doc._id ?? '');
}

function toMetaDescription(text: string | undefined, fallback: string): string {
  return truncateMetaDescription(text, fallback);
}

async function findCaseStudyBySlugOrId(slugOrId: string) {
  const normalized = slugify(slugOrId);

  const bySlug = await CaseStudy.findOne({ slug: slugOrId, published: true })
    .populate({
      path: 'project',
      select: 'title thumbnail url category',
      populate: { path: 'category', select: 'name description' },
    })
    .lean();
  if (bySlug) return bySlug;

  if (normalized && normalized !== slugOrId) {
    const byNormalizedSlug = await CaseStudy.findOne({ slug: normalized, published: true })
      .populate({
        path: 'project',
        select: 'title thumbnail url category',
        populate: { path: 'category', select: 'name description' },
      })
      .lean();
    if (byNormalizedSlug) return byNormalizedSlug;
  }

  if (mongoose.Types.ObjectId.isValid(slugOrId)) {
    return CaseStudy.findOne({ _id: slugOrId, published: true })
      .populate({
        path: 'project',
        select: 'title thumbnail url category',
        populate: { path: 'category', select: 'name description' },
      })
      .lean();
  }

  const list = await CaseStudy.find({ published: true }).select('title').lean();
  const match = list.find((d: any) => slugify(String(d?.title ?? '')) === slugOrId);
  if (!match?._id) return null;

  return CaseStudy.findOne({ _id: match._id, published: true })
    .populate({
      path: 'project',
      select: 'title thumbnail url category',
      populate: { path: 'category', select: 'name description' },
    })
    .lean();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  await dbConnect();
  const { slug } = await params;
  const doc = await findCaseStudyBySlugOrId(slug);

  if (!doc) return { title: 'Case study' };

  const cs = doc as { title?: string; excerpt?: string; slug?: string; _id?: mongoose.Types.ObjectId };
  const title = cs.title ?? 'Case study';
  const canonicalSlug = getCaseStudyCanonicalSlug(cs);
  const description = toMetaDescription(
    cs.excerpt,
    `Case study: ${title} custom software delivery by ClickMasters. Web, mobile, SaaS, and enterprise outcomes.`,
  );

  return metadataConfig.caseStudyDetail(title, description, canonicalSlug);
}

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await dbConnect();
  const { slug } = await params;
  const raw = await findCaseStudyBySlugOrId(slug);

  if (!raw) notFound();

  const canonicalSlug = getCaseStudyCanonicalSlug(
    raw as { slug?: string; title?: string; _id?: mongoose.Types.ObjectId },
  );

  if (slug !== canonicalSlug && slugify(slug) !== slugify(canonicalSlug)) {
    redirect(`/case-studies/${encodeURIComponent(canonicalSlug)}`);
  }

  const cs = raw as {
    title: string;
    excerpt: string;
    client?: string;
    technologies?: string[];
    thumbnail?: string;
    status?: string;
    challenge: string;
    approach: string;
    results: string;
    project?: LeanProject;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  const project = cs.project;
  const fallbackThumb =
    project?.thumbnail && typeof project.thumbnail === 'string' ? project.thumbnail : '';
  const heroImage = cs.thumbnail?.trim() ? cs.thumbnail : fallbackThumb;
  const imageSrc = heroImage ? resolveImageUrl(heroImage) : null;
  const categoryName = project?.category
    ? getCategoryName(project.category as string | { _id: string; name: string })
    : '';

  const headingContext = (cs.client?.trim() || project?.title?.trim() || '').slice(0, 60);

  const sections = [
    { id: 'challenge', label: 'Challenge', content: cs.challenge },
    { id: 'approach', label: 'Approach & delivery', content: cs.approach },
    { id: 'results', label: 'Results & impact', content: cs.results },
  ];

  const tocItems = sections.map((s) => ({
    id: s.id,
    title: s.label,
    level: 2 as const,
  }));

  const toIso = (d?: Date | string) => (d ? new Date(d).toISOString() : undefined);
  const caseStudyArticle = articleSchema({
    headline: cs.title,
    description: cs.excerpt,
    url: `${siteConfig.url}/case-studies/${canonicalSlug}`,
    image: heroImage || undefined,
    datePublished: toIso(cs.createdAt),
    dateModified: toIso(cs.updatedAt),
    about: categoryName || undefined,
  });
  const liveProductUrl = isRealProductUrl(project?.url) ? project?.url : undefined;

  return (
    <>
      <script
        id="case-study-article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(caseStudyArticle) }}
      />
      <script
        id="case-study-detail-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: 'Home', url: '/' },
              { name: 'Case Studies', url: '/case-studies' },
              { name: cs.title, url: `/case-studies/${canonicalSlug}` },
            ]),
          ),
        }}
      />

      <main className="min-h-screen bg-slate-50 font-sans text-slate-900 pt-10">
        <article>

          {/* ── Hero header ───────────────────────────────────────────────── */}
          <div className="relative overflow-hidden border-b border-slate-200 bg-white">
            {/* Subtle glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-20 h-[480px] w-[480px] rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(232,83,26,0.07) 0%, transparent 70%)' }}
            />

            <div className="relative mx-auto max-w-8xl px-16 pb-12 pt-16 md:px-8 lg:px-16">
              {/* Back link */}
              <Button variant="ghost" className="-ml-2 mb-8 gap-1.5 text-[13px] text-slate-500 hover:text-primary hover:bg-transparent pl-0" asChild>
                <Link href="/case-studies">
                  <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
                  All case studies
                </Link>
              </Button>

              {/* Category eyebrow */}
              {categoryName && (
                <p className="mb-4 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                  {categoryName}
                </p>
              )}

              {/* Title */}
              <h1 className="max-w-8xl font-display text-3xl font-normal leading-[1.15] tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                {cs.title}
              </h1>

              {/* Client */}
              {cs.client && (
                <p className="mt-3 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                  {cs.client}
                </p>
              )}

              {/* Excerpt */}
              <p className="mt-5 max-w-8xl text-[15px] leading-relaxed text-slate-500">
                {cs.excerpt}
              </p>

              {/* Tech pills */}
              {cs.technologies && cs.technologies.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {cs.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md bg-slate-100 px-2.5 py-1 font-mono text-[11px] font-medium text-gray-900 ring-1 ring-slate-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}

              {/* Live product link */}
              {liveProductUrl && (
                <a
                  href={liveProductUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-7 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-[13px] font-semibold text-primary shadow-sm transition hover:border-primary/30 hover:bg-primary/5"
                >
                  View live product
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                </a>
              )}
            </div>
          </div>

          {/* ── Hero image ────────────────────────────────────────────────── */}
          <div className="border-b border-slate-200 bg-white px-16 md:px-8 lg:px-16 pb-0">
            <div className="mx-auto max-w-8xl">
              <div className="relative aspect-[16/9] overflow-hidden bg-slate-100 rounded-t-2xl border border-b-0 border-slate-200">
                <img
                  src={imageSrc || "/placeholder.svg"}
                  alt={`${cs.title} case study hero image`}
                  className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                />
              </div>
            </div>
          </div>

          {/* ── Section nav strip ─────────────────────────────────────────── */}
          <div className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
            <div className="mx-auto flex max-w-8xl gap-0 overflow-x-auto px-16 md:px-8 lg:px-16">
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="shrink-0 border-b-2 border-transparent px-4 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 transition hover:border-primary hover:text-primary"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* ── Content sections ──────────────────────────────────────────── */}
          <div className="mx-auto max-w-8xl px-16 md:px-8 lg:px-16 py-14">
            <div className="grid gap-0 lg:grid-cols-[1fr_280px] lg:gap-16">

              {/* Main content */}
              <div className="min-w-0">
                {sections.map((s, i) => (
                  <section
                    key={s.id}
                    id={s.id}
                    className={`scroll-mt-28 ${i < sections.length - 1 ? 'mb-14 border-b border-slate-200 pb-14' : 'mb-0'}`}
                  >
                    {/* Section label */}
                    <p className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                      {String(i + 1).padStart(2, '0')} {s.label}
                    </p>
                    <h2 className="font-display text-2xl font-normal text-slate-950 sm:text-3xl">
                      {/* Page-specific H2 (T15): prefix the shared label with the client / project context */}
                      {s.label}{headingContext ? ` — ${headingContext}` : ''}
                    </h2>
                    <div className="mt-5 whitespace-pre-wrap text-[15px] leading-[1.8] text-slate-900">
                      {s.content}
                    </div>
                  </section>
                ))}
              </div>

              {/* Sidebar visible on lg+ */}
              <aside className="hidden lg:block">
                <div className="sticky top-24">
                  <TableOfContents items={tocItems} title="Case Study Navigation" />
                </div>
              </aside>

            </div>
          </div>

          {/* ── Footer CTA ────────────────────────────────────────────────── */}
          <section className="border-t border-slate-200 bg-slate-950 px-16 md:px-8 lg:px-16 py-14">
            <div className="mx-auto flex max-w-8xl flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
              <div>
                <h3 className="font-display text-2xl font-normal leading-snug text-white sm:text-3xl">
                  Ready to discuss your{' '}
                  <em className="italic text-primary/80">initiative?</em>
                </h3>
                <p className="mt-2 max-w-lg text-[14px] leading-relaxed text-slate-400">
                  We scope, build, and ship tell us what you&apos;re working on and we&apos;ll
                  share relevant references.
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                <Button
                  asChild
                  className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-orange-50 transition"
                >
                  <Link href="/contact-us">
                    Start the conversation
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="rounded-lg border-slate-700 bg-transparent px-6 py-3 text-sm font-semibold text-slate-300 hover:border-slate-500 hover:text-white transition"
                >
                  <Link href="/case-studies">
                    <ArrowLeft className="mr-2 h-4 w-4" aria-hidden />
                    All case studies
                  </Link>
                </Button>
              </div>
            </div>
          </section>

        </article>
      </main>
    </>
  );
}