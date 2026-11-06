import { Metadata } from 'next';

// ─────────────────────────────────────────────────────────────────────────────
//  SEO HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const BRAND_SUFFIX = ' | ClickMasters';
const BRAND_SUFFIX_PATTERN = /\s*\|\s*ClickMasters(\s*\|\s*ClickMasters)*\s*$/gi;
const GEO_SUFFIX_PATTERN = /\s+(in|for)\s+(Pakistan|USA|UK|Europe|Canada|Worldwide)\b.*$/i;
const WHITESPACE = /\s+/g;
const TRAILING_ELLIPSIS = /(\.\.\.|…)$/;
// Recommended lengths. These are WARNINGS only (T6): titles and descriptions are
// never cut or suffixed with "…" — the full CMS/page string is always output.
const RECOMMENDED_SEO_TITLE_LEN = 60;
const RECOMMENDED_META_DESC_LEN = 155;
const MIN_META_DESC_LEN = 70;

function warnLength(kind: string, value: string, max: number) {
  if (process.env.NODE_ENV !== 'production' && value.length > max) {
    console.warn(`[seo] ${kind} is ${value.length} chars (recommended ≤ ${max}): "${value}"`);
  }
}

export function stripBrandSuffix(title: string): string {
  return title.replace(BRAND_SUFFIX_PATTERN, '').trim();
}

/** Normalise whitespace only — headings are no longer truncated. */
export function truncateHeading(text: string): string {
  return text.replace(WHITESPACE, ' ').trim();
}

/**
 * Full title with the brand suffix applied exactly once.
 * Returned as { absolute } so the layout template cannot double-append the brand.
 */
export function formatSeoTitle(title: string): { absolute: string } {
  const stripped = stripBrandSuffix(title.replace(WHITESPACE, ' ').trim()).replace(TRAILING_ELLIPSIS, '').trim();
  const full = stripped ? `${stripped}${BRAND_SUFFIX}` : 'ClickMasters';
  warnLength('Title', full, RECOMMENDED_SEO_TITLE_LEN);
  return { absolute: full };
}

function resolveSeoTitle(title: string): string {
  return formatSeoTitle(title).absolute;
}

/**
 * Meta description: whitespace-normalised, never truncated (T6).
 * Very short descriptions are extended with a fallback sentence.
 */
export function truncateMetaDescription(text?: string, fallback?: string): string {
  const raw = (text ?? '').replace(WHITESPACE, ' ').trim();
  let use = raw || (fallback ?? '').replace(WHITESPACE, ' ').trim();

  if (use.length < MIN_META_DESC_LEN) {
    const extended =
      fallback && fallback.trim() !== raw
        ? fallback.replace(WHITESPACE, ' ').trim()
        : `${use} Expert custom software development by ClickMasters.`.trim();
    if (extended.length >= MIN_META_DESC_LEN) use = extended;
  }

  warnLength('Meta description', use, RECOMMENDED_META_DESC_LEN);
  return use;
}

/**
 * Pakistan-first service title (T6). Default used until Content supplies a final
 * title. Picks the longest candidate that still fits ~62 characters including the
 * brand suffix, e.g. "Custom Software Development Company in Pakistan | ClickMasters".
 * International angles (USA, Europe, Canada…) belong on the /locations/* pages.
 */
export function pakistanFirstServiceTitle(serviceName: string, preferredTitle?: string): string {
  const MAX_WITH_BRAND = 62;
  const lead = stripBrandSuffix(preferredTitle ?? '')
    .split('|')[0]
    .replace(GEO_SUFFIX_PATTERN, '')
    .trim();
  const name = serviceName.trim();
  const candidates = [
    lead && /pakistan/i.test(preferredTitle ?? '') ? stripBrandSuffix(preferredTitle!).split('|')[0].trim() : '',
    lead ? `${lead} in Pakistan` : '',
    `${name} Company in Pakistan`,
    `${name} Services in Pakistan`,
    `${name} in Pakistan`,
  ].filter(Boolean);
  return candidates.find((c) => `${c}${BRAND_SUFFIX}`.length <= MAX_WITH_BRAND) ?? `${name} in Pakistan`;
}

export function withSeoMetadata(meta: Metadata): Metadata {
  const result: Metadata = { ...meta };

  if (typeof meta.title === 'string') {
    result.title = formatSeoTitle(meta.title);
  }

  if (typeof meta.description === 'string') {
    result.description = truncateMetaDescription(meta.description);
  }

  if (meta.openGraph) {
    const ogTitle =
      typeof meta.openGraph.title === 'string'
        ? resolveSeoTitle(meta.openGraph.title)
        : typeof meta.title === 'string'
          ? resolveSeoTitle(meta.title)
          : undefined;

    result.openGraph = {
      ...meta.openGraph,
      ...(ogTitle ? { title: ogTitle } : {}),
      ...(typeof meta.openGraph.description === 'string'
        ? { description: truncateMetaDescription(meta.openGraph.description) }
        : typeof meta.description === 'string'
          ? { description: truncateMetaDescription(meta.description) }
          : {}),
    };
  }

  if (meta.twitter) {
    const twitterTitle =
      typeof meta.twitter.title === 'string'
        ? resolveSeoTitle(meta.twitter.title)
        : typeof meta.title === 'string'
          ? resolveSeoTitle(meta.title)
          : undefined;

    result.twitter = {
      ...meta.twitter,
      ...(twitterTitle ? { title: twitterTitle } : {}),
      ...(typeof meta.twitter.description === 'string'
        ? { description: truncateMetaDescription(meta.twitter.description) }
        : typeof meta.description === 'string'
          ? { description: truncateMetaDescription(meta.description) }
          : {}),
    };
  }

  return result;
}

export function buildPageMetadata(options: {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
  ogImageAlt?: string;
  robots?: Metadata['robots'];
  /** hreflang alternates, e.g. { 'en-AE': url, 'x-default': url } */
  languages?: Record<string, string>;
}): Metadata {
  const description = truncateMetaDescription(options.description);
  const resolvedTitle = resolveSeoTitle(options.title);

  return withSeoMetadata({
    title: options.title,
    description,
    alternates: {
      canonical: options.canonical,
      ...(options.languages ? { languages: options.languages } : {}),
    },
    openGraph: {
      title: resolvedTitle,
      description,
      url: options.canonical,
      ...(options.ogImage
        ? {
            images: [
              {
                url: options.ogImage,
                width: 1200,
                height: 630,
                alt: options.ogImageAlt || options.title,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: resolvedTitle,
      description,
      ...(options.ogImage ? { images: [options.ogImage] } : {}),
    },
    ...(options.robots ? { robots: options.robots } : {}),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
//  SITE CONFIG
// ─────────────────────────────────────────────────────────────────────────────

export const siteConfig = {
  name: 'Clickmasters Digital Marketing Agency',

  title: 'ClickMasters – Software Development Company',

  description:
    'ClickMasters is a professional custom software development company ' +
    'building web apps, mobile apps, SaaS, AI systems, and enterprise software.',

  url: process.env.NEXT_PUBLIC_APP_URL || 'https://software.clickmasters.pk',

  ogImage: '/og/logo-white1.webp',

  twitterHandle: '@clickmasters',

  locale: 'en_US',
};

// ─────────────────────────────────────────────────────────────────────────────
//  JSON-LD SCHEMA HELPERS
//  Inject these via <script type="application/ld+json"> in your page/layout.
//  Add organizationSchema + webSiteSchema to your root layout.tsx.
// ─────────────────────────────────────────────────────────────────────────────

/** Organization – goes in root layout.tsx */
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${siteConfig.url}/#organization`,

  name: 'ClickMasters',
  alternateName: 'ClickMasters Software',
  url: siteConfig.url,
  logo: `${siteConfig.url}/images/logo-white1.webp`,
  image: `${siteConfig.url}/og-image.jpg`,

  description:
    'ClickMasters is a professional custom software development company ' +
    'building web apps, mobile apps, SaaS, AI systems, and enterprise software.',

  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Office # 403, 4th Floor, Paris Shopping Mall, Police Foundation',
    addressLocality: 'Islamabad',
    addressRegion: 'Punjab',
    postalCode: '45700',
    addressCountry: 'PK',
  },

  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: '+92-327-7775551',
      contactType: 'customer service',
      availableLanguage: 'English',
      url: `${siteConfig.url}/contact-us`,
    },
    {
      '@type': 'ContactPoint',
      email: 'info@software.clickmasters.pk',
      contactType: 'customer support',
      availableLanguage: 'English',
      url: `${siteConfig.url}/contact-us`,
    },
  ],

  sameAs: [
    'https://www.linkedin.com/company/clickmasters-digital-marketing-agency',
    'https://www.instagram.com/clickmasters.pk/',
    'https://www.facebook.com/clickmasterspvtltd',
    'https://www.youtube.com/@clickmastersofficial',
    'https://www.pinterest.com/clickmasters00/',
  ],
};

/** Alias used by the homepage */
export const homepageOrganizationSchema = organizationSchema;

/** WebSite – enables Google Sitelinks Search Box */
export const webSiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${siteConfig.url}/#website`,

  name: 'ClickMasters',
  url: siteConfig.url,

  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

/** Service catalog – use on homepage or /services page */
export const homepageServiceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  '@id': `${siteConfig.url}/#primary-service`,
  name: 'Custom Software Development Services',
  serviceType: 'Custom Software Development',
  description:
    'Professional custom software development services including web apps, mobile apps, SaaS, AI, and enterprise systems.',
  url: siteConfig.url,
  provider: {
    '@type': 'Organization',
    '@id': `${siteConfig.url}/#organization`,
    name: 'ClickMasters',
    url: siteConfig.url,
  },
  areaServed: {
    '@type': 'Country',
    name: 'Pakistan',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Software Development Services',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Custom Software Development',
          description: 'Tailored software built for your business needs',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Web Application Development',
          description: 'Modern web apps with React, Next.js and cloud hosting',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Mobile App Development',
          description: 'Native and cross-platform iOS and Android apps',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'SaaS Product Development',
          description: 'End-to-end SaaS platform development and scaling',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'AI & Automation Systems',
          description: 'AI-powered software and intelligent automation solutions',
        },
      },
    ],
  },
};

/** FAQ – use on homepage or any page with an FAQ section */
export const homepageFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': `${siteConfig.url}/#faq`,
  mainEntityOfPage: `${siteConfig.url}/`,
  inLanguage: 'en',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much does custom software development cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Custom software development costs vary based on complexity, features, and timeline. A basic web application typically starts from $5,000–$15,000, while enterprise systems range from $30,000–$200,000+. We provide free consultations to give accurate project estimates.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does it take to build a custom software application?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Development timelines depend on the project scope. An MVP takes 6–12 weeks, a full web or mobile application takes 3–6 months, and enterprise systems can take 6–18 months. We use agile sprints to deliver working software every 2 weeks.',
      },
    },
    {
      '@type': 'Question',
      name: 'What technologies does ClickMasters use?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "We use modern, proven technologies including React, Next.js, Node.js, Python, Flutter, React Native, PostgreSQL, MongoDB, AWS, Google Cloud, and Azure. We choose the best stack for each project's specific needs.",
      },
    },
    {
      '@type': 'Question',
      name: 'Do you provide post-launch support and maintenance?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. ClickMasters provides 24/7 post-launch support, security updates, performance monitoring, and feature development. We offer monthly maintenance plans to keep your software running smoothly.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can ClickMasters work with international clients?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. We work with clients across the USA, Europe, Middle East, and worldwide. Our team operates across time zones and uses agile project management tools to ensure seamless collaboration regardless of location.',
      },
    },
  ],
};

/** WebPage – add to homepage for rich result context */
export const homepageWebPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${siteConfig.url}/#webpage`,
  url: `${siteConfig.url}/`,
  name: 'Best Software Development Company in Pakistan',
  description:
    'Leading software development company in Pakistan building web apps, mobile apps, SaaS, AI, and ERP. Hire expert developers for scalable digital products.',
  inLanguage: 'en',
  isPartOf: {
    '@type': 'WebSite',
    '@id': `${siteConfig.url}/#website`,
    url: siteConfig.url,
    name: 'ClickMasters',
  },
  about: {
    '@type': 'Organization',
    '@id': `${siteConfig.url}/#organization`,
    name: 'ClickMasters',
  },
  primaryImageOfPage: {
    '@type': 'ImageObject',
    url: `${siteConfig.url}/og-image.jpg`,
    width: 1200,
    height: 630,
  },
};

export type BreadcrumbItem = {
  name: string;
  url: string;
};

function toAbsoluteUrl(url: string) {
  if (!url) return siteConfig.url;
  if (/^https?:\/\//i.test(url)) return url;
  const normalizedPath = url.startsWith('/') ? url : `/${url}`;
  return `${siteConfig.url}${normalizedPath}`;
}

/** Breadcrumbs – call on every inner page */
export function breadcrumbSchema(crumbs: BreadcrumbItem[]) {
  const cleanedCrumbs = crumbs
    .map((crumb) => ({
      name: crumb.name?.trim(),
      url: toAbsoluteUrl(crumb.url?.trim()),
    }))
    .filter((crumb) => Boolean(crumb.name && crumb.url));

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: cleanedCrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

/** FAQ rich results – use on any page that has a FAQ section */
export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

/** Service – use on hub, sub-service and location service pages */
export function serviceSchema(
  name: string,
  description: string,
  url: string,
  options: { areaServed?: string | string[]; serviceType?: string } = {},
) {
  const areas = Array.isArray(options.areaServed)
    ? options.areaServed
    : [options.areaServed ?? 'Pakistan'];
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${url}#service`,
    name,
    serviceType: options.serviceType ?? name,
    provider: {
      '@type': 'Organization',
      '@id': `${siteConfig.url}/#organization`,
      name: 'ClickMasters',
      url: siteConfig.url,
    },
    areaServed: areas.map((area) => ({ '@type': 'Country', name: area })),
    description,
    url,
  };
}

/** Person block for the blog/case-study author (same as BlogPosting author). */
export const authorPersonSchema = {
  '@type': 'Person',
  name: 'Amjad Khan',
  url: `${siteConfig.url}/about-us`,
  // Add the author's LinkedIn profile here (sameAs) to match the BlogPosting author block.
};

/** Article – use on case-study detail pages */
export function articleSchema(opts: {
  headline: string;
  description?: string;
  url: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  about?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.headline,
    ...(opts.description ? { description: opts.description } : {}),
    url: opts.url,
    mainEntityOfPage: opts.url,
    ...(opts.image ? { image: toAbsoluteUrl(opts.image) } : {}),
    ...(opts.datePublished ? { datePublished: opts.datePublished } : {}),
    ...(opts.dateModified || opts.datePublished
      ? { dateModified: opts.dateModified ?? opts.datePublished }
      : {}),
    author: authorPersonSchema,
    publisher: {
      '@type': 'Organization',
      '@id': `${siteConfig.url}/#organization`,
      name: 'ClickMasters',
      logo: { '@type': 'ImageObject', url: `${siteConfig.url}/images/logo-white1.webp` },
    },
    ...(opts.about ? { about: { '@type': 'Thing', name: opts.about } } : {}),
  };
}

/** SoftwareApplication – use on /software-solutions/[slug] */
export function softwareAppSchema(opts: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: opts.name,
    description: opts.description,
    url: opts.url,
    applicationCategory: 'BusinessApplication',
    author: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };
}

/**
 * AggregateRating – add to /testimonials page.
 * Unlocks star ratings in Google SERPs (15–30% CTR lift).
 * ⚠️  Replace ratingValue and reviewCount with real data before deploying.
 */
export const aggregateRatingSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${siteConfig.url}/#organization`,
  name: siteConfig.name,
  url: siteConfig.url,
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '112', // ← replace with real count
    bestRating: '5',
    worstRating: '1',
  },
};

/** LocalBusiness – add to /contact page */
export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${siteConfig.url}/#business`,

  name: siteConfig.name,
  url: siteConfig.url,

  logo: `${siteConfig.url}/images/logo-white1.webp`,
  image: `${siteConfig.url}/og/logo-white1.webp`,

  description: siteConfig.description,

  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Office # 403, 4th Floor, Paris Shopping Mall, Police Foundation',
    addressLocality: 'Islamabad',
    addressRegion: 'Punjab',
    postalCode: '45700',
    addressCountry: 'PK',
  },

  telephone: '+92-327-7775551',
  email: 'info@software.clickmasters.pk',

  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '18:00',
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
//  DEFAULT / FALLBACK METADATA  (used in root layout.tsx)
// ─────────────────────────────────────────────────────────────────────────────

export const defaultMetadata: Metadata = withSeoMetadata({
  metadataBase: new URL(siteConfig.url),

  title: {
    default: siteConfig.title,
    template: '%s | ClickMasters',
  },

  description: siteConfig.description,

  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },

  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: 'ClickMasters Software Development Company',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    site: siteConfig.twitterHandle,
    creator: siteConfig.twitterHandle,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [`${siteConfig.url}/og/logo-white1.webp`],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  verification: {
    google: 'tH8GZm7N2hbAICQfeQEs4YejO057UvY4eJBWLkHHJxU',
  },
});

// ─────────────────────────────────────────────────────────────────────────────
//  PER-PAGE METADATA
//  Titles: your originals, preserved exactly.
//  Descriptions: SEO-optimized, 140–155 chars, no | ClickMasters duplication.
// ─────────────────────────────────────────────────────────────────────────────

export const metadataConfig = {

  // ── / (Home) ────────────────────────────────────────────────────────────────
  home: (): Metadata => withSeoMetadata({
    title: 'Best Software Development Company in Pakistan',

    description:
      'Leading software development company in Pakistan. We build web apps, mobile apps, SaaS, AI systems & ERP. Hire expert developers for scalable digital products.',

    alternates: {
      canonical: `${siteConfig.url}/`,
    },

    openGraph: {
      title: 'Best Software Development Company in Pakistan',
      description:
        'Leading software development company in Pakistan. We build web apps, mobile apps, SaaS, AI systems & ERP. Hire expert developers for scalable digital products.',
      url: siteConfig.url,
      siteName: 'ClickMasters',
      type: 'website',
      images: [
        {
          url: `${siteConfig.url}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: 'Best Software Development Company in Pakistan - ClickMasters',
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title: 'Best Software Development Company in Pakistan',
      description:
        'Leading software development company in Pakistan. We build web apps, mobile apps, SaaS, AI systems & ERP. Hire expert developers for scalable digital products.',
      images: [`${siteConfig.url}/og-image.jpg`],
    },
  }),

  // ── /about-us ───────────────────────────────────────────────────────────────
  about: (): Metadata => withSeoMetadata({
    title: 'ClickMasters Software House | The Team Behind 100+ Products',

    description:
      '50+ engineers. 100+ products shipped. 10+ years building web apps, mobile apps, SaaS & AI solutions for startups and global enterprises. Meet the team.',

    alternates: { canonical: `${siteConfig.url}/about-us` },

    openGraph: {
      title: 'ClickMasters Software House | The Team Behind 100+ Products',
      description:
        'From a small dev team to 50+ engineers delivering 100+ software products worldwide ClickMasters builds web, mobile, SaaS & AI solutions that scale.',
      url: `${siteConfig.url}/about-us`,
      images: [
        {
          url: `${siteConfig.url}/og/og-about.jpg`,
          width: 1200,
          height: 630,
          alt: 'ClickMasters engineering team software development company',
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title: 'ClickMasters Software House | The Team Behind 100+ Products',
      description:
        '50+ engineers. 100+ projects. 10+ years. ClickMasters builds scalable digital solutions for startups and global enterprises worldwide.',
      images: [`${siteConfig.url}/og/og-about.jpg`],
    },
  }),

  // ── /services ───────────────────────────────────────────────────────────────
  services: (): Metadata => withSeoMetadata({
    title: 'Software Development Services | Web, Mobile & ERP',

    description:
      'Full-cycle custom software development: web apps, mobile, ERP, APIs & cloud. Trusted by startups and enterprises worldwide. Book a free consultation today.',

    alternates: { canonical: `${siteConfig.url}/software-solutions` },

    openGraph: {
      title: 'Software Development Services | Web, Mobile & ERP',
      description:
        'Full-cycle development for web apps, mobile apps, ERP, APIs & cloud. Tailored to your business goals. Free consultation available get started today.',
      url: `${siteConfig.url}/software-solutions`,
      images: [
        {
          url: `${siteConfig.url}/og/og-services.jpg`,
          width: 1200,
          height: 630,
          alt: 'ClickMasters software development services',
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title: 'Software Development Services | Web, Mobile & ERP',
      description:
        'Web apps, mobile apps, ERP, APIs & cloud. Full-cycle development tailored to your business. Free consultation available.',
      images: [`${siteConfig.url}/og/og-services.jpg`],
    },
  }),


  serviceDetail: (title: string, description: string, slug: string, parentSlug?: string): Metadata => withSeoMetadata({
    title,

    description: truncateMetaDescription(description),

    alternates: {
      canonical: parentSlug ? `${siteConfig.url}/${parentSlug}/${slug}` : `${siteConfig.url}/${slug}`,
    },

    openGraph: {
      title,
      description: truncateMetaDescription(description),
      url: parentSlug ? `${siteConfig.url}/${parentSlug}/${slug}` : `${siteConfig.url}/${slug}`,
      images: [
        {
          url: `${siteConfig.url}/og/og-services.jpg`,
          width: 1200,
          height: 630,
          alt: `${title} ClickMasters software services`,
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title,
      description: truncateMetaDescription(description),
      images: [`${siteConfig.url}/og/og-services.jpg`],
    },
  }),

  // ── /software-solutions ─────────────────────────────────────────────────────
  solutions: (): Metadata => withSeoMetadata({
    title: "What We've Built | 100+ Scalable Software Systems",

    description:
      'Explore how ClickMasters builds software for real businesses web platforms, enterprise SaaS, and ERP systems. Browse 100+ production-grade solutions we delivered.',

    alternates: { canonical: `${siteConfig.url}/software-solutions` },

    openGraph: {
      title: "What We've Built | 100+ Scalable Software Systems",
      description:
        'Production systems used by real businesses. See how ClickMasters engineers scalable software for fintech, healthcare, retail, and logistics companies.',
      url: `${siteConfig.url}/software-solutions`,
      images: [
        {
          url: `${siteConfig.url}/og/og-solutions.jpg`,
          width: 1200,
          height: 630,
          alt: 'ClickMasters software portfolio 100+ scalable systems',
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title: "What We've Built | 100+ Scalable Software Systems",
      description:
        'Real production software powering fintech, healthcare, retail & logistics built for scale and performance by ClickMasters.',
      images: [`${siteConfig.url}/og/og-solutions.jpg`],
    },
  }),

  // ── /software-solutions/[slug] ───────────────────────────────────────────────
  solutionsDetail: (
    title: string,
    description: string,
    slug: string,
    ogImageUrl?: string,
  ): Metadata => withSeoMetadata({
    title,

    description: truncateMetaDescription(
      description ||
      `ClickMasters transforms ${title} into powerful, scalable, revenue-ready software. See how we built this high-impact digital product from idea to production.`
    ),

    alternates: {
      canonical: `${siteConfig.url}/software-solutions/${slug}`,
    },

    openGraph: {
      title,
      description: truncateMetaDescription(
        description ||
        `We don't just build software we build growth engines. See how ClickMasters delivered a high-impact ${title} solution that scales with your business.`
      ),
      url: `${siteConfig.url}/software-solutions/${slug}`,
      images: [
        {
          url: ogImageUrl || `${siteConfig.url}/og/og-solutions.jpg`,
          width: 1200,
          height: 630,
          alt: `${title} – built by ClickMasters software development company`,
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title,
      description: truncateMetaDescription(
        description ||
        `ClickMasters builds scalable ${title} solutions designed for performance, growth, and real-world business impact.`
      ),
      images: [ogImageUrl || `${siteConfig.url}/og/og-solutions.jpg`],
    },
  }),

  // ── /case-studies ────────────────────────────────────────────────────────────
  caseStudies: (): Metadata => withSeoMetadata({
    title: 'How Businesses Turn Ideas Into High-Performance Software',

    description:
      'Explore real client transformation stories from ClickMasters startups and enterprises turning ideas into powerful web apps, mobile apps, and SaaS platforms.',

    alternates: { canonical: `${siteConfig.url}/case-studies` },

    openGraph: {
      title: 'How Businesses Turn Ideas Into High-Performance Software',
      description:
        'Real engineering stories. See how ClickMasters builds scalable systems powering businesses across the USA, Europe, and Middle East.',
      url: `${siteConfig.url}/case-studies`,
      images: [
        {
          url: `${siteConfig.url}/og/og-case-studies.jpg`,
          width: 1200,
          height: 630,
          alt: 'ClickMasters real software transformation case studies',
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title: 'How Businesses Turn Ideas Into High-Performance Software',
      description:
        'See how real businesses build scalable software with ClickMasters AI, SaaS, and enterprise systems built for growth.',
      images: [`${siteConfig.url}/og/og-case-studies.jpg`],
    },
  }),

  // ── /case-studies/[slug] ─────────────────────────────────────────────────────
  caseStudyDetail: (title: string, description: string, slug: string): Metadata => withSeoMetadata({
    title,
    description: truncateMetaDescription(description),
    alternates: { canonical: `${siteConfig.url}/case-studies/${slug}` },
    openGraph: {
      title,
      description: truncateMetaDescription(description),
      url: `${siteConfig.url}/case-studies/${slug}`,
    },
    twitter: { description: truncateMetaDescription(description) },
  }),

  // ── /blog ───────────────────────────────────────────────────────────────────
  blog: (): Metadata => withSeoMetadata({
    title: 'The Hidden Formula Behind Fast-Growing Software Products',

    description:
      'Discover real engineering principles behind successful software systems. Learn how scalable AI platforms, SaaS products, and modern web apps are built for millions of users.',

    alternates: { canonical: `${siteConfig.url}/blog` },

    openGraph: {
      title: 'The Hidden Formula Behind Fast-Growing Software Products',
      description:
        'Not trends real engineering. See how production-grade AI systems, SaaS platforms, and scalable applications are designed to survive growth and peak demand.',
      url: `${siteConfig.url}/blog`,
      images: [
        {
          url: `${siteConfig.url}/og/og-blog.jpg`,
          width: 1200,
          height: 630,
          alt: 'ClickMasters software engineering insights and blog',
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title: 'The Hidden Formula Behind Fast-Growing Software Products',
      description:
        'Real engineering behind high-growth SaaS, AI systems, and scalable software built for performance and millions of users.',
      images: [`${siteConfig.url}/og/og-blog.jpg`],
    },
  }),

  // ── /testimonials ───────────────────────────────────────────────────────────
  testimonials: (): Metadata => withSeoMetadata({
    title: 'Why 100+ Businesses Trust ClickMasters',

    description:
      'See why startups and enterprises rate ClickMasters 4.9/5. Real success stories from fintech, healthcare, retail & logistics scalable web, mobile & SaaS products.',

    alternates: { canonical: `${siteConfig.url}/testimonials` },

    openGraph: {
      title: 'Why 100+ Businesses Trust ClickMasters',
      description:
        '100+ real businesses. 4.9/5 rating. Discover why clients trust ClickMasters to turn ideas into powerful, revenue-driving digital products.',
      url: `${siteConfig.url}/testimonials`,
      images: [
        {
          url: `${siteConfig.url}/og/og-testimonials.jpg`,
          width: 1200,
          height: 630,
          alt: 'Client success stories ClickMasters software development',
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title: 'Why 100+ Businesses Trust ClickMasters',
      description:
        'Real businesses. Real results. 4.9/5 rated. See why clients choose ClickMasters for scalable software solutions.',
      images: [`${siteConfig.url}/og/og-testimonials.jpg`],
    },
  }),

  // ── /contact-us ─────────────────────────────────────────────────────────────
  contact: (): Metadata => withSeoMetadata({
    title: 'Turn Your Idea Into Software | Get a Free Expert Consultation',

    description:
      'Have a software idea or project in mind? Talk directly to ClickMasters engineers and get a free, no-obligation consultation. Fast response within 24 hours.',

    alternates: { canonical: `${siteConfig.url}/contact-us` },

    openGraph: {
      title: 'Turn Your Idea Into Software | Get a Free Expert Consultation',
      description:
        'Speak with experienced software engineers and turn your idea into a scalable product. Get a fast, free consultation response within 24 hours.',
      url: `${siteConfig.url}/contact-us`,
      images: [
        {
          url: `${siteConfig.url}/og/og-contact.jpg`,
          width: 1200,
          height: 630,
          alt: 'ClickMasters software engineers ready for consultation',
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title: 'Turn Your Idea Into Software | Get a Free Expert Consultation',
      description:
        'Get a free consultation with software engineers. We build web apps, mobile apps, SaaS & AI products fast response within 24 hours.',
      images: [`${siteConfig.url}/og/og-contact.jpg`],
    },
  }),

  // ── Admin pages (no-index) ───────────────────────────────────────────────────
  admin: {
    login: (): Metadata => withSeoMetadata({
      title: 'Admin Login | ClickMasters',
      description: 'Secure admin access for the ClickMasters platform.',
      robots: { index: false, follow: false },
    }),
    dashboard: (): Metadata => withSeoMetadata({
      title: 'Admin Dashboard | ClickMasters',
      description: 'Manage your ClickMasters content and settings.',
      robots: { index: false, follow: false },
    }),
    categories: (): Metadata => withSeoMetadata({
      title: 'Manage Categories | ClickMasters Admin',
      description: 'Manage project categories for ClickMasters.',
      robots: { index: false, follow: false },
    }),
    solutions: (): Metadata => withSeoMetadata({
      title: 'Manage Solutions | ClickMasters Admin',
      description: 'Manage software solutions and projects.',
      robots: { index: false, follow: false },
    }),
    testimonials: (): Metadata => withSeoMetadata({
      title: 'Manage Testimonials | ClickMasters Admin',
      description: 'Manage client testimonials.',
      robots: { index: false, follow: false },
    }),
  },
};