import type { Metadata } from 'next';
import { cache } from 'react';
import mongoose from 'mongoose';
import ProjectDetail from '@/components/work/ProjectDetail';
import { FooterSection } from '@/components/home';
import ProgressGate from '@/components/loading/ProgressGate';
import _db from '@/utils/db';
import Project from '@/models/Projects.model';

/**
 * One lookup shared by the metadata and the page body.
 *
 * React's cache() dedupes it per request, so asking for the title twice — once
 * for the tab, once for the loading screen — is still a single query.
 */
const getProject = cache(async (id: string) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    await _db();
    return (await Project.findById(id).lean()) as any;
  } catch {
    return null;
  }
});

// Title and description come from the project document itself.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) return { title: 'PROJECT NOT FOUND' };

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: project.image ? [project.image] : undefined,
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Read server-side so the project's own name is on the loading screen from 0%.
  // Taking it from the query would leave it blank until the thing we are waiting
  // for arrives.
  const project = await getProject(id);
  const label = project?.title || 'PROJECT';

  return (
    <ProgressGate label={label} sources={['projects']} projectId={id} caption="OPENING CASE FILE">
      <ProjectDetail id={id} />
      <FooterSection />
    </ProgressGate>
  );
}
