'use client';

import Link from 'next/link';
import { useMemo, type CSSProperties } from 'react';
import { ArrowRight } from 'lucide-react';
import { resolveImageUrl } from '@/lib/utils';
import { calculateReadTimeText } from '@/lib/readTime';

export type RelatedBlogCard = {
  _id: string;
  slug?: string;
  title: string;
  excerpt: string;
  thumbnail?: string;
  category?: string;
  readTimeMinutes?: number;
  content?: string;
  createdAt?: string;
};

function postHref(post: RelatedBlogCard) {
  const slug = typeof post.slug === 'string' && post.slug.trim() ? post.slug.trim() : String(post._id);
  return `/blog/${encodeURIComponent(slug)}`;
}

function thumb(post: RelatedBlogCard) {
  return post.thumbnail?.trim() ? resolveImageUrl(post.thumbnail) : '/placeholder.svg';
}

function readLabel(post: RelatedBlogCard) {
  if (typeof post.readTimeMinutes === 'number' && Number.isFinite(post.readTimeMinutes) && post.readTimeMinutes > 0) {
    return `${Math.ceil(post.readTimeMinutes)} min`;
  }
  return calculateReadTimeText({
    html: post.content,
    fallbackParts: [post.title, post.excerpt],
  });
}

function MiniRelatedCard({ post, duplicate }: { post: RelatedBlogCard; duplicate?: boolean }) {
  return (
    <Link
      href={postHref(post)}
      tabIndex={duplicate ? -1 : undefined}
      className="group flex h-[1300px] w-[280px] shrink-0 flex-col overflow-hidden rounded-xl border border-slate-200/90 p-2.5 shadow-sm transition hover:border-primary/35 hover:shadow-md sm:h-[300px] sm:w-[300px]"
    >
      <div className="relative h-[62%] w-full shrink-0 overflow-hidden rounded-lg bg-slate-100">
        <img
          src={thumb(post)}
          alt={post.title}
          width={300}
          height={186}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder.svg';
          }}
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-between pt-2">
        <p className="line-clamp-2 text-sm font-semibold leading-snug text-slate-900 group-hover:text-primary sm:text-base">
          {post.title}
        </p>
        <p className="truncate text-xs text-slate-500 sm:text-sm">{readLabel(post)}</p>
        <span className="inline-flex items-center text-xs font-semibold text-primary sm:text-sm">
          Read
          <ArrowRight className="ml-1 h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

type BlogRelatedSliderProps = {
  posts: RelatedBlogCard[];
  categoryLabel: string;
};

export default function BlogRelatedSlider({ posts, categoryLabel }: BlogRelatedSliderProps) {
  const durationSec = useMemo(() => Math.min(55, Math.max(22, posts.length * 5.5)), [posts.length]);

  if (!posts.length) return null;

  return (
    <section
      className="mt-5 rounded-2xl p-5 sm:p-6"
      aria-labelledby="related-blogs-heading"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary sm:text-xs">More to read</p>
          <h2 id="related-blogs-heading" className="mt-0.5 font-display text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Related articles
          </h2>
          <p className="mt-0.5 max-w-xl text-xs text-slate-900 sm:text-sm">
            {/* <span className="font-medium text-slate-800">{categoryLabel}</span>
            <span className="text-slate-500"> · scrolling newest first</span> */}
          </p>
        </div>
        <Link
          href="/blog"
          className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-primary hover:underline sm:text-sm"
        >
          View all posts
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="blog-related-ticker-wrap relative mt-5 overflow-hidden  py-5 sm:py-6">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-8 bg-gradient-to-r from-[#f5f6f8] to-transparent sm:w-12"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-8 bg-gradient-to-l from-[#f5f6f8] to-transparent sm:w-12"
          aria-hidden
        />

        <div
          className="blog-related-ticker-track flex w-max"
          style={{ ['--blog-ticker-duration']: `${durationSec}s` } as CSSProperties}
        >
          <div className="flex shrink-0 gap-3 pl-3 sm:gap-3.5 sm:pl-4">
            {posts.map((post) => (
              <MiniRelatedCard key={String(post._id)} post={post} />
            ))}
          </div>
          <div className="blog-related-ticker-dup flex shrink-0 gap-3 pl-3 sm:gap-3.5 sm:pl-4" aria-hidden>
            {posts.map((post) => (
              <MiniRelatedCard key={`${String(post._id)}-dup`} post={post} duplicate />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
