import { NextResponse } from 'next/server';
import _db from '@/utils/db';
import Contact from '@/models/Contact.model';
import Projects from '@/models/Projects.model';
import Blog from '@/models/Blog.model';
import Gallery from '@/models/Gallery.model';
import Experience from '@/models/Experience.model';
import Education from '@/models/Education.model';
import Testimonials from '@/models/Testimonials.model';
import Skills from '@/models/Skills.model';
import Media from '@/models/Media.model';

/**
 * Aggregate counts backing /admin/analytics.
 *
 * Counted in Mongo rather than in the browser: the dashboard fetches ten whole
 * collections and lengths them client-side, which ships every project, message
 * and blog body over the wire to render a handful of numbers. Here only the
 * numbers travel.
 *
 * Scope is deliberately what the database actually knows — content and
 * messages. Traffic (views, referrers, geography) is not recorded anywhere in
 * this app and is not inferable; that half comes from an analytics provider.
 */

export const dynamic = 'force-dynamic';

/** Start of the month containing `date`, in UTC. */
const monthStart = (date: Date, offset = 0) =>
  new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + offset, 1));

const STALE_DAYS = 90;

export async function GET() {
  try {
    await _db();

    const now = new Date();
    const thisMonth = monthStart(now);
    const lastMonth = monthStart(now, -1);
    const cadenceFrom = monthStart(now, -5);
    const staleBefore = new Date(now.getTime() - STALE_DAYS * 24 * 60 * 60 * 1000);

    /** Documents created per `YYYY-MM`, for the cadence chart. */
    const byMonth = (model: typeof Projects) =>
      model.aggregate([
        { $match: { createdAt: { $gte: cadenceFrom } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, n: { $sum: 1 } } },
      ]);

    const [
      messagesTotal,
      messagesUnread,
      messagesThisMonth,
      messagesLastMonth,
      oldestUnread,

      projectsTotal,
      projectsHidden,
      projectsFeatured,
      projectsMissingImage,
      projectsStale,
      projectsByCategory,

      blogsTotal,
      blogsMissingExcerpt,
      galleryTotal,
      galleryHidden,
      experienceTotal,
      educationTotal,
      testimonialsTotal,
      skillGroups,
      mediaTotal,

      projectsPerMonth,
      blogsPerMonth,
      galleryPerMonth,
    ] = await Promise.all([
      Contact.countDocuments({}),
      Contact.countDocuments({ read: false }),
      Contact.countDocuments({ createdAt: { $gte: thisMonth } }),
      Contact.countDocuments({ createdAt: { $gte: lastMonth, $lt: thisMonth } }),
      Contact.findOne({ read: false }).sort({ createdAt: 1 }).select('createdAt').lean(),

      Projects.countDocuments({}),
      Projects.countDocuments({ visible: false }),
      Projects.countDocuments({ featured: true }),
      Projects.countDocuments({ $or: [{ image: { $exists: false } }, { image: '' }] }),
      Projects.countDocuments({ updatedAt: { $lt: staleBefore } }),
      Projects.aggregate([
        { $group: { _id: '$category', n: { $sum: 1 } } },
        { $sort: { n: -1 } },
        { $limit: 8 },
      ]),

      Blog.countDocuments({}),
      Blog.countDocuments({ $or: [{ excerpt: { $exists: false } }, { excerpt: '' }] }),
      Gallery.countDocuments({}),
      Gallery.countDocuments({ visible: false }),
      Experience.countDocuments({}),
      Education.countDocuments({}),
      Testimonials.countDocuments({}),
      Skills.find({}).select('items').lean(),
      Media.countDocuments({}),

      byMonth(Projects),
      byMonth(Blog as unknown as typeof Projects),
      byMonth(Gallery as unknown as typeof Projects),
    ]);

    // Six labelled buckets, so a month with no activity still shows as a zero
    // rather than vanishing from the series.
    const months: string[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = monthStart(now, -i);
      months.push(`${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`);
    }
    const lookup = (rows: { _id: string; n: number }[], key: string) =>
      rows.find((r) => r._id === key)?.n ?? 0;

    const cadence = months.map((month) => {
      const projects = lookup(projectsPerMonth, month);
      const blogs = lookup(blogsPerMonth, month);
      const gallery = lookup(galleryPerMonth, month);
      return { month, projects, blogs, gallery, total: projects + blogs + gallery };
    });

    const skillItems = (skillGroups as { items?: string[] }[]).reduce(
      (sum, g) => sum + (g.items?.length ?? 0),
      0
    );

    return NextResponse.json(
      {
        generatedAt: now.toISOString(),
        messages: {
          total: messagesTotal,
          unread: messagesUnread,
          thisMonth: messagesThisMonth,
          lastMonth: messagesLastMonth,
          oldestUnreadAt: (oldestUnread as { createdAt?: Date } | null)?.createdAt ?? null,
        },
        content: {
          projects: {
            total: projectsTotal,
            visible: projectsTotal - projectsHidden,
            hidden: projectsHidden,
            featured: projectsFeatured,
            missingImage: projectsMissingImage,
            stale: projectsStale,
          },
          blogs: { total: blogsTotal, missingExcerpt: blogsMissingExcerpt },
          gallery: { total: galleryTotal, hidden: galleryHidden },
          experience: experienceTotal,
          education: educationTotal,
          testimonials: testimonialsTotal,
          skills: { groups: skillGroups.length, items: skillItems },
          media: mediaTotal,
        },
        cadence,
        categories: (projectsByCategory as { _id: string; n: number }[]).map((c) => ({
          name: c._id || 'UNCATEGORISED',
          count: c.n,
        })),
        staleDays: STALE_DAYS,
      },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (error) {
    console.error('Error building admin stats:', error);
    return NextResponse.json({ error: 'Error building admin stats' }, { status: 500 });
  }
}
