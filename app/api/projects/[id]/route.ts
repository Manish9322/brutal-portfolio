import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import _db from '@/utils/db';
import Project from '@/models/Projects.model';

// GET a single project by id, for the /work/[id] detail page.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid project id' }, { status: 400 });
    }

    await _db();
    const project = await Project.findById(id).lean();

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(project, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json({ error: 'Error fetching project' }, { status: 500 });
  }
}
