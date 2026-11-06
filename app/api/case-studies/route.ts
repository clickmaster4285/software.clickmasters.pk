import { NextRequest, NextResponse } from 'next/server';
import CaseStudy from '../../../lib/models/CaseStudy';
import Project from '../../../lib/models/Project';
import '../../../lib/models/Category';
import dbConnect from '../../../lib/mongoose';

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function ensureUniqueSlug(base: string) {
  const clean = slugify(base);
  if (!clean) return '';
  let slug = clean;
  let i = 2;
  while (await CaseStudy.findOne({ slug }).select('_id').lean()) {
    slug = `${clean}-${i++}`;
  }
  return slug;
}

function populateProject() {
  return {
    path: 'project',
    select: 'title description thumbnail url category status',
    populate: { path: 'category', select: 'name description' },
  };
}

// GET: published only by default; ?drafts=1 returns all (admin UI)
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const drafts = searchParams.get('drafts') === '1';

    const filter = drafts ? {} : { published: true };

    const list = await CaseStudy.find(filter)
      .populate(populateProject())
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(list);
  } catch (err: unknown) {
    console.error('GET /case-studies error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const {
      project: projectId,
      published,
      slug,
      title,
      seoTitle,
      excerpt,
      client,
      technologies,
      thumbnail,
      status,
      challenge,
      approach,
      results,
    } = body;

    if (!projectId || !title || !excerpt || !challenge || !approach || !results) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const project = await Project.findById(projectId).lean();
    if (!project) {
      return NextResponse.json({ message: 'Solution not found' }, { status: 400 });
    }

    const existing = await CaseStudy.findOne({ project: projectId }).lean();
    if (existing) {
      return NextResponse.json(
        { message: 'This solution already has a case study. Edit the existing one.' },
        { status: 400 }
      );
    }

    const desiredSlug = typeof slug === 'string' ? slug.trim() : '';
    const computedSlug = desiredSlug ? slugify(desiredSlug) : await ensureUniqueSlug(String(title));
    if (computedSlug) {
      const taken = await CaseStudy.findOne({ slug: computedSlug }).select('_id').lean();
      if (taken) {
        return NextResponse.json({ message: 'Slug already in use' }, { status: 400 });
      }
    }

    const doc = await CaseStudy.create({
      project: projectId,
      slug: computedSlug,
      published: Boolean(published),
      title: String(title).trim(),
      seoTitle: typeof seoTitle === 'string' ? seoTitle.trim() : '',
      excerpt: String(excerpt).trim(),
      client: typeof client === 'string' ? client.trim() : '',
      technologies: Array.isArray(technologies) ? technologies.map(String) : [],
      thumbnail: typeof thumbnail === 'string' ? thumbnail.trim() : '',
      status: status || 'completed',
      challenge: String(challenge).trim(),
      approach: String(approach).trim(),
      results: String(results).trim(),
    });

    const populated = await CaseStudy.findById(doc._id).populate(populateProject()).lean();
    return NextResponse.json(populated, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('POST /case-studies error:', msg);
    if (msg.includes('duplicate key')) {
      return NextResponse.json({ message: 'A case study for this solution already exists' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
