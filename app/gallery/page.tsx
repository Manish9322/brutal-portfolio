import ProgressGate from '@/components/loading/ProgressGate';
import { pageMetadata } from '@/lib/page-metadata';
import GalleryWall from '@/components/gallery/GalleryWall';
import { FooterSection } from '@/components/home';

export const metadata = pageMetadata(
  'BEHIND THE SCENES',
  'Frames from the field, grouped by set.'
);

export default function GalleryPage() {
  return (
    <ProgressGate label="GALLERY" sources={['gallery']}>
      <GalleryWall />
      <FooterSection />
    </ProgressGate>
  );
}
