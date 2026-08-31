export interface SocialLink {
  _id: string;
  platform: string;
  url: string;
}

export interface Profile {
  _id?: string;
  name: string;
  lastName: string;
  manifestoLine: string;
  status: string;
  location: string;
  discipline: string;
  email: string;
  telegram: string;
  /** Controls whether the Telegram handle is shown in the contact section. */
  telegramVisible: boolean;
  socialLinks: SocialLink[];
}

export interface About {
  _id?: string;
  manifestoHeading: string;
  description: string;
}

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  message: string;
  date: string;
  read: boolean;
}

export interface Screenshot {
  _id: string;
  url: string;
  caption: string;
}

export interface Project {
  _id: string;
  title: string;
  category: string;
  year: string;
  description: string;
  techStack: string[];
  image: string;
  link: string;
  visible: boolean;
  featured: boolean;
  order: number;

  // Detail-page content
  longDescription: string;
  challenges: string[];
  solutions: string[];
  screenshots: Screenshot[];
  role: string;
  team: string;
  timeline: string;
  githubUrl: string;
  liveUrl: string;
}

export interface RelatedProject {
  _id: string;
  name: string;
  description: string;
}

export interface Experience {
  _id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  visible: boolean;
  order: number;

  // Detail-page content
  location: string;
  startDate: string;
  endDate: string;
  industry: string;
  teamSize: string;
  website: string;
  technologies: string[];
  achievements: string[];
  responsibilities: string[];
  projects: RelatedProject[];
}

export type EducationType = 'degree' | 'certification' | 'course';

export interface Education {
  _id: string;
  degree: string;
  institution: string;
  year: string;
  description: string;
  visible: boolean;
  order: number;

  // Timeline / certificate detail
  type: EducationType;
  field: string;
  period: string;
  startDate: string;
  endDate: string;
  location: string;
  gpa: string;
  achievements: string[];
  website: string;
  certificateUrl: string;
}

export interface Skill {
  _id: string;
  category: string;
  items: string[];
  order: number;
}

export interface Blog {
  _id: string;
  title: string;
  excerpt: string;
  date: string;
  content: string;
  published: boolean;
  slug: string;
}

export interface MediaAsset {
  _id: string;
  url: string;
  label: string;
  type: 'image' | 'video';
  dateAdded: string;
}

export interface GalleryItem {
  _id: string;
  url: string;
  caption: string;
  order: number;
  visible: boolean;

  // Grouping for the /gallery page
  category: string;
  description: string;
}

export interface Testimonial {
  _id: string;
  quote: string;
  author: string;
  role: string;
  projectRef: string;
  isFeatured: boolean;
  order: number;
  visible: boolean;
}

export interface SEOConfig {
  _id?: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  ogImage: string;
}

export interface FooterResource {
  _id: string;
  label: string;
  url: string;
}

export interface Settings {
  _id?: string;
  version: string;
  marqueeText: string;
  footerResources: FooterResource[];
}
