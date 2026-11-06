import { calculateReadTime } from './readTime';

/** Fields the /blog listing needs; the full post body is never sent to the index (open item #15). */
const CARD_FIELDS = [
  '_id',
  'slug',
  'published',
  'title',
  'excerpt',
  'readTimeMinutes',
  'author',
  'authorLinkedin',
  'authorImage',
  'thumbnail',
  'category',
  'tags',
  'createdAt',
  'updatedAt',
] as const;

type RawPost = Record<string, unknown> & { content?: unknown; title?: unknown; excerpt?: unknown };

export function toBlogCard(post: RawPost): Record<string, unknown> {
  const card: Record<string, unknown> = {};
  for (const key of CARD_FIELDS) {
    if (post[key] !== undefined) card[key] = post[key];
  }
  const stored = post.readTimeMinutes;
  if (!(typeof stored === 'number' && Number.isFinite(stored) && stored > 0)) {
    card.readTimeMinutes = calculateReadTime({
      html: typeof post.content === 'string' ? post.content : '',
      fallbackParts: [String(post.title ?? ''), String(post.excerpt ?? '')],
    }).minutes;
  }
  return card;
}
