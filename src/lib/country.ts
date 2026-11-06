// Country data with specific information for each location
export interface CountryData {
  name: string;
  title: string;
  description: string;
  content: string;
  servicesByCategory: {
    category: string
    services: string[]
  }[];
  contactInfo: {
    email: string;
    phone: string;
    address: string;
  };
  timezone: string;
  languages: string[];
  heroHeadline: string;
  heroSubheadline: string;
  businessLandscape: string;
  digitalTransformationDemand: string;
  marketChallenges: string[];
  industries: {
    name: string;
    description: string;
  }[];
  solutions: {
    name: string;
    description: string;
  }[];
  problems: string[];
  technologies: string[];
  caseStudies: {
    title: string;
    industry: string;
    challenge: string;
    solution: string;
    results: string;
  }[];
  testimonials: {
    name: string;
    company: string;
    feedback: string;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
  processPhases?: {
    phase: string;
    title: string;
    timeline: string;
    text: string;
  }[];
  pricingTiers?: {
    type: string;
    investment: string;
    timeline: string;
    bestFor: string;
  }[];
}

export const countryData: Record<string, CountryData> = {
  canada: {
    name: 'Canada',
    title: 'Software Development Company in Canada',
    description: 'Leading custom software development company in Canada. We build scalable web applications, mobile apps, and AI solutions for Canadian businesses.',
    content: 'ClickMasters is your premier software development partner in Canada. Our team of expert developers specializes in creating custom solutions that drive business growth and digital transformation.',
    servicesByCategory : [
  {
    category: "AI & Machine Learning",
    services: [
      "AI Agents Development",
      "AI Automation Systems",
      "AI Chatbot Development",
      "AI Integration Services",
      "AI Model Development",
      "Deep Learning Solutions",
      "Generative AI Solutions",
      "LLM Applications Development",
    ],
  },

  {
    category: "App Development",
    services: [
      "Android App Development",
      "Cross Platform App Development",
      "Flutter App Development",
      "iOS App Development",
      "Mobile App Development",
      "Mobile App Design",
      "Native App Development",
      "React Native Development",
    ],
  },

  {
    category: "Web Development",
    services: [
      "Ecommerce Development",
      "Frontend Development",
      "Full Stack Development",
      "Web Application Development",
      "Website Development",
      "Web Design",
    ],
  },

  {
    category: "Backend & Infrastructure",
    services: [
      "Backend Development",
      "Cloud Native Development",
      "Cloud Solutions",
      "Cloud Solutions DevOps",
      "DevOps Services",
      "Serverless Architecture",
      "Microservices Architecture",
    ],
  },

  {
    category: "Database & Data",
    services: [
      "Data Engineering",
      "Data Migration",
      "Data Science Analytics",
      "Data Visualization",
      "Data Warehousing",
      "Database Design",
      "Database Management",
      "Database Optimisation",
    ],
  },

  {
    category: "Blockchain & Crypto",
    services: [
      "Blockchain Development",
      "Crypto Wallet Development",
      "DApp Development",
      "Smart Contract Development",
    ],
  },

  {
    category: "Testing & QA",
    services: [
      "Automated Testing",
      "Manual Testing",
      "Load Testing",
      "Performance Testing",
      "QA Software Testing",
      "Penetration Testing",
    ],
  },

  {
    category: "Security",
    services: [
      "Application Security",
      "Cybersecurity Services",
      "Security Audits",
      "Vulnerability Assessment",
      "Compliance Risk Management",
    ],
  },

  {
    category: "Business & Analytics",
    services: [
      "Business Intelligence",
      "Business Process Automation",
      "Predictive Analytics",
      "Recommendation Systems",
      "RPA",
      "Workflow Automation",
    ],
  },

  {
    category: "Specialized Development",
    services: [
      "AR Development",
      "VR Development",
      "Embedded Systems Development",
      "Desktop Application Development",
      "Enterprise Software",
      "IoT Development",
      "Industrial IoT",
      "Mixed Reality Solutions",
      "Smart Systems Development",
      "Web3 Development",
    ],
  },

  {
    category: "E-commerce Platforms",
    services: [
      "Headless Ecommerce",
      "Shopify Development",
      "WooCommerce Development",
      "Headless CMS Development",
    ],
  },

  {
    category: "Advanced Technologies",
    services: [
      "Computer Vision",
      "Image Processing",
      "Natural Language Processing",
      "Speech Recognition",
      "Text Analytics",
      "Video Analytics",
      "Model Training Optimisation",
      "Token Development",
    ],
  },

  {
    category: "Services & Support",
    services: [
      "Dedicated Development Teams",
      "IT Outsourcing",
      "Maintenance Support",
      "Staff Augmentation",
      "System Integration",
      "Technical Support",
      "Bug Fixing",
      "API Integration",
    ],
  },

  {
    category: "Design & UX",
    services: [
      "UI/UX Design Services",
      "UX Research",
      "Product Design",
      "Design Systems",
      "Wireframing Prototyping",
    ],
  },

  {
    category: "Other Services",
    services: [
      "API Development Integration",
      "Big Data Solutions",
      "Containerisation",
      "Infrastructure as Code",
      "Jamstack Development",
      "MVP Development",
      "NFT Marketplace Development",
      "PWA Development",
      "SQL NoSQL Solutions",
      "Web Scraping Data Extraction",
    ],
  },
],
    contactInfo: {
      email: 'canada@clickmasters.com',
      phone: '+1 (416) 555-0123',
      address: 'Toronto, Ontario, Canada'
    },
    timezone: 'EST (UTC-5)',
    languages: ['English', 'French'],
    heroHeadline: 'Software Development Services in Canada',
    heroSubheadline: 'Helping startups and enterprises build scalable web, mobile, and SaaS solutions.',
    businessLandscape: 'Canada boasts a diverse and thriving business ecosystem with strong technology sectors in Toronto, Vancouver, and Montreal.',
    digitalTransformationDemand: 'Canadian businesses are rapidly embracing digital transformation to stay competitive in global markets.',
    marketChallenges: [
      'Talent shortage in tech sector',
      'High development costs',
      'Complex regulatory requirements',
      'Cross-border integration needs'
    ],
    industries: [
      { name: 'Healthcare', description: 'Digital health solutions and medical software systems' },
      { name: 'Fintech', description: 'Banking and financial technology innovations' },
      { name: 'Real Estate', description: 'Property management and real estate platforms' },
      { name: 'Education', description: 'EdTech solutions and learning management systems' },
      { name: 'E-commerce', description: 'Online retail and marketplace platforms' },
      { name: 'Logistics', description: 'Supply chain and transportation management' }
    ],
    solutions: [
      { name: 'Business automation systems', description: 'Streamline workflows and reduce manual processes' },
      { name: 'CRM & ERP solutions', description: 'Comprehensive business management platforms' },
      { name: 'SaaS platforms', description: 'Scalable subscription-based software solutions' },
      { name: 'Cloud applications', description: 'Modern cloud-native application development' },
      { name: 'Workflow optimization', description: 'Process automation and efficiency improvements' },
      { name: 'API integrations', description: 'Seamless system connectivity and data exchange' }
    ],
    problems: [
      'Manual workflows slowing down operations',
      'Outdated legacy systems',
      'Poor scalability of current solutions',
      'Inefficient business processes',
      'Lack of automation in key areas'
    ],
    technologies: ['React / Next.js', 'Node.js', 'Laravel', 'Flutter', 'AWS', 'Docker'],
    caseStudies: [
      {
        title: 'Healthcare Management System',
        industry: 'Healthcare',
        challenge: 'Manual patient record management',
        solution: 'Custom EHR system with HIPAA compliance',
        results: '40% reduction in administrative time, improved patient care'
      },
      {
        title: 'E-commerce Platform',
        industry: 'Retail',
        challenge: 'Limited online presence',
        solution: 'Full-featured e-commerce platform',
        results: '300% increase in online sales within 6 months'
      }
    ],
    testimonials: [
      {
        name: 'Sarah Johnson',
        company: 'Tech Innovations Inc.',
        feedback: 'ClickMasters delivered exceptional software solutions that transformed our business operations.'
      },
      {
        name: 'Michael Chen',
        company: 'Global Logistics Ltd.',
        feedback: 'Professional team, great communication, and outstanding results. Highly recommended!'
      }
    ],
    faqs: [
      {
        question: 'How much does software development cost in Canada?',
        answer: 'Costs vary based on complexity, typically ranging from $10,000 to $100,000+ for custom solutions.'
      },
      {
        question: 'Do you work remotely with international clients?',
        answer: 'Yes, we work with clients globally and have experience with remote collaboration.'
      },
      {
        question: 'What technologies do you use?',
        answer: 'We use modern technologies including React, Node.js, Python, and cloud platforms like AWS.'
      },
      {
        question: 'Do you provide post-launch support?',
        answer: 'Yes, we offer comprehensive maintenance and support packages for all our solutions.'
      }
    ]
  },
  usa: {
    name: 'USA',
    title: 'Software Development Company in the USA',
    description: 'Top-rated software development company in the USA. We deliver cutting-edge web, mobile, and AI solutions for American businesses.',
    content: 'ClickMasters USA provides world-class software development services to businesses across the United States. Our expert team delivers innovative solutions that transform your digital presence.',
        servicesByCategory : [
  {
    category: "AI & Machine Learning",
    services: [
      "AI Agents Development",
      "AI Automation Systems",
      "AI Chatbot Development",
      "AI Integration Services",
      "AI Model Development",
      "Deep Learning Solutions",
      "Generative AI Solutions",
      "LLM Applications Development",
    ],
  },

  {
    category: "App Development",
    services: [
      "Android App Development",
      "Cross Platform App Development",
      "Flutter App Development",
      "iOS App Development",
      "Mobile App Development",
      "Mobile App Design",
      "Native App Development",
      "React Native Development",
    ],
  },

  {
    category: "Web Development",
    services: [
      "Ecommerce Development",
      "Frontend Development",
      "Full Stack Development",
      "Web Application Development",
      "Website Development",
      "Web Design",
    ],
  },

  {
    category: "Backend & Infrastructure",
    services: [
      "Backend Development",
      "Cloud Native Development",
      "Cloud Solutions",
      "Cloud Solutions DevOps",
      "DevOps Services",
      "Serverless Architecture",
      "Microservices Architecture",
    ],
  },

  {
    category: "Database & Data",
    services: [
      "Data Engineering",
      "Data Migration",
      "Data Science Analytics",
      "Data Visualization",
      "Data Warehousing",
      "Database Design",
      "Database Management",
      "Database Optimisation",
    ],
  },

  {
    category: "Blockchain & Crypto",
    services: [
      "Blockchain Development",
      "Crypto Wallet Development",
      "DApp Development",
      "Smart Contract Development",
    ],
  },

  {
    category: "Testing & QA",
    services: [
      "Automated Testing",
      "Manual Testing",
      "Load Testing",
      "Performance Testing",
      "QA Software Testing",
      "Penetration Testing",
    ],
  },

  {
    category: "Security",
    services: [
      "Application Security",
      "Cybersecurity Services",
      "Security Audits",
      "Vulnerability Assessment",
      "Compliance Risk Management",
    ],
  },

  {
    category: "Business & Analytics",
    services: [
      "Business Intelligence",
      "Business Process Automation",
      "Predictive Analytics",
      "Recommendation Systems",
      "RPA",
      "Workflow Automation",
    ],
  },

  {
    category: "Specialized Development",
    services: [
      "AR Development",
      "VR Development",
      "Embedded Systems Development",
      "Desktop Application Development",
      "Enterprise Software",
      "IoT Development",
      "Industrial IoT",
      "Mixed Reality Solutions",
      "Smart Systems Development",
      "Web3 Development",
    ],
  },

  {
    category: "E-commerce Platforms",
    services: [
      "Headless Ecommerce",
      "Shopify Development",
      "WooCommerce Development",
      "Headless CMS Development",
    ],
  },

  {
    category: "Advanced Technologies",
    services: [
      "Computer Vision",
      "Image Processing",
      "Natural Language Processing",
      "Speech Recognition",
      "Text Analytics",
      "Video Analytics",
      "Model Training Optimisation",
      "Token Development",
    ],
  },

  {
    category: "Services & Support",
    services: [
      "Dedicated Development Teams",
      "IT Outsourcing",
      "Maintenance Support",
      "Staff Augmentation",
      "System Integration",
      "Technical Support",
      "Bug Fixing",
      "API Integration",
    ],
  },

  {
    category: "Design & UX",
    services: [
      "UI/UX Design Services",
      "UX Research",
      "Product Design",
      "Design Systems",
      "Wireframing Prototyping",
    ],
  },

  {
    category: "Other Services",
    services: [
      "API Development Integration",
      "Big Data Solutions",
      "Containerisation",
      "Infrastructure as Code",
      "Jamstack Development",
      "MVP Development",
      "NFT Marketplace Development",
      "PWA Development",
      "SQL NoSQL Solutions",
      "Web Scraping Data Extraction",
    ],
  },
],
    contactInfo: {
      email: 'usa@clickmasters.com',
      phone: '+1 (212) 555-0147',
      address: 'New York, NY, USA'
    },
    timezone: 'EST (UTC-5)',
    languages: ['English'],
    heroHeadline: 'Software Development Services in USA',
    heroSubheadline: 'Helping startups and enterprises build scalable web, mobile, and SaaS solutions.',
    businessLandscape: 'The United States leads the global technology sector with major innovation hubs in Silicon Valley, New York, and Austin.',
    digitalTransformationDemand: 'American businesses require cutting-edge digital solutions to maintain competitive advantage in fast-paced markets.',
    marketChallenges: [
      'Intense competition for talent',
      'High development costs in major tech hubs',
      'Complex regulatory compliance',
      'Rapid technology evolution'
    ],
    industries: [
      { name: 'Healthcare', description: 'Digital health solutions and medical software systems' },
      { name: 'Fintech', description: 'Banking and financial technology innovations' },
      { name: 'Real Estate', description: 'Property management and real estate platforms' },
      { name: 'Education', description: 'EdTech solutions and learning management systems' },
      { name: 'E-commerce', description: 'Online retail and marketplace platforms' },
      { name: 'Logistics', description: 'Supply chain and transportation management' }
    ],
    solutions: [
      { name: 'Business automation systems', description: 'Streamline workflows and reduce manual processes' },
      { name: 'CRM & ERP solutions', description: 'Comprehensive business management platforms' },
      { name: 'SaaS platforms', description: 'Scalable subscription-based software solutions' },
      { name: 'Cloud applications', description: 'Modern cloud-native application development' },
      { name: 'Workflow optimization', description: 'Process automation and efficiency improvements' },
      { name: 'API integrations', description: 'Seamless system connectivity and data exchange' }
    ],
    problems: [
      'Manual workflows slowing down operations',
      'Outdated legacy systems',
      'Poor scalability of current solutions',
      'Inefficient business processes',
      'Lack of automation in key areas'
    ],
    technologies: ['React / Next.js', 'Node.js', 'Laravel', 'Flutter', 'AWS', 'Docker'],
    caseStudies: [
      {
        title: 'FinTech Platform',
        industry: 'Fintech',
        challenge: 'Legacy banking system integration',
        solution: 'Modern API-first banking platform',
        results: '50% faster transaction processing, improved security'
      },
      {
        title: 'Healthcare SaaS',
        industry: 'Healthcare',
        challenge: 'Scattered patient data management',
        solution: 'Unified healthcare management system',
        results: '60% improvement in data accuracy, better patient outcomes'
      }
    ],
    testimonials: [
      {
        name: 'David Miller',
        company: 'InnovateTech Solutions',
        feedback: 'Outstanding development team that delivered our complex SaaS platform on time and budget.'
      },
      {
        name: 'Emily Rodriguez',
        company: 'Global Finance Corp',
        feedback: 'Professional, reliable, and innovative. ClickMasters exceeded our expectations.'
      }
    ],
    faqs: [
      {
        question: 'How much does software development cost in USA?',
        answer: 'Costs vary based on complexity, typically ranging from $15,000 to $150,000+ for custom solutions.'
      },
      {
        question: 'Do you work remotely with international clients?',
        answer: 'Yes, we work with clients globally and have experience with remote collaboration.'
      },
      {
        question: 'What technologies do you use?',
        answer: 'We use modern technologies including React, Node.js, Python, and cloud platforms like AWS.'
      },
      {
        question: 'Do you provide post-launch support?',
        answer: 'Yes, we offer comprehensive maintenance and support packages for all our solutions.'
      }
    ]
  },
  uk: {
    name: 'UK',
    title: 'Software Development Company in the UK',
    description: 'Leading software development agency in the United Kingdom. Specializing in custom web apps, mobile solutions, and AI development for UK businesses.',
    content: 'ClickMasters UK is your trusted software development partner across the United Kingdom. We deliver high-quality, scalable solutions that help businesses thrive in the digital age.',
       servicesByCategory : [
  {
    category: "AI & Machine Learning",
    services: [
      "AI Agents Development",
      "AI Automation Systems",
      "AI Chatbot Development",
      "AI Integration Services",
      "AI Model Development",
      "Deep Learning Solutions",
      "Generative AI Solutions",
      "LLM Applications Development",
    ],
  },

  {
    category: "App Development",
    services: [
      "Android App Development",
      "Cross Platform App Development",
      "Flutter App Development",
      "iOS App Development",
      "Mobile App Development",
      "Mobile App Design",
      "Native App Development",
      "React Native Development",
    ],
  },

  {
    category: "Web Development",
    services: [
      "Ecommerce Development",
      "Frontend Development",
      "Full Stack Development",
      "Web Application Development",
      "Website Development",
      "Web Design",
    ],
  },

  {
    category: "Backend & Infrastructure",
    services: [
      "Backend Development",
      "Cloud Native Development",
      "Cloud Solutions",
      "Cloud Solutions DevOps",
      "DevOps Services",
      "Serverless Architecture",
      "Microservices Architecture",
    ],
  },

  {
    category: "Database & Data",
    services: [
      "Data Engineering",
      "Data Migration",
      "Data Science Analytics",
      "Data Visualization",
      "Data Warehousing",
      "Database Design",
      "Database Management",
      "Database Optimisation",
    ],
  },

  {
    category: "Blockchain & Crypto",
    services: [
      "Blockchain Development",
      "Crypto Wallet Development",
      "DApp Development",
      "Smart Contract Development",
    ],
  },

  {
    category: "Testing & QA",
    services: [
      "Automated Testing",
      "Manual Testing",
      "Load Testing",
      "Performance Testing",
      "QA Software Testing",
      "Penetration Testing",
    ],
  },

  {
    category: "Security",
    services: [
      "Application Security",
      "Cybersecurity Services",
      "Security Audits",
      "Vulnerability Assessment",
      "Compliance Risk Management",
    ],
  },

  {
    category: "Business & Analytics",
    services: [
      "Business Intelligence",
      "Business Process Automation",
      "Predictive Analytics",
      "Recommendation Systems",
      "RPA",
      "Workflow Automation",
    ],
  },

  {
    category: "Specialized Development",
    services: [
      "AR Development",
      "VR Development",
      "Embedded Systems Development",
      "Desktop Application Development",
      "Enterprise Software",
      "IoT Development",
      "Industrial IoT",
      "Mixed Reality Solutions",
      "Smart Systems Development",
      "Web3 Development",
    ],
  },

  {
    category: "E-commerce Platforms",
    services: [
      "Headless Ecommerce",
      "Shopify Development",
      "WooCommerce Development",
      "Headless CMS Development",
    ],
  },

  {
    category: "Advanced Technologies",
    services: [
      "Computer Vision",
      "Image Processing",
      "Natural Language Processing",
      "Speech Recognition",
      "Text Analytics",
      "Video Analytics",
      "Model Training Optimisation",
      "Token Development",
    ],
  },

  {
    category: "Services & Support",
    services: [
      "Dedicated Development Teams",
      "IT Outsourcing",
      "Maintenance Support",
      "Staff Augmentation",
      "System Integration",
      "Technical Support",
      "Bug Fixing",
      "API Integration",
    ],
  },

  {
    category: "Design & UX",
    services: [
      "UI/UX Design Services",
      "UX Research",
      "Product Design",
      "Design Systems",
      "Wireframing Prototyping",
    ],
  },

  {
    category: "Other Services",
    services: [
      "API Development Integration",
      "Big Data Solutions",
      "Containerisation",
      "Infrastructure as Code",
      "Jamstack Development",
      "MVP Development",
      "NFT Marketplace Development",
      "PWA Development",
      "SQL NoSQL Solutions",
      "Web Scraping Data Extraction",
    ],
  },
],
    contactInfo: {
      email: 'uk@clickmasters.com',
      phone: '+44 (20) 7123-4567',
      address: 'London, United Kingdom'
    },
    timezone: 'GMT (UTC+0)',
    languages: ['English'],
    heroHeadline: 'Software Development Services in UK',
    heroSubheadline: 'Helping startups and enterprises build scalable web, mobile, and SaaS solutions.',
    businessLandscape: 'The United Kingdom boasts a sophisticated technology ecosystem with London as a global fintech hub.',
    digitalTransformationDemand: 'British businesses are rapidly adopting digital solutions to compete in post-Brexit markets.',
    marketChallenges: [
      'Brexit-related regulatory changes',
      'Talent competition in London',
      'GDPR compliance requirements',
      'Digital skills gap'
    ],
    industries: [
      { name: 'Healthcare', description: 'Digital health solutions and medical software systems' },
      { name: 'Fintech', description: 'Banking and financial technology innovations' },
      { name: 'Real Estate', description: 'Property management and real estate platforms' },
      { name: 'Education', description: 'EdTech solutions and learning management systems' },
      { name: 'E-commerce', description: 'Online retail and marketplace platforms' },
      { name: 'Logistics', description: 'Supply chain and transportation management' }
    ],
    solutions: [
      { name: 'Business automation systems', description: 'Streamline workflows and reduce manual processes' },
      { name: 'CRM & ERP solutions', description: 'Comprehensive business management platforms' },
      { name: 'SaaS platforms', description: 'Scalable subscription-based software solutions' },
      { name: 'Cloud applications', description: 'Modern cloud-native application development' },
      { name: 'Workflow optimization', description: 'Process automation and efficiency improvements' },
      { name: 'API integrations', description: 'Seamless system connectivity and data exchange' }
    ],
    problems: [
      'Manual workflows slowing down operations',
      'Outdated legacy systems',
      'Poor scalability of current solutions',
      'Inefficient business processes',
      'Lack of automation in key areas'
    ],
    technologies: ['React / Next.js', 'Node.js', 'Laravel', 'Flutter', 'AWS', 'Docker'],
    caseStudies: [
      {
        title: 'Banking Platform',
        industry: 'Fintech',
        challenge: 'Legacy core banking system',
        solution: 'Modern microservices banking platform',
        results: '70% faster processing, improved customer experience'
      },
      {
        title: 'E-commerce Solution',
        industry: 'Retail',
        challenge: 'Omnichannel retail integration',
        solution: 'Unified e-commerce and POS system',
        results: '45% increase in online sales, better inventory management'
      }
    ],
    testimonials: [
      {
        name: 'James Wilson',
        company: 'London Digital Agency',
        feedback: 'Exceptional technical expertise and project management. Highly recommend their services.'
      },
      {
        name: 'Sophie Turner',
        company: 'British Tech Innovations',
        feedback: 'ClickMasters delivered our complex project on time with outstanding quality.'
      }
    ],
    faqs: [
      {
        question: 'How much does software development cost in UK?',
        answer: 'Costs vary based on complexity, typically ranging from £8,000 to £80,000+ for custom solutions.'
      },
      {
        question: 'Do you work remotely with international clients?',
        answer: 'Yes, we work with clients globally and have experience with remote collaboration.'
      },
      {
        question: 'What technologies do you use?',
        answer: 'We use modern technologies including React, Node.js, Python, and cloud platforms like AWS.'
      },
      {
        question: 'Do you provide post-launch support?',
        answer: 'Yes, we offer comprehensive maintenance and support packages for all our solutions.'
      }
    ]
  },
  germany: {
    name: 'Germany',
    title: 'Software Development Company in Germany',
    description: 'Führendes Softwareentwicklungsunternehmen in Deutschland. Wir maßgeschneiderte Web-Anwendungen, mobile Apps und KI-Lösungen.',
    content: 'ClickMasters Germany ist Ihr bevorzugter Partner für Softwareentwicklung in Deutschland. Unser Expertenteam liefert innovative Lösungen für digitale Transformation.',
       servicesByCategory : [
  {
    category: "AI & Machine Learning",
    services: [
      "AI Agents Development",
      "AI Automation Systems",
      "AI Chatbot Development",
      "AI Integration Services",
      "AI Model Development",
      "Deep Learning Solutions",
      "Generative AI Solutions",
      "LLM Applications Development",
    ],
  },

  {
    category: "App Development",
    services: [
      "Android App Development",
      "Cross Platform App Development",
      "Flutter App Development",
      "iOS App Development",
      "Mobile App Development",
      "Mobile App Design",
      "Native App Development",
      "React Native Development",
    ],
  },

  {
    category: "Web Development",
    services: [
      "Ecommerce Development",
      "Frontend Development",
      "Full Stack Development",
      "Web Application Development",
      "Website Development",
      "Web Design",
    ],
  },

  {
    category: "Backend & Infrastructure",
    services: [
      "Backend Development",
      "Cloud Native Development",
      "Cloud Solutions",
      "Cloud Solutions DevOps",
      "DevOps Services",
      "Serverless Architecture",
      "Microservices Architecture",
    ],
  },

  {
    category: "Database & Data",
    services: [
      "Data Engineering",
      "Data Migration",
      "Data Science Analytics",
      "Data Visualization",
      "Data Warehousing",
      "Database Design",
      "Database Management",
      "Database Optimisation",
    ],
  },

  {
    category: "Blockchain & Crypto",
    services: [
      "Blockchain Development",
      "Crypto Wallet Development",
      "DApp Development",
      "Smart Contract Development",
    ],
  },

  {
    category: "Testing & QA",
    services: [
      "Automated Testing",
      "Manual Testing",
      "Load Testing",
      "Performance Testing",
      "QA Software Testing",
      "Penetration Testing",
    ],
  },

  {
    category: "Security",
    services: [
      "Application Security",
      "Cybersecurity Services",
      "Security Audits",
      "Vulnerability Assessment",
      "Compliance Risk Management",
    ],
  },

  {
    category: "Business & Analytics",
    services: [
      "Business Intelligence",
      "Business Process Automation",
      "Predictive Analytics",
      "Recommendation Systems",
      "RPA",
      "Workflow Automation",
    ],
  },

  {
    category: "Specialized Development",
    services: [
      "AR Development",
      "VR Development",
      "Embedded Systems Development",
      "Desktop Application Development",
      "Enterprise Software",
      "IoT Development",
      "Industrial IoT",
      "Mixed Reality Solutions",
      "Smart Systems Development",
      "Web3 Development",
    ],
  },

  {
    category: "E-commerce Platforms",
    services: [
      "Headless Ecommerce",
      "Shopify Development",
      "WooCommerce Development",
      "Headless CMS Development",
    ],
  },

  {
    category: "Advanced Technologies",
    services: [
      "Computer Vision",
      "Image Processing",
      "Natural Language Processing",
      "Speech Recognition",
      "Text Analytics",
      "Video Analytics",
      "Model Training Optimisation",
      "Token Development",
    ],
  },

  {
    category: "Services & Support",
    services: [
      "Dedicated Development Teams",
      "IT Outsourcing",
      "Maintenance Support",
      "Staff Augmentation",
      "System Integration",
      "Technical Support",
      "Bug Fixing",
      "API Integration",
    ],
  },

  {
    category: "Design & UX",
    services: [
      "UI/UX Design Services",
      "UX Research",
      "Product Design",
      "Design Systems",
      "Wireframing Prototyping",
    ],
  },

  {
    category: "Other Services",
    services: [
      "API Development Integration",
      "Big Data Solutions",
      "Containerisation",
      "Infrastructure as Code",
      "Jamstack Development",
      "MVP Development",
      "NFT Marketplace Development",
      "PWA Development",
      "SQL NoSQL Solutions",
      "Web Scraping Data Extraction",
    ],
  },
],
    contactInfo: {
      email: 'deutschland@clickmasters.com',
      phone: '+49 (30) 1234-5678',
      address: 'Berlin, Germany'
    },
    timezone: 'CET (UTC+1)',
    languages: ['German', 'English'],
    heroHeadline: 'Software Development Services in Germany',
    heroSubheadline: 'Helping startups and enterprises build scalable web, mobile, and SaaS solutions.',
    businessLandscape: 'Germany leads European innovation with strong engineering culture and manufacturing excellence.',
    digitalTransformationDemand: 'German industries require robust software solutions for Industry 4.0 and digital manufacturing.',
    marketChallenges: [
      'GDPR and data protection regulations',
      'High quality standards',
      'Engineering talent shortage',
      'Complex enterprise integration'
    ],
    industries: [
      { name: 'Healthcare', description: 'Digital health solutions and medical software systems' },
      { name: 'Fintech', description: 'Banking and financial technology innovations' },
      { name: 'Real Estate', description: 'Property management and real estate platforms' },
      { name: 'Education', description: 'EdTech solutions and learning management systems' },
      { name: 'E-commerce', description: 'Online retail and marketplace platforms' },
      { name: 'Logistics', description: 'Supply chain and transportation management' }
    ],
    solutions: [
      { name: 'Business automation systems', description: 'Streamline workflows and reduce manual processes' },
      { name: 'CRM & ERP solutions', description: 'Comprehensive business management platforms' },
      { name: 'SaaS platforms', description: 'Scalable subscription-based software solutions' },
      { name: 'Cloud applications', description: 'Modern cloud-native application development' },
      { name: 'Workflow optimization', description: 'Process automation and efficiency improvements' },
      { name: 'API integrations', description: 'Seamless system connectivity and data exchange' }
    ],
    problems: [
      'Manual workflows slowing down operations',
      'Outdated legacy systems',
      'Poor scalability of current solutions',
      'Inefficient business processes',
      'Lack of automation in key areas'
    ],
    technologies: ['React / Next.js', 'Node.js', 'Laravel', 'Flutter', 'AWS', 'Docker'],
    caseStudies: [
      {
        title: 'Manufacturing ERP',
        industry: 'Manufacturing',
        challenge: 'Legacy production management systems',
        solution: 'Modern Industry 4.0 manufacturing platform',
        results: '35% improvement in production efficiency, real-time monitoring'
      },
      {
        title: 'Automotive Platform',
        industry: 'Automotive',
        challenge: 'Connected vehicle data management',
        solution: 'IoT-powered automotive analytics platform',
        results: 'Enhanced vehicle diagnostics, improved customer service'
      }
    ],
    testimonials: [
      {
        name: 'Hans Mueller',
        company: 'Berlin Tech Solutions',
        feedback: 'Outstanding technical quality and attention to detail. Exceeded our expectations.'
      },
      {
        name: 'Anna Schmidt',
        company: 'German Digital Innovations',
        feedback: 'Professional team with deep understanding of German market requirements.'
      }
    ],
    faqs: [
      {
        question: 'How much does software development cost in Germany?',
        answer: 'Costs vary based on complexity, typically ranging from €10,000 to €100,000+ for custom solutions.'
      },
      {
        question: 'Do you work remotely with international clients?',
        answer: 'Yes, we work with clients globally and have experience with remote collaboration.'
      },
      {
        question: 'What technologies do you use?',
        answer: 'We use modern technologies including React, Node.js, Python, and cloud platforms like AWS.'
      },
      {
        question: 'Do you provide post-launch support?',
        answer: 'Yes, we offer comprehensive maintenance and support packages for all our solutions.'
      }
    ]
  },
  uae: {
    name: 'UAE',
    title: 'Software Development Company in Dubai, UAE',
    description: 'Premier software development company in UAE and Dubai. We create custom web applications, mobile apps, and AI solutions for Middle Eastern businesses.',
    content: 'ClickMasters UAE is your trusted software development partner in the United Arab Emirates. We deliver cutting-edge solutions that drive digital innovation across the Middle East.',
      servicesByCategory : [
  {
    category: "AI & Machine Learning",
    services: [
      "AI Agents Development",
      "AI Automation Systems",
      "AI Chatbot Development",
      "AI Integration Services",
      "AI Model Development",
      "Deep Learning Solutions",
      "Generative AI Solutions",
      "LLM Applications Development",
    ],
  },

  {
    category: "App Development",
    services: [
      "Android App Development",
      "Cross Platform App Development",
      "Flutter App Development",
      "iOS App Development",
      "Mobile App Development",
      "Mobile App Design",
      "Native App Development",
      "React Native Development",
    ],
  },

  {
    category: "Web Development",
    services: [
      "Ecommerce Development",
      "Frontend Development",
      "Full Stack Development",
      "Web Application Development",
      "Website Development",
      "Web Design",
    ],
  },

  {
    category: "Backend & Infrastructure",
    services: [
      "Backend Development",
      "Cloud Native Development",
      "Cloud Solutions",
      "Cloud Solutions DevOps",
      "DevOps Services",
      "Serverless Architecture",
      "Microservices Architecture",
    ],
  },

  {
    category: "Database & Data",
    services: [
      "Data Engineering",
      "Data Migration",
      "Data Science Analytics",
      "Data Visualization",
      "Data Warehousing",
      "Database Design",
      "Database Management",
      "Database Optimisation",
    ],
  },

  {
    category: "Blockchain & Crypto",
    services: [
      "Blockchain Development",
      "Crypto Wallet Development",
      "DApp Development",
      "Smart Contract Development",
    ],
  },

  {
    category: "Testing & QA",
    services: [
      "Automated Testing",
      "Manual Testing",
      "Load Testing",
      "Performance Testing",
      "QA Software Testing",
      "Penetration Testing",
    ],
  },

  {
    category: "Security",
    services: [
      "Application Security",
      "Cybersecurity Services",
      "Security Audits",
      "Vulnerability Assessment",
      "Compliance Risk Management",
    ],
  },

  {
    category: "Business & Analytics",
    services: [
      "Business Intelligence",
      "Business Process Automation",
      "Predictive Analytics",
      "Recommendation Systems",
      "RPA",
      "Workflow Automation",
    ],
  },

  {
    category: "Specialized Development",
    services: [
      "AR Development",
      "VR Development",
      "Embedded Systems Development",
      "Desktop Application Development",
      "Enterprise Software",
      "IoT Development",
      "Industrial IoT",
      "Mixed Reality Solutions",
      "Smart Systems Development",
      "Web3 Development",
    ],
  },

  {
    category: "E-commerce Platforms",
    services: [
      "Headless Ecommerce",
      "Shopify Development",
      "WooCommerce Development",
      "Headless CMS Development",
    ],
  },

  {
    category: "Advanced Technologies",
    services: [
      "Computer Vision",
      "Image Processing",
      "Natural Language Processing",
      "Speech Recognition",
      "Text Analytics",
      "Video Analytics",
      "Model Training Optimisation",
      "Token Development",
    ],
  },

  {
    category: "Services & Support",
    services: [
      "Dedicated Development Teams",
      "IT Outsourcing",
      "Maintenance Support",
      "Staff Augmentation",
      "System Integration",
      "Technical Support",
      "Bug Fixing",
      "API Integration",
    ],
  },

  {
    category: "Design & UX",
    services: [
      "UI/UX Design Services",
      "UX Research",
      "Product Design",
      "Design Systems",
      "Wireframing Prototyping",
    ],
  },

  {
    category: "Other Services",
    services: [
      "API Development Integration",
      "Big Data Solutions",
      "Containerisation",
      "Infrastructure as Code",
      "Jamstack Development",
      "MVP Development",
      "NFT Marketplace Development",
      "PWA Development",
      "SQL NoSQL Solutions",
      "Web Scraping Data Extraction",
    ],
  },
],
    contactInfo: {
      email: 'uae@clickmasters.com',
      phone: '+971 (4) 123-4567',
      address: 'Dubai, United Arab Emirates'
    },
    timezone: 'GST (UTC+4)',
    languages: ['English', 'Arabic'],
    heroHeadline: 'Software Development Services in UAE',
    heroSubheadline: 'Helping startups and enterprises build scalable web, mobile, and SaaS solutions.',
    businessLandscape: 'UAE leads Middle East digital transformation with Dubai as a global technology hub.',
    digitalTransformationDemand: 'Emirati businesses are rapidly adopting digital solutions to diversify beyond oil and gas.',
    marketChallenges: [
      'Cultural adaptation requirements',
      'Multilingual support needs',
      'Rapid market growth',
      'Talent acquisition challenges'
    ],
    industries: [
      { name: 'Healthcare', description: 'Digital health solutions and medical software systems' },
      { name: 'Fintech', description: 'Banking and financial technology innovations' },
      { name: 'Real Estate', description: 'Property management and real estate platforms' },
      { name: 'Education', description: 'EdTech solutions and learning management systems' },
      { name: 'E-commerce', description: 'Online retail and marketplace platforms' },
      { name: 'Logistics', description: 'Supply chain and transportation management' }
    ],
    solutions: [
      { name: 'Business automation systems', description: 'Streamline workflows and reduce manual processes' },
      { name: 'CRM & ERP solutions', description: 'Comprehensive business management platforms' },
      { name: 'SaaS platforms', description: 'Scalable subscription-based software solutions' },
      { name: 'Cloud applications', description: 'Modern cloud-native application development' },
      { name: 'Workflow optimization', description: 'Process automation and efficiency improvements' },
      { name: 'API integrations', description: 'Seamless system connectivity and data exchange' }
    ],
    problems: [
      'Manual workflows slowing down operations',
      'Outdated legacy systems',
      'Poor scalability of current solutions',
      'Inefficient business processes',
      'Lack of automation in key areas'
    ],
    technologies: ['React / Next.js', 'Node.js', 'Laravel', 'Flutter', 'AWS', 'Docker'],
    caseStudies: [
      {
        title: 'Real Estate Platform',
        industry: 'Real Estate',
        challenge: 'Property management across multiple emirates',
        solution: 'Unified real estate management system',
        results: '50% improvement in property turnover, better client satisfaction'
      },
      {
        title: 'Government Services Portal',
        industry: 'Government',
        challenge: 'Digital citizen services transformation',
        solution: 'Comprehensive e-government platform',
        results: '80% reduction in processing time, improved citizen experience'
      }
    ],
    testimonials: [
      {
        name: 'Ahmed Al-Mansouri',
        company: 'Dubai Digital Solutions',
        feedback: 'Exceptional understanding of Middle Eastern market requirements and cultural nuances.'
      },
      {
        name: 'Fatima Hassan',
        company: 'UAE Tech Innovations',
        feedback: 'Professional team that delivered our complex project with outstanding quality.'
      }
    ],
    faqs: [
      {
        question: 'How much does software development cost in UAE?',
        answer: 'Costs vary based on complexity, typically ranging from $ 40,000 to $ 400,000+ for custom solutions.'
      },
      {
        question: 'Do you work remotely with international clients?',
        answer: 'Yes, we work with clients globally and have experience with remote collaboration.'
      },
      {
        question: 'What technologies do you use?',
        answer: 'We use modern technologies including React, Node.js, Python, and cloud platforms like AWS.'
      },
      {
        question: 'Do you provide post-launch support?',
        answer: 'Yes, we offer comprehensive maintenance and support packages for all our solutions.'
      }
    ]
  },
  australia: {
    name: 'Australia',
    title: 'Software Development Company in Australia',
    description: 'Top software development company in Australia. We build custom web applications, mobile apps, and AI solutions for Australian businesses.',
    content: 'ClickMasters Australia is your premier software development partner Down Under. Our expert team delivers innovative solutions that help businesses succeed in the digital landscape.',
       servicesByCategory : [
  {
    category: "AI & Machine Learning",
    services: [
      "AI Agents Development",
      "AI Automation Systems",
      "AI Chatbot Development",
      "AI Integration Services",
      "AI Model Development",
      "Deep Learning Solutions",
      "Generative AI Solutions",
      "LLM Applications Development",
    ],
  },

  {
    category: "App Development",
    services: [
      "Android App Development",
      "Cross Platform App Development",
      "Flutter App Development",
      "iOS App Development",
      "Mobile App Development",
      "Mobile App Design",
      "Native App Development",
      "React Native Development",
    ],
  },

  {
    category: "Web Development",
    services: [
      "Ecommerce Development",
      "Frontend Development",
      "Full Stack Development",
      "Web Application Development",
      "Website Development",
      "Web Design",
    ],
  },

  {
    category: "Backend & Infrastructure",
    services: [
      "Backend Development",
      "Cloud Native Development",
      "Cloud Solutions",
      "Cloud Solutions DevOps",
      "DevOps Services",
      "Serverless Architecture",
      "Microservices Architecture",
    ],
  },

  {
    category: "Database & Data",
    services: [
      "Data Engineering",
      "Data Migration",
      "Data Science Analytics",
      "Data Visualization",
      "Data Warehousing",
      "Database Design",
      "Database Management",
      "Database Optimisation",
    ],
  },

  {
    category: "Blockchain & Crypto",
    services: [
      "Blockchain Development",
      "Crypto Wallet Development",
      "DApp Development",
      "Smart Contract Development",
    ],
  },

  {
    category: "Testing & QA",
    services: [
      "Automated Testing",
      "Manual Testing",
      "Load Testing",
      "Performance Testing",
      "QA Software Testing",
      "Penetration Testing",
    ],
  },

  {
    category: "Security",
    services: [
      "Application Security",
      "Cybersecurity Services",
      "Security Audits",
      "Vulnerability Assessment",
      "Compliance Risk Management",
    ],
  },

  {
    category: "Business & Analytics",
    services: [
      "Business Intelligence",
      "Business Process Automation",
      "Predictive Analytics",
      "Recommendation Systems",
      "RPA",
      "Workflow Automation",
    ],
  },

  {
    category: "Specialized Development",
    services: [
      "AR Development",
      "VR Development",
      "Embedded Systems Development",
      "Desktop Application Development",
      "Enterprise Software",
      "IoT Development",
      "Industrial IoT",
      "Mixed Reality Solutions",
      "Smart Systems Development",
      "Web3 Development",
    ],
  },

  {
    category: "E-commerce Platforms",
    services: [
      "Headless Ecommerce",
      "Shopify Development",
      "WooCommerce Development",
      "Headless CMS Development",
    ],
  },

  {
    category: "Advanced Technologies",
    services: [
      "Computer Vision",
      "Image Processing",
      "Natural Language Processing",
      "Speech Recognition",
      "Text Analytics",
      "Video Analytics",
      "Model Training Optimisation",
      "Token Development",
    ],
  },

  {
    category: "Services & Support",
    services: [
      "Dedicated Development Teams",
      "IT Outsourcing",
      "Maintenance Support",
      "Staff Augmentation",
      "System Integration",
      "Technical Support",
      "Bug Fixing",
      "API Integration",
    ],
  },

  {
    category: "Design & UX",
    services: [
      "UI/UX Design Services",
      "UX Research",
      "Product Design",
      "Design Systems",
      "Wireframing Prototyping",
    ],
  },

  {
    category: "Other Services",
    services: [
      "API Development Integration",
      "Big Data Solutions",
      "Containerisation",
      "Infrastructure as Code",
      "Jamstack Development",
      "MVP Development",
      "NFT Marketplace Development",
      "PWA Development",
      "SQL NoSQL Solutions",
      "Web Scraping Data Extraction",
    ],
  },
],
    contactInfo: {
      email: 'australia@clickmasters.com',
      phone: '+61 (2) 9876-5432',
      address: 'Sydney, Australia'
    },
    timezone: 'AEST (UTC+10)',
    languages: ['English'],
    heroHeadline: 'Software Development Services in Australia',
    heroSubheadline: 'Helping startups and enterprises build scalable web, mobile, and SaaS solutions.',
    businessLandscape: 'Australia boasts a thriving tech ecosystem with Sydney and Melbourne as major innovation hubs.',
    digitalTransformationDemand: 'Australian businesses are embracing digital solutions to compete in Asia-Pacific markets.',
    marketChallenges: [
      'Geographic isolation challenges',
      'Talent competition in major cities',
      'High operational costs',
      'Time zone coordination'
    ],
    industries: [
      { name: 'Healthcare', description: 'Digital health solutions and medical software systems' },
      { name: 'Fintech', description: 'Banking and financial technology innovations' },
      { name: 'Real Estate', description: 'Property management and real estate platforms' },
      { name: 'Education', description: 'EdTech solutions and learning management systems' },
      { name: 'E-commerce', description: 'Online retail and marketplace platforms' },
      { name: 'Logistics', description: 'Supply chain and transportation management' }
    ],
    solutions: [
      { name: 'Business automation systems', description: 'Streamline workflows and reduce manual processes' },
      { name: 'CRM & ERP solutions', description: 'Comprehensive business management platforms' },
      { name: 'SaaS platforms', description: 'Scalable subscription-based software solutions' },
      { name: 'Cloud applications', description: 'Modern cloud-native application development' },
      { name: 'Workflow optimization', description: 'Process automation and efficiency improvements' },
      { name: 'API integrations', description: 'Seamless system connectivity and data exchange' }
    ],
    problems: [
      'Manual workflows slowing down operations',
      'Outdated legacy systems',
      'Poor scalability of current solutions',
      'Inefficient business processes',
      'Lack of automation in key areas'
    ],
    technologies: ['React / Next.js', 'Node.js', 'Laravel', 'Flutter', 'AWS', 'Docker'],
    caseStudies: [
      {
        title: 'Mining Operations Platform',
        industry: 'Mining',
        challenge: 'Legacy mining operation management',
        solution: 'Modern IoT-powered mining platform',
        results: '40% improvement in operational efficiency, enhanced safety monitoring'
      },
      {
        title: 'E-commerce Solution',
        industry: 'Retail',
        challenge: 'Multi-channel retail integration',
        solution: 'Omnichannel e-commerce platform',
        results: '60% increase in online sales, improved customer experience'
      }
    ],
    testimonials: [
      {
        name: 'Jack Thompson',
        company: 'Sydney Digital Agency',
        feedback: 'Outstanding technical expertise and project management. Highly recommended.'
      },
      {
        name: 'Emma Wilson',
        company: 'Australian Tech Innovations',
        feedback: 'Professional team that delivered our complex project on time and budget.'
      }
    ],
    faqs: [
      {
        question: 'How much does software development cost in Australia?',
        answer: 'Costs vary based on complexity, typically ranging from AUD 15,000 to AUD 150,000+ for custom solutions.'
      },
      {
        question: 'Do you work remotely with international clients?',
        answer: 'Yes, we work with clients globally and have experience with remote collaboration.'
      },
      {
        question: 'What technologies do you use?',
        answer: 'We use modern technologies including React, Node.js, Python, and cloud platforms like AWS.'
      },
      {
        question: 'Do you provide post-launch support?',
        answer: 'Yes, we offer comprehensive maintenance and support packages for all our solutions.'
      }
    ],
    processPhases: [
      {
        phase: 'Phase 1',
        title: 'Discovery & Analysis',
        timeline: 'Week 1-2',
        text: 'We dive deep into your business requirements, goals, and target audience to create a solid foundation for the project.',
      },
      {
        phase: 'Phase 2',
        title: 'Strategic Planning',
        timeline: 'Week 2-3',
        text: 'Creating a detailed project roadmap, technical architecture, and resource allocation plan.',
      },
      {
        phase: 'Phase 3',
        title: 'Design & Prototyping',
        timeline: 'Week 3-5',
        text: 'Crafting intuitive UI/UX designs and interactive prototypes for your review and feedback.',
      },
      {
        phase: 'Phase 4',
        title: 'Agile Development',
        timeline: 'Week 5-12',
        text: 'Building your solution using modern technologies with regular sprints and progress updates.',
      },
      {
        phase: 'Phase 5',
        title: 'Quality Assurance',
        timeline: 'Week 10-13',
        text: 'Rigorous testing across devices and scenarios to ensure a bug-free, high-performance product.',
      },
      {
        phase: 'Phase 6',
        title: 'Launch & Optimization',
        timeline: 'Week 14+',
        text: 'Deploying your solution and providing ongoing support and performance tuning.',
      },
    ],
    pricingTiers: [
      {
        type: 'MVP Development',
        investment: 'From AUD 15,000',
        timeline: '6-8 Weeks',
        bestFor: 'Startups testing their initial concept',
      },
      {
        type: 'Custom Solution',
        investment: 'From AUD 35,000',
        timeline: '3-5 Months',
        bestFor: 'Established businesses needing specialized tools',
      },
      {
        type: 'Enterprise Platform',
        investment: 'Custom Pricing',
        timeline: '6+ Months',
        bestFor: 'Large-scale digital transformation projects',
      },
    ],
  }
};

// Helper function to get all country slugs
export function getAllCountrySlugs(): string[] {
  return Object.keys(countryData);
}

// Helper function to get country data by slug
export function getCountryData(slug: string): CountryData | undefined {
  return countryData[slug];
}


// Helper function to check if country exists
export function countryExists(slug: string): boolean {
  return slug in countryData;
}