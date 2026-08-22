
import React, { useState, useEffect } from 'react';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Gallery from './components/Gallery';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AIPrompt from './components/AIPrompt';
import AdminLogin from './components/admin/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';
import DashboardPage from './components/admin/pages/DashboardPage';
import AnalyticsPage from './components/admin/pages/AnalyticsPage';
import MessagesPage from './components/admin/pages/MessagesPage';
import ProjectsPage from './components/admin/pages/ProjectsPage';
import ProfilePage from './components/admin/pages/ProfilePage';
import SystemSettingsPage from './components/admin/pages/SystemSettingsPage';
import SkillsPage from './components/admin/pages/SkillsPage';
import ExperiencePage from './components/admin/pages/ExperiencePage';
import EducationPage from './components/admin/pages/EducationPage';
import BlogsPage from './components/admin/pages/BlogsPage';
import MediaPage from './components/admin/pages/MediaPage';
import SEOPage from './components/admin/pages/SEOPage';
import GalleryPage from './components/admin/pages/GalleryPage';
import TestimonialsPage from './components/admin/pages/TestimonialsPage';
import NotFound from './components/NotFound';
import Journal from './components/Journal';
import BlogPost from './components/BlogPost';

const PortfolioView: React.FC = () => {
  const { data } = usePortfolio();
  
  // SEO Meta Update Effect
  useEffect(() => {
    document.title = data.seo.metaTitle;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', data.seo.metaDescription);
    const keywords = document.querySelector('meta[name="keywords"]');
    if (keywords) keywords.setAttribute('content', data.seo.keywords.join(', '));
  }, [data.seo]);

  const visibleEducation = data.education.filter(e => e.visible);

  return (
    <div className="min-h-screen selection:bg-[#FF5F1F] selection:text-white animate-in fade-in duration-500">
      <div className="max-w-[1800px] mx-auto border-x-4 border-black bg-white">
        <Navigation />
        <main>
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Experience />
          <Gallery />
          
          {visibleEducation.length > 0 && (
            <section id="academia" className="border-b-4 border-black flex flex-col md:flex-row bg-gray-50">
              <div className="w-full md:w-1/3 p-12 border-b-4 md:border-b-0 md:border-r-4 border-black">
                <h2 className="font-heading font-bold text-6xl uppercase leading-none">ACADEMIA</h2>
              </div>
              <div className="w-full md:w-2/3 divide-y-4 divide-black">
                {visibleEducation.map(edu => (
                  <div key={edu.id} className="p-12 hover:bg-white transition-colors duration-300">
                    <div className="flex flex-col md:flex-row justify-between items-baseline mb-4">
                        <h4 className="text-3xl font-black uppercase tracking-tighter">{edu.degree}</h4>
                        <span className="font-bold text-[#FF5F1F]">{edu.year}</span>
                    </div>
                    <p className="font-heading font-bold text-xl uppercase mb-4 text-black opacity-80">{edu.institution}</p>
                    <p className="text-lg opacity-70 max-w-2xl">{edu.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <Testimonials />
          <AIPrompt />
          <Contact />
        </main>
        <Footer />
      </div>
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[100]">
        <div className="h-full w-full" style={{ backgroundImage: 'linear-gradient(to right, black 1px, transparent 1px), linear-gradient(to bottom, black 1px, transparent 1px)', backgroundSize: '100px 100px' }}></div>
      </div>
    </div>
  );
};

const AdminView: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const { isAuthenticated } = usePortfolio();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!isAuthenticated) return <AdminLogin />;

  return (
    <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab} onExit={onExit}>
      {activeTab === 'dashboard' && <DashboardPage />}
      {activeTab === 'analytics' && <AnalyticsPage />}
      {activeTab === 'messages' && <MessagesPage />}
      {activeTab === 'profile' && <ProfilePage />}
      {activeTab === 'settings' && <SystemSettingsPage />}
      {activeTab === 'projects' && <ProjectsPage />}
      {activeTab === 'skills' && <SkillsPage />}
      {activeTab === 'experience' && <ExperiencePage />}
      {activeTab === 'education' && <EducationPage />}
      {activeTab === 'gallery' && <GalleryPage />}
      {activeTab === 'testimonials' && <TestimonialsPage />}
      {activeTab === 'blogs' && <BlogsPage />}
      {activeTab === 'media' && <MediaPage />}
      {activeTab === 'seo' && <SEOPage />}
    </AdminLayout>
  );
};

const MainApp: React.FC = () => {
  const [view, setView] = useState<'portfolio' | 'admin' | '404' | 'journal' | 'blog-post'>('portfolio');
  const [activePostSlug, setActivePostSlug] = useState<string | null>(null);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      // Added #academia and #gallery to valid sections to ensure hash-links work without 404ing
      const validSections = ['', '#work', '#about', '#skills', '#contact', '#gallery', '#testimonials', '#academia'];
      
      if (hash === '#admin') {
        setView('admin');
      } else if (hash === '#journal') {
        setView('journal');
        window.scrollTo(0, 0);
      } else if (hash.startsWith('#journal/')) {
        const slug = hash.replace('#journal/', '');
        setActivePostSlug(slug);
        setView('blog-post');
        window.scrollTo(0, 0);
      } else if (validSections.includes(hash)) {
        setView('portfolio');
      } else {
        setView('404');
      }
    };
    window.addEventListener('hashchange', handleHash);
    handleHash();
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const resetSystem = () => {
    window.location.hash = '';
    setView('portfolio');
  };

  const backToJournal = () => {
    window.location.hash = '#journal';
  };

  if (view === '404') return <NotFound onReset={resetSystem} />;
  if (view === 'admin') return <AdminView onExit={resetSystem} />;
  if (view === 'journal') return <><Journal /><Footer /></>;
  if (view === 'blog-post' && activePostSlug) return <><BlogPost slug={activePostSlug} onBack={backToJournal} /><Footer /></>;
  
  return <PortfolioView />;
};

const App: React.FC = () => {
  return (
    <PortfolioProvider>
      <MainApp />
    </PortfolioProvider>
  );
};

export default App;
