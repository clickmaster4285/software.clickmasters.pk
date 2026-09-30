"use client";

import { Star, Quote } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import SplitText from "../../ui/SplitText";

export interface Testimonial {
  _id: string;
  authorName: string;
  authorRole?: string;
  authorCompany?: string;
  content: string;
  avatarUrl?: string;
  rating: number;
  statValue?: string;   // e.g. "+38%", "0", "11w", "3×"
  statLabel?: string;   // e.g. "Conversion", "Downtime", "To Launch"
}

/** Get initials from a full name */
function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/** Deterministic avatar bg color per initials */
const AVATAR_COLORS = [
  "bg-indigo-500",
  "bg-teal-600",
  "bg-orange-500",
  "bg-emerald-500",
  "bg-violet-500",
  "bg-rose-500",
];
function avatarColor(name: string) {
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

/** Top border accent per card position */
const BORDER_ACCENTS = [
  "bg-gradient-to-r from-[#0f766e] via-[#0891b2] to-[#164e63]",
  "bg-gradient-to-r from-[#c2410c] via-[#ea580c] to-[#7c2d12]",
  "bg-gradient-to-r from-[#1d4ed8] via-[#4338ca] to-[#312e81]",
  "bg-gradient-to-r from-[#047857] via-[#059669] to-[#064e3b]",
];
/** Stat color per card position */
const STAT_COLORS = [
  "text-teal-600",
  "text-orange-500",
  "text-blue-500",
  "text-emerald-500",
];

interface AuthorBlockProps {
  testimonial: Testimonial;
}

function AuthorBlock({ testimonial }: AuthorBlockProps) {
  const initials = getInitials(testimonial.authorName);
  const colorClass = avatarColor(testimonial.authorName);

  return (
    <div className="flex items-center gap-2.5">
      {/* Avatar */}
      {testimonial.avatarUrl ? (
        <img
          src={testimonial.avatarUrl}
          alt={testimonial.authorName}
          className="h-9 w-9 rounded-full object-cover flex-shrink-0"
        />
      ) : (
        <div
          className={`h-9 w-9 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0 ${colorClass}`}
        >
          {initials}
        </div>
      )}

      {/* Name + Role stacked */}
      <div>
        <div className="font-semibold text-sm text-slate-900 leading-tight">
          {testimonial.authorName}
        </div>
        <div className="text-xs text-gray-800  mt-0.5 leading-tight">
          {testimonial.authorRole}
          {testimonial.authorRole && testimonial.authorCompany ? ", " : ""}
          {testimonial.authorCompany}
        </div>
      </div>
    </div>
  );
}

interface StatBlockProps {
  testimonial: Testimonial;
  colorClass: string;
  large?: boolean;
}

function StatBlock({ testimonial, colorClass, large }: StatBlockProps) {
  if (!testimonial.statValue) return null;

  return (
    <div className="text-right">
      <div
        className={`font-bold leading-none ${colorClass} ${
          large ? "text-3xl" : "text-xl"
        }`}
      >
        {testimonial.statValue}
      </div>
      {testimonial.statLabel && (
        <div className="text-[9px] uppercase tracking-widest text-slate-400 mt-1">
          {testimonial.statLabel}
        </div>
      )}
    </div>
  );
}

export function TestimonialsSection() {
  const { data: testimonials = [] } = useQuery<Testimonial[]>({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const res = await apiFetch("/api/testimonials");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  if (!testimonials.length) return null;

  const main = testimonials[0];
  const side = testimonials.slice(1, 3);
  const bottom = testimonials[3];

  return (
    <section id="testimonials" className="bg-[#f7fbfa] relative py-24 scroll-mt-24">

       <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#a7f3d0] opacity-30 blur-3xl" /> 
      
      <div className="pointer-events-none absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-[#fdba74] opacity-25 blur-3xl" />

      <div className="pointer-events-none absolute top-1/2 -left-32 h-[550px] w-[550px] -translate-y-1/2 rounded-full bg-[#93c5fd] opacity-25 blur-3xl" /> 
      

     <div 
    className="pointer-events-none absolute bottom-[-180px] left-1/4 h-[480px] w-[480px] rounded-full bg-[#a7f3d0] opacity-20 blur-3xl" 
  />
      <div className="mx-auto max-w-[1600px] lg:px-12 sm:px-6 px-4">

        {/* HEADER */}
        <div className="text-center mb-14">
          

           <div className="inline-flex items-center gap-2 mb-3">
                      <span className="h-[2px] w-8 rounded-full bg-primary" />
                       <div className="inline-flex items-center gap-1.5">
            <SplitText
            as="h2"
            text="Trusted by founders &amp; enterprise teams"
            className="text-2xl md:text-3xl font-bold uppercase tracking-[0.25em] text-primary"
            delay={60}
            duration={0.8}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, x: 60 }}
            to={{ opacity: 1, x: 0 }}
            threshold={0.2}
            
          />
          </div>
                      <span className="h-[2px] w-8 rounded-full bg-primary" />
                    </div>



        

          <p className="mt-3 text-gray-900 max-w-2xl mx-auto">
            Real stories from clients who shipped production-grade products with us.
          </p>

          {/* rating */}
          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm border">
            <div className="flex text-orange-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <span className="text-sm font-semibold">4.9 / 5</span>
            <span className="text-xs text-gray-800 ">320+ reviews</span>
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* MAIN CARD */}
          {main && (
            <div
  className="
    lg:col-span-2 bg-white/80 rounded-3xl p-8 shadow-md border
    relative overflow-hidden
  "
>
  <div
    className={`absolute top-0 left-0 w-full h-[8px] ${BORDER_ACCENTS[0]}`}
  />
          <Quote className="absolute right-6 top-6 h-24 w-24 textprimary opacity-10 pointer-events-none" />

              <div className="flex gap-2 text-orange-400 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>

              <p className="text-2xl leading-relaxed text-slate-900">
                &ldquo;{main.content}&rdquo;
              </p>

              <div className="mt-8 flex items-end justify-between">
                <AuthorBlock testimonial={main} />
                <StatBlock
                  testimonial={main}
                  colorClass={STAT_COLORS[0]}
                  large
                />
              </div>
            </div>
          )}

          {/* SIDE CARDS */}
          <div className="flex flex-col gap-6">
            {side.map((t, i) => (
           <div
  key={t._id}
  className="
    bg-white/80 rounded-3xl p-6 shadow-sm border
    relative overflow-hidden
  "
>
  <div
    className={`absolute top-0 left-0 w-full h-[6px] ${BORDER_ACCENTS[i + 1]}`}
  />
                <Quote className="absolute right-4 top-4 h-10 w-10 text-slate-100" />

                <div className="flex gap-1 text-orange-400 mb-3">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="h-3 w-3 fill-current" />
                  ))}
                </div>

                <p className="text-xl text-slate-00">
                  &ldquo;{t.content}&rdquo;
                </p>

                <div className="mt-6 flex items-end justify-between">
                  <AuthorBlock testimonial={t} />
                  <StatBlock
                    testimonial={t}
                    colorClass={STAT_COLORS[i + 1]}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>


        

      
    
{/* BOTTOM GRID */}
<div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

  {[bottom, testimonials[4], testimonials[5]]
    .filter(Boolean)
    .map((item, i) => (
      <div
        key={item!._id}
        className="
          bg-white/80 rounded-3xl p-6 shadow-sm border
          relative overflow-hidden
        "
      >
        <div
          className={`absolute top-0 left-0 w-full h-[6px] ${
            BORDER_ACCENTS[(i + 1) % BORDER_ACCENTS.length]
          }`}
        />

        <Quote className="h-10 w-10 text-slate-100 mb-2" />

        <div className="flex gap-1 text-orange-400 mb-3">
          {Array.from({ length: 5 }).map((_, j) => (
            <Star key={j} className="h-3 w-3 fill-current" />
          ))}
        </div>

        <p className="text-xl text-slate-800">
          &ldquo;{item!.content}&rdquo;
        </p>

        <div className="mt-6 flex items-end justify-between">
          <AuthorBlock testimonial={item!} />

          <StatBlock
            testimonial={item!}
            colorClass={
              STAT_COLORS[(i + 1) % STAT_COLORS.length]
            }
          />
        </div>
      </div>
    ))}

</div>

      </div>
    </section>
  );
}