'use client'

import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';





import { useRef } from "react"
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown, Briefcase, Calendar, Tag, Target, ExternalLink, FolderGit2 } from "lucide-react"
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { resolveImageUrl } from '@/lib/utils'
import { cn } from "@/lib/utils";



interface Project {
  _id: string;
  title: string;
  description: string;
  url?: string;
  category?: {
    _id: string;
    name: string;
  };
  tags?: string[];
  status?: string;
  thumbnail?: string;
  createdAt?: string;
}

export const ParallaxProjectsSection = () => {
  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["projects-public"],
    queryFn: async () => {
      const res = await apiFetch("/api/projects");
      if (!res.ok) throw new Error("Failed to fetch projects");
      return res.json();
    },
  });

  if (isLoading) {
    return <ParallaxSkeleton />;
  }

  if (!projects.length) {
    return <EmptyState />;
  }

  // Only render the content component when we have data
  return <ParallaxProjectsContent projects={projects.slice(0, 4)} />;
};

// Skeleton Loader
const ParallaxSkeleton = () => (
  <div className="min-h-[50vh] sm:min-h-[60vh] flex flex-col items-center justify-center px-4">
    <div className="text-center w-full max-w-md mx-auto">
      <div className="h-8 w-32 bg-slate-200 rounded-full mx-auto mb-4 animate-pulse" />
      <div className="h-10 w-48 bg-slate-200 rounded-lg mx-auto animate-pulse" />
      <div className="mt-8 space-y-4">
        <div className="h-32 w-full bg-slate-100 rounded-xl animate-pulse" />
        <div className="h-20 w-full bg-slate-100 rounded-xl animate-pulse" />
      </div>
    </div>
  </div>
);

// Empty State
const EmptyState = () => (
  <div className="min-h-[40vh] sm:min-h-[50vh] flex flex-col items-center justify-center px-4">
    <div className="text-center max-w-sm mx-auto">
      <Briefcase className="h-10 w-10 sm:h-12 sm:w-12 text-slate-300 mx-auto mb-3" />
      <p className="text-slate-500 text-sm sm:text-base">No projects available yet.</p>
      <p className="text-slate-400 text-xs sm:text-sm mt-2">Check back soon for our latest work!</p>
    </div>
  </div>
);



interface Project {
  _id: string;
  title: string;
  description: string;
  url?: string;
  category?: {
    _id: string;
    name: string;
  };
  tags?: string[];
  status?: string;
  thumbnail?: string;
  createdAt?: string;
}

interface ParallaxProjectsContentProps {
  projects: Project[];
}

export const ParallaxProjectsContent = ({ projects }: ParallaxProjectsContentProps) => {
  // We know projects has exactly 4 items here
  const sections = projects.map((project, index) => ({
    id: project._id,
    title: project.title,
    description: project.description,
    imageUrl: project.thumbnail ? resolveImageUrl(project.thumbnail) : null,
    reverse: index % 2 !== 0,
    category: project.category,
    tags: project.tags || [],
    url: project.url,
    status: project.status,
    createdAt: project.createdAt
  }));

  // Create refs for each section (always 4)
  const sectionRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];

  // Create scroll animations for each section
  const scrollProgress0 = useScroll({ target: sectionRefs[0], offset: ["start end", "center start"] }).scrollYProgress;
  const scrollProgress1 = useScroll({ target: sectionRefs[1], offset: ["start end", "center start"] }).scrollYProgress;
  const scrollProgress2 = useScroll({ target: sectionRefs[2], offset: ["start end", "center start"] }).scrollYProgress;
  const scrollProgress3 = useScroll({ target: sectionRefs[3], offset: ["start end", "center start"] }).scrollYProgress;

  const scrollProgresses = [scrollProgress0, scrollProgress1, scrollProgress2, scrollProgress3];

  // Create transforms for each section
  const opacityContents = scrollProgresses.map(progress => useTransform(progress, [0, 0.7], [0, 1]));
  const clipProgresses = scrollProgresses.map(progress => useTransform(progress, [0, 0.7], ["inset(0 100% 0 0)", "inset(0 0% 0 0)"]));
  const translateContents = scrollProgresses.map(progress => useTransform(progress, [0, 1], [-30, 0]));
  const translateImages = scrollProgresses.map(progress => useTransform(progress, [0, 1], [30, 0]));

  const formattedDate = (date?: string) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status?: string) => {
    switch(status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-50 text-green-700 border-green-100';
      case 'in-progress':
        return 'bg-yellow-50 text-yellow-700 border-yellow-100';
      case 'planned':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      default:
        return 'bg-slate-50 text-slate-900 border-slate-100';
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
     <div className='w-full flex flex-col mt-4 sm:mt-6 py-6 sm:py-8'>
  <div className="flex items-center justify-center gap-3 px-4 sm:px-6 md:px-8">
   
    <motion.h2 
      className="text-xl sm:text-2xl md:text-3xl font-semibold text-slate-900"
      initial={{ scale: 0.8, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      Featured Projects
    </motion.h2>
  
  </div>
  
  {/* Center line below the title */}
  <motion.div 
    initial={{ width: 0 }}
    whileInView={{ width: 80 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay: 0.3 }}
    className="h-1 bg-gradient-to-r from-primary to-primaryrounded-full mx-auto mt-4"
  />
</div>

      {/* Parallax Sections */}
      <div className="flex flex-col pb-6 sm:pb-8 px-2 lg:px-40">
        {sections.map((section, index) => (
          <div 
            key={section.id}
            ref={sectionRefs[index]} 
            className={cn(
              "flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-12 py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8",
              section.reverse ? 'lg:flex-row-reverse' : ''
            )}
          >
            {/* Content */}
            <motion.div 
              style={{ y: translateContents[index] }}
              className="w-full lg:w-1/2 order-1 lg:order-none"
            >
              {section.category && (
                <div className="flex items-center gap-2 mb-2 sm:mb-3">
                  <div className="w-4 sm:w-6 h-px bg-primary" />
                  <span className="text-[11px] sm:text-xs font-medium uppercase tracking-wider text-orange-600">
                    {section.category.name}
                  </span>
                </div>
              )}

              <motion.h2 
                style={{ y: translateContents[index] }} 
                className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 mb-2 sm:mb-3 leading-tight mt-4"
              >
                {section.title}
              </motion.h2>

              <motion.p 
                style={{ y: translateContents[index] }} 
                className="text-gray-900 text-sm sm:text-base leading-relaxed mb-3 sm:mb-4"
              >
                {section.description}
              </motion.p>

              {section.status && (
                <motion.div style={{ y: translateContents[index] }} className="mb-3 sm:mb-4">
                  <span className={cn("text-[11px] sm:text-xs px-2 py-0.5 rounded-full border", getStatusColor(section.status))}>
                    {section.status.charAt(0).toUpperCase() + section.status.slice(1)}
                  </span>
                </motion.div>
              )}

              <motion.div style={{ y: translateContents[index] }} className="flex flex-wrap gap-2 sm:gap-3 mb-3 sm:mb-4">
                {formattedDate(section.createdAt) && (
                  <div className="flex items-center gap-1 sm:gap-1.5 text-xs text-slate-900">
                    <Calendar className="h-3 w-3 text-primary flex-shrink-0" />
                    <span className="truncate">{formattedDate(section.createdAt)}</span>
                  </div>
                )}
              </motion.div>

              {section.tags && section.tags.length > 0 && (
                <motion.div style={{ y: translateContents[index] }} className="mb-3 sm:mb-4">
                  <div className="flex items-center gap-1 sm:gap-1.5 mb-1.5 sm:mb-2">
                    <Tag className="h-3 w-3 text-primary flex-shrink-0" />
                    <span className="text-[11px] sm:text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Technologies
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {section.tags.slice(0, 3).map((tech, i) => (
                      <span key={i} className="text-[11px] sm:text-xs px-2 py-0.5 rounded-full bg-orange-50 text-secondaryborder border-orange-100">
                        {tech}
                      </span>
                    ))}
                    {section.tags.length > 3 && (
                      <span className="text-[11px] sm:text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-900">
                        +{section.tags.length - 3}
                      </span>
                    )}
                  </div>
                </motion.div>
              )}

              <motion.div style={{ y: translateContents[index] }} className="flex flex-col sm:flex-row gap-3">
                {section.url && (
                  <Button asChild size="default" className="group bg-primary hover:bg-secondarytext-white rounded-full px-4 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-base shadow-md w-full sm:w-auto">
                    <Link href={section.url} target="_blank" rel="noopener noreferrer">
                      View Project
                      <ExternalLink className="ml-1.5 h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </Link>
                  </Button>
                )}
                <Button asChild size="default" variant="outline" className="group border-orange-200 hover:border-orange-300 text-secondaryhover:text-secondaryrounded-full px-4 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-base w-full sm:w-auto">
                  <Link href="/case-studies">
                    Learn More
                    <ArrowDown className="ml-1.5 h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 rotate-[-90deg]" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>

            {/* Image */}
            <motion.div 
              style={{ 
                opacity: opacityContents[index],
                clipPath: clipProgresses[index],
                y: translateImages[index]
              }}
              className="w-full lg:w-1/2 order-2 lg:order-none mt-4 sm:mt-6 lg:mt-0"
            >
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg">
                {section.imageUrl ? (
                  <Image
                    src={section.imageUrl}
                    alt={section.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, (max-width: 1024px) 50vw, 33vw"
                    priority={index === 0}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
                    <FolderGit2 className="h-12 w-12 sm:h-16 sm:w-16 text-orange-300" />
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        ))}
      </div>

      {/* End Section */}
      <div className='w-full flex flex-col items-center justify-center px-4 py-8 sm:py-12'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-sm sm:max-w-md mx-auto"
        >
          <h3 className='text-lg sm:text-xl md:text-2xl font-bold text-slate-900 mb-2 px-4'>
            Have a Project in Mind?
          </h3>
          <Button asChild size="default" className="bg-primary hover:bg-secondarytext-white rounded-full px-6 sm:px-8 mt-3 w-full sm:w-auto">
            <Link href="/contact-us">
              Start a Project
              <ArrowDown className="ml-1.5 h-3.5 w-3.5 rotate-[-90deg]" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
};