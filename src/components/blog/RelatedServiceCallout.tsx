import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

type Props = {
  serviceName: string;
  href: string;
  position: 'top' | 'bottom';
};

/**
 * "Related service" callout (T7). Informational blog posts link prominently to the
 * matching commercial service page so that page — not the post — ranks for
 * "{service} company / services in Pakistan" queries.
 */
export function RelatedServiceCallout({ serviceName, href, position }: Props) {
  return (
    <aside
      aria-label="Related service"
      className={`${position === 'top' ? 'mb-8' : 'mt-10'} rounded-xl border border-primary/20 bg-primary/5 p-5`}
    >
      <p className="text-xs font-semibold uppercase tracking-widest text-primary">Related service</p>
      <p className="mt-2 text-[15px] leading-7 text-slate-900">
        {position === 'top'
          ? 'Looking for a delivery partner rather than a guide? See our '
          : 'Ready to build? Talk to the team behind this guide about our '}
        <Link href={href} className="font-semibold text-primary underline underline-offset-4">
          {serviceName} services in Pakistan
        </Link>
        .
      </p>
      {position === 'bottom' && (
        <Link
          href={href}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
        >
          {serviceName}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      )}
    </aside>
  );
}
