import Testimonials from "@/src/components/landingPage/Testimonials/page";
import { breadcrumbSchema, metadataConfig } from '@/app/metadata-config';
import { getActiveTestimonials } from '@/src/lib/server-data';

export const metadata = metadataConfig.testimonials();

// Rendered per request (data cached for an hour in getActiveTestimonials) so the
// testimonials are always in the server HTML — never a build-time empty shell (T13).
export const dynamic = 'force-dynamic';

export default async function TestimonialsPage() {
  const testimonials = await getActiveTestimonials();

  return (
    <>
      <script
        id="testimonials-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: 'Home', url: '/' },
              { name: 'Testimonials', url: '/testimonials' },
            ]),
          ),
        }}
      />
      <Testimonials />

      {/* Server-rendered text of every testimonial (T13). Review/AggregateRating schema is
          intentionally NOT emitted until each review is verifiable. */}
      {testimonials.length > 0 && (
        <section
          aria-labelledby="all-testimonials-heading"
          className="mx-auto max-w-[1600px] px-4 pb-20 sm:px-6 lg:px-10"
        >
          <h2 id="all-testimonials-heading" className="text-2xl font-semibold text-slate-900 sm:text-3xl">
            What our clients say about working with ClickMasters
          </h2>
          <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <li key={t.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <figure>
                  <blockquote className="text-[15px] leading-7 text-slate-800">“{t.content}”</blockquote>
                  <figcaption className="mt-4 text-sm">
                    <span className="font-semibold text-slate-900">{t.authorName}</span>
                    {(t.authorRole || t.authorCompany) && (
                      <span className="text-slate-600">
                        {' — '}
                        {[t.authorRole, t.authorCompany].filter(Boolean).join(', ')}
                      </span>
                    )}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
