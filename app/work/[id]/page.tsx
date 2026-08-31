import type { Metadata } from 'next';
import mongoose from 'mongoose';
import ProjectDetail from '@/components/work/ProjectDetail';
import { FooterSection } from '@/components/home';
import _db from '@/utils/db';
import Project from '@/models/Projects.model';

// Title and description come from the project document itself.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) return { title: 'PROJECT NOT FOUND' };
    await _db();
    const project: any = await Project.findById(id).lean();
    if (!project) return { title: 'PROJECT NOT FOUND' };

    return {
      title: `${project.title} | BRUTALIST PORTFOLIO`,
      description: project.description,
      openGraph: {
        title: project.title,
        description: project.description,
        images: project.image ? [project.image] : undefined,
      },
    };
  } catch {
    return { title: 'PROJECT | BRUTALIST PORTFOLIO' };
  }
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <>
      <ProjectDetail id={id} />
      <FooterSection />
    </>
  );
}
