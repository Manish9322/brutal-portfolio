import type { Metadata } from 'next';
import { Space_Grotesk, Syncopate } from 'next/font/google';
import './globals.css';
import { Providers } from '../utils/providers';
import _db from '../utils/db';
import SEO from '../models/SEO.model';
import Profile from '../models/Profile.model';
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
 *
 * The title is a template rather than a string: child pages supply only their
 * own part ('ALL WORKS') and Next appends the owner's name, so the suffix is
 * defined once here instead of being hardcoded into every page.
 */
export async function generateMetadata(): Promise<Metadata> {
  let seo: any = DEFAULT_SEO;
  let siteName = '';

  try {
    await _db();
    const [storedSeo, profile] = await Promise.all([
      SEO.findOne({}).lean(),
      Profile.findOne({}).select('name lastName').lean() as Promise<any>,
    ]);
    if (storedSeo) seo = storedSeo;
    siteName = [profile?.name, profile?.lastName].filter(Boolean).join(' ').trim().toUpperCase();
  } catch {
    // Database not configured yet - fall through to the defaults.
  }

  // Without a name the template would render 'ALL WORKS | ', so fall back to
  // the site title the SEO record already carries.
  const suffix = siteName || seo.metaTitle;

  return {
    title: {
      default: seo.metaTitle,
      template: `%s | ${suffix}`,
    },
    description: seo.metaDescription,
    keywords: seo.keywords,
    openGraph: {
      // openGraph.title does not inherit the title template, so it carries its
      // own — otherwise shared links would lose the name.
      title: {
        default: seo.metaTitle,
        template: `%s | ${suffix}`,
      },
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
