/**
 * Original content from the pre-database build. Used to seed an empty MongoDB
 * so a fresh install renders exactly the same site it always did.
 */

export const DEFAULT_PROFILE = {
  name: 'AXEL',
  lastName: 'VARGAS',
  manifestoLine:
    'I BUILD ROBUST SYSTEMS AND DEFIANT INTERFACES. I DO NOT COMPROMISE ON PERFORMANCE OR RAW AESTHETICS.',
  status: 'AVAILABLE FOR HIGH-STAKES PROJECTS',
  location: 'UTC+1 / REMOTE WORLDWIDE',
  discipline: 'SYSTEM ARCHITECTURE / FULLSTACK ENG',
  email: 'HELLO@AXEL.V1',
  telegram: '@AXEL_SYSTEMS',
  socialLinks: [
    { platform: 'GITHUB', url: 'https://github.com' },
    { platform: 'LINKEDIN', url: 'https://linkedin.com' },
    { platform: 'X.COM', url: 'https://x.com' },
  ],
};

export const DEFAULT_ABOUT = {
  manifestoHeading: 'THE MANIFESTO',
  description:
    "I've spent the last decade building systems that don't just work—they endure. From high-frequency trading platforms to cutting-edge AI integrations, my focus is on clarity, speed, and resilience. I reject the trend of 'soft' design.",
};

export const DEFAULT_SEO = {
  metaTitle: 'AXEL VARGAS | BRUTALIST PORTFOLIO',
  metaDescription: 'Senior System Architect and Fullstack Engineer.',
  keywords: ['Brutalist', 'Engineering', 'React', 'Go', 'Rust'],
  ogImage: 'https://picsum.photos/seed/og/1200/630',
};

export const DEFAULT_SETTINGS = {
  version: '1.0.4',
  marqueeText: 'SYSTEM DEPLOYED - STABLE - OPTIMIZED - BRUTALIST',
  footerResources: [
    { label: 'RESUME.PDF', url: '#' },
    { label: 'ARCHIVE', url: '#' },
    { label: 'DESIGN_OPS', url: '#' },
  ],
};

export const SEED_SKILLS = [
  { category: 'LANGUAGES', items: ['TYPESCRIPT', 'RUST', 'GO', 'PYTHON', 'C++', 'SQL'], order: 0 },
  {
    category: 'FRAMEWORKS',
    items: ['REACT', 'NEXT.JS', 'FASTAPI', 'EXPRESS', 'HUGGINGFACE'],
    order: 1,
  },
  {
    category: 'INFRASTRUCTURE',
    items: ['AWS', 'DOCKER', 'KUBERNETES', 'TERRAFORM', 'NGINX'],
    order: 2,
  },
  { category: 'TOOLS', items: ['VIM', 'GIT', 'FIGMA', 'LINUX', 'POSTMAN'], order: 3 },
];

export const SEED_PROJECTS = [
  {
    title: 'NEXUS ARCH',
    category: 'FULL-STACK INFRA',
    year: '2024',
    description:
      'A distributed event-driven architecture designed for high-concurrency financial trading systems.',
    techStack: ['Golang', 'Kubernetes', 'Redis', 'Kafka'],
    image: 'https://picsum.photos/seed/p1/800/600',
    link: '#',
    visible: true,
    order: 0,
  },
  {
    title: 'VOID UI',
    category: 'DESIGN SYSTEM',
    year: '2023',
    description:
      'A brutalist component library for React focusing on performance and raw aesthetics.',
    techStack: ['TypeScript', 'Tailwind', 'React', 'Framer'],
    image: 'https://picsum.photos/seed/p2/800/600',
    link: '#',
    visible: true,
    order: 1,
  },
  {
    title: 'CRYPTO ENGINE',
    category: 'BLOCKCHAIN SDK',
    year: '2023',
    description: 'A high-speed SDK for interacting with multiple L2 chains simultaneously.',
    techStack: ['Rust', 'Solidity', 'Ethers.js'],
    image: 'https://picsum.photos/seed/p3/800/600',
    link: '#',
    visible: true,
    order: 2,
  },
  {
    title: 'SENSEI AI',
    category: 'LLM PLATFORM',
    year: '2024',
    description: 'Agentic workflow automation platform using multi-modal large language models.',
    techStack: ['Python', 'Next.js', 'PyTorch', 'Gemini API'],
    image: 'https://picsum.photos/seed/p4/800/600',
    link: '#',
    visible: true,
    order: 3,
  },
];

export const SEED_EXPERIENCES = [
  {
    role: 'PRINCIPAL ENGINEER',
    company: 'QUANTUM SYSTEMS',
    period: '2022 - PRESENT',
    description: 'Leading the core architecture team for global scale infrastructure.',
    visible: true,
    order: 0,
  },
  {
    role: 'SENIOR FULLSTACK DEV',
    company: 'HYPERLOOP DIGITAL',
    period: '2020 - 2022',
    description: 'Engineered high-performance web applications and internal tooling.',
    visible: true,
    order: 1,
  },
  {
    role: 'SOFTWARE ARCHITECT',
    company: 'NEON LABS',
    period: '2018 - 2020',
    description: 'Designed and implemented microservices for a real-time data platform.',
    visible: true,
    order: 2,
  },
];

export const SEED_EDUCATION = [
  {
    degree: 'MS COMPUTER SCIENCE',
    institution: 'MIT',
    year: '2018',
    description: 'Specialized in Distributed Systems.',
    visible: true,
    order: 0,
  },
];

export const SEED_GALLERY = [
  {
    url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
    caption: 'LATE NIGHT DEBUGGING SESSIONS IN THE LAB.',
    order: 1,
    visible: true,
  },
  {
    url: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=800',
    caption: 'THE SYSTEM ARCHITECTURE SKETCH FOR NEXUS.',
    order: 2,
    visible: true,
  },
  {
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
    caption: 'HARDWARE INTEGRATION TESTING.',
    order: 3,
    visible: true,
  },
];

export const SEED_TESTIMONIALS = [
  {
    quote:
      'AXEL TRANSFORMED OUR LEGACY MONOLITH INTO A SCALABLE ENGINE THAT HANDLES MILLIONS OF CONCURRENT SESSIONS WITHOUT BLINKING.',
    author: 'SARAH CONNOR',
    role: 'CTO @ SKYNET DYNAMICS',
    projectRef: 'NEXUS ARCH',
    isFeatured: true,
    order: 1,
    visible: true,
  },
  {
    quote:
      'THE MOST RIGID AND PERFORMANCE-DRIVEN ENGINEER I HAVE EVER WORKED WITH. HIS CODE IS ARCHITECTURE.',
    author: 'JOHN DOE',
    role: 'PRINCIPAL ARCHITECT @ NEON LABS',
    projectRef: 'VOID UI',
    isFeatured: false,
    order: 2,
    visible: true,
  },
];

const CODE_AS_ARCHITECTURE_CONTENT = [
  '# THE FOUNDATION',
  'Code is the steel beam of the digital age. Too often, developers prioritize "softness" over structural integrity. This is a mistake.',
  '',
  '## THE CASE FOR RIGIDITY',
  'When a system is rigid, its boundaries are clear. Clear boundaries lead to predictable failures. Predictable failures are easier to debug and fix than "flexible" magic that hides complexity.',
  '',
  '## SYSTEMATIC DEBT',
  'Every shortcut taken in the name of "quick deployment" is a fracture in the foundation. I build for longevity.',
  '',
  '# THE DEPLOYMENT',
  'We deployed Nexus using these principles and saw a 40% reduction in unexpected downtime.',
].join('\n');

const BRUTALIST_WEB_CONTENT = [
  '# RAW INTERFACES',
  'Interfaces are tools, not art galleries. They should convey information with maximum efficiency.',
  '',
  '## OVER-DESIGN IS A DISEASE',
  'Shadows, gradients, and subtle animations often mask poor information hierarchy. If you need a transition to explain where a button went, you failed the layout.',
  '',
  '## THE SOLUTION',
  'Use thick borders. High contrast. Large text. Grid systems that feel mechanical. ',
  '',
  '# CONCLUSION',
  'Speed is a feature. Clarity is a requirement.',
].join('\n');

export const SEED_BLOGS = [
  {
    title: 'CODE AS ARCHITECTURE',
    excerpt: 'WHY RIGID STRUCTURES YIELD FLEXIBLE OUTCOMES IN LARGE-SCALE SYSTEMS.',
    date: '2024-05-12',
    content: CODE_AS_ARCHITECTURE_CONTENT,
    published: true,
    slug: 'code-as-architecture',
  },
  {
    title: 'BRUTALISM IN THE BROWSER',
    excerpt: 'REJECTING THE TREND OF OVER-SOFTENED UI AND RETURNING TO RAW UTILITY.',
    date: '2024-05-18',
    content: BRUTALIST_WEB_CONTENT,
    published: true,
    slug: 'brutalist-web',
  },
];

export const SEED_MEDIA = [
  {
    url: 'https://picsum.photos/seed/m1/800/600',
    label: 'WORKSTATION_01',
    type: 'image',
    dateAdded: '2024-01-01',
  },
];
