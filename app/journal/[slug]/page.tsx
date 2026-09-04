import type { Metadata } from 'next';
import { cache } from 'react';
import BlogPostView from '@/components/journal/BlogPostView';
import { FooterSection } from '@/components/home';
import ProgressGate from '@/components/loading/ProgressGate';
import _db from '@/utils/db';
import Blog from '@/models/Blog.model';

/** One lookup shared by the metadata and the page body, deduped per request. */
const getPost = cache(async (slug: string) => {
  try {
    await _db();
    return (await Blog.findOne({ slug }).lean()) as any;
  } catch {
    return null;
  }
});

/**
 * Per-post title and description.
 *
 * Without this every post inherited the site-wide title, so all of them shared
 * one entry in search results and link previews. The name suffix is appended by
 * the root layout's title template.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: 'POST NOT FOUND' };

  return {
    title: post.title,
    description: post.excerpt || undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      type: 'article',
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  // JOURNAL is the wiped word rather than the post title: headlines run long
  // ("Why Every Developer Should Write Blogs") and would stack into six lines
  // of display type. The title goes on the small line above it instead.
  return (
    <ProgressGate label="JOURNAL" sources={['blogs']} caption={post?.title || 'OPENING LOG ENTRY'}>
      <BlogPostView slug={slug} />
      <FooterSection />
    </ProgressGate>
  );
}
