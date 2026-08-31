import type { Metadata } from 'next';
import { Space_Grotesk, Syncopate } from 'next/font/google';
import './globals.css';
import { Providers } from '../utils/providers';
import _db from '../utils/db';
import SEO from '../models/SEO.model';
import { DEFAULT_SEO } from '../lib/seed-data';

// Self-hosted at build time; exposed as CSS variables so globals.css can never
// misspell the family name.
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const syncopate = Syncopate({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-syncopate',
  display: 'swap',
});

/**
 * SEO settings live in MongoDB and are edited from /admin/seo.
 * Falls back to the seeded defaults when the database is unreachable.
 */
export async function generateMetadata(): Promise<Metadata> {
  let seo: any = DEFAULT_SEO;

  try {
    await _db();
    const stored = await SEO.findOne({}).lean();
    if (stored) seo = stored;
  } catch {
    // Database not configured yet - fall through to the defaults.
  }

  return {
    title: seo.metaTitle,
    description: seo.metaDescription,
    keywords: seo.keywords,
    openGraph: {
      title: seo.metaTitle,
      description: seo.metaDescription,
      images: seo.ogImage ? [seo.ogImage] : undefined,
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${syncopate.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
