import ProgressGate from '@/components/loading/ProgressGate';
import { pageMetadata } from '@/lib/page-metadata';
import AllProjects from '@/components/work/AllProjects';
import { FooterSection } from '@/components/home';

export const metadata = pageMetadata(
  'ALL WORKS',
  'Every system built, shipped and documented.'
);

export default function WorkPage() {
  return (
    <ProgressGate label="WORK" sources={['projects']}>
      <AllProjects />
      <FooterSection />
    </ProgressGate>
  );
}
