
export interface Profile {
  name: string;
  lastName: string;
  manifestoLine: string;
  status: string;
  location: string;
  discipline: string;
  email: string;
  telegram: string;
  socialLinks: SocialLink[];
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
  read: boolean;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  description: string;
  techStack: string[];
  image: string;
  link: string;
  visible: boolean;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  visible: boolean;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  year: string;
  description: string;
  visible: boolean;
}

export interface Skill {
  category: string;
  items: string[];
}

export interface Blog {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  content: string;
  published: boolean;
  slug: string;
}

export interface MediaAsset {
  id: string;
  url: string;
  label: string;
  type: 'image' | 'video';
  dateAdded: string;
}

export interface GalleryItem {
  id: string;
  url: string;
  caption: string;
  order: number;
  visible: boolean;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  projectRef: string;
  isFeatured: boolean;
  order: number;
  visible: boolean;
}

export interface SEOConfig {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  ogImage: string;
}

export interface FooterResource {
  id: string;
  label: string;
  url: string;
}

export interface SystemInfo {
  version: string;
  marqueeText: string;
}

export interface PortfolioData {
  profile: Profile;
  about: {
    manifestoHeading: string;
    description: string;
  };
  skills: Skill[];
  projects: Project[];
  experiences: Experience[];
  education: Education[];
  blogs: Blog[];
  media: MediaAsset[];
  gallery: GalleryItem[];
  testimonials: Testimonial[];
  messages: ContactMessage[];
  seo: SEOConfig;
  footerResources: FooterResource[];
  systemInfo: SystemInfo;
}
