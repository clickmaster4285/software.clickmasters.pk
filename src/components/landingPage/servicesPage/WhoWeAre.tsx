import Link from "next/link";
import SplitText from "../../ui/SplitText";

interface WhoWeAreProps {
  slug?: string;
}

function getServicePrefix(slug?: string) {
  if (!slug) return "professional";

  const topServices = [
    "machine-learning-ml",
    "artificial-intelligence-ai",
    "data-services",
    "nlp-computer-vision",
  ];

  const leadingServices = ["design-ui-ux", "iot-and-emerging-tech"];

  const affordableServices = [
    "support-and-outsourcing",
    "blockchain-and-web3",
    "testing-and-qa",
  ];

  const bestServices = ["mobile-development", "web-development"];

  if (topServices.includes(slug)) return "top";
  if (leadingServices.includes(slug)) return "leading";
  if (affordableServices.includes(slug)) return "affordable";
  if (bestServices.includes(slug)) return "best";

  return "professional";
}

export function WhoWeAre({ slug }: WhoWeAreProps) {
  const prefix = getServicePrefix(slug);

  return (
    <section className="scroll-mt-24 py-16 md:py-24">
      {/* Heading */}
      <div className="mx-auto max-w-3xl text-center mb-12 sm:mb-14 md:mb-16">
        <div className="inline-flex items-center gap-2 mb-3">
          <span className="h-[2px] w-8 rounded-full bg-primary" />

          <SplitText
            as="h2"
            text="Who We Are"
            className="text-2xl md:text-3xl font-bold uppercase tracking-[0.25em] text-primary"
            delay={60}
            duration={0.8}
            ease="power3.out"
            splitType="words"
            from={{ opacity: 0, x: 60 }}
            to={{ opacity: 1, x: 0 }}
            threshold={0.2}
          />

          <span className="h-[2px] w-8 rounded-full bg-primary" />
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-[1600px]">
        <p className="text-lg md:text-xl leading-relaxed text-slate-900 text-justify">
          ClickMasters provides {prefix}{" "}

          {slug ? (
            <Link
              href={`/${slug}`}
              className="text-primary font-semibold hover:underline"
            >
              {slug.replace(/-/g, " ")}
            </Link>
          ) : (
            "software development"
          )}{" "}

          services for businesses that need reliable digital solutions for their
          operations, customers, and growth. Our team works with startups,
          small businesses, and growing companies to plan, design, and develop
          software that solves real business problems.
        </p>
      </div>
    </section>
  );
}