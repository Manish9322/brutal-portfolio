import ProgressGate from '@/components/loading/ProgressGate';
import { pageMetadata } from '@/lib/page-metadata';
import JournalList from '@/components/journal/JournalList';
import { FooterSection } from '@/components/home';

export const metadata = pageMetadata(
  'JOURNAL',
  'Raw architectural thoughts and system logs.'
);

export default function JournalPage() {
  return (
    <ProgressGate label="JOURNAL" sources={['blogs']}>
      <JournalList />
      <FooterSection />
    </ProgressGate>
  );
}
