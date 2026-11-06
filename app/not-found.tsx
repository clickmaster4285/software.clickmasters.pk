import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { withSeoMetadata } from '@/app/metadata-config';
import { serviceHubs } from '@/lib/service-nav';

export const metadata: Metadata = withSeoMetadata({
  title: 'Page Not Found',
  description: 'The page you are looking for does not exist on ClickMasters.',
  // Next.js injects <meta name="robots" content="noindex"> on every 404 response;
  // null drops the inherited layout tag so the page emits exactly one robots meta (T5).
  robots: null,
});

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-background">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="i-ri:404-fill text-8xl text-muted-foreground mb-4" />
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Page Not Found</h1>
          <p className="text-muted-foreground">
            The page you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
        <Button size="lg" asChild>
          <Link href="/">Go Home</Link>
        </Button>
        <nav aria-label="Popular pages" className="text-left">
          <p className="text-sm font-semibold text-foreground">Popular services</p>
          <ul className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
            {serviceHubs.slice(0, 8).map((hub) => (
              <li key={hub.href}>
                <Link href={hub.href} className="text-primary hover:underline">
                  {hub.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-muted-foreground">
            Still lost? Browse our <Link href="/faqs" className="text-primary hover:underline">FAQs</Link>,{' '}
            <Link href="/case-studies" className="text-primary hover:underline">case studies</Link> or{' '}
            <Link href="/contact-us" className="text-primary hover:underline">contact us</Link>.
          </p>
        </nav>
      </div>
    </div>
  );
}
