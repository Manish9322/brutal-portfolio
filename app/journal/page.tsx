import JournalList from '@/components/journal/JournalList';
import { FooterSection } from '@/components/home';

export const metadata = {
  title: 'JOURNAL | BRUTALIST PORTFOLIO',
  description: 'Raw architectural thoughts and system logs.',
};

export default function JournalPage() {
  return (
    <>
      <JournalList />
      <FooterSection />
    </>
  );
}
