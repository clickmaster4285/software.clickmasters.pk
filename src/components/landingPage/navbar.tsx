'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Menu,
  ChevronDown,
  X,
  Brain,
  Bot,
  Database,
  Code2,
  Cloud,
  HeartPulse,
  Landmark,
  Truck,
  Headset,
  ShoppingCart,
  UserCheck,
  Building2,
  Building,
  DollarSign,
  Calculator,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { getCategoryName } from '@/lib/utils';
import { getServicePath, serviceMenuSections } from '@/lib/service-pages';
import { getAllServicePages } from '@/lib/service-pages';
// Types for dropdown data
interface ProjectItem {
  id: string;
  title: string;
  url?: string;
  externalUrl?: string;
}

interface ProjectCategory {
  category: string;
  items: ProjectItem[];
}

interface Project {
  _id: string;
  title: string;
  description: string;
  thumbnail?: string;
  url?: string;
  category: string | { _id: string; name: string };
  status: 'live' | 'in-progress' | 'completed';
  technologies?: string[];
  client?: string;
  completionDate?: string;
}

type ServiceMenuItem = {
  title: string;
  description: string;
  href: string;
};

type ServiceMenuSection = {
  label: string;
  items: ServiceMenuItem[];
};

// Hire Us dropdown items
const hireUsItems: { title: string; href: string; icon: LucideIcon }[] = [
  { title: 'Hire AI Developers', href: '/hire/hire-ai-developers/', icon: Brain },
  { title: 'AI Agent Development Services', href: '/hire/ai-agent-development-services/', icon: Bot },
  { title: 'RAG Development Services', href: '/hire/rag-development-services/', icon: Database },
  { title: 'Custom Software Development', href: '/hire/custom-software-development/', icon: Code2 },
  { title: 'SaaS Development Services', href: '/hire/saas-development-services/', icon: Cloud },
  { title: 'AI Development Healthcare', href: '/hire/ai-development-healthcare/', icon: HeartPulse },
  { title: 'AI Development Finance', href: '/hire/ai-development-finance/', icon: Landmark },
  { title: 'AI Development Logistics', href: '/hire/ai-development-logistics/', icon: Truck },
  {
    title: 'AI Agents for Customer Support',
    href: '/hire/ai-agents-for-customer-support/',
    icon: Headset,
  },
  { title: 'AI Agents for Sales', href: '/hire/ai-agents-for-sales/', icon: ShoppingCart },
  {
    title: 'AI Agents for Lead Qualification',
    href: '/hire/ai-agents-for-lead-qualification/',
    icon: UserCheck,
  },
  { title: 'AI Development Company USA', href: '/hire/ai-development-company-usa/', icon: Building2 },
  { title: 'AI Development Company UK', href: '/hire/ai-development-company-uk/', icon: Building },
  { title: 'AI Development Cost', href: '/hire/ai-development-cost/', icon: DollarSign },
  { title: 'RAG Development Cost', href: '/hire/rag-development-cost/', icon: Calculator },
];

// Locations dropdown items
const locationsItems: { title: string; href: string; files: number }[] = [
  { title: 'Canada', href: '/locations/canada', files: 107 },
  { title: 'USA', href: '/locations/usa', files: 107 },
  { title: 'UK', href: '/locations/uk', files: 107 },
  { title: 'Germany', href: '/locations/germany', files: 107 },
  { title: 'UAE', href: '/locations/uae', files: 107 },
  { title: 'Australia', href: '/locations/australia', files: 107 },
];


const LOGO_COLOR_SRC = '/images/logo1.webp';
const LOGO_WHITE_SRC = '/images/logo-white1.webp';

const mobileServicePageLinks: { title: string; href: string }[] = serviceMenuSections.flatMap((section) =>
  section.items.map((item) => ({
    title: item.title,
    href: getServicePath(section.label, item.title),
  }))
);

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeServiceSection, setActiveServiceSection] = useState<string>(
    serviceMenuSections[0]?.label ?? ''
  );
  const [activeSolutionsSection, setActiveSolutionsSection] = useState<string>('');
  const [activeResourcesSection, setResourcesSection] = useState<string>('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [previewItems, setPreviewItems] = useState<any[]>([]);

  /** Short grace period for moving from trigger to panel; keep small to avoid a “laggy” close. */
  const HOVER_MENU_CLOSE_MS = 80;

  const isHome = pathname === '/';
  const isAbout = pathname === '/about-us';
 const isLocation = pathname.startsWith("/locations/");
  // Fetch projects from API for Solutions dropdown
  const { data: projects = [], isLoading: isLoadingProjects } = useQuery<Project[]>({
    queryKey: ['projects-public'],
    queryFn: async () => {
      const res = await apiFetch('/api/projects');
      if (!res.ok) throw new Error('Failed to fetch projects');
      return res.json();
    },
  });

// Add after the projects fetch
const { data: caseStudies = [] } = useQuery({
  queryKey: ['case-studies-count'],
  queryFn: async () => {
    const res = await apiFetch('/api/case-studies');
    if (!res.ok) throw new Error('Failed to fetch case studies');
    return res.json();
  },
});
  
 // Get FAQs from service pages (not from API)
const allServicePages = getAllServicePages();
const allFaqs = allServicePages.flatMap(service => 
  (service.faqs || []).map(faq => ({
    ...faq,
    serviceTitle: service.title,
    serviceSlug: service.slug,
    category: service.category
  }))
);




  

const { data: testimonials = [] } = useQuery({
  queryKey: ['testimonials-count'],
  queryFn: async () => {
    const res = await apiFetch('/api/testimonials');
    if (!res.ok) throw new Error('Failed to fetch testimonials');
    return res.json();
  },
});

const { data: blogs = [] } = useQuery({
  queryKey: ['blogs-count'],
  queryFn: async () => {
    const res = await apiFetch('/api/blog');
    if (!res.ok) throw new Error('Failed to fetch blogs');
    return res.json();
  },
});



  const resourcesItems = [
  {
    title: `Case Studies (${caseStudies.length})`,
    description: 'Real projects and success stories from our clients.',
    href: '/case-studies',
  },
  {
    title: `Blog (${blogs.length})`,
    description: 'Insights, guides, and updates on tech & business.',
    href: '/blog',
  },
  {
    title: 'FAQs',
    description: 'Answers to common questions about our services.',
    href: '/faqs',
  },
  {
    title: `Testimonials (${testimonials.length})`,
    description: 'What our clients say about working with us.',
    href: '/testimonials',
  },
  ];
  

  // Group projects by category
  const groupedProjects = projects.reduce((acc: ProjectCategory[], project) => {
    const categoryName = getCategoryName(project.category);
    const existingCategory = acc.find((cat) => cat.category === categoryName);

    const projectItem: ProjectItem = {
      id: project._id,
      title: project.title,
      url: project.url || `/software-solutions/${project._id}`,
      externalUrl: project.url,
    };

    if (existingCategory) {
      existingCategory.items.push(projectItem);
    } else {
      acc.push({
        category: categoryName,
        items: [projectItem],
      });
    }
    return acc;
  }, []);

  useEffect(() => {
    if (activeDropdown !== 'solutions') return;
    if (groupedProjects.length === 0) return;
    if (!activeSolutionsSection || !groupedProjects.some((s) => s.category === activeSolutionsSection)) {
      setActiveSolutionsSection(groupedProjects[0]?.category ?? '');
    }
  }, [activeDropdown, groupedProjects, activeSolutionsSection]);

  // Handle project click
  const handleProjectClick = (project: ProjectItem) => {
    closeDropdowns();
    if (project.externalUrl) {
      window.open(project.externalUrl, '_blank', 'noopener,noreferrer');
    } else {
      router.push(project.url || `/software-solutions/${project.id}`);
    }
  };

  // Handle Solutions link click
  const handleSolutionsClick = () => {
    closeDropdowns();
    router.push('/software-solutions');
  };

  const handleHireUsClick = () => {
    closeDropdowns();
    router.push('/contact-us');
  };

  const handleServicesClick = () => {
    closeDropdowns();
    router.push('/#');
  };

  const serviceSections: ServiceMenuSection[] = serviceMenuSections.map((section) => ({
    label: section.label,
    items: section.items.map((item) => ({
      title: item.title,
      description: item.description,
      href: getServicePath(section.label, item.title),
    })),
  }));

  useEffect(() => {
    if (activeDropdown !== 'services') return;
    if (!serviceSections.some((s) => s.label === activeServiceSection)) {
      setActiveServiceSection(serviceSections[0]?.label ?? '');
    }
  }, [activeDropdown]);

  // Check if page is loading
  useEffect(() => {
    const timer = setTimeout(() => setIsPageLoading(false), 500);
    return () => clearTimeout(timer);
  }, [pathname]);

  const isLightHero = ( isAbout ) && !isScrolled && !isPageLoading;

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleMouseEnter = (dropdown: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    if (dropdown === 'services') {
      setActiveServiceSection(serviceSections[0]?.label ?? '');
    }
    if (dropdown === 'solutions') {
      setActiveSolutionsSection(groupedProjects[0]?.category ?? '');
    }

   if (dropdown === 'resources') {
    // Set default to 'Case Studies' when opening resources dropdown
    setResourcesSection('Case Studies');
  }
    setActiveDropdown(dropdown);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
      hoverTimeoutRef.current = null;
    }, HOVER_MENU_CLOSE_MS);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    if (activeDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeDropdown]);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  const isActivePath = (path: string) => {
    return pathname === path;
  };

  const closeDropdowns = () => {
    setActiveDropdown(null);
    setActiveServiceSection(serviceSections[0]?.label ?? '');
    setActiveSolutionsSection(groupedProjects[0]?.category ?? '');
  };

  // During page loading, show black text and logo
  const navStyle = isPageLoading
    ? 'bg-white border-b border-black/10 shadow-sm'
    : isScrolled
      ? 'bg-white/95 border-b border-black/10 shadow-sm'
      : 'bg-white/10 backdrop-blur-md border-b border-transparent';

  const logoToShow = isPageLoading || !isLightHero ? LOGO_COLOR_SRC : LOGO_WHITE_SRC;

  const linkStyle = (isActive: boolean) => {
    if (isPageLoading) {
      return isActive ? 'text-primary font-bold' : 'text-black/70 hover:text-primary';
    }
    if (isActive) {
      return 'text-primary font-bold';
    }
    if (isLightHero) {
      return 'text-white/90 hover:text-primary';
    }
    return 'text-black/70 hover:text-primary';
  };

  return (
    <header
      className={cn('fixed inset-x-0 top-0 z-50 transition-all duration-300 px-10 ', navStyle)}
    >
      <div className="px-2 md:px-4 lg:px-26 flex h-20 items-center justify-between max-w-[1600px] mx-auto">
        {/* Logo */}
        <Link
          href="/"
          className="flex min-w-0 max-w-[min(100%,calc(100%-3.5rem))] shrink items-center gap-2 transition-opacity hover:opacity-90"
          onClick={closeDropdowns}
        >
          <Image
            key={logoToShow}
            src={logoToShow}
            alt="ClickMasters"
            width={600}
            height={400}
            className="h-10 w-auto max-h-10 max-w-[160px] object-contain object-left sm:h-12 sm:max-h-12 sm:max-w-[200px] xl:max-w-[256px]"
            priority
            fetchPriority="high"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-4 2xl:gap-8">
      
          

          {/* Solutions Dropdown - Hover with click navigation */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter('solutions')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={handleSolutionsClick}
              className={cn(
                'text-lg transition-colors flex items-center gap-1',
                activeDropdown === 'solutions'
                  ? 'text-primary'
                  : isPageLoading
                    ? 'text-black/70 hover:text-primary'
                    : isLightHero
                      ? 'text-white/90 hover:text-primary'
                      : 'text-black/70 hover:text-primary'
              )}
            >
              Solutions
              <ChevronDown
                className={cn(
                  'h-4 w-4 shrink-0 transition-transform duration-200 ease-out',
                  activeDropdown === 'solutions' && 'rotate-180'
                )}
              />
            </button>
          </div>

          {/* Services Dropdown - Mega menu */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter('services')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={handleServicesClick}
              className={cn(
                'text-lg  transition-colors flex items-center gap-1',
                activeDropdown === 'services'
                  ? 'text-primary'
                  : isPageLoading
                    ? 'text-black/70 hover:text-primary'
                    : isLightHero
                      ? 'text-white/90 hover:text-primary'
                      : 'text-black/70 hover:text-primary'
              )}
            >
              Services
              <ChevronDown
                className={cn(
                  'h-4 w-4 shrink-0 transition-transform duration-200 ease-out',
                  activeDropdown === 'services' && 'rotate-180'
                )}
              />
            </button>
          </div>

           
         {/* resources Dropdown - Hover with click navigation */}
<div
  className="relative"
  onMouseEnter={() => handleMouseEnter('resources')}
  onMouseLeave={handleMouseLeave}
>
  <button
    onClick={() => {
      closeDropdowns();
      // or router.push('/case-studies') if you prefer
    }}
    className={cn(
      'text-lg  transition-colors flex items-center gap-1',
      activeDropdown === 'resources'
        ? 'text-primary'
        : isPageLoading
          ? 'text-black/70 hover:text-primary'
          : isLightHero
            ? 'text-white/90 hover:text-primary'
            : 'text-black/70 hover:text-primary'
    )}
  >
    Resources
    <ChevronDown
      className={cn(
        'h-4 w-4 shrink-0 transition-transform duration-200 ease-out',
        activeDropdown === 'resources' && 'rotate-180'
      )}
    />
  </button>
</div>








          {/* Hire Us Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter('hire-us')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={handleHireUsClick}
              className={cn(
                'text-lg transition-colors flex items-center gap-1',
                activeDropdown === 'hire-us'
                  ? 'text-primary'
                  : isPageLoading
                    ? 'text-black/70 hover:text-primary'
                    : isLightHero
                      ? 'text-white/90 hover:text-primary'
                      : 'text-black/70 hover:text-primary'
              )}
            >
              Hire Us
              <ChevronDown
                className={cn(
                  'h-4 w-4 shrink-0 transition-transform duration-200 ease-out',
                  activeDropdown === 'hire-us' && 'rotate-180'
                )}
              />
            </button>
          </div>

        

          <Link
            href="/about-us"
            onClick={closeDropdowns}
            className={cn(
              'text-lg  transition-colors',
              linkStyle(isActivePath('/about-us'))
            )}
          >
            About Us
          </Link>

          <Link
            href="/contact-us"
            onClick={closeDropdowns}
            className={cn(
              'text-lg  transition-colors',
              linkStyle(isActivePath('/contact-us'))
            )}
          >
            Contact Us
          </Link>

          {/* Locations Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter('locations')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              className={cn(
                'text-lg transition-colors flex items-center gap-1',
                activeDropdown === 'locations'
                  ? 'text-primary'
                  : isPageLoading
                    ? 'text-black/70 hover:text-primary'
                    : isLightHero
                      ? 'text-white/90 hover:text-primary'
                      : 'text-black/70 hover:text-primary'
              )}
            >
              Locations
              <ChevronDown
                className={cn(
                  'h-4 w-4 shrink-0 transition-transform duration-200 ease-out',
                  activeDropdown === 'locations' && 'rotate-180'
                )}
              />
            </button>
            
            {/* Locations Dropdown Menu */}
            {activeDropdown === 'locations' && !isPageLoading && (
              <div
                onMouseEnter={() => {
                  if (hoverTimeoutRef.current) {
                    clearTimeout(hoverTimeoutRef.current);
                    hoverTimeoutRef.current = null;
                  }
                }}
                onMouseLeave={closeDropdowns}
                className="absolute left-0 top-full  animate-in fade-in-0 slide-in-from-top-1 duration-150 ease-out z-50 mt-6 -ml-16"
              >
                <div
                  ref={dropdownRef}
                  onMouseLeave={closeDropdowns}
                  className="w-48 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg"
                >
                  <div className="bg-slate-50 p-3">
                    <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                      Locations
                    </p>
                    <ul className="space-y-1">
                      {locationsItems.map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            onClick={closeDropdowns}
                            className="block w-full rounded-md px-3 py-2.5 text-left text-sm font-semibold transition-colors hover:bg-white/70 hover:text-slate-900 text-slate-900"
                          >
                            <div className="flex items-center justify-between">
                              <span>{item.title}</span>
                              <ChevronDown className="h-4 w-4 -rotate-90 opacity-0 group-hover:opacity-60 transition-opacity" />
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

         
         
        </nav>

        {/* Desktop CTA */}
        {/* <div className="hidden xl:flex items-center gap-3">
          <Link href="/admin/login" onClick={closeDropdowns}>
            <button
              className={cn(
                'px-5 py-2 text-sm font-medium transition-colors duration-300 rounded-md',
                isPageLoading || isScrolled || !isLightHero
                  ? 'text-white bg-primary hover:bg-primary/90'
                  : 'text-white bg-primary hover:bg-primary/90'
              )}
            >
              Sign In
            </button>
          </Link>
        </div> */}

        {/* Mobile menu: logo must stay constrained or flex pushes this off-screen; keep trigger from shrinking */}
        <div className="flex shrink-0 xl:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Open menu"
                className={cn(
                  'p-2 transition-colors',
                  isLightHero
                    ? 'text-white/90 hover:text-primary'
                    : 'text-black/70 hover:text-primary'
                )}
              >
                <Menu className="h-6 w-6 shrink-0" />
              </button>
            </SheetTrigger>
          <SheetContent
            side="right"
            className="w-full sm:max-w-md p-0 bg-white border-l border-black/10"
          >
            <div className="flex flex-col h-full">
              {/* Mobile Header */}
              <div className="flex items-center justify-between p-6 border-b border-black/5">
                <Image
                  src={LOGO_COLOR_SRC}
                  alt="ClickMasters"
                  width={800}
                  height={400}
                  className="h-auto w-36"
                />
              </div>

              {/* Mobile Navigation */}
              <nav className="flex-1 overflow-y-auto p-6">
                <div className="flex flex-col space-y-1">
                  {/* Home */}
                  

                  {/* Solutions Mobile Dropdown */}
                  <MobileDropdown
                    title="Solutions"
                    items={groupedProjects}
                    isLoading={isLoadingProjects}
                    onLinkClick={() => setIsOpen(false)}
                    onProjectClick={handleProjectClick}
                  />

                  {/* Services */}
                  <MobileServicesDropdown
                    title="Services"
                    onLinkClick={() => setIsOpen(false)}
                  />

       <MobileResourcesDropdown
      title="Resources"
      caseStudies={caseStudies}
      blogs={blogs}
      testimonials={testimonials}
      allFaqs={allFaqs}
  
      onLinkClick={() => setIsOpen(false)}
    />
                  {/* Hire Us Mobile Dropdown */}
                  <MobileHireUsDropdown
                    title="Hire Us"
                    items={hireUsItems}
                    onLinkClick={() => setIsOpen(false)}
                  />

                 
                  <Link
                    href="/about-us"
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'py-3 font-medium transition-colors border-b border-black/5',
                      isActivePath('/about-us')
                        ? 'text-primary font-bold'
                        : 'text-black/70 hover:text-primary'
                    )}
                  >
                    About Us
                  </Link>

                  <Link
                    href="/contact-us"
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'py-3 font-medium transition-colors border-b border-black/5',
                      isActivePath('/contact-us')
                        ? 'text-primary font-bold'
                        : 'text-black/70 hover:text-primary'
                    )}
                  >
                    Contact Us
                  </Link>

     <MobileLocationsDropdown
                    title="Locations"
                    items={locationsItems}
                    onLinkClick={() => setIsOpen(false)}
                  />
                 
                </div>
              </nav>

              {/* Mobile Footer */}
              {/* <div className="p-6 border-t border-black/5">
                <Link href="/admin/login" onClick={() => setIsOpen(false)}>
                  <button className="w-full px-5 py-3 text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors duration-300 rounded-md">
                    Sign In
                  </button>
                </Link>
              </div> */}
            </div>
          </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Full-width Dropdown Menu for Solutions */}
      {activeDropdown === 'solutions' && !isPageLoading && (
        <div
          onMouseEnter={() => {
            if (hoverTimeoutRef.current) {
              clearTimeout(hoverTimeoutRef.current);
              hoverTimeoutRef.current = null;
            }
          }}
          onMouseLeave={closeDropdowns}
          className="absolute left-0 right-0 top-full border-t border-black/5 bg-transparent animate-in fade-in-0 slide-in-from-top-1 duration-150 ease-out"
        >
          <div className="max-w-8xl mx-auto px-5 md:px-8 lg:px-10 py-0">
            {isLoadingProjects ? (
              <div
                ref={dropdownRef}
                onMouseLeave={closeDropdowns}
                className="mx-auto max-w-6xl rounded-xl border border-slate-200 bg-white px-6 py-10 text-center shadow-[0_18px_50px_-18px_rgba(0,0,0,0.35)]"
              >
                <p className="text-black/40">Loading projects...</p>
              </div>
            ) : groupedProjects.length === 0 ? (
              <div
                ref={dropdownRef}
                onMouseLeave={closeDropdowns}
                className="mx-auto max-w-6xl rounded-xl border border-slate-200 bg-white px-6 py-10 text-center shadow-[0_18px_50px_-18px_rgba(0,0,0,0.35)]"
              >
                <p className="text-black/40">No projects available</p>
              </div>
            ) : (
              <div
                ref={dropdownRef}
                onMouseLeave={closeDropdowns}
                className="mx-auto max-w-6xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_18px_50px_-18px_rgba(0,0,0,0.35)]"
              >
                <div className="grid grid-cols-12">
                  {/* Left rail */}
                  <div className="col-span-3 bg-slate-50 p-4 border-r border-slate-200">
                    <p className="px-3 pb-3 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                      Solutions
                    </p>
                    <ul className="space-y-1">
                      {groupedProjects.map((section) => {
                        const active = section.category === activeSolutionsSection;
                        return (
                          <li key={section.category}>
                            <button
                              type="button"
                              onMouseEnter={() => setActiveSolutionsSection(section.category)}
                              onClick={() => setActiveSolutionsSection(section.category)}
                              className={cn(
                                'w-full rounded-md px-3 py-2.5 text-left text-sm font-semibold transition-colors flex items-center justify-between',
                                active
                                  ? 'bg-white text-slate-900 shadow-sm'
                                  : 'text-gray-900 hover:bg-white/70 hover:text-slate-900'
                              )}
                            >
                              <span>{section.category}</span>
                              <ChevronDown
                                className={cn(
                                  'h-4 w-4 -rotate-90 transition-opacity',
                                  active ? 'opacity-70' : 'opacity-0'
                                )}
                                aria-hidden
                              />
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {/* Right content */}
                  <div className="col-span-9 p-8">
                    {groupedProjects
                      .filter((s) => s.category === activeSolutionsSection)
                      .map((section) => (
                        <div key={section.category}>
                          <div className="grid gap-6 sm:grid-cols-2">
                            {section.items.slice(0, 16).map((item) => (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => handleProjectClick(item)}
                                className="group rounded-md p-2 text-left transition-colors hover:bg-slate-50"
                              >
                                <div className="flex items-start justify-between gap-4">
                                  <p className="text-sm font-semibold text-slate-900 group-hover:text-primary">
                                    {item.title}
                                  </p>
                                  <ChevronDown className="mt-0.5 h-4 w-4 -rotate-90 text-slate-300 transition-colors group-hover:text-primary" />
                                </div>
                              </button>
                            ))}
                          </div>

                          <div className="mt-6 border-t border-slate-200 pt-4">
                            <Link
                              href="/software-solutions"
                              onClick={closeDropdowns}
                              className="text-xs font-semibold uppercase tracking-widest text-gray-900 hover:text-primary transition-colors"
                            >
                              Browse all solutions →
                            </Link>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Full-width Dropdown Menu for Services */}
    {/* Full-width Dropdown Menu for Services */}
{activeDropdown === 'services' && !isPageLoading && (
  <div
    onMouseEnter={() => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }
    }}
    onMouseLeave={closeDropdowns}
    className="absolute left-0 right-0 top-full border-t border-black/5 bg-transparent animate-in fade-in-0 slide-in-from-top-1 duration-150 ease-out"
  >
    <div className="max-w-8xl mx-auto px-5 md:px-8 lg:px-10 py-0">
      <div
        ref={dropdownRef}
        onMouseLeave={closeDropdowns}
        className="mx-auto max-w-6xl h-[520px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_18px_50px_-18px_rgba(0,0,0,0.35)]"
      >
        <div className="grid h-full grid-cols-12">
          {/* Left rail - Now with clickable links */}
    
<div className="col-span-3 h-full overflow-y-auto bg-slate-50 p-4 border-r border-slate-200">
  <p className="px-3 pb-3 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
    Services
  </p>
  <ul className="space-y-1">
    {serviceSections.map((section) => {
      const active = section.label === activeServiceSection;
      // Create URL-friendly slug for the category
      const categorySlug = section.label
        .toLowerCase()
        .replace(/&/g, 'and')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      
      return (
        <li key={section.label}>
          <Link
            href={`/${categorySlug}`}
            onClick={(e) => {
              // Close dropdown when clicking the link
              closeDropdowns();
              // Don't prevent default - let the navigation happen
            }}
            onMouseEnter={(e) => {
              // On hover, change the right panel content without navigating
              // This provides the preview functionality
              setActiveServiceSection(section.label);
            }}
            className={cn(
              'block w-full rounded-md px-3 py-2.5 text-left text-sm font-semibold transition-colors',
              active
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-gray-900 hover:bg-white/70 hover:text-slate-900'
            )}
          >
            <div className="flex items-center justify-between">
              <span>{section.label}</span>
              <ChevronDown
                className={cn(
                  'h-4 w-4 -rotate-90 transition-opacity',
                  active ? 'opacity-70' : 'opacity-0 group-hover:opacity-60'
                )}
                aria-hidden
              />
            </div>
          </Link>
        </li>
      );
    })}
  </ul>
</div>

          {/* Right content */}
          <div className="col-span-9 h-full p-8 overflow-y-auto">
            {serviceSections
              .filter((s) => s.label === activeServiceSection)
              .map((section) => {
                const categorySlug = section.label
                  .toLowerCase()
                  .replace(/&/g, 'and')
                  .replace(/[^a-z0-9]+/g, '-')
                  .replace(/^-|-$/g, '');
                
                return (
                  <div key={section.label} className="flex h-full flex-col">
                    {/* Category header with View All link */}
                    <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3">
                      <span className="text-base font-bold text-slate-900">{section.label}</span>
                      <Link
                        href={`/${categorySlug}`}
                        onClick={closeDropdowns}
                        className="text-xs font-semibold uppercase tracking-widest text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                      >
                        View All
                        <ChevronDown className="h-3 w-3 -rotate-90" />
                      </Link>
                    </div>
                    
                    <div className="grid flex-1 content-start gap-6 overflow-y-auto pr-2 sm:grid-cols-2">
                      {section.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={closeDropdowns}
                          className="group rounded-md p-2 transition-colors hover:bg-slate-50"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-sm font-semibold text-slate-900 group-hover:text-primary">
                                {item.title}
                              </p>
                              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                                {item.description}
                              </p>
                            </div>
                            <ChevronDown className="mt-0.5 h-4 w-4 -rotate-90 text-slate-300 transition-colors group-hover:text-primary flex-shrink-0" />
                          </div>
                        </Link>
                      ))}
                    </div>

                                      </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  </div>
)}

      
{activeDropdown === 'resources' && !isPageLoading && (
  <div
    onMouseEnter={() => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }
    }}
    onMouseLeave={closeDropdowns}
    className="absolute left-0 right-0 top-full border-t border-black/5 bg-transparent animate-in fade-in-0 slide-in-from-top-1 duration-150 ease-out"
  >
    <div className="max-w-8xl mx-auto px-5 md:px-8 lg:px-10 py-0">
      <div
        ref={dropdownRef}
        onMouseLeave={closeDropdowns}
        className="mx-auto max-w-6xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_18px_50px_-18px_rgba(0,0,0,0.35)]"
      >
        <div className="grid grid-cols-12">
                {/* Left rail - Categories */}
                
        {/* Left rail - Categories */}
<div className="col-span-3 bg-slate-50 p-4 border-r border-slate-200">
  <p className="px-3 pb-3 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
    Resources
  </p>
  <ul className="space-y-1">
    {[
      { 
        title: 'Case Studies', 
        count: caseStudies.length,
        href: '/case-studies'
      },
      { 
        title: 'Blog', 
        count: blogs.length,
        href: '/blog'
      },
      { 
        title: 'FAQs', 
        count: allFaqs.length,
        href: '/faqs'
      },
      { 
        title: 'Testimonials', 
        count: testimonials.length,
        href: '/testimonials'
      },
  
    ].map((section) => {
      const active = activeResourcesSection === section.title;
      return (
        <li key={section.title}>
          <Link
            href={section.href}
            onClick={closeDropdowns}
            onMouseEnter={() => setResourcesSection(section.title)}
            className={cn(
              'w-full rounded-md px-3 py-2.5 text-left text-sm font-semibold transition-colors flex items-center justify-between hover:bg-white/70',
              active
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-gray-900 hover:text-slate-900'
            )}
          >
            <span>
              {section.title}
              {section.count > 0 && (
                <span className="ml-1 text-xs font-normal text-slate-400">
                  ({section.count})
                </span>
              )}
            </span>
            <ChevronDown
              className={cn(
                'h-4 w-4 -rotate-90 transition-opacity',
                active ? 'opacity-70' : 'opacity-0'
              )}
              aria-hidden
            />
          </Link>
        </li>
      );
    })}
  </ul>
</div>

          {/* Right content - Preview items */}
          <div className="col-span-9 p-6 max-h-[600px] overflow-y-auto">
            
            {/* Case Studies Section */}
            {activeResourcesSection === 'Case Studies' && (
              <div>
                <div className={cn(
                  "grid gap-5",
                  caseStudies.slice(0, 2).length === 1 ? "grid-cols-1" : "sm:grid-cols-2"
                )}>
                  {caseStudies.slice(0, 2).map((study: any) => (
                    <Link
                      key={study._id}
                      href={`/case-studies/${study.slug || study._id}`}
                      onClick={closeDropdowns}
                      className="group block transition-all duration-200 hover:-translate-y-1"
                    >
                      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md">
                        {study.thumbnail && (
                          <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                            <Image
                              src={study.thumbnail}
                              alt={study.title}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>
                        )}
                        <div className="p-4">
                          <span className="font-semibold text-slate-900 group-hover:text-primary line-clamp-2 text-base">
                            {study.title}
                          </span>
                          {study.description && (
                            <p className="mt-2 text-sm text-slate-500 line-clamp-2">
                              {study.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* All case studies link at bottom */}
                <div className="mt-6 border-t border-slate-200 pt-4">
                  <Link
                    href="/case-studies"
                    onClick={closeDropdowns}
                    className="text-xs font-semibold uppercase tracking-widest text-gray-900 hover:text-primary transition-colors"
                  >
                    View all case studies ({caseStudies.length}) →
                  </Link>
                </div>
              </div>
            )}

            {/* Blog Section */}
            {activeResourcesSection === 'Blog' && (
              <div>
                <div className={cn(
                  "grid gap-5",
                  blogs.slice(0, 2).length === 1 ? "grid-cols-1" : "sm:grid-cols-2"
                )}>
                  {blogs.slice(0, 2).map((blog: any) => (
                    <Link
                      key={blog._id}
                      href={`/blog/${blog.slug || blog._id}`}
                      onClick={closeDropdowns}
                      className="group block transition-all duration-200 hover:-translate-y-1"
                    >
                      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md">
                        {blog.thumbnail && (
                          <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                            <Image
                              src={blog.thumbnail}
                              alt={blog.title}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>
                        )}
                        <div className="p-4">
                          <span className="font-semibold text-slate-900 group-hover:text-primary line-clamp-2 text-base">
                            {blog.title}
                          </span>
                          {blog.excerpt && (
                            <p className="mt-2 text-sm text-slate-500 line-clamp-2">
                              {blog.excerpt}
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* All blogs link at bottom */}
                <div className="mt-6 border-t border-slate-200 pt-4">
                  <Link
                    href="/blog"
                    onClick={closeDropdowns}
                    className="text-xs font-semibold uppercase tracking-widest text-gray-900 hover:text-primary transition-colors"
                  >
                    View all blogs ({blogs.length}) →
                  </Link>
                </div>
              </div>
            )}

            {/* FAQs Section - Simple list layout with responsive grid */}
            {activeResourcesSection === 'FAQs' && (
              <div>
                <div className={cn(
                  "grid gap-4",
                  allFaqs.slice(0, 4).length === 1 ? "grid-cols-1" : "md:grid-cols-2"
                )}>
                  {allFaqs.slice(0, 4).map((faq: any, idx: number) => (
                    <Link
                      key={idx}
                      href={`/faqs/${faq.serviceSlug}`}
                      onClick={closeDropdowns}
                      className="group block"
                    >
                      <div className="p-4 rounded-lg border border-slate-200 bg-white hover:shadow-md transition-all duration-200 hover:border-primary/30 h-full">
                        <p className="text-sm font-medium text-slate-800 group-hover:text-primary transition-colors line-clamp-2">
                          {faq.question}
                        </p>
                        <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                          {faq.answer.substring(0, 120)}...
                        </p>
                        <span className="inline-block text-xs font-semibold text-primary mt-3">
                          {faq.serviceTitle}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* All FAQs link at bottom */}
                <div className="mt-6 border-t border-slate-200 pt-4">
                  <Link
                    href="/faqs"
                    onClick={closeDropdowns}
                    className="text-xs font-semibold uppercase tracking-widest text-gray-900 hover:text-primary transition-colors"
                  >
                    View all FAQs →
                  </Link>
                </div>
              </div>
            )}

            {/* Testimonials Section - Simple card layout with responsive grid */}
            {activeResourcesSection === 'Testimonials' && (
              <div>
                <div className={cn(
                  "grid gap-4",
                  testimonials.slice(0, 3).length === 1 ? "grid-cols-1" : "md:grid-cols-2"
                )}>
                  {testimonials.slice(0, 3).map((testimonial: any) => (
                    <div key={testimonial._id} className="p-4 rounded-lg border border-slate-200 bg-white hover:shadow-md transition-all duration-200 h-full">
                      <div className="flex items-start gap-3">
                        {testimonial.avatar ? (
                          <div className="relative w-10 h-10 flex-shrink-0 rounded-full overflow-hidden">
                            <Image
                              src={testimonial.avatar}
                              alt={testimonial.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-primary font-semibold text-sm">
                              {testimonial.name?.charAt(0) || 'C'}
                            </span>
                          </div>
                        )}
                        
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900 text-sm">{testimonial.name}</p>
                          {testimonial.company && (
                            <p className="text-xs text-slate-500">{testimonial.company}</p>
                          )}
                          <p className="text-sm text-gray-900 mt-2 italic line-clamp-3">
                            "{testimonial.content?.substring(0, 150)}..."
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* All testimonials link at bottom */}
                <div className="mt-6 border-t border-slate-200 pt-4">
                  <Link
                    href="/testimonials"
                    onClick={closeDropdowns}
                    className="text-xs font-semibold uppercase tracking-widest text-gray-900 hover:text-primary transition-colors"
                  >
                    View all testimonials ({testimonials.length}) →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
)}
      

      {/* Full-width Dropdown Menu for Hire Us */}
      {activeDropdown === 'hire-us' && !isPageLoading && (
        <div
          onMouseEnter={() => {
            if (hoverTimeoutRef.current) {
              clearTimeout(hoverTimeoutRef.current);
              hoverTimeoutRef.current = null;
            }
          }}
          onMouseLeave={closeDropdowns}
          className="absolute left-0 right-0 top-full border-t border-black/5 bg-transparent animate-in fade-in-0 slide-in-from-top-1 duration-150 ease-out"
        >
          <div className="max-w-8xl mx-auto px-5 md:px-8 lg:px-10 py-0">
            <div
              ref={dropdownRef}
              onMouseLeave={closeDropdowns}
              className="mx-auto max-w-4xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_18px_50px_-18px_rgba(0,0,0,0.35)]"
            >
              <div className="grid grid-cols-12">
                {/* Left rail - optional, can be used for categories if needed */}
                <div className="col-span-3 bg-slate-50 p-4 border-r border-slate-200">
                  <p className="px-3 pb-3 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                    Hire Us
                  </p>
                  <ul className="space-y-1">
                    <li>
                      <button
                        type="button"
                        className="w-full rounded-md px-3 py-2.5 text-left text-sm font-semibold bg-white text-slate-900 shadow-sm flex items-center justify-between"
                      >
                        <span>Development Services</span>
                        <ChevronDown className="h-4 w-4 -rotate-90 opacity-70" aria-hidden />
                      </button>
                    </li>
                  </ul>
                </div>

                {/* Right content - all hire us items */}
                <div className="col-span-9 p-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {hireUsItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeDropdowns}
                        className="group rounded-md p-2 transition-colors hover:bg-slate-50"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-2">
                            <item.icon className="h-4 w-4 text-slate-400 transition-colors group-hover:text-primary" />
                            <p className="text-sm font-semibold text-slate-900 group-hover:text-primary">
                              {item.title}
                            </p>
                          </div>
                          <ChevronDown className="mt-0.5 h-4 w-4 -rotate-90 text-slate-300 transition-colors group-hover:text-primary" />
                        </div>
                      </Link>
                    ))}
                  </div>

                  <div className="mt-6 border-t border-slate-200 pt-4">
                    <Link
                      href="/contact-us"
                      onClick={closeDropdowns}
                      className="text-xs font-semibold uppercase tracking-widest text-gray-900 hover:text-primary transition-colors"
                    >
                      Contact sales →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

          </header>
  );
}

// Mobile Dropdown Component for Projects/Solutions
interface MobileDropdownProps {
  title: string;
  items: ProjectCategory[];
  isLoading?: boolean;
  onLinkClick: () => void;
  onProjectClick: (project: ProjectItem) => void;
}

function MobileDropdown({
  title,
  items,
  isLoading,
  onLinkClick,
  onProjectClick,
}: MobileDropdownProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const renderItems = () => {
    if (isLoading) {
      return <p className="pl-4 text-black/40">Loading projects...</p>;
    }

    if (items.length === 0) {
      return <p className="pl-4 text-black/40">No projects available</p>;
    }

    return (
      <div className="pl-4 space-y-4 mt-3">
        {items.map((section, idx) => (
          <div key={idx}>
            <span className="text-sm font-semibold text-primary mb-2 block">{section.category}</span>
            <ul className="space-y-2">
              {section.items.map((item, itemIdx) => (
                <li key={itemIdx}>
                  <button
                    onClick={() => {
                      onProjectClick(item);
                      onLinkClick();
                    }}
                    className="text-black/60 hover:text-primary transition-colors block py-1 text-left w-full"
                  >
                    {item.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="pt-2">
          <Link
            href="/software-solutions"
            onClick={onLinkClick}
            className="text-primary hover:text-primary/80 text-sm font-medium inline-flex items-center gap-1"
          >
            View All Projects
            <ChevronDown className="h-3 w-3 -rotate-90" />
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="border-b border-black/5">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full py-3 font-medium text-black/70 hover:text-primary transition-colors"
      >
        {title}
        <ChevronDown
          className={cn('h-4 w-4 transition-transform duration-300', isExpanded && 'rotate-180')}
        />
      </button>
      {isExpanded && renderItems()}
    </div>
  );
}

// Mobile Dropdown Component for Hire Us
interface MobileHireUsDropdownProps {
  title: string;
  items: { title: string; href: string; icon: LucideIcon }[];
  onLinkClick: () => void;
}

function MobileHireUsDropdown({ title, items, onLinkClick }: MobileHireUsDropdownProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border-b border-black/5">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full py-3 font-medium text-black/70 hover:text-primary transition-colors"
      >
        {title}
        <ChevronDown
          className={cn('h-4 w-4 transition-transform duration-300', isExpanded && 'rotate-180')}
        />
      </button>
      {isExpanded && (
        <div className="pl-4 space-y-2 mt-3 pb-3">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onLinkClick}
              className="block py-1.5 text-sm text-black/60 hover:text-primary transition-colors"
            >
              <span className="flex items-center gap-2">
                <item.icon className="h-4 w-4 text-black/40" />
                <span>{item.title}</span>
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// Mobile Dropdown Component for Services
interface MobileServicesDropdownProps {
  title: string;
  onLinkClick: () => void;
}

function MobileServicesDropdown({ title, onLinkClick }: MobileServicesDropdownProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border-b border-black/5">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full py-3 font-medium text-black/70 hover:text-primary transition-colors"
      >
        {title}
        <ChevronDown
          className={cn('h-4 w-4 transition-transform duration-300', isExpanded && 'rotate-180')}
        />
      </button>
      {isExpanded && (
        <div className="pl-4 space-y-2 mt-3 pb-3">
          {mobileServicePageLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onLinkClick}
              className="block py-1.5 text-sm text-black/60 hover:text-primary transition-colors"
            >
              {link.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}


// Mobile Dropdown Component for Locations
interface MobileLocationsDropdownProps {
  title: string;
  items: { title: string; href: string; files: number }[];
  onLinkClick: () => void;
}

function MobileLocationsDropdown({ title, items, onLinkClick }: MobileLocationsDropdownProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border-b border-black/5">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full py-3 font-medium text-black/70 hover:text-primary transition-colors"
      >
        {title}
        <ChevronDown
          className={cn('h-4 w-4 transition-transform duration-300', isExpanded && 'rotate-180')}
        />
      </button>

      {isExpanded && (
        <div className="pl-4 space-y-3 mt-3 pb-6">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onLinkClick}
              className="block py-2 text-sm font-medium text-black/70 hover:text-primary transition-colors group"
            >
              {item.title}
            </Link>
          ))}
          
          <div className="pt-2 border-t border-black/5">
            <Link
              href="/locations"
              onClick={onLinkClick}
              className="text-primary hover:text-primary/80 text-sm font-medium inline-flex items-center gap-1"
            >
              View All Locations
              <ChevronDown className="h-3 w-3 -rotate-90" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

// Mobile Dropdown Component for Resources (using same UI as Solutions)
interface MobileResourcesDropdownProps {
  title: string;
  caseStudies: any[];
  blogs: any[];
  testimonials: any[];
  allFaqs: any[];
  onLinkClick: () => void;
}

function MobileResourcesDropdown({ 
  title, 
  caseStudies, 
  blogs, 
  testimonials, 
  allFaqs,
  onLinkClick 
}: MobileResourcesDropdownProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border-b border-black/5">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full py-3 font-medium text-black/70 hover:text-primary transition-colors"
      >
        {title}
        <ChevronDown
          className={cn('h-4 w-4 transition-transform duration-300', isExpanded && 'rotate-180')}
        />
      </button>

      {isExpanded && (
        <div className="pl-4 space-y-4 mt-3 pb-6">
          
          {/* Case Studies */}
          <div>
            <Link
              href="/case-studies"
              onClick={onLinkClick}
              className="flex items-center justify-between  text-sm font-medium text-black/70 hover:text-primary transition-colors"
            >
              Case Studies
             
            </Link>
         
          </div>

          {/* Blog */}
          <div>
            <Link
              href="/blog"
              onClick={onLinkClick}
              className="flex items-center justify-between  text-sm font-medium text-black/70 hover:text-primary transition-colors"
            >
              Blog
            
            </Link>
          
          </div>

          {/* FAQs */}
          <div>
            <Link
              href="/faqs"
              onClick={onLinkClick}
              className="flex items-center justify-between  text-sm font-medium text-black/70 hover:text-primary transition-colors"
            >
              FAQs
          
            </Link>
            
          </div>

          {/* Testimonials */}
          <div>
            <Link
              href="/testimonials"
              onClick={onLinkClick}
              className="flex items-center justify-between  text-sm font-medium text-black/70 hover:text-primary transition-colors"
            >
              Testimonials
            
            </Link>
           
          </div>

        </div>
      )}
    </div>
  );
}