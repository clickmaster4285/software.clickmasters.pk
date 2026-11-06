"use client";

import { Check } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
// Type-only: the 1.5 MB checklist dataset stays on the server (T12).
import type { Checklist } from '@/src/lib/service_checklist';
import ChecklistMainContent from '@/src/components/landingPage/checklist/ChecklistMainContent';
import { ChecklistCTAHero } from '@/src/components/landingPage/checklist/ChecklistCTAHero.tsx';
import { EngineeringBaseline } from '@/src/components/landingPage/servicesPage/EngineeringBaseline';
import { ServiceSubpageBreadcrumb } from '@/src/components/landingPage/servicesPage/ServiceSubpageBreadcrumb';
import { subpageInnerPadding, subpageOuterPadding } from "@/src/components/landingPage/servicesPage/subpage-layout";

interface ChecklistHeroProps {
  checklist: any;
  overallPercentage: number;
  phaseIcons: Record<string, { icon: string; color: string; bg: string }>;
  getPhasePercentage: (phaseKey: string) => number;
  getDoneCount: (phaseKey: string) => number;
}

function AnimatedCounter({ end, duration = 1200 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(end * progress));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration]);

  return <span className="font-head text-4xl font-extrabold text-[#1A1A2E] tabular-nums">{count}</span>;
}

export default function ChecklistHero({
  checklist,
  overallPercentage,
  phaseIcons,
  getPhasePercentage,
  getDoneCount,
}: ChecklistHeroProps) {
  return (
    <section className="bg-white border-b border-[#E4E6EF] py-16">
      <div className={subpageOuterPadding}>
        <div className={`${subpageInnerPadding} grid md:grid-cols-[1fr_420px] gap-16 items-start`}>
        
        {/* Left Section - Hero Content */}
        <div className="max-w-5xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#FFF3ED] border border-primary/10 text-primary text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-6">
            <i className="fa-solid fa-circle-check text-[11px]"></i>
            {checklist.heroBadgeText.split("|")[0].trim()}
          </div>

          {/* Title */}
          <h1 className="font-head text-4xl md:text-6xl font-extrabold text-[#1A1A2E] leading-[1.1] tracking-tighter mb-6">
            {checklist.heroTitleMain.split(" ").slice(0, -1).join(" ")}{" "}
            <span className="text-primary">{checklist.heroTitleHighlight}</span>
          </h1>

          {/* Description */}
          <p className="text-lg text-[#5A5A72] leading-relaxed max-w-xl mb-10">
            {checklist.heroDescription}
          </p>

          {/* Stats with Counters */}
          <div className="flex gap-10">
            {checklist.stats.map((stat: any, idx: number) => (
              <div key={idx} className="group">
                <div className="flex items-baseline gap-1">
                  <AnimatedCounter end={parseInt(stat.num)} />
                  {stat.suffix && (
                    <span className="text-3xl font-bold text-[#1A1A2E]">{stat.suffix}</span>
                  )}
                </div>
                <div className="text-sm text-[#8888A0] font-medium mt-1 tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Section - Professional Progress Card */}
        <div>
          <div className="bg-white border border-[#E4E6EF] rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500">
            
            {/* Header */}
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-3">
               
                <div>
                  <h3 className="font-bold text-xl text-[#1A1A2E]">Your Progress</h3>
                  <p className="text-sm text-[#8888A0]">Real-time completion tracker</p>
                </div>
              </div>

              {/* Overall Percentage */}
              <div className="text-right">
                <div className="text-5xl font-extrabold text-primary tabular-nums">
                  {overallPercentage}
                  <span className="text-2xl">%</span>
                </div>
                <div className="text-xs text-[#8888A0] -mt-1">COMPLETE</div>
              </div>
            </div>

            {/* Overall Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-[#5A5A72] mb-2.5">
                <span className="font-medium">Overall Progress</span>
                <span className="font-semibold text-primary">{overallPercentage}%</span>
              </div>
              <div className="h-3 bg-[#F1F3F7] rounded-2xl overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary via-primary to-primary/90 rounded-2xl transition-all duration-700 ease-out relative"
                  style={{ width: `${overallPercentage}%` }}
                >
                  <div className="absolute inset-0 bg-white/30 animate-[pulse_2s_ease-in-out_infinite]" />
                </div>
              </div>
            </div>

            {/* Phase Progress */}
            <div className="space-y-6">
              {checklist.phases.map((phase: any) => {
                const percentage = getPhasePercentage(phase.key);
                const phaseIcon = phaseIcons[phase.key];

                return (
                  <div key={phase.key} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                    
                                <Check className="h-5 w-5 text-green-600"/>
                        <span className="font-semibold text-[#1A1A2E]">{phase.title}</span>
                      </div>

                      <div className="flex items-center gap-3 text-right">
                        <span className="font-bold text-primary text-base tabular-nums">
                          {percentage}%
                        </span>
                        <span className="text-xs text-[#8888A0] font-medium">
                          {getDoneCount(phase.key)}/{phase.items.length}
                        </span>
                      </div>
                    </div>

                    {/* Phase Bar */}
                    <div className="h-2 bg-[#F1F3F7] rounded-2xl overflow-hidden">
                      <div
                        className="h-full rounded-2xl transition-all duration-700 ease-out"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: phaseIcon?.color || "#6366f1",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Motivational Footer */}
            <div className="mt-8 pt-6 border-t border-[#E4E6EF]">
              <div className="flex gap-3 text-sm">
                <i
                  className={`fa-solid mt-0.5 text-lg ${
                    overallPercentage === 100
                      ? "fa-trophy text-amber-500"
                      : overallPercentage >= 75
                      ? "fa-rocket text-primary"
                      : overallPercentage >= 50
                      ? "fa-fire text-orange-500"
                      : "fa-bullhorn text-[#8888A0]"
                  }`}
                />
                <p className="text-[#5A5A72] leading-relaxed">
                  {overallPercentage === 100
                    ? "🎉 Outstanding! You've completed the entire checklist."
                    : overallPercentage >= 75
                    ? "You're almost there. Just a few more steps to go!"
                    : overallPercentage >= 50
                    ? "Solid progress! You're more than halfway through."
                    : overallPercentage >= 25
                    ? "Great start — keep the momentum going."
                    : "Start completing tasks to track your progress."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}

const phaseIcons: Record<string, { icon: string; color: string; bg: string }> = {
  pre: { icon: 'fa-solid fa-file-signature', color: '#D97706', bg: '#FEF3C7' },
  sprint: { icon: 'fa-solid fa-arrows-rotate', color: '#2563EB', bg: '#DBEAFE' },
  launch: { icon: 'fa-solid fa-rocket', color: '#E8692A', bg: '#FFF3ED' },
  post: { icon: 'fa-solid fa-chart-line', color: '#059669', bg: '#D1FAE5' },
};

export function ChecklistPageClient({
  slug,
  service,
  checklist,
}: {
  slug: string;
  service: string;
  checklist: Checklist;
}) {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<'all' | string>('all');

  useEffect(() => {
    const saved = localStorage.getItem(`checklist-${service}`);
    if (saved) {
      setCheckedItems(JSON.parse(saved));
    }
  }, [service]);

  useEffect(() => {
    localStorage.setItem(`checklist-${service}`, JSON.stringify(checkedItems));
  }, [checkedItems, service]);

  const toggleItem = useCallback((itemId: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  }, []);

  const checkAll = useCallback(
    (phaseKey: string) => {
      const phase = checklist.phases.find((p) => p.key === phaseKey);
      if (!phase) return;

      const allChecked = phase.items.every((item) => checkedItems[item.id]);

      setCheckedItems((prev) => {
        const newState = { ...prev };
        phase.items.forEach((item) => {
          newState[item.id] = !allChecked;
        });
        return newState;
      });
    },
    [checklist, checkedItems],
  );

  const getDoneCount = useCallback(
    (phaseKey: string): number => {
      const phase = checklist.phases.find((p) => p.key === phaseKey);
      if (!phase) return 0;
      return phase.items.filter((item) => checkedItems[item.id]).length;
    },
    [checklist, checkedItems],
  );

  const getPhasePercentage = useCallback(
    (phaseKey: string): number => {
      const phase = checklist.phases.find((p) => p.key === phaseKey);
      if (!phase) return 0;
      const done = getDoneCount(phaseKey);
      return phase.items.length > 0 ? Math.round((done / phase.items.length) * 100) : 0;
    },
    [checklist, getDoneCount],
  );

  const getTotalDone = useCallback((): number => {
    return Object.values(checkedItems).filter(Boolean).length;
  }, [checkedItems]);

  const overallPercentage = Math.round((getTotalDone() / checklist.totalItems) * 100);
  const serviceDisplayName = checklist.serviceName.split(':')[0].trim();

  const renderPhaseSection = (phaseKey: string) => {
    const phase = checklist.phases.find((p) => p.key === phaseKey);
    if (!phase) return null;

    const doneCount = getDoneCount(phaseKey);
    const total = phase.items.length;
    const isComplete = doneCount === total;
    const { icon, color, bg } = phaseIcons[phaseKey] || {
      icon: 'fa-solid fa-circle',
      color: '#666',
      bg: '#f0f0f0',
    };

    return (
      <div className={` ${activeTab === 'all' || activeTab === phaseKey ? 'block' : 'hidden'} animate-fadeIn`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-5 border-b border-gray-100">
          <div className="flex items-center gap-3.5 mb-3 sm:mb-0">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
              style={{ backgroundColor: bg, color }}
            >
              <i className={icon}></i>
            </div>
            <div>
              <h3 className="font-head text-xl md:text-2xl font-extrabold text-[#1A1A2E] tracking-tight">
                {phase.title}
              </h3>
              <div className="text-xs text-[#8888A0] mt-0.5">{phase.subtitle}</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <span
              className={`text-xs font-bold px-3.5 py-1.5 rounded-full ${isComplete ? 'bg-green-100 text-green-700' : 'bg-[#F2F4F8] text-[#8888A0]'}`}
            >
              {doneCount} / {total} done
            </span>
            <button
              type="button"
              className="text-xs font-semibold px-4 py-1.5 rounded-md border border-[#E4E6EF] bg-white text-[#5A5A72] hover:border-primary/10 hover:text-primary hover:bg-[#FFF3ED] transition-all"
              onClick={() => checkAll(phaseKey)}
            >
              Check All
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {phase.items.map((item) => (
            <div
              key={item.id}
              className={`flex items-start gap-3.5 p-3.5 border rounded-lg bg-white cursor-pointer transition-all ${checkedItems[item.id] ? 'bg-green-50 border-green-200' : 'border-[#E4E6EF] hover:border-primary/10 hover:bg-[#FFF3ED]'}`}
              onClick={() => toggleItem(item.id)}
            >
              <div
                className={`w-5.5 h-5.5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${checkedItems[item.id] ? 'bg-emerald-600 border-emerald-600' : 'border-[#E4E6EF] bg-white'}`}
              >
                {checkedItems[item.id] && <i className="fa-solid fa-check text-white text-[11px]"></i>}
              </div>
              <div className="flex-1">
                <div
                  className={`text-sm font-medium leading-relaxed transition-all ${checkedItems[item.id] ? 'text-[#8888A0] line-through decoration-green-200' : 'text-[#2C2C3E]'}`}
                >
                  {item.text}
                </div>
                <div className="flex gap-1.5 mt-1.5 flex-wrap">
                  {item.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${tag.type === 'required' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-[#F2F4F8] text-[#8888A0] border border-[#E4E6EF]'}`}
                    >
                      {tag.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <ServiceSubpageBreadcrumb
        crumbs={[
          { label: 'Home', href: '/' },
          { label: checklist.category, href: `/${checklist.categorySlug}` },
          { label: serviceDisplayName, href: `/${slug}/${service}` },
          { label: 'Checklist' },
        ]}
      />
      <ChecklistHero
        checklist={checklist}
        overallPercentage={overallPercentage}
        phaseIcons={phaseIcons}
        getPhasePercentage={getPhasePercentage}
        getDoneCount={getDoneCount}
      />
      <ChecklistMainContent
        checklist={checklist}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        renderPhaseSection={renderPhaseSection}
        phaseIcons={phaseIcons}
        checkedItems={checkedItems}
        toggleItem={toggleItem}
        checkAll={checkAll}
      />
      <div className={`py-16 w-full ${subpageOuterPadding}`}>
        <div className={subpageInnerPadding}>
          <EngineeringBaseline
            serviceName={`${checklist.serviceName
              .replace(/-/g, ' ')
              .replace(/\b\w/g, (char) => char.toUpperCase())} Checklist`}
            checklist={checklist.howToUse.map((item) => ({
              item: item.desc,
              standard: item.title,
            }))}
          />
        </div>
      </div>
      <div className="-mb-12">
        <ChecklistCTAHero
          variant="combined"
          title={checklist.ctaTitle}
          description={checklist.ctaDescription}
          buttons={[
            {
              text: checklist.ctaButtonText,
              href: checklist.ctaLink ?? '/contact-us',
              variant: 'primary',
            },
          ]}
        />
      </div>
    </>
  );
}