
import React, { createContext, useContext, useState, useEffect } from 'react';
import { PortfolioData, Project, Experience, Skill, Blog, MediaAsset, Education, GalleryItem, Testimonial, ContactMessage } from '../types';
import { PROJECTS, EXPERIENCES, SKILLS } from '../constants';

interface PortfolioContextType {
  data: PortfolioData;
  updateData: (newData: Partial<PortfolioData>) => void;
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  addMessage: (msg: Omit<ContactMessage, 'id' | 'date' | 'read'>) => void;
}

const STORAGE_KEY = 'axel_brutalist_cms_v3';

const INITIAL_DATA: PortfolioData = {
  profile: {
    name: 'AXEL',
    lastName: 'VARGAS',
    manifestoLine: 'I BUILD ROBUST SYSTEMS AND DEFIANT INTERFACES. I DO NOT COMPROMISE ON PERFORMANCE OR RAW AESTHETICS.',
    status: 'AVAILABLE FOR HIGH-STAKES PROJECTS',
    location: 'UTC+1 / REMOTE WORLDWIDE',
    discipline: 'SYSTEM ARCHITECTURE / FULLSTACK ENG',
    email: 'HELLO@AXEL.V1',
    telegram: '@AXEL_SYSTEMS',
    socialLinks: [
      { id: '1', platform: 'GITHUB', url: 'https://github.com' },
      { id: '2', platform: 'LINKEDIN', url: 'https://linkedin.com' },
      { id: '3', platform: 'X.COM', url: 'https://x.com' }
    ]
  },
  about: {
    manifestoHeading: 'THE MANIFESTO',
    description: "I've spent the last decade building systems that don't just work—they endure. From high-frequency trading platforms to cutting-edge AI integrations, my focus is on clarity, speed, and resilience. I reject the trend of 'soft' design."
  },
  skills: SKILLS,
  projects: PROJECTS,
  experiences: EXPERIENCES,
  education: [
    { id: 'edu1', degree: 'MS COMPUTER SCIENCE', institution: 'MIT', year: '2018', description: 'Specialized in Distributed Systems.', visible: true }
  ],
  gallery: [
    { id: 'g1', url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800', caption: 'LATE NIGHT DEBUGGING SESSIONS IN THE LAB.', order: 1, visible: true },
    { id: 'g2', url: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=800', caption: 'THE SYSTEM ARCHITECTURE SKETCH FOR NEXUS.', order: 2, visible: true },
    { id: 'g3', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800', caption: 'HARDWARE INTEGRATION TESTING.', order: 3, visible: true }
  ],
  testimonials: [
    { id: 't1', quote: 'AXEL TRANSFORMED OUR LEGACY MONOLITH INTO A SCALABLE ENGINE THAT HANDLES MILLIONS OF CONCURRENT SESSIONS WITHOUT BLINKING.', author: 'SARAH CONNOR', role: 'CTO @ SKYNET DYNAMICS', projectRef: 'NEXUS ARCH', isFeatured: true, order: 1, visible: true },
    { id: 't2', quote: 'THE MOST RIGID AND PERFORMANCE-DRIVEN ENGINEER I HAVE EVER WORKED WITH. HIS CODE IS ARCHITECTURE.', author: 'JOHN DOE', role: 'PRINCIPAL ARCHITECT @ NEON LABS', projectRef: 'VOID UI', isFeatured: false, order: 2, visible: true }
  ],
  blogs: [
    { 
      id: 'b1', 
      title: 'CODE AS ARCHITECTURE', 
      excerpt: 'WHY RIGID STRUCTURES YIELD FLEXIBLE OUTCOMES IN LARGE-SCALE SYSTEMS.', 
      date: '2024-05-12', 
      content: `# THE FOUNDATION\nCode is the steel beam of the digital age. Too often, developers prioritize "softness" over structural integrity. This is a mistake.\n\n## THE CASE FOR RIGIDITY\nWhen a system is rigid, its boundaries are clear. Clear boundaries lead to predictable failures. Predictable failures are easier to debug and fix than "flexible" magic that hides complexity.\n\n## SYSTEMATIC DEBT\nEvery shortcut taken in the name of "quick deployment" is a fracture in the foundation. I build for longevity.\n\n# THE DEPLOYMENT\nWe deployed Nexus using these principles and saw a 40% reduction in unexpected downtime.`, 
      published: true, 
      slug: 'code-as-architecture' 
    },
    {
      id: 'b2',
      title: 'BRUTALISM IN THE BROWSER',
      excerpt: 'REJECTING THE TREND OF OVER-SOFTENED UI AND RETURNING TO RAW UTILITY.',
      date: '2024-05-18',
      content: `# RAW INTERFACES\nInterfaces are tools, not art galleries. They should convey information with maximum efficiency.\n\n## OVER-DESIGN IS A DISEASE\nShadows, gradients, and subtle animations often mask poor information hierarchy. If you need a transition to explain where a button went, you failed the layout.\n\n## THE SOLUTION\nUse thick borders. High contrast. Large text. Grid systems that feel mechanical. \n\n# CONCLUSION\nSpeed is a feature. Clarity is a requirement.`,
      published: true,
      slug: 'brutalist-web'
    }
  ],
  messages: [],
  media: [
    { id: 'm1', url: 'https://picsum.photos/seed/m1/800/600', label: 'WORKSTATION_01', type: 'image', dateAdded: '2024-01-01' }
  ],
  seo: {
    metaTitle: 'AXEL VARGAS | BRUTALIST PORTFOLIO',
    metaDescription: 'Senior System Architect and Fullstack Engineer.',
    keywords: ['Brutalist', 'Engineering', 'React', 'Go', 'Rust'],
    ogImage: 'https://picsum.photos/seed/og/1200/630'
  },
  footerResources: [
    { id: '1', label: 'RESUME.PDF', url: '#' },
    { id: '2', label: 'ARCHIVE', url: '#' },
    { id: '3', label: 'DESIGN_OPS', url: '#' }
  ],
  systemInfo: {
    version: '1.0.4',
    marqueeText: 'SYSTEM DEPLOYED - STABLE - OPTIMIZED - BRUTALIST'
  }
};

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<PortfolioData>(INITIAL_DATA);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Migrations
        if (!parsed.gallery) parsed.gallery = INITIAL_DATA.gallery;
        if (!parsed.testimonials) parsed.testimonials = INITIAL_DATA.testimonials;
        if (!parsed.blogs || parsed.blogs.length === 0) parsed.blogs = INITIAL_DATA.blogs;
        if (!parsed.messages) parsed.messages = [];
        if (!parsed.profile.socialLinks) parsed.profile.socialLinks = INITIAL_DATA.profile.socialLinks;
        if (!parsed.profile.email) parsed.profile.email = INITIAL_DATA.profile.email;
        if (!parsed.profile.telegram) parsed.profile.telegram = INITIAL_DATA.profile.telegram;
        if (!parsed.footerResources) parsed.footerResources = INITIAL_DATA.footerResources;
        if (!parsed.systemInfo) parsed.systemInfo = INITIAL_DATA.systemInfo;
        
        // Fix for testimonial visibility migration
        parsed.testimonials = parsed.testimonials.map((t: any) => ({
           ...t,
           visible: t.visible !== undefined ? t.visible : true
        }));

        setData(parsed);
      } catch (e) {
        console.error("Failed to load CMS data", e);
      }
    }
  }, []);

  const updateData = (newData: Partial<PortfolioData>) => {
    setData(prev => {
      const updated = { ...prev, ...newData };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const addMessage = (msg: Omit<ContactMessage, 'id' | 'date' | 'read'>) => {
    const newMessage: ContactMessage = {
      ...msg,
      id: Date.now().toString(),
      date: new Date().toISOString(),
      read: false
    };
    updateData({ messages: [newMessage, ...data.messages] });
  };

  const login = (password: string) => {
    if (password === 'admin123') {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => setIsAuthenticated(false);

  return (
    <PortfolioContext.Provider value={{ data, updateData, isAuthenticated, login, logout, addMessage }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) throw new Error('usePortfolio must be used within PortfolioProvider');
  return context;
};
