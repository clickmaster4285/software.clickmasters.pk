import { NextRequest, NextResponse } from 'next/server';
import CaseStudy from '../../../../lib/models/CaseStudy';
import '../../../../lib/models/Project';
import '../../../../lib/models/Category';
import dbConnect from '../../../../lib/mongoose';

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function populateProject() {
  return {
    path: 'project',
    select: 'title description thumbnail url category status',
    populate: { path: 'category', select: 'name description' },
  };
}

// GET single: public if published; ?drafts=1 allows draft (admin)
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const drafts = searchParams.get('drafts') === '1';

    const doc = await CaseStudy.findById(id).populate(populateProject()).lean();
    if (!doc) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }

    if (!doc.published && !drafts) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(doc);
  } catch (err: unknown) {
    console.error('GET /case-studies/[id] error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await dbConnect();
    const body = await req.json();

    const updates: Record<string, unknown> = {};
    const keys = [
      'published',
      'slug',
      'title',
      'seoTitle',
      'excerpt',
      'client',
      'technologies',
      'thumbnail',
      'status',
      'challenge',
      'approach',
      'results',
    ] as const;

    for (const k of keys) {
      if (k in body) {
        if (k === 'technologies' && Array.isArray(body[k])) {
          updates[k] = body[k].map(String);
        } else if (k === 'published') {
          updates[k] = Boolean(body[k]);
        } else if (k === 'slug' && typeof body[k] === 'string') {
          updates[k] = slugify(body[k].trim());
        } else if (typeof body[k] === 'string') {
          updates[k] = body[k].trim();
        } else {
          updates[k] = body[k];
        }
      }
    }

    if (typeof updates.slug === 'string' && updates.slug) {
      const existing = await CaseStudy.findOne({
        slug: updates.slug,
        _id: { $ne: id },
      })
        .select('_id')
        .lean();
      if (existing) {
        return NextResponse.json({ message: 'Slug already in use' }, { status: 400 });
      }
    }

    const doc = await CaseStudy.findByIdAndUpdate(id, updates, {
      returnDocument: 'after',
      runValidators: true,
    })
      .populate(populateProject())
      .lean();

    if (!doc) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(doc);
  } catch (err: unknown) {
    console.error('PUT /case-studies/[id] error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await dbConnect();
    const deleted = await CaseStudy.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (err: unknown) {
    console.error('DELETE /case-studies/[id] error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
