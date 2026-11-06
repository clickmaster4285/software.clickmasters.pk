import {
  Mail,
  Phone,
  MapPin,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";

import { serviceHubs } from "@/lib/service-nav";

interface FooterLink {
  label: string;
  href: string;
}

/** Country hubs — each links to /locations/{country}. */
export const footerLocations: FooterLink[] = [
  { label: "UAE", href: "/locations/uae" },
  { label: "UK", href: "/locations/uk" },
  { label: "USA", href: "/locations/usa" },
  { label: "Canada", href: "/locations/canada" },
  { label: "Germany", href: "/locations/germany" },
  { label: "Australia", href: "/locations/australia" },
];

// Services column is generated from the same data source as the sitemap,
// so every published hub is linked from every page and the two can never diverge.
const serviceLinks: FooterLink[] = serviceHubs.map((hub) => ({ label: hub.label, href: hub.href }));

const companyLinks: FooterLink[] = [
  { label: "About Us", href: "/about-us" },
  { label: "Contact Us", href: "/contact-us" },
  { label: "Locations", href: "/locations" },
  { label: "Careers", href: "/careers" },
  { label: "Testimonials", href: "/testimonials" },
];

const resourceLinks: FooterLink[] = [
  { label: "FAQs", href: "/faqs" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Software Solutions", href: "/software-solutions" },
  { label: "Blog", href: "/blog" },
];

function FooterLinkItem({ link }: { link: FooterLink }) {
  return (
    <li>
      <Link
        href={link.href}
        className="group inline-flex items-center gap-1.5 transition-all duration-200 hover:text-white"
      >
        <span className="inline-block transition-all duration-200 group-hover:translate-x-1">
          {link.label}
        </span>
        <ArrowRight className="h-3 w-3 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-1" />
      </Link>
    </li>
  );
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-foreground text-background">
      {/* Animated Background Glows */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#a7f3d0] opacity-30 blur-3xl animate-pulse-slow" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-[#fdba74] opacity-25 blur-3xl animate-pulse-slow delay-700" />

      {/* Main grid */}
      <div className="relative mx-auto grid max-w-[1600px] px-10 py-14 grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-6 z-10">
        
        {/* Logo + Description */}
        <div data-footer-col className="lg:col-span-2">
          <Link href="/" className="inline-block">
            <div className="flex flex-col leading-none">
              <span className="font-serif text-2xl font-bold tracking-tight">
                CLICK<span className="text-[color:var(--brand-peach)]">M</span>
                ASTERS
              </span>
              <span className="mt-1 text-[10px] tracking-[0.18em] text-background/60">
                DIGITAL MARKETING AGENCY &amp; SOFTWARE HOUSE
              </span>
            </div>
          </Link>

          <p className="mt-6 max-w-sm text-sm leading-relaxed text-background/70">
            A senior software house building web, mobile, and AI-powered
            systems for ambitious teams across the USA, Europe &amp; Middle East.
          </p>

          <div className="mt-6 space-y-2.5 text-sm text-background/80">
            <a
              href="mailto:marketing@clickmasters.pk"
              className="flex items-center gap-3 transition hover:text-primary"
            >
              <Mail className="h-4 w-4 text-blue-500" />
              <span>marketing@clickmasters.pk</span>
            </a>

            <a
              href="tel:+447988576086"
              className="flex items-center gap-3 transition hover:text-primary"
            >
              <Phone className="h-4 w-4 text-orange-600" />
             
              <span>
                +44 7988 576086 | +1 325 202 4074 | +92 332 5394285
              </span>
            </a>

             <a
              href="tel:+447988576086"
              className="flex items-center gap-3 transition hover:text-primary"
            >
            
              <FaWhatsapp className="h-4 w-4 text-green-600" />
              <span>
                +44 7988 576086 | +1 325 202 4074 | +92 332 5394285
              </span>
            </a>



            <p className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-red-500" />
              PWD · Paris Shopping Mall · Islamabad · Pakistan
            </p>
          </div>
        </div>

        {/* Services: all hubs */}
        <nav data-footer-col aria-label="Services" className="lg:col-span-2">
          <h2 className="text-lg font-bold uppercase tracking-[0.2em] text-white">Services</h2>
          <ul className="mt-5 grid grid-cols-1 gap-x-6 gap-y-3 text-sm text-background/75 sm:grid-cols-2">
            {serviceLinks.map((link) => (
              <FooterLinkItem key={link.href} link={link} />
            ))}
          </ul>
        </nav>

        <nav data-footer-col aria-label="Company">
          <h2 className="text-lg font-bold uppercase tracking-[0.2em] text-white">Company</h2>
          <ul className="mt-5 space-y-3 text-sm text-background/75">
            {companyLinks.map((link) => (
              <FooterLinkItem key={link.href} link={link} />
            ))}
          </ul>
        </nav>

        <nav data-footer-col aria-label="Resources">
          <h2 className="text-lg font-bold uppercase tracking-[0.2em] text-white">Resources</h2>
          <ul className="mt-5 space-y-3 text-sm text-background/75">
            {resourceLinks.map((link) => (
              <FooterLinkItem key={link.href} link={link} />
            ))}
          </ul>
        </nav>
      </div>

      {/* Serving countries strip */}
      <div className="relative z-10 border-t border-white/10">
        <nav
          aria-label="Locations we serve"
          className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-x-5 gap-y-2 px-10 py-5 text-sm text-background/75"
        >
          <span className="font-semibold text-white">Serving clients in:</span>
          {footerLocations.map((loc) => (
            <Link key={loc.href} href={loc.href} className="transition hover:text-white">
              {loc.label}
            </Link>
          ))}
          <Link href="/locations" className="transition hover:text-white underline underline-offset-4">
            All locations
          </Link>
        </nav>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-white/10 z-10">
        <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-3 px-10 py-6 text-xs text-background/60 md:flex-row">
          <p>© {new Date().getFullYear()} ClickMasters Software Company. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="transition hover:text-background">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="transition hover:text-background">
              Terms of Service
            </Link>
            <Link href="/cookie-policy" className="transition hover:text-background">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}