'use client';

import type { Checklist } from '@/src/lib/service_checklist';
import Image from 'next/image';
import { subpageInnerPadding, subpageOuterPadding } from '@/src/components/landingPage/servicesPage/subpage-layout';

interface ChecklistMainContentProps {
  checklist: Checklist;
  activeTab: 'all' | string;
  setActiveTab: (tab: 'all' | string) => void;
  renderPhaseSection: (phaseKey: string) => React.ReactNode;
  phaseIcons: Record<string, { icon: string; color: string; bg: string }>;

  checkedItems: Record<string, boolean>;
  toggleItem: (itemId: string) => void;
  checkAll: (phaseKey: string) => void;
}


export default function ChecklistMainContent({
  checklist,
  activeTab,
  setActiveTab,
  renderPhaseSection,
  phaseIcons,
  checkedItems,
  toggleItem,
  checkAll,
}: ChecklistMainContentProps) {
  



  


  return (
    <div className="relative">
      {/* Static Background Image */}
     <Image
  src="/checklist-img.webp"
  alt="Checklist Background"
  fill
  priority
  quality={100}
  className="object-cover object-center"
/>
      {/* Darker Overlay for Better Contrast */}
      <div className="absolute inset-0 bg-black/60 " />

      <div className={`relative z-10 py-12 ${subpageOuterPadding}`}>
        <div className={subpageInnerPadding}>
        
        {/* Checklist Intro Section - White Text */}
        <section className=" mb-12">
          <div className="max-w-5xl">
            <h2 className="font-head text-3xl md:text-3xl font-extrabold text-white tracking-tight mb-4">
              {checklist.checklistIntro.title}
            </h2>
            <p className="text-lg text-gray-300 leading-relaxed">
              {checklist.checklistIntro.body}
            </p>
          </div>
        </section>

        {/* Modern Tabs */}
        <div className="mb-10">
          <div className="flex flex-wrap gap-1 border-b border-white/20 pb-1">
            <button
              className={`px-6 py-3 text-sm font-semibold rounded-t-xl transition-all ${
                activeTab === 'all'
                  ? 'text-white bg-white/10 border border-white/30 shadow-sm'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
              onClick={() => setActiveTab('all')}
            >
              All Tasks
              <span className="ml-2 text-xs opacity-70">({checklist.totalItems})</span>
            </button>

            {checklist.phases.map((phase) => (
              <button
                key={phase.key}
                className={`px-6 py-3 text-sm font-semibold rounded-t-xl transition-all ${
                  activeTab === phase.key
                    ? 'text-white bg-white/10 border border-white/30 shadow-sm'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
                onClick={() => setActiveTab(phase.key)}
              >
                {phase.title}
                <span className="ml-2 text-xs opacity-70">({phase.items.length})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Phase Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {checklist.phases.map((phase) => {
           const completedCount = phase.items.filter(
  item => checkedItems[item.id]
).length;
            const allChecked = completedCount === phase.items.length && phase.items.length > 0;
            const progress = phase.items.length ? (completedCount / phase.items.length) * 100 : 0;

            return (
              <div
                key={phase.key}
                className={activeTab === 'all' || activeTab === phase.key ? 'block' : 'hidden'}
              >
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden hover:border-white/40 transition-all duration-300 group">
                  
                  {/* Card Header */}
                  <div className="p-6 border-b border-white/10">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-xl text-white">
                        {phase.title}
                      </h3>
                      <span className="text-sm font-medium text-white/80 bg-white/10 px-3 py-1 rounded-full">
                        {completedCount}/{phase.items.length}
                      </span>
                    </div>

                    {phase?.description && (
                      <p className="text-sm text-gray-300">{phase?.description}</p>
                    )}

                    {/* Progress Bar */}
                    <div className="mt-4 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Check All Button */}
                  <div className="px-6 pt-4 pb-2">
                    <button
                      onClick={() => checkAll(phase.key)}
                      className="text-sm text-gray-300 hover:text-white transition-colors flex items-center gap-1.5"
                    >
                      <i className={`fa-solid ${allChecked ? 'fa-rotate-left' : 'fa-check-double'}`} />
                      {allChecked ? 'Uncheck all' : 'Check all'}
                    </button>
                  </div>

                  {/* Checklist Items */}
                  <div className="divide-y divide-white/10 max-h-[420px] overflow-y-auto custom-scroll">
                    {phase.items.map((item, idx) => {
                   const isChecked = checkedItems[item.id];

                      return (
                        <div
                          key={idx}
                       onClick={() => toggleItem(item.id)}
                          className={`group/item p-6 cursor-pointer transition-all hover:bg-white/5 ${
                            isChecked ? 'bg-white/5' : ''
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            {/* Checkbox */}
                            <div className="flex-shrink-0 mt-0.5">
                              <div
                                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                                  isChecked
                                    ? 'bg-primary border-primary'
                                    : 'border-white/40 group-hover/item:border-white/60'
                                }`}
                              >
                                {isChecked && (
                                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </div>
                            </div>

                            {/* Text Content */}
                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-[15px] leading-relaxed transition-all ${
                                  isChecked
                                    ? 'text-gray-400 line-through'
                                    : 'text-white'
                                }`}
                              >
                                {item.text}
                              </p>

                              {item.subtext && (
                                <p
                                  className={`text-sm mt-1.5 ${
                                    isChecked ? 'text-gray-800' : 'text-gray-400'
                                  }`}
                                >
                                  {item.subtext}
                                </p>
                              )}

                              {item.status && (
                                <span
                                  className={`inline-block mt-3 text-xs px-3 py-1 rounded-full font-medium ${
                                    item.status === 'Required'
                                      ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                                      : item.status === 'Verification'
                                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                      : 'bg-white/10 text-gray-300'
                                  }`}
                                >
                                  {item.status}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      </div>

      {/* Custom Scrollbar */}
      <style jsx>{`
        .custom-scroll::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.4);
          border-radius: 10px;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.6);
        }
      `}</style>
    </div>
  );
}







