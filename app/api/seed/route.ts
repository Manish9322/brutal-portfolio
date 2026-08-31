import { NextResponse } from 'next/server';
import _db from '@/utils/db';
import Profile from '@/models/Profile.model';
import About from '@/models/About.model';
import SEO from '@/models/SEO.model';
import Settings from '@/models/Settings.model';
import Skill from '@/models/Skills.model';
import Project from '@/models/Projects.model';
import Experience from '@/models/Experience.model';
import Education from '@/models/Education.model';
import Gallery from '@/models/Gallery.model';
import Testimonial from '@/models/Testimonials.model';
import Blog from '@/models/Blog.model';
import Media from '@/models/Media.model';
import {
  DEFAULT_PROFILE,
  DEFAULT_ABOUT,
  DEFAULT_SEO,
  DEFAULT_SETTINGS,
  SEED_SKILLS,
  SEED_PROJECTS,
  SEED_EXPERIENCES,
  SEED_EDUCATION,
  SEED_GALLERY,
  SEED_TESTIMONIALS,
  SEED_BLOGS,
  SEED_MEDIA,
} from '@/lib/seed-data';

/**
 * Populates an empty database with the original portfolio content.
 * Safe to re-run: every collection is only seeded when it is empty.
 * POST /api/seed        -> seed empty collections
 * POST /api/seed?force=1 -> wipe and re-seed everything
 */
export async function POST(request: Request) {
  try {
    await _db();
    const force = new URL(request.url).searchParams.get('force') === '1';
    const report: Record<string, string> = {};

    const seedCollection = async (name: string, model: any, docs: any[]) => {
      if (force) await model.deleteMany({});
      const count = await model.countDocuments();
      if (count > 0) {
        report[name] = `skipped (${count} existing)`;
        return;
      }
      await model.insertMany(docs);
      report[name] = `seeded ${docs.length}`;
    };

    const seedSingleton = async (name: string, model: any, doc: any) => {
      if (force) await model.deleteMany({});
      const existing = await model.findOne({});
      if (existing) {
        report[name] = 'skipped (exists)';
        return;
      }
      await model.create(doc);
      report[name] = 'seeded';
    };

    await seedSingleton('profile', Profile, DEFAULT_PROFILE);
    await seedSingleton('about', About, DEFAULT_ABOUT);
    await seedSingleton('seo', SEO, DEFAULT_SEO);
    await seedSingleton('settings', Settings, DEFAULT_SETTINGS);

    await seedCollection('skills', Skill, SEED_SKILLS);
    await seedCollection('projects', Project, SEED_PROJECTS);
    await seedCollection('experience', Experience, SEED_EXPERIENCES);
    await seedCollection('education', Education, SEED_EDUCATION);
    await seedCollection('gallery', Gallery, SEED_GALLERY);
    await seedCollection('testimonials', Testimonial, SEED_TESTIMONIALS);
    await seedCollection('blogs', Blog, SEED_BLOGS);
    await seedCollection('media', Media, SEED_MEDIA);

    return NextResponse.json({ message: 'Seed complete', report });
  } catch (error) {
    console.error('Seed failed:', error);
    return NextResponse.json({ error: 'Seed failed' }, { status: 500 });
  }
}
