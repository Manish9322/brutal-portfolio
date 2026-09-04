import ProgressGate from '@/components/loading/ProgressGate';
import { pageMetadata } from '@/lib/page-metadata';
import CareerLog from '@/components/experience/CareerLog';
import { FooterSection } from '@/components/home';

export const metadata = pageMetadata(
  'CAREER LOG',
  'Every posting, mandate and product shipped.'
);

export default function ExperiencePage() {
  return (
    <ProgressGate label="EXPERIENCE" sources={['experience']}>
      <CareerLog />
      <FooterSection />
    </ProgressGate>
  );
}
