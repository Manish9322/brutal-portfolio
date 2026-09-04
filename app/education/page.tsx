import ProgressGate from '@/components/loading/ProgressGate';
import { pageMetadata } from '@/lib/page-metadata';
import EducationTimeline from '@/components/education/EducationTimeline';
import { FooterSection } from '@/components/home';

export const metadata = pageMetadata(
  'THE RECORD',
  'Qualifications, certifications and the timeline behind them.'
);

export default function EducationPage() {
  return (
    <ProgressGate label="EDUCATION" sources={['education']}>
      <EducationTimeline />
      <FooterSection />
    </ProgressGate>
  );
}
