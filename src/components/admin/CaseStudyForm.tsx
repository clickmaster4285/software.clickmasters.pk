'use client';

import { useEffect, useState } from 'react';
import { X, Plus, Loader2, Lock, LockOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { CaseStudy, Project } from '../../../lib/storage';
import { resolveImageUrl } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { compressAndConvertImage, getImageDimensions } from '../../../src/utils/imageUtils';

export type CaseStudyFormPayload = {
  project?: string;
  published: boolean;
  slug: string;
  title: string;
  seoTitle: string;
  excerpt: string;
  client: string;
  technologies: string[];
  thumbnail: string;
  status: 'live' | 'in-progress' | 'completed';
  challenge: string;
  approach: string;
  results: string;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function rowId(p: { _id?: string; id?: string }) {
  return String(p._id ?? p.id ?? '');
}

function projectIdFromRef(project: string | Project | undefined): string {
  if (!project) return '';
  if (typeof project === 'string') return project;
  return rowId(project);
}

interface CaseStudyFormProps {
  caseStudy?: CaseStudy;
  onSubmit: (data: CaseStudyFormPayload) => void;
  onCancel: () => void;
}

const CaseStudyForm = ({ caseStudy, onSubmit, onCancel }: CaseStudyFormProps) => {
  const isEdit = Boolean(caseStudy);

  const [projectId, setProjectId] = useState(() => projectIdFromRef(caseStudy?.project as Project | string));
  const [slug, setSlug] = useState(caseStudy?.slug || '');
  const [slugLocked, setSlugLocked] = useState(true);
  const [title, setTitle] = useState(caseStudy?.title || '');
  const [seoTitle, setSeoTitle] = useState(caseStudy?.seoTitle || '');
  const [excerpt, setExcerpt] = useState(caseStudy?.excerpt || '');
  const [client, setClient] = useState(caseStudy?.client || '');
  const [technologies, setTechnologies] = useState<string[]>(caseStudy?.technologies || []);
  const [newTech, setNewTech] = useState('');
  const [status, setStatus] = useState<CaseStudyFormPayload['status']>(
    caseStudy?.status || 'completed'
  );
  const [challenge, setChallenge] = useState(caseStudy?.challenge || '');
  const [approach, setApproach] = useState(caseStudy?.approach || '');
  const [results, setResults] = useState(caseStudy?.results || '');
  const [published, setPublished] = useState(caseStudy?.published ?? false);
  const [thumbnail, setThumbnail] = useState(caseStudy?.thumbnail || '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState('');
  const [previewUrl, setPreviewUrl] = useState(
    caseStudy?.thumbnail ? resolveImageUrl(caseStudy.thumbnail) : ''
  );

  const { data: projects = [], isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: async () => {
      const { apiFetch } = await import('../../../lib/api');
      const res = await apiFetch('/api/projects', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to load solutions');
      return res.json();
    },
  });

  const { data: existingCaseStudies = [] } = useQuery<CaseStudy[]>({
    queryKey: ['case-studies', 'admin'],
    queryFn: async () => {
      const { apiFetch } = await import('../../../lib/api');
      const res = await apiFetch('/api/case-studies?drafts=1', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to load case studies');
      return res.json();
    },
    enabled: !isEdit,
  });

  const takenProjectIds = new Set(
    existingCaseStudies
      .filter((cs) => !(isEdit && caseStudy && String(cs._id) === String(caseStudy._id)))
      .map((cs) => projectIdFromRef(cs.project as Project | string))
      .filter(Boolean)
  );

  useEffect(() => {
    if (isEdit || !projectId || !projects.length) return;
    const p = projects.find((x) => rowId(x) === projectId);
    if (!p) return;
    setTitle((t) => t || p.title);
    setExcerpt((e) => e || p.description?.slice(0, 400) || '');
  }, [projectId, projects, isEdit]);

  useEffect(() => {
    if (!slugLocked) return;
    setSlug(slugify(title));
  }, [title, slugLocked]);

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setCompressing(true);
      setCompressionProgress('Compressing…');
      const dimensions = await getImageDimensions(file);
      let quality = 0.8;
      if (file.size > 5 * 1024 * 1024) quality = 0.7;
      else if (file.size > 2 * 1024 * 1024) quality = 0.75;
      const compressedFile = await compressAndConvertImage(file, {
        maxWidth: 1920,
        maxHeight: 1080,
        quality,
        format: 'webp',
      });
      const previewObjectUrl = URL.createObjectURL(compressedFile);
      setPreviewUrl(previewObjectUrl);
      setImageFile(compressedFile);
      setThumbnail('');
    } catch (err) {
      console.error(err);
      const previewObjectUrl = URL.createObjectURL(file);
      setPreviewUrl(previewObjectUrl);
      setImageFile(file);
    } finally {
      setCompressing(false);
      setCompressionProgress('');
    }
  };

  const handleAddTech = () => {
    const t = newTech.trim();
    if (t && !technologies.includes(t)) setTechnologies([...technologies, t]);
    setNewTech('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEdit && !projectId) {
      alert('Select a solution');
      return;
    }

    let imageUrl = thumbnail.trim();
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
          const err = await res.json().catch(() => ({}));
          alert((err as { message?: string }).message || 'Upload failed');
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

    const payload: CaseStudyFormPayload = {
      published,
      slug: slugify(slug),
      title: title.trim(),
      seoTitle: seoTitle.trim(),
      excerpt: excerpt.trim(),
      client: client.trim(),
      technologies,
      thumbnail: imageUrl,
      status,
      challenge: challenge.trim(),
      approach: approach.trim(),
      results: results.trim(),
    };

    if (!isEdit) payload.project = projectId;

    onSubmit(payload);
  };

  if (projectsLoading) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">Loading solutions…</div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="min-w-0 space-y-4">
      <div className="min-w-0 space-y-2">
        <Label htmlFor="cs-project">Linked solution *</Label>
        <Select
          value={projectId || undefined}
          onValueChange={setProjectId}
          disabled={isEdit}
          required={!isEdit}
        >
          <SelectTrigger id="cs-project" className="w-full min-w-0">
            <SelectValue placeholder="Choose a solution" />
          </SelectTrigger>
          <SelectContent>
            {projects.map((p) => {
              const id = rowId(p);
              const taken = !isEdit && takenProjectIds.has(id);
              return (
                <SelectItem key={id} value={id} disabled={taken}>
                  {p.title}
                  {taken ? ' (has case study)' : ''}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Each solution can have one case study. Narrative below is only for the case studies page.
        </p>
      </div>

      <div className="flex flex-col gap-3 rounded-lg border border-border/60 px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 pr-2">
          <Label htmlFor="cs-published">Published</Label>
          <p className="text-xs text-muted-foreground">Only published studies appear on the site.</p>
        </div>
        <Switch id="cs-published" checked={published} onCheckedChange={setPublished} className="shrink-0" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="cs-title">Case study title *</Label>
        <Input
          id="cs-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Headline for this study"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="cs-seo-title">SEO title (browser tab and search results)</Label>
        <Input
          id="cs-seo-title"
          value={seoTitle}
          onChange={(e) => setSeoTitle(e.target.value)}
          placeholder="e.g. Bar POS Case Study: 45% Faster Service"
        />
        {/* " | ClickMasters" (15 chars) is appended automatically; keep the whole title ≤ 60 */}
        <p className={`text-xs ${seoTitle.trim().length > 45 ? 'text-amber-600' : 'text-muted-foreground'}`}>
          {seoTitle.trim().length}/45 characters before &quot; | ClickMasters&quot;. The long headline above stays the
          page H1. Leave empty to use &quot;{client.trim() || 'Client'} Case Study&quot;.
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="cs-slug">Slug</Label>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => {
              setSlugLocked((prev) => {
                const nextLocked = !prev;
                if (nextLocked) setSlug(slugify(title));
                return nextLocked;
              });
            }}
          >
            {slugLocked ? (
              <>
                <LockOpen className="mr-1.5 h-3.5 w-3.5" />
                Unlock
              </>
            ) : (
              <>
                <Lock className="mr-1.5 h-3.5 w-3.5" />
                Lock
              </>
            )}
          </Button>
        </div>
        <Input
          id="cs-slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="e.g. alpha-project"
          disabled={slugLocked}
        />
        <p className="text-xs text-muted-foreground">
          {slugLocked
            ? 'Slug is auto-generated from title and locked.'
            : 'Slug is unlocked. You can edit it manually.'}{' '}
          Used in the URL: <span className="font-mono">/case-studies/</span>
          <span className="font-mono">{slugify(slug) || 'your-slug'}</span>
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="cs-excerpt">Short summary (listing card) *</Label>
        <Textarea
          id="cs-excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={3}
          required
          placeholder="2–4 sentences for the grid card"
        />
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2">
        <div className="min-w-0 space-y-2">
          <Label htmlFor="cs-client">Client / organization</Label>
          <Input
            id="cs-client"
            value={client}
            onChange={(e) => setClient(e.target.value)}
            placeholder="Optional"
          />
        </div>
        <div className="min-w-0 space-y-2">
          <Label>Status on card *</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as CaseStudyFormPayload['status'])}>
            <SelectTrigger className="w-full min-w-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="live">Live</SelectItem>
              <SelectItem value="in-progress">In progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="min-w-0 space-y-2">
        <Label>Technologies</Label>
        <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-stretch">
          <Input
            className="min-w-0 flex-1"
            value={newTech}
            onChange={(e) => setNewTech(e.target.value)}
            placeholder="e.g. Next.js"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddTech();
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-10 w-full shrink-0 sm:h-10 sm:w-10"
            onClick={handleAddTech}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {technologies.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {technologies.map((tech) => (
              <Badge key={tech} variant="secondary" className="gap-1">
                {tech}
                <button
                  type="button"
                  className="ml-1 hover:text-destructive"
                  onClick={() => setTechnologies(technologies.filter((x) => x !== tech))}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="cs-challenge">Challenge *</Label>
        <Textarea
          id="cs-challenge"
          value={challenge}
          onChange={(e) => setChallenge(e.target.value)}
          rows={5}
          required
          placeholder="What problem or context did the client face?"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="cs-approach">Approach & delivery *</Label>
        <Textarea
          id="cs-approach"
          value={approach}
          onChange={(e) => setApproach(e.target.value)}
          rows={5}
          required
          placeholder="How you scoped, architected, and shipped"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="cs-results">Results & impact *</Label>
        <Textarea
          id="cs-results"
          value={results}
          onChange={(e) => setResults(e.target.value)}
          rows={5}
          required
          placeholder="Outcomes, metrics, adoption, or qualitative impact"
        />
      </div>

      <div className="space-y-3">
        <Label>Card image (optional)</Label>
        <p className="text-xs text-muted-foreground">
          Leave empty and clear URL to use the linked solution&apos;s image on listings.
        </p>
        <div className="grid min-w-0 gap-4 md:grid-cols-[1fr_minmax(0,160px)] items-start">
          <div className="min-w-0 space-y-2">
            <Input type="file" accept="image/*" onChange={handleImageSelect} disabled={compressing} />
            {compressing && (
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                {compressionProgress}
              </div>
            )}
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
          <div className="min-h-[7rem] rounded-lg border border-border/60 overflow-hidden bg-secondary/40 md:min-h-0">
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
          {(uploading || compressing) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {isEdit ? 'Save changes' : 'Create case study'}
        </Button>
      </div>
    </form>
  );
};

export default CaseStudyForm;
