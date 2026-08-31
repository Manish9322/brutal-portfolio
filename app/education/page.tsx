import EducationTimeline from '@/components/education/EducationTimeline';
import { FooterSection } from '@/components/home';

export const metadata = {
  title: 'THE RECORD | BRUTALIST PORTFOLIO',
  description: 'Qualifications, certifications and the timeline behind them.',
};

export default function EducationPage() {
  return (
    <>
      <EducationTimeline />
      <FooterSection />
    </>
  );
}
