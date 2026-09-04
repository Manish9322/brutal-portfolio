import type { Metadata } from 'next';

/**
 * Title and description for a static page.
 *
 * `openGraph.title` is set explicitly and always mirrors `title`. Next's title
 * template does not reach openGraph on its own: a page that declares only
 * `title` inherits the parent's *resolved* openGraph title instead, so its
 * share card silently shows the site-wide title rather than the page's. Pairing
 * them here means the two can never drift apart per page.
 *
 * The owner's name is appended by the template in app/layout.tsx — pass only
 * the page's own part, e.g. pageMetadata('ALL WORKS', '...').
 */
export const pageMetadata = (title: string, description: string): Metadata => ({
  title,
  description,
  openGraph: { title, description },
});
