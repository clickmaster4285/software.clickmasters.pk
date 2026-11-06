'use client';

import { useEffect, useState } from 'react';
import { X, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { resolveImageUrl } from '@/lib/utils';
import { compressAndConvertImage } from '../../../src/utils/imageUtils';
import RichTextEditor from '@/components/admin/RichTextEditor';

export type BlogFormPayload = {
  published: boolean;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorLinkedin: string;
  authorImage: string;
  thumbnail: string;
  category: string;
  faqHeading: string;
  tags: string[];
  faqs: Array<{ question: string; answer: string }>;
};

type BlogPost = {
  _id: string;
  slug?: string;
  published: boolean;
  title: string;
  excerpt: string;
  content: string;
  author?: string;
  authorLinkedin?: string;
  authorImage?: string;
  thumbnail?: string;
  category?: string;
  faqHeading?: string;
  tags?: string[];
  faqs?: Array<{ question: string; answer: string }>;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

interface BlogFormProps {
  post?: BlogPost;
  onSubmit: (data: BlogFormPayload) => void;
  onCancel: () => void;
}

export default function BlogForm({ post, onSubmit, onCancel }: BlogFormProps) {
  const isEdit = Boolean(post);
  const [slug, setSlug] = useState(post?.slug || '');
  const [manualSlug, setManualSlug] = useState(Boolean(post?.slug));
  const [title, setTitle] = useState(post?.title || '');
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');
  const [content, setContent] = useState(post?.content || '');
  const [author, setAuthor] = useState(post?.author || '');
  const [authorLinkedin, setAuthorLinkedin] = useState(post?.authorLinkedin || '');
  const [authorImage, setAuthorImage] = useState(post?.authorImage || '');
  const [authorImageFile, setAuthorImageFile] = useState<File | null>(null);
  const [authorImagePreviewUrl, setAuthorImagePreviewUrl] = useState(
    post?.authorImage ? resolveImageUrl(post.authorImage) : ''
  );
  const [category, setCategory] = useState(post?.category || '');
  const [faqHeading, setFaqHeading] = useState(post?.faqHeading || 'Frequently Asked Questions');
  const [published, setPublished] = useState(post?.published ?? false);
  const [thumbnail, setThumbnail] = useState(post?.thumbnail || '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [tags, setTags] = useState<string[]>(post?.tags || []);
  const [newTag, setNewTag] = useState('');
  const [faqs, setFaqs] = useState<Array<{ question: string; answer: string }>>(
    post?.faqs && post.faqs.length > 0 ? post.faqs : [{ question: '', answer: '' }]
  );
  const [previewUrl, setPreviewUrl] = useState(post?.thumbnail ? resolveImageUrl(post.thumbnail) : '');

  useEffect(() => {
    if (manualSlug) return;
    setSlug(slugify(title));
  }, [title, manualSlug]);

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setCompressing(true);
      const compressedFile = await compressAndConvertImage(file, {
        maxWidth: 1920,
        maxHeight: 1080,
        quality: 0.8,
        format: 'webp',
      });
      setPreviewUrl(URL.createObjectURL(compressedFile));
      setImageFile(compressedFile);
      setThumbnail('');
    } catch {
      setPreviewUrl(URL.createObjectURL(file));
      setImageFile(file);
    } finally {
      setCompressing(false);
    }
  };

  const handleAddTag = () => {
    const t = newTag.trim();
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setNewTag('');
  };

  const handleAuthorImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressedFile = await compressAndConvertImage(file, {
        maxWidth: 800,
        maxHeight: 800,
        quality: 0.85,
        format: 'webp',
      });
      setAuthorImagePreviewUrl(URL.createObjectURL(compressedFile));
      setAuthorImageFile(compressedFile);
      setAuthorImage('');
    } catch {
      setAuthorImagePreviewUrl(URL.createObjectURL(file));
      setAuthorImageFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const textOnlyContent = content.replace(/<[^>]*>/g, '').trim();
    if (!textOnlyContent) {
      alert('Content is required');
      return;
    }

    let imageUrl = thumbnail.trim();
    let authorImageUrl = authorImage.trim();

    if (imageFile) {
      setUploading(true);
      try {
        const { apiFetch } = await import('../../../lib/api');
        const formData = new FormData();
        formData.append('image', imageFile);
        const res = await apiFetch('/api/projects/upload', {
          method: 'POST',
          credentials: 'include',
          body: formData,
        });
        if (!res.ok) {
          alert('Upload failed');
          setUploading(false);
          return;
        }
        const data = await res.json();
        imageUrl = data.imageUrl;
      } catch {
        setUploading(false);
        alert('Upload failed');
        return;
      }
      setUploading(false);
    }

    if (authorImageFile) {
      setUploading(true);
      try {
        const { apiFetch } = await import('../../../lib/api');
        const formData = new FormData();
        formData.append('image', authorImageFile);
        const res = await apiFetch('/api/projects/upload', {
          method: 'POST',
          credentials: 'include',
          body: formData,
        });
        if (!res.ok) {
          alert('Author image upload failed');
          setUploading(false);
          return;
        }
        const data = await res.json();
        authorImageUrl = data.imageUrl;
      } catch {
        setUploading(false);
        alert('Author image upload failed');
        return;
      }
      setUploading(false);
    }

    onSubmit({
      published,
      slug: slug.trim(),
      title: title.trim(),
      excerpt: excerpt.trim(),
      content: content.trim(),
      author: author.trim(),
      authorLinkedin: authorLinkedin.trim(),
      authorImage: authorImageUrl,
      thumbnail: imageUrl,
      category: category.trim(),
      faqHeading: faqHeading.trim(),
      tags,
      faqs: faqs
        .map((item) => ({ question: item.question.trim(), answer: item.answer.trim() }))
        .filter((item) => item.question && item.answer),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="min-w-0 space-y-4">
      <div className="flex flex-col gap-3 rounded-lg border border-border/60 px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 pr-2">
          <Label htmlFor="blog-published">Published</Label>
          <p className="text-xs text-muted-foreground">Only published posts appear on the site.</p>
        </div>
        <Switch id="blog-published" checked={published} onCheckedChange={setPublished} className="shrink-0" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="blog-title">Title *</Label>
        <Input
          id="blog-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post title"
          required
        />
        {/* T6 — length is a warning, never a hard cut; the full title is published. */}
        <p className={`text-xs ${title.replace(/\s*\|\s*ClickMasters\s*$/i, '').length + 15 > 60 ? 'text-amber-600' : 'text-muted-foreground'}`}>
          SEO title: {title.replace(/\s*\|\s*ClickMasters\s*$/i, '').length + 15} / 60 characters incl. &quot; | ClickMasters&quot;
          {title.replace(/\s*\|\s*ClickMasters\s*$/i, '').length + 15 > 60 ? ' — may be shortened by Google in results' : ''}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="blog-slug">Slug</Label>
        <Input
          id="blog-slug"
          value={slug}
          onChange={(e) => {
            setManualSlug(true);
            setSlug(e.target.value);
          }}
          placeholder="e.g. scaling-nextjs-apps"
        />
        <p className="text-xs text-muted-foreground">
          Your custom slug stays unchanged after you type it. It will not auto-generate again.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="blog-author">Author</Label>
        <Input
          id="blog-author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Optional author name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="blog-author-linkedin">Author LinkedIn</Label>
        <Input
          id="blog-author-linkedin"
          type="url"
          value={authorLinkedin}
          onChange={(e) => setAuthorLinkedin(e.target.value)}
          placeholder="https://www.linkedin.com/in/your-profile"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="blog-author-image">Author Image URL</Label>
        <Input
          id="blog-author-image"
          value={authorImage}
          onChange={(e) => {
            setAuthorImage(e.target.value);
            if (!authorImageFile) {
              setAuthorImagePreviewUrl(e.target.value ? resolveImageUrl(e.target.value) : '');
            }
          }}
          placeholder="https://example.com/author.jpg"
          disabled={!!authorImageFile}
        />
      </div>

      <div className="space-y-3">
        <Label>Author image upload (optional)</Label>
        <div className="grid min-w-0 items-start gap-4 md:grid-cols-[1fr_minmax(0,120px)]">
          <div className="min-w-0 space-y-2">
            <Input type="file" accept="image/*" onChange={handleAuthorImageSelect} disabled={compressing} />
            <p className="text-xs text-muted-foreground">
              Select image from system. If selected, uploaded image URL will be saved automatically.
            </p>
          </div>
          <div className="min-h-[5.5rem] overflow-hidden rounded-full border border-border/60 bg-secondary/40">
            <img
              src={authorImagePreviewUrl || '/placeholder.svg'}
              alt=""
              className="h-24 w-24 max-w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="blog-category">Category</Label>
        <Input
          id="blog-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="e.g. Custom Software Development"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="blog-excerpt">Excerpt *</Label>
        <Textarea
          id="blog-excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={3}
          required
          placeholder="Short summary for listing cards"
        />
        <p className={`text-xs ${excerpt.trim().length > 155 ? 'text-amber-600' : 'text-muted-foreground'}`}>
          Also used as the meta description: {excerpt.trim().length} / 155 characters
          {excerpt.trim().length > 155 ? ' — consider shortening' : ''}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="blog-content">Content *</Label>
        <RichTextEditor
          value={content}
          onChange={setContent}
          placeholder="Write content and use the toolbar for headings, links, lists, and images."
        />
        <p className="text-xs text-muted-foreground">
          Use Paragraph for normal text, and H1/H2 for headings from the toolbar style dropdown.
        </p>
      </div>

      <div className="min-w-0 space-y-2">
        <Label>Tags</Label>
        <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-stretch">
          <Input
            className="min-w-0 flex-1"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="e.g. Next.js"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddTag();
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-10 w-full shrink-0 sm:h-10 sm:w-10"
            onClick={handleAddTag}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="gap-1">
                {tag}
                <button
                  type="button"
                  className="ml-1 hover:text-destructive"
                  onClick={() => setTags(tags.filter((x) => x !== tag))}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-3 rounded-lg border border-border/60 p-3">
        <div className="flex items-center justify-between gap-2">
          <Label>FAQs</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setFaqs((prev) => [...prev, { question: '', answer: '' }])}
          >
            <Plus className="mr-1 h-3.5 w-3.5" />
            Add FAQ
          </Button>
        </div>
        <Input
          value={faqHeading}
          onChange={(e) => setFaqHeading(e.target.value)}
          placeholder="FAQ section heading (e.g. Frequently Asked Questions)"
        />
        <p className="text-xs text-muted-foreground">Add question-answer pairs in this separate FAQ section.</p>
        <div className="space-y-3">
          {faqs.map((item, idx) => (
            <div key={`faq-${idx}`} className="space-y-2 rounded-md border border-border/50 p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-medium text-muted-foreground">FAQ {idx + 1}</p>
                {faqs.length > 1 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-destructive"
                    onClick={() => setFaqs((prev) => prev.filter((_, i) => i !== idx))}
                  >
                    Remove
                  </Button>
                ) : null}
              </div>
              <Input
                value={item.question}
                onChange={(e) =>
                  setFaqs((prev) => prev.map((f, i) => (i === idx ? { ...f, question: e.target.value } : f)))
                }
                placeholder="Question"
              />
              <Textarea
                value={item.answer}
                onChange={(e) =>
                  setFaqs((prev) => prev.map((f, i) => (i === idx ? { ...f, answer: e.target.value } : f)))
                }
                rows={3}
                placeholder="Answer"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Label>Featured image (optional)</Label>
        <div className="grid min-w-0 items-start gap-4 md:grid-cols-[1fr_minmax(0,160px)]">
          <div className="min-w-0 space-y-2">
            <Input type="file" accept="image/*" onChange={handleImageSelect} disabled={compressing} />
            <Input
              value={thumbnail}
              onChange={(e) => {
                setThumbnail(e.target.value);
                if (!imageFile) setPreviewUrl(e.target.value ? resolveImageUrl(e.target.value) : '');
              }}
              placeholder="Or paste image URL"
              disabled={!!imageFile}
            />
          </div>
          <div className="min-h-[7rem] overflow-hidden rounded-lg border border-border/60 bg-secondary/40 md:min-h-0">
            <img
              src={previewUrl || '/placeholder.svg'}
              alt=""
              className="h-28 w-full max-w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              }}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-2 border-t pt-4 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">
          Cancel
        </Button>
        <Button type="submit" disabled={uploading || compressing} className="w-full sm:w-auto">
          {(uploading || compressing) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEdit ? 'Save changes' : 'Create post'}
        </Button>
      </div>
    </form>
  );
}
