
import { Project, Experience, Skill } from './types';

export const ACCENT_COLOR = '#FF5F1F'; // Electric Orange

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'NEXUS ARCH',
    category: 'FULL-STACK INFRA',
    year: '2024',
    description: 'A distributed event-driven architecture designed for high-concurrency financial trading systems.',
    techStack: ['Golang', 'Kubernetes', 'Redis', 'Kafka'],
    image: 'https://picsum.photos/seed/p1/800/600',
    link: '#',
    // Added missing visible property
    visible: true
  },
  {
    id: '2',
    title: 'VOID UI',
    category: 'DESIGN SYSTEM',
    year: '2023',
    description: 'A brutalist component library for React focusing on performance and raw aesthetics.',
    techStack: ['TypeScript', 'Tailwind', 'React', 'Framer'],
    image: 'https://picsum.photos/seed/p2/800/600',
    link: '#',
    // Added missing visible property
    visible: true
  },
  {
    id: '3',
    title: 'CRYPTO ENGINE',
    category: 'BLOCKCHAIN SDK',
    year: '2023',
    description: 'A high-speed SDK for interacting with multiple L2 chains simultaneously.',
    techStack: ['Rust', 'Solidity', 'Ethers.js'],
    image: 'https://picsum.photos/seed/p3/800/600',
    link: '#',
    // Added missing visible property
    visible: true
  },
  {
    id: '4',
    title: 'SENSEI AI',
    category: 'LLM PLATFORM',
    year: '2024',
    description: 'Agentic workflow automation platform using multi-modal large language models.',
    techStack: ['Python', 'Next.js', 'PyTorch', 'Gemini API'],
    image: 'https://picsum.photos/seed/p4/800/600',
    link: '#',
    // Added missing visible property
    visible: true
  }
];

export const EXPERIENCES: Experience[] = [
  {
    id: 'e1',
    role: 'PRINCIPAL ENGINEER',
    company: 'QUANTUM SYSTEMS',
    period: '2022 - PRESENT',
    description: 'Leading the core architecture team for global scale infrastructure.',
    // Added missing visible property
    visible: true
  },
  {
    id: 'e2',
    role: 'SENIOR FULLSTACK DEV',
    company: 'HYPERLOOP DIGITAL',
    period: '2020 - 2022',
    description: 'Engineered high-performance web applications and internal tooling.',
    // Added missing visible property
    visible: true
  },
  {
    id: 'e3',
    role: 'SOFTWARE ARCHITECT',
    company: 'NEON LABS',
    period: '2018 - 2020',
    description: 'Designed and implemented microservices for a real-time data platform.',
    // Added missing visible property
    visible: true
  }
];

export const SKILLS: Skill[] = [
  {
    category: 'LANGUAGES',
    items: ['TYPESCRIPT', 'RUST', 'GO', 'PYTHON', 'C++', 'SQL']
  },
  {
    category: 'FRAMEWORKS',
    items: ['REACT', 'NEXT.JS', 'FASTAPI', 'EXPRESS', 'HUGGINGFACE']
  },
  {
    category: 'INFRASTRUCTURE',
    items: ['AWS', 'DOCKER', 'KUBERNETES', 'TERRAFORM', 'NGINX']
  },
  {
    category: 'TOOLS',
    items: ['VIM', 'GIT', 'FIGMA', 'LINUX', 'POSTMAN']
  }
];
