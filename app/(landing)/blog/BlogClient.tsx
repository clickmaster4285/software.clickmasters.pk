'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { apiFetch } from '@/lib/api';
import { calculateReadTimeText } from '../../../src/lib/readTime';
import { resolveImageUrl } from '@/lib/utils';
import { ArrowRight, ChevronLeft, ChevronRight, Clock3, ExternalLink, RefreshCcw, Search } from 'lucide-react';

export type BlogCard = {
  _id: string;
  slug?: string;
  published: boolean;
  title: string;
  excerpt: string;
  content?: string;
  readTimeMinutes?: number;
  author?: string;
  authorLinkedin?: string;
  authorImage?: string;
  thumbnail?: string;
  category?: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
};



function postId(value: unknown): string {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object') {
    const anyVal = value as { toString?: () => string; $oid?: string };
    if (typeof anyVal.toString === 'function') {
      const s = anyVal.toString();
      if (s && s !== '[object Object]') return s;
    }
    if (typeof anyVal.$oid === 'string') return anyVal.$oid;
  }
  return '';
}

type BlogClientProps = {
  initialPosts?: BlogCard[];
};

const PAGE_SIZE = 9;

function formatDate(value?: string) {
  if (!value) return '';
  return new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function postHref(post: BlogCard) {
  const id = postId(post._id);
  const slug = typeof post.slug === 'string' && post.slug.trim() ? post.slug.trim() : id;
  return `/blog/${encodeURIComponent(slug)}`;
}

function postImage(post: BlogCard) {
  return post.thumbnail?.trim() ? resolveImageUrl(post.thumbnail) : '/placeholder.svg';
}

function postReadTime(post: BlogCard) {
  if (typeof post.readTimeMinutes === 'number' && Number.isFinite(post.readTimeMinutes) && post.readTimeMinutes > 0) {
    return `${Math.ceil(post.readTimeMinutes)} min read`;
  }
  return calculateReadTimeText({
    html: post.content,
    fallbackParts: [post.title, post.excerpt],
  });
}

function authorName(post: BlogCard) {
  return post.author?.trim() || 'ClickMasters Team';
}

function authorLinkedin(post: BlogCard) {
  return post.authorLinkedin?.trim() || '';
}

function authorImage(post: BlogCard) {
  return post.authorImage?.trim() ? resolveImageUrl(post.authorImage) : '';
}

export default function BlogClient({ initialPosts }: BlogClientProps) {
  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string>('all');
  const [page, setPage] = useState(1);

  const { data: posts = [], isLoading } = useQuery<BlogCard[]>({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      const res = await apiFetch('/api/blog');
      if (!res.ok) throw new Error('Failed to load blog posts');
      return res.json();
    },
    ...(initialPosts !== undefined ? { initialData: initialPosts } : {}),
  });

  const tags = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of posts) {
      const category = p.category?.trim();
      if (!category) continue;
      map.set(category, (map.get(category) || 0) + 1);
    }
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name]) => name);
  }, [posts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter((p) => {
      const tags = (p.tags || []).join(' ').toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        (p.author || '').toLowerCase().includes(q) ||
        tags.includes(q)
      );
    });
  }, [posts, query]);

  const filteredByTag = useMemo(() => {
    if (activeTag === 'all') return filtered;
    return filtered.filter((p) => {
      const categoryMatch = (p.category || '').toLowerCase() === activeTag.toLowerCase();
      return categoryMatch;
    });
  }, [filtered, activeTag]);

  const featured = filteredByTag[0];
  const highlights = filteredByTag.slice(1, 3);
  const gridPosts = filteredByTag.slice(3);
  const totalPages = Math.max(1, Math.ceil(gridPosts.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const pageItems = gridPosts.slice(start, start + PAGE_SIZE);

  return (
    <div className="min-h-screen bg-[#f5f6f8] pt-20 text-slate-900">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 pb-8 pt-10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">ClickMasters</p>
              <h1 className="mt-1 font-display text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                NEWSROOM
              </h1>
            </div>
            <div className="w-full md:w-[320px]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search stories"
                  className="h-10 border-slate-300 bg-white pl-9"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setActiveTag('all');
                setPage(1);
              }}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                activeTag === 'all'
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-300 bg-white text-gray-900 hover:border-slate-500'
              }`}
            >
              All topics
            </button>
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  setActiveTag(tag);
                  setPage(1);
                }}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                  activeTag === tag
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-300 bg-white text-gray-900 hover:border-slate-500'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <p className="text-slate-900">Loading newsroom...</p>
          ) : !featured ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <p className="font-medium text-slate-900">No stories found.</p>
              <p className="mt-2 text-sm text-slate-900">Try another search or topic filter.</p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 lg:grid-cols-3">
                <Link
                  href={postHref(featured)}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-primary/25 hover:shadow-md lg:col-span-2"
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                    <img
                      src={postImage(featured)}
                      alt={featured.title}
                      className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                  </div>
                  <div className="p-6">
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                      {featured.tags?.[0] || 'Featured'}
                    </p>
                    <h2 className="mt-2 font-display text-2xl font-bold leading-tight text-slate-900 group-hover:text-primary">
                      {featured.title}
                    </h2>
                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-900">
                      {featured.excerpt}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-2">
                        {authorImage(featured) ? (
                          <img
                            src={authorImage(featured)}
                            alt={authorName(featured)}
                            className="h-5 w-5 rounded-full border border-slate-200 object-cover"
                          />
                        ) : null}
                        {authorLinkedin(featured) ? (
                          <a
                            href={authorLinkedin(featured)}
                            target="_blank"
                            rel="noopener noreferrer nofollow"
                            onClick={(e) => e.stopPropagation()}
                            className="hover:text-primary hover:underline"
                          >
                            {authorName(featured)}
                          </a>
                        ) : (
                          <span>{authorName(featured)}</span>
                        )}
                      </span>
                      <span>•</span>
                      <span>{formatDate(featured.createdAt)}</span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1">
                        <Clock3 className="h-3.5 w-3.5" />
                        {postReadTime(featured)}
                      </span>
                      {featured.updatedAt ? (
                        <>
                          <span>•</span>
                          <span className="inline-flex items-center gap-1">
                            <RefreshCcw className="h-3.5 w-3.5" />
                            Updated {formatDate(featured.updatedAt)}
                          </span>
                        </>
                      ) : null}
                      {authorLinkedin(featured) ? (
                        <a
                          href={authorLinkedin(featured)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="ml-1 inline-flex items-center gap-1 rounded border border-slate-200 bg-white px-2 py-0.5 text-[11px] hover:border-primary/40 hover:text-primary"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Profile
                        </a>
                      ) : null}
                    </div>
                  </div>
                </Link>

                <div className="grid gap-6">
                  {highlights.map((post) => (
                    <Link
                      key={postId(post._id) || String(post._id)}
                      href={postHref(post)}
                      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-primary/25 hover:shadow-md"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                        <img
                          src={postImage(post)}
                          alt={post.title}
                          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder.svg';
                          }}
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="line-clamp-2 text-base font-semibold leading-snug text-slate-900 group-hover:text-primary">
                          {post.title}
                        </h3>
                        <p className="mt-2 flex flex-wrap items-center gap-1 text-xs text-slate-500">
                          {authorLinkedin(post) ? (
                            <a
                              href={authorLinkedin(post)}
                              target="_blank"
                              rel="noopener noreferrer nofollow"
                              onClick={(e) => e.stopPropagation()}
                              className="hover:text-primary hover:underline"
                            >
                              {authorName(post)}
                            </a>
                          ) : (
                            <span>{authorName(post)}</span>
                          )}
                          <span>•</span>
                          <span>{formatDate(post.createdAt)}</span>
                          <span>•</span>
                          <span>{postReadTime(post)}</span>
                          {post.updatedAt ? (
                            <>
                              <span>•</span>
                              <span>Updated {formatDate(post.updatedAt)}</span>
                            </>
                          ) : null}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {pageItems.length > 0 && (
                <ul className="mt-8 grid list-none gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
                  {pageItems.map((post) => (
                    <li key={postId(post._id) || String(post._id)}>
                      <Link
                        href={postHref(post)}
                        className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-primary/25 hover:shadow-md"
                      >
                        <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                          <img
                            src={postImage(post)}
                            alt={post.title}
                            className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/placeholder.svg';
                            }}
                          />
                        </div>
                        <div className="flex flex-1 flex-col p-4">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">
                            {post.tags?.[0] || 'Article'}
                          </p>
                          <h3 className="mt-1 line-clamp-2 text-lg font-semibold leading-snug text-slate-900 group-hover:text-primary">
                            {post.title}
                          </h3>
                          <p className="mt-2 line-clamp-3 text-sm text-slate-900">{post.excerpt}</p>
                          <p className="mt-3 flex flex-wrap items-center gap-1 text-xs text-slate-500">
                            {authorLinkedin(post) ? (
                              <a
                                href={authorLinkedin(post)}
                                target="_blank"
                                rel="noopener noreferrer nofollow"
                                onClick={(e) => e.stopPropagation()}
                                className="hover:text-primary hover:underline"
                              >
                                {authorName(post)}
                              </a>
                            ) : (
                              <span>{authorName(post)}</span>
                            )}
                            <span>•</span>
                            <span>{postReadTime(post)}</span>
                            {post.updatedAt ? (
                              <>
                                <span>•</span>
                                <span>Updated {formatDate(post.updatedAt)}</span>
                              </>
                            ) : null}
                          </p>
                          <span className="mt-4 inline-flex items-center text-sm font-semibold text-primary">
                            Read more
                            <ArrowRight className="ml-1 h-4 w-4 transition group-hover:translate-x-0.5" />
                          </span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}

              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={safePage === 1}
                    className="rounded border border-slate-300 bg-white p-1.5 text-gray-900 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const n = idx + 1;
                    return (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setPage(n)}
                        className={`h-8 min-w-8 rounded border px-2 text-sm ${
                          n === safePage
                            ? 'border-slate-900 bg-slate-900 text-white'
                            : 'border-slate-300 bg-white text-slate-900'
                        }`}
                      >
                        {n}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={safePage === totalPages}
                    className="rounded border border-slate-300 bg-white p-1.5 text-gray-900 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
