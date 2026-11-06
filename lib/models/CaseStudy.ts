import mongoose from 'mongoose';

const caseStudySchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      unique: true,
    },
    slug: { type: String, unique: true, sparse: true, index: true, default: '' },
    published: { type: Boolean, default: false },
    title: { type: String, required: true },
    /** <title>/og:title (≤ 60 chars incl. " | ClickMasters"); empty falls back to "{client} Case Study". */
    seoTitle: { type: String, default: '' },
    excerpt: { type: String, required: true },
    client: { type: String, default: '' },
    technologies: { type: [String], default: [] },
    /** Optional; empty uses linked solution thumbnail */
    thumbnail: { type: String, default: '' },
    status: {
      type: String,
      enum: ['live', 'in-progress', 'completed'],
      default: 'completed',
    },
    challenge: { type: String, required: true },
    approach: { type: String, required: true },
    results: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.CaseStudy || mongoose.model('CaseStudy', caseStudySchema);
