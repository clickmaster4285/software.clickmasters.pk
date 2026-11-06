/**
 * Lightweight services navigation data — the SINGLE source of truth for the
 * 19 service hubs and 130 sub-services.
 *
 * Used by: header mega-menu, footer, hub grids, sitemap generator (via
 * service-pages.ts which re-exports from here).
 *
 * IMPORTANT: keep this file free of heavy imports (faq.ts, persona/goal data …)
 * so it can be imported from client components without bloating the JS bundle.
 */
export type ServiceMenuSection = {
 label: string;
 items: { title: string; description: string }[];
};

export function slugify(value: string): string {
 return value
 .toLowerCase()
 .trim()
 .replace(/['"]/g, '')
 .replace(/[^a-z0-9]+/g, '-')
 .replace(/^-+|-+$/g, '');
}

/** Align menu-derived category slugs with `services.ts` hub paths. */
export function categorySlugFromSectionLabel(label: string): string {
 const fromMenu = slugify(label);
 const aliases: Record<string, string> = {
  'cloud-devops': 'cloud-and-devops',
  'testing-qa': 'testing-and-qa',
  'support-outsourcing': 'support-and-outsourcing',
  'blockchain-web3': 'blockchain-and-web3',
  'data-intelligence': 'data-and-intelligence',
  'automation-integration': 'automation-and-integration',
  'automation-chatbot': 'automation-and-chatbot',
  'iot-emerging-tech': 'iot-and-emerging-tech',
 };
 return aliases[fromMenu] ?? fromMenu;
}





export const serviceMenuSections: ServiceMenuSection[] = [
  {
 label: 'Software Development',
 items: [
      { title: 'Custom Software Development', description: 'Tailored software for specific business goals.' },
      { title: 'Enterprise Software Development', description: 'Scalable enterprise platforms and workflows.' },
      { title: 'SaaS Product Development', description: 'Cloud-based SaaS products with recurring value.' },
      { title: 'MVP Development', description: 'Fast MVP releases to validate ideas.' },
      { title: 'Desktop Application Development', description: 'Reliable desktop apps for business operations.' },
      { title: 'API Development & Integration', description: 'Robust APIs and third-party integrations.' },
      { title: 'Microservices Architecture', description: 'Distributed systems built for scale.' },
      { title: 'Backend Development', description: 'Secure, high-performance backend services.' },
      { title: 'Frontend Development', description: 'Responsive, accessible frontend experiences.' },
      { title: 'Full Stack Development', description: 'End-to-end product development support.' },
 ],
  },
  {
 label: 'Web Development',
 items: [
      { title: 'Web Application Development', description: 'Modern web apps and business portals.' },
      { title: 'Website Development', description: 'SEO-friendly websites that convert.' },
      { title: 'PWA Development', description: 'Installable web apps with offline support.' },
      { title: 'Headless CMS Development', description: 'Flexible content systems with API delivery.' },
      { title: 'JAMstack Development', description: 'Fast static-first web architectures.' },
      { title: 'E-commerce Development', description: 'Scalable online stores and checkout flows.' },
      { title: 'Headless E-commerce', description: 'Composable commerce for modern storefronts.' },
      { title: 'Shopify Development', description: 'Custom Shopify storefront and app work.' },
      { title: 'WooCommerce Development', description: 'WordPress commerce customization and support.' },
 ],
  },
  {
 label: 'Mobile Development',
 items: [
      { title: 'Mobile App Development', description: 'Mobile products for iOS and Android users.' },
      { title: 'Android App Development', description: 'Native Android apps with strong performance.' },
      { title: 'iOS App Development', description: 'Native iOS apps built for Apple ecosystem.' },
      { title: 'Cross-Platform App Development', description: 'Shared-code apps for faster delivery.' },
      { title: 'Flutter App Development', description: 'Flutter apps with consistent UI.' },
      { title: 'React Native Development', description: 'React Native apps with reusable components.' },
 ],
  },
  {
 label: 'Design UI/UX',
 items: [
      { title: 'UI/UX Design Services', description: 'User-first interfaces with measurable outcomes.' },
      { title: 'Product Design', description: 'End-to-end product thinking and execution.' },
      { title: 'Web Design', description: 'Modern web layouts with clear hierarchy.' },
      { title: 'Mobile App Design', description: 'Mobile-first design systems and flows.' },
      { title: 'UX Research', description: 'Research-backed decisions for better usability.' },
      { title: 'Wireframing & Prototyping', description: 'Rapid wireframes and interactive prototypes.' },
      { title: 'Design Systems', description: 'Reusable design language and component patterns.' },
 ],
  },
  {
 label: 'Artificial Intelligence (AI)',
 items: [
      { title: 'Generative AI Solutions', description: 'LLM-powered generation and automation workflows.' },
      { title: 'AI Experts', description: 'Expert advisors for AI strategy and implementation.' },
      { title: 'AI Developers', description: 'Custom AI applications built by expert developers.' },
      { title: 'AI Prompt Engineers', description: 'Prompt engineering for high-quality model outputs.' },
      { title: 'AI Chatbot Development', description: 'Conversational assistants for support and sales.' },
      { title: 'AI Agents Development', description: 'Autonomous agents for business operations.' },
      { title: 'AI Automation Systems', description: 'Intelligent automation across repetitive tasks.' },
      { title: 'AI Integration Services', description: 'Integrate AI capabilities into existing systems.' },
      { title: 'AI Model Development', description: 'Custom model development and deployment.' },
      { title: 'LLM Applications Development', description: 'Production-grade LLM applications and tooling.' },
 ],
  },
  {
 label: 'Machine Learning (ML)',
 items: [
      { title: 'Machine Learning Solutions', description: 'ML systems tailored to your domain data.' },
      { title: 'Machine Learning Experts', description: 'Expert ML practitioners for model-driven products.' },
      { title: 'Predictive Analytics', description: 'Forecasting models to guide decisions.' },
      { title: 'Recommendation Systems', description: 'Personalized recommendations for engagement.' },
      { title: 'Model Training Optimisation', description: 'Training pipelines and model performance tuning.' },
      { title: 'Deep Learning Solutions', description: 'Advanced neural models for complex problems.' },
      { title: 'Deep Learning Experts', description: 'Specialists in deep learning architecture and deployment.' },
 ],
  },
  {
 label: 'NLP & Computer Vision',
 items: [
      { title: 'Natural Language Processing', description: 'Text understanding and language workflows.' },
      { title: 'Speech Recognition', description: 'Voice-to-text and speech processing solutions.' },
      { title: 'Text Analytics', description: 'Insights from unstructured text data.' },
      { title: 'Computer Vision', description: 'Image and video understanding pipelines.' },
      { title: 'Image Processing', description: 'Image enhancement, detection, and classification.' },
      { title: 'Video Analytics', description: 'Real-time and batch video intelligence.' },
 ],
  },
  {
 label: 'Data Services',
 items: [
      { title: 'Data Science & Analytics', description: 'Data-driven strategy and advanced analytics.' },
      { title: 'Business Intelligence (BI)', description: 'BI dashboards and business reporting systems.' },
      { title: 'Data Engineering', description: 'Reliable pipelines and data platform architecture.' },
      { title: 'Data Warehousing', description: 'Warehouse design for analytics at scale.' },
      { title: 'Data Visualization', description: 'Clear visual storytelling with data.' },
      { title: 'Big Data Solutions', description: 'Large-scale data processing infrastructure.' },
 ],
  },
  {
 label: 'Data & Intelligence',
 items: [
      { title: 'Data Scraping Specialists', description: 'Extract the data you need from the open web and internal sources.' },
      { title: 'Web Scraping Specialists', description: 'Reliable web scraping services for structured data collection.' },
      { title: 'Excel Experts', description: 'Advanced spreadsheet automation and analytics in Excel.' },
      { title: 'Google Sheets Experts', description: 'Automated Google Sheets workflows and data solutions.' },
      { title: 'Power BI Developers', description: 'Interactive dashboards and reporting with Power BI.' },
      { title: 'Data Scientists', description: 'Expert data science to turn your data into business insights.' },
      { title: 'Data Engineers', description: 'Data pipeline and infrastructure engineering for analytics-ready systems.' },
      { title: 'Tableau Developers', description: 'Visual analytics and dashboard development in Tableau.' },
      { title: 'SQL Database Developers', description: 'SQL database development for fast, reliable data storage and queries.' },
 ],
  },
  {
 label: 'Automation & Chatbot',
 items: [
      { title: 'Chatbot Developers', description: 'Custom chatbot development for support and engagement.' },
      { title: 'Chatbot Marketing Experts', description: 'Drive conversions and lead capture with chatbot marketing.' },
      { title: 'Chatbot UX Writers', description: 'Conversational UX writing for effective chatbot experiences.' },
      { title: 'Process Automation Experts', description: 'Automate repetitive business processes with intelligent workflows.' },
      { title: 'Python Automation Experts', description: 'Python automation solutions for repetitive and data-driven tasks.' },
      { title: 'Software Automation Experts', description: 'Software automation to remove manual effort and improve quality.' },
      { title: 'Web Automation Experts', description: 'Web automation for testing, scraping, and workflow automation.' },
      { title: 'Marketing Automation Experts', description: 'Marketing automation systems for campaigns and lead nurture.' },
 ],
  },
  {
 label: 'Automation & Integration',
 items: [
      { title: 'Business Process Automation', description: 'Automate repetitive business workflows.' },
      { title: 'Workflow Automation', description: 'Orchestrated process automation across teams.' },
      { title: 'RPA', description: 'RPA bots for operational efficiency.' },
      { title: 'System Integration', description: 'Connect platforms and eliminate silos.' },
      { title: 'API Integration', description: 'Reliable integration between tools and services.' },
      { title: 'Web Scraping & Data Extraction', description: 'Structured data extraction for operations.' },
 ],
  },
  {
 label: 'Cloud & DevOps',
 items: [
      { title: 'Cloud Solutions', description: 'Cloud architecture and migration services.' },
      { title: 'Cloud Solutions DevOps', description: 'Cloud architecture with DevOps practices.' },
      { title: 'Cloud-Native Development', description: 'Cloud-native apps built for resilience.' },
      { title: 'DevOps Services', description: 'Delivery pipelines and release automation.' },
      { title: 'DevSecOps', description: 'Security integrated into DevOps practices.' },
      { title: 'CI/CD Pipeline Setup', description: 'Automated build, test, and deployment workflows.' },
      { title: 'Serverless Architecture', description: 'Event-driven serverless application design.' },
      { title: 'Containerisation', description: 'Containerized deployments at scale.' },
      { title: 'Infrastructure as Code', description: 'Versioned, repeatable infrastructure setup.' },
 ],
  },
  {
 label: 'Database Services',
 items: [
      { title: 'Database Design', description: 'Data models optimized for real workloads.' },
      { title: 'Database Management', description: 'Database operations, reliability, and health.' },
      { title: 'Data Migration', description: 'Safe migration with minimal downtime.' },
      { title: 'Database Optimisation', description: 'Performance tuning for faster queries.' },
      { title: 'SQL & NoSQL Solutions', description: 'Right-fit SQL and NoSQL implementations.' },
 ],
  },
  {
 label: 'Cybersecurity',
 items: [
      { title: 'Cybersecurity Services', description: 'Security posture improvements and hardening.' },
      { title: 'Security Audits', description: 'Comprehensive infrastructure and app audits.' },
      { title: 'Penetration Testing', description: 'Controlled security testing by experts.' },
      { title: 'Vulnerability Assessment', description: 'Find and prioritize security weaknesses.' },
      { title: 'Compliance & Risk Management', description: 'Controls and governance for compliance.' },
      { title: 'Application Security', description: 'Secure SDLC and application hardening.' },
 ],
  },
  {
 label: 'Testing & QA',
 items: [
      { title: 'QA & Software Testing', description: 'Comprehensive QA strategies and execution.' },
      { title: 'Automated Testing', description: 'Reliable test automation for faster releases.' },
      { title: 'Manual Testing', description: 'Thorough exploratory and scenario-based testing.' },
      { title: 'Performance Testing', description: 'Measure and optimize system performance.' },
      { title: 'Load Testing', description: 'Validate reliability under peak traffic.' },
      { title: 'Bug Fixing', description: 'Rapid issue resolution and stabilization.' },
 ],
  },
  {
 label: 'Support & Outsourcing',
 items: [
      { title: 'Maintenance & Support', description: 'Ongoing maintenance and product support.' },
      { title: 'Dedicated Development Teams', description: 'Skilled dedicated teams for long-term work.' },
      { title: 'IT Outsourcing', description: 'Flexible outsourcing for technical delivery.' },
      { title: 'Staff Augmentation', description: 'On-demand engineers to scale your team.' },
      { title: 'Technical Support', description: 'Reliable support for systems and users.' },
 ],
  },
  {
 label: 'Blockchain & Web3',
 items: [
      { title: 'Blockchain Development', description: 'Blockchain platforms and custom protocols.' },
      { title: 'Smart Contract Development', description: 'Secure smart contract implementation.' },
      { title: 'DApp Development', description: 'DApp architecture and frontend integration.' },
      { title: 'Web3 Development', description: 'Web3 product development and integrations.' },
      { title: 'Crypto Wallet Development', description: 'Wallet apps with secure asset handling.' },
      { title: 'NFT Marketplace Development', description: 'NFT marketplace platforms and tooling.' },
      { title: 'Token Development', description: 'Token standards and launch support.' },
 ],
  },
  {
 label: 'IoT & Emerging Tech',
 items: [
      { title: 'IoT Development', description: 'Connected device ecosystems and dashboards.' },
      { title: 'Smart Systems Development', description: 'Intelligent systems with real-time control.' },
      { title: 'Industrial IoT', description: 'Industrial monitoring and automation solutions.' },
      { title: 'Embedded Systems Development', description: 'Embedded firmware and hardware integration.' },
 ],
  },
  {
 label: 'Immersive Tech',
 items: [
      { title: 'AR Development', description: 'Augmented reality experiences and apps.' },
      { title: 'VR Development', description: 'Virtual reality applications for training and products.' },
      { title: 'Mixed Reality Solutions', description: 'Mixed reality for collaborative experiences.' },
      { title: '3D Application Development', description: 'Interactive 3D applications and simulations.' },
 ],
  },
];

export type ServiceNavItem = { title: string; slug: string; href: string; description: string };
export type ServiceHub = { label: string; slug: string; href: string; items: ServiceNavItem[] };

/** All 19 hubs with their published sub-services, derived from serviceMenuSections. */
export const serviceHubs: ServiceHub[] = serviceMenuSections.map((section) => {
  const hubSlug = categorySlugFromSectionLabel(section.label);
  return {
    label: section.label,
    slug: hubSlug,
    href: `/${hubSlug}`,
    items: section.items.map((item) => {
      const slug = slugify(item.title);
      return { title: item.title, slug, href: `/${hubSlug}/${slug}`, description: item.description };
    }),
  };
});

const hubBySlug = new Map(serviceHubs.map((hub) => [hub.slug, hub]));
const navItemBySlug = new Map(
  serviceHubs.flatMap((hub) => hub.items.map((item) => [item.slug, { hub, item }] as const))
);

export function getServiceHub(hubSlug: string): ServiceHub | undefined {
  return hubBySlug.get(hubSlug);
}

/** Canonical path for a sub-service, without loading the heavy page content module. */
export function getServiceNavPath(category: string, title: string): string {
  const serviceSlug = slugify(title);
  const found = navItemBySlug.get(serviceSlug);
  if (found) return found.item.href;
  return `/${categorySlugFromSectionLabel(category)}/${serviceSlug}`;
}

const subServiceSlugsByLength = [...navItemBySlug.keys()].sort((a, b) => b.length - a.length);

/**
 * Find the sub-service a slug is about, e.g. a blog slug "custom-software-development"
 * or "custom-software-development-guide" -> Custom Software Development (T7).
 */
export function findServiceForSlug(slug: string): { hub: ServiceHub; item: ServiceNavItem } | undefined {
  const normalized = slugify(slug);
  const match = subServiceSlugsByLength.find(
    (s) => normalized === s || normalized.startsWith(`${s}-`)
  );
  return match ? navItemBySlug.get(match) : undefined;
}
