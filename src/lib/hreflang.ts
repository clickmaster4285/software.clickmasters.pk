/**
 * hreflang alternates between a Pakistan-default sub-service page and its
 * /locations/{country}/{service}-{country} versions (T2).
 *
 * The same set is emitted on every member of the group so the annotations are
 * reciprocal, with x-default pointing at the Pakistan page.
 * SERVER-ONLY (imports the large country-services dataset).
 */
import { getCountryServicePage } from './country-services';
import { getServicePage } from './service-pages';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://software.clickmasters.pk';

/** Country slug -> BCP 47 language-region code (content is English everywhere). */
export const COUNTRY_HREFLANG: Record<string, string> = {
  uae: 'en-AE',
  uk: 'en-GB',
  usa: 'en-US',
  canada: 'en-CA',
  germany: 'en-DE',
  australia: 'en-AU',
};

/** "custom-software-development-uae" -> "custom-software-development" */
export function baseServiceSlug(countryServiceSlug: string, country: string): string {
  const suffix = `-${country.toLowerCase()}`;
  return countryServiceSlug.endsWith(suffix)
    ? countryServiceSlug.slice(0, -suffix.length)
    : countryServiceSlug;
}

/**
 * Build metadata.alternates.languages for a base sub-service slug.
 * Returns undefined when the service has no country versions.
 */
export function serviceHreflangAlternates(baseSlug: string): Record<string, string> | undefined {
  const languages: Record<string, string> = {};

  for (const [country, code] of Object.entries(COUNTRY_HREFLANG)) {
    const page = getCountryServicePage(`${baseSlug}-${country}`, country);
    if (page) languages[code] = `${SITE_URL}/locations/${country}/${page.slug}`;
  }
  if (Object.keys(languages).length === 0) return undefined;

  const pakistanPage = getServicePage(baseSlug);
  if (pakistanPage) {
    const url = `${SITE_URL}/${pakistanPage.categorySlug}/${pakistanPage.slug}`;
    languages['en-PK'] = url;
    languages['x-default'] = url;
  }
  return languages;
}
