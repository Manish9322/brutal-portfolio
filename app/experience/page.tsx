import CareerLog from '@/components/experience/CareerLog';
import { FooterSection } from '@/components/home';

export const metadata = {
  title: 'CAREER LOG | BRUTALIST PORTFOLIO',
  description: 'Every posting, mandate and product shipped.',
};

export default function ExperiencePage() {
  return (
    <>
      <CareerLog />
      <FooterSection />
    </>
  );
}
