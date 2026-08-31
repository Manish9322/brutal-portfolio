import GalleryWall from '@/components/gallery/GalleryWall';
import { FooterSection } from '@/components/home';

export const metadata = {
  title: 'BEHIND THE SCENES | BRUTALIST PORTFOLIO',
  description: 'Frames from the field, grouped by set.',
};

export default function GalleryPage() {
  return (
    <>
      <GalleryWall />
      <FooterSection />
    </>
  );
}
