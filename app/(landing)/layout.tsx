import { ReactNode } from "react";
import dynamic from "next/dynamic";
import { Footer } from "@/src/components/landingPage/Footer";
import { getAllServicePages } from "@/lib/service-pages";
import type { NavFaqPreview } from "@/components/landingPage/navbar";

const Navbar = dynamic(
  () => import("@/components/landingPage/navbar").then((mod) => mod.Navbar),
  {
    loading: () => (
      <div className="h-20 w-full border-b border-black/10 bg-white/95" />
    ),
  }
);

// Computed on the server so the 1 MB+ FAQ / service-page data never ships to the browser.
const allServiceFaqs: NavFaqPreview[] = getAllServicePages().flatMap((service) =>
  (service.faqs || []).map((faq) => ({
    question: faq.question,
    answer: faq.answer.slice(0, 160),
    serviceTitle: service.title,
    serviceSlug: service.slug,
  }))
);
const faqPreview = allServiceFaqs.slice(0, 4);
const faqCount = allServiceFaqs.length;

export default function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen ">
      {/* Sticky Navbar */}
      <header className="sticky top-0 z-50">
        <Navbar faqPreview={faqPreview} faqCount={faqCount} />
      </header>

      {/* Page content — no overflow here so sticky TOC / card stacks use document scroll */}
      <div className="flex-1">{children}</div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
