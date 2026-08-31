import AllProjects from '@/components/work/AllProjects';
import { FooterSection } from '@/components/home';

export const metadata = {
  title: 'ALL WORKS | BRUTALIST PORTFOLIO',
  description: 'Every system built, shipped and documented.',
};

export default function WorkPage() {
  return (
    <>
      <AllProjects />
      <FooterSection />
    </>
  );
}
