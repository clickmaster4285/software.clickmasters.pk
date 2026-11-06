import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import mongoose from 'mongoose';
import { ArrowLeft, Clock3, RefreshCcw, ExternalLink } from 'lucide-react';
import BlogPost from '../../../../lib/models/BlogPost';
import dbConnect from '../../../../lib/mongoose';
import { calculateReadTimeText } from '../../../../src/lib/readTime';
import { resolveImageUrl } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import BlogToc from '@/components/blog/BlogToc';
import { RelatedServiceCallout } from '@/components/blog/RelatedServiceCallout';
import { findServiceForSlug } from '@/lib/service-nav';
import BlogCta from '@/components/blog/BlogCta'; // Import the Client Component
import BlogFaqSection from '@/components/blog/BlogFaqSection';
import BlogRelatedSlider, { type RelatedBlogCard } from '@/components/blog/BlogRelatedSlider';
import { breadcrumbSchema, siteConfig, buildPageMetadata, truncateMetaDescription, stripBrandSuffix, truncateHeading } from '@/app/metadata-config';

const BlogPostModel = BlogPost as any;

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function stripTags(value: string) {
  return value
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function buildContentWithToc(html: string) {
  const headingCounts: Record<string, number> = {};
  const seenHeadingTexts = new Set<string>();
  const toc: Array<{ id: string; text: string; level: 1 | 2 | 3 }> = [];
  const isLikelyParagraph = (rawInner: string, text: string) => {
    const hasManyBreaks = (rawInner.match(/<br\s*\/?>/gi) || []).length >= 2;
    const hasBlockChildren = /<(p|div|ul|ol|li|table|section|article|blockquote)\b/i.test(rawInner);
    const isVeryLong = text.length > 140;
    return hasManyBreaks || hasBlockChildren || isVeryLong;
  };

  const withIds = html.replace(
    /<(h[1-3])([^>]*)>([\s\S]*?)<\/\1>/gi,
    (_m, tag: string, attrs: string, inner: string) => {
      let normalizedTag = tag;
      const text = stripTags(inner);
      if (!text) return _m;
      let level = parseInt(normalizedTag[1]) as 1 | 2 | 3;
      if (level === 1) {
        normalizedTag = 'h2';
        level = 2;
      }
      if (level > 2) return _m;
      
      if (isLikelyParagraph(inner, text)) return _m;
      
      const normalizedText = text.toLowerCase();
      if (seenHeadingTexts.has(normalizedText)) return _m;
      seenHeadingTexts.add(normalizedText);

      const base = slugify(text) || 'section';
      headingCounts[base] = (headingCounts[base] || 0) + 1;
      const generatedId = headingCounts[base] > 1 ? `${base}-${headingCounts[base]}` : base;
      const existingIdMatch = attrs.match(/\sid\s*=\s*["']([^"']+)["']/i);
      const existingIdRaw = existingIdMatch?.[1]?.trim() || '';
      const id = slugify(existingIdRaw) || generatedId;

      toc.push({ id, text, level });

      if (existingIdMatch) {
        const normalizedAttrs = attrs.replace(/\sid\s*=\s*["'][^"']*["']/i, ` id="${id}"`);
        return `<${normalizedTag}${normalizedAttrs}>${inner}</${normalizedTag}>`;
      }
      return `<${normalizedTag}${attrs} id="${id}">${inner}</${normalizedTag}>`;
    }
  );

  return { html: withIds, toc };
}

function toMetaDescription(text: string | undefined, fallback: string): string {
  return truncateMetaDescription(text, fallback);
}

function formatDate(value?: string) {
  if (!value) return '';
  return new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

type FaqItem = {
  question: string;
  answer: string;
};

function extractFaqItemsFromHtml(html: string): FaqItem[] {
  const faqHeadingMatch = /<h[1-3][^>]*>\s*Frequently Asked Questions\s*<\/h[1-3]>/i.exec(html);
  if (!faqHeadingMatch) return [];

  const afterFaq = html.slice(faqHeadingMatch.index + faqHeadingMatch[0].length);
  const pairRegex = /<h3[^>]*>([\s\S]*?)<\/h3>\s*<p[^>]*>([\s\S]*?)<\/p>/gi;
  const items: FaqItem[] = [];
  let match: RegExpExecArray | null = pairRegex.exec(afterFaq);

  while (match && items.length < 10) {
    const question = stripTags(match[1] || '').trim();
    const answer = stripTags(match[2] || '').trim();
    if (!question || !answer) {
      match = pairRegex.exec(afterFaq);
      continue;
    }
    items.push({ question, answer });
    match = pairRegex.exec(afterFaq);
  }

  return items;
}

async function findPostBySlugOrId(slugOrId: string) {
  const normalized = slugify(slugOrId);

  let bySlug = await BlogPostModel.findOne({ slug: slugOrId, published: true }).lean();
  if (bySlug) return bySlug;

  if (normalized && normalized !== slugOrId) {
    bySlug = await BlogPostModel.findOne({ slug: normalized, published: true }).lean();
    if (bySlug) return bySlug;
  }

  if (mongoose.Types.ObjectId.isValid(slugOrId)) {
    return BlogPostModel.findOne({ _id: slugOrId, published: true }).lean();
  }

  const list = await BlogPostModel.find({ published: true }).select('title').lean();
  const match = list.find((d: { title?: string }) => slugify(String(d?.title ?? '')) === slugOrId);
  if (!match?._id) return null;
  return BlogPostModel.findOne({ _id: match._id, published: true }).lean();
}

async function findRelatedByCategory(category: string, excludeId: string): Promise<RelatedBlogCard[]> {
  const cat = category.trim();
  if (!cat || !mongoose.Types.ObjectId.isValid(excludeId)) return [];

  const excludeObjectId = new mongoose.Types.ObjectId(excludeId);

  const rows = await BlogPostModel.find({
    published: true,
    category: cat,
    _id: { $ne: excludeObjectId },
  })
    .sort({ createdAt: -1 })
    .limit(12)
    .select('title excerpt slug thumbnail category readTimeMinutes createdAt')
    .lean();

  return JSON.parse(JSON.stringify(rows)) as RelatedBlogCard[];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  await dbConnect();
  const { slug } = await params;
  const normalized = slugify(slug);

  let doc = await BlogPostModel.findOne({ slug, published: true }).select('title excerpt').lean();
  if (!doc && normalized && normalized !== slug) {
    doc = await BlogPostModel.findOne({ slug: normalized, published: true }).select('title excerpt').lean();
  }
  if (!doc && mongoose.Types.ObjectId.isValid(slug)) {
    doc = await BlogPostModel.findOne({ _id: slug, published: true }).select('title excerpt').lean();
  }
  if (!doc) return { title: 'Blog post' };

  const d = doc as { title?: string; excerpt?: string };
  const title = stripBrandSuffix(d.title ?? 'Blog post');
  const description = toMetaDescription(
    d.excerpt,
    `Software development insights from ClickMasters: ${title}. Custom software, SaaS, and engineering best practices.`,
  );
  return buildPageMetadata({
    title,
    description,
    canonical: `${siteConfig.url}/blog/${slug}`,
  });
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await dbConnect();
  const { slug } = await params;
  const raw = await findPostBySlugOrId(slug);
  if (!raw) notFound();

  const post = raw as {
    title: string;
    excerpt: string;
    content: string;
    readTimeMinutes?: number;
    author?: string;
    authorLinkedin?: string;
    authorImage?: string;
    thumbnail?: string;
    category?: string;
    faqHeading?: string;
    tags?: string[];
    faqs?: Array<{ question?: string; answer?: string }>;
    createdAt?: string;
    updatedAt?: string;
  };
  const imageSrc = post.thumbnail?.trim() ? resolveImageUrl(post.thumbnail) : '/placeholder.svg';
  const htmlContent = post.content?.trim() ? post.content : '<p>No content added yet.</p>';
  const { html: htmlWithIds, toc } = buildContentWithToc(htmlContent);
  const faqItems =
    Array.isArray(post.faqs) && post.faqs.length > 0
      ? post.faqs
          .map((item) => ({
            question: typeof item?.question === 'string' ? item.question.trim() : '',
            answer: typeof item?.answer === 'string' ? item.answer.trim() : '',
          }))
          .filter((item) => item.question && item.answer)
      : extractFaqItemsFromHtml(htmlContent);
  const faqSectionHeading = post.faqHeading?.trim() || 'Frequently Asked Questions';
  const tocItems = faqItems.length
    ? [...toc, { id: 'faq-section', text: faqSectionHeading, level: 2 as const }]
    : toc;
  const readTime =
    typeof post.readTimeMinutes === 'number' && Number.isFinite(post.readTimeMinutes) && post.readTimeMinutes > 0
      ? `${Math.ceil(post.readTimeMinutes)} min read`
      : calculateReadTimeText({
          html: htmlContent,
          fallbackParts: [post.title, post.excerpt],
        });
  const displayAuthor = post.author?.trim() || 'ClickMasters Team';
  const authorLinkedinUrl = post.authorLinkedin?.trim() || '';
  const authorImageUrl = post.authorImage?.trim() ? resolveImageUrl(post.authorImage) : '';
  const publishedDate = formatDate(post.createdAt);
  const updatedDate = formatDate(post.updatedAt);

  // T7 — link service-topic posts to the matching commercial service page
  const relatedService = findServiceForSlug(slug);

  const currentId = String((raw as { _id?: mongoose.Types.ObjectId })._id ?? '');
  const categoryTrimmed = post.category?.trim() ?? '';
  const relatedPosts =
    currentId && categoryTrimmed ? await findRelatedByCategory(categoryTrimmed, currentId) : [];

  return (
    <>
      <script
        id="blog-detail-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: 'Home', url: '/' },
              { name: 'Blog', url: '/blog' },
              { name: post.title, url: `/blog/${slug}` },
            ]),
          ) || "",
        }}
      />
      <script
        id="blog-detail-article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.excerpt,
            articleSection: post.category || undefined,
            keywords: post.tags?.join(', ') || undefined,
            author: {
              '@type': 'Person',
              name: displayAuthor,
              sameAs: authorLinkedinUrl || undefined,
            },
            publisher: {
              '@type': 'Organization',
              name: 'ClickMasters',
              url: 'https://software.clickmasters.pk',
            },
            datePublished: post.createdAt || undefined,
            dateModified: post.updatedAt || post.createdAt || undefined,
            mainEntityOfPage: `https://software.clickmasters.pk/blog/${encodeURIComponent(slug)}`,
            image: imageSrc,
          }) || "",
        }}
      />
      <div className="min-h-screen bg-[#f5f6f8] pt-20 text-slate-900">
        <article>
          <div className="border-b border-slate-200/80 bg-white">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
              <Button variant="ghost" className="-ml-2 mb-6 gap-2 text-slate-900" asChild>
                <Link href="/blog">
                  <ArrowLeft className="h-4 w-4" />
                  All posts
                </Link>
              </Button>
              <h1 className="max-w-4xl font-display text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                {truncateHeading(stripBrandSuffix(post.title))}
              </h1>
              <div className="mt-6 flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  {authorImageUrl ? (
                    <img
                      src={authorImageUrl}
                      alt={displayAuthor}
                      className="h-10 w-10 rounded-full border border-slate-200 object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {displayAuthor
                        .split(/\s+/)
                        .slice(0, 2)
                        .map((part: string) => part.charAt(0).toUpperCase())
                        .join('')}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{displayAuthor}</p>
                    <p className="text-xs text-slate-500">Author</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-900">
                  {authorLinkedinUrl ? (
                    <a
                      href={authorLinkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 hover:border-primary/40 hover:text-primary"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      LinkedIn
                    </a>
                  ) : null}
                  <span className="inline-flex items-center gap-1">
                    <Clock3 className="h-3.5 w-3.5" />
                    {readTime}
                  </span>
                  {updatedDate ? (
                    <span className="inline-flex items-center gap-1">
                      <RefreshCcw className="h-3.5 w-3.5" />
                      Updated {updatedDate}
                    </span>
                  ) : null}
                  {publishedDate ? <span>Published {publishedDate}</span> : null}
                </div>
              </div>
            </div>
          </div>

          {/* 2-Column Layout with proper stickiness */}
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
              
              {/* Left Column - Content (8 columns) */}
              <div className="lg:col-span-8">
                <img
                  src={imageSrc}
                  alt={post.title}
                  width={1200}
                  height={630}
                  fetchPriority="high"
                  className="mb-10 w-full max-h-[420px] rounded-2xl border border-slate-200/90 object-cover shadow-sm"
                />
                {relatedService && (
                  <RelatedServiceCallout
                    serviceName={relatedService.item.title}
                    href={relatedService.item.href}
                    position="top"
                  />
                )}
                <section
                  className="blog-content prose prose-slate max-w-none prose-headings:font-display prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-headings:text-slate-900 prose-p:text-slate-900 prose-p:leading-8 prose-li:text-slate-900 prose-a:text-primary prose-blockquote:border-l-primary prose-img:rounded-xl prose-img:border prose-img:border-slate-200 prose-img:shadow-sm"
                  dangerouslySetInnerHTML={{ __html: htmlWithIds }}
                />
                <BlogFaqSection title={faqSectionHeading} items={faqItems} />
                {relatedService && (
                  <RelatedServiceCallout
                    serviceName={relatedService.item.title}
                    href={relatedService.item.href}
                    position="bottom"
                  />
                )}
              </div>

              {/* Right Column - Sidebar (4 columns) */}
              <aside className="lg:col-span-4 lg:self-start lg:sticky lg:top-24">
                <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <BlogToc items={tocItems} />
                </div>
                <BlogCta />
              </aside>
            </div>
          </div>
          {relatedPosts.length > 0 && categoryTrimmed ? (
            <div className="w-full px-4 pb-12 sm:px-6 lg:px-8">
              <BlogRelatedSlider posts={relatedPosts} categoryLabel={categoryTrimmed} />
            </div>
          ) : null}
        </article>
      </div>
      <style>{`
        .blog-content font[size='1'] {
          font-size: 0.75rem;
        }
        .blog-content font[size='2'] {
          font-size: 0.875rem;
        }
        .blog-content font[size='3'] {
          font-size: 1rem;
        }
        .blog-content font[size='4'] {
          font-size: 1.125rem;
        }
        .blog-content font[size='5'] {
          font-size: 1.25rem;
        }
        .blog-content font[size='6'] {
          font-size: 1.5rem;
        }
        .blog-content font[size='7'] {
          font-size: 1.875rem;
        }
        .blog-content h1,
        .blog-content h2,
        .blog-content h3 {
          scroll-margin-top: 96px;
        }
        .toc-active-heading-pulse {
          animation: heading-pulse 0.9s ease-in-out;
        }
        @keyframes heading-pulse {
          0% {
            background-color: transparent;
          }
          50% {
            background-color: rgba(249, 115, 22, 0.1);
          }
          100% {
            background-color: transparent;
          }
        }
      `}</style>
    </>
  );
}