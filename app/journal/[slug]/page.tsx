import BlogPostView from '@/components/journal/BlogPostView';
import { FooterSection } from '@/components/home';

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <>
      <BlogPostView slug={slug} />
      <FooterSection />
    </>
  );
}
