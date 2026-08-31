import {
  Navigation,
  HeroSection,
  // AboutSection,   // disabled: 'WORK WITH ME' manifesto block
  SkillsSection,
  ProjectsSection,
  ExperienceSection,
  GallerySection,
  AcademiaSection,
  TestimonialSection,
  // AIPromptSection, // disabled: Gemini 'MANIFESTO ENGINE' block
  ContactSection,
  FooterSection,
} from '@/components/home';

export default function Home() {
  return (
    <div className="min-h-screen selection:bg-[#FF5F1F] selection:text-white animate-in fade-in duration-500">
      <div className="max-w-[1800px] mx-auto border-x-4 border-black bg-white">
        <Navigation />
        <main>
          <HeroSection />
          {/* <AboutSection /> */}
          <SkillsSection />
          <ProjectsSection />
          <ExperienceSection />
          <GallerySection />
          <AcademiaSection />
          <TestimonialSection />
          {/* <AIPromptSection /> */}
          <ContactSection />
        </main>
        <FooterSection />
      </div>
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[100]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              'linear-gradient(to right, black 1px, transparent 1px), linear-gradient(to bottom, black 1px, transparent 1px)',
            backgroundSize: '100px 100px',
          }}
        ></div>
      </div>
    </div>
  );
}
