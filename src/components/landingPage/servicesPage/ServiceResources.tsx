import Link from 'next/link';
import type { ServiceResources as ServiceResourcesData } from '@/src/lib/service-resources';

type Props = {
  serviceName: string;
  resources: ServiceResourcesData;
};

/**
 * "Resources for {service}" block (T3). Server-rendered <a href> links to every
 * programmatic child page of the sub-service: persona, goal, how-to, checklist, FAQ.
 */
export function ServiceResources({ serviceName, resources }: Props) {
  const groups = [
    { title: "Who it's for", links: resources.personas },
    { title: 'Outcomes', links: resources.goals },
    { title: 'Guides', links: resources.guides },
  ].filter((group) => group.links.length > 0);

  if (groups.length === 0) return null;

  return (
    <section id="resources" className="scroll-mt-24 pt-16" aria-labelledby="service-resources-heading">
      <div className="flex items-center gap-3">
        <div className="h-10 w-1 rounded-full bg-primary" />
        <h2 id="service-resources-heading" className="text-2xl font-semibold text-slate-900 sm:text-3xl">
          Resources for {serviceName}
        </h2>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <nav
            key={group.title}
            aria-label={`${serviceName}: ${group.title}`}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-500">{group.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[15px] font-medium text-slate-900 underline-offset-4 transition-colors hover:text-primary hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
    </section>
  );
}
