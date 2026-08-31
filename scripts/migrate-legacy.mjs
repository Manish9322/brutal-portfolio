/**
 * One-time (re-runnable) migration: copies the legacy portfolio's content out of
 * the old database and reshapes it into the collections this app expects.
 *
 *   npm run migrate:legacy              # dry run - reports what it would write
 *   npm run migrate:legacy -- --commit  # actually writes (replaces target collections)
 *
 *   --from <db>   source database   (default: test)
 *   --to   <db>   target database   (default: the db named in MONGODB_URL)
 *   --only a,b    migrate only these target collections (default: all)
 *
 * Use --only to re-import one collection without disturbing the others, e.g.
 * after editing content in /admin:  npm run migrate:legacy -- --commit --only educations
 *
 * The source database is only ever READ. Nothing in it is modified.
 */
import mongoose from 'mongoose';

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i !== -1 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : fallback;
};
const COMMIT = args.includes('--commit');
const FROM = flag('from', 'test');
const ONLY = (flag('only', '') || '')
  .split(',')
  .map((c) => c.trim())
  .filter(Boolean);
const wanted = (name) => ONLY.length === 0 || ONLY.includes(name);

const URI = process.env.MONGODB_URL;
if (!URI) {
  console.error('MONGODB_URL is not set. Run via "npm run migrate:legacy" so .env is loaded.');
  process.exit(1);
}
const TO = flag('to', new URL(URI).pathname.replace(/^\//, '') || 'brutal_portfolio');

if (FROM === TO) {
  console.error(`Refusing to run: source and target are both "${FROM}".`);
  process.exit(1);
}

// ---------------------------------------------------------------- helpers ----

const notes = [];
const clean = (v) => (typeof v === 'string' ? v.trim() : v);
const isUrl = (v) => typeof v === 'string' && /^https?:\/\//i.test(v.trim());

/** "June 2025 - July 2025" -> "2025"; falls back to any 4-digit year present. */
const yearFrom = (value) => {
  if (!value) return '';
  const years = String(value).match(/\b(19|20)\d{2}\b/g);
  if (!years) return String(value).trim();
  return years[years.length - 1];
};

/** "Manish Sonawane" -> { name: "Manish", lastName: "Sonawane" } */
const splitName = (full) => {
  const parts = String(full || '').trim().split(/\s+/);
  return parts.length <= 1
    ? { name: parts[0] || '', lastName: '' }
    : { name: parts[0], lastName: parts.slice(1).join(' ') };
};

/** First sentence of a bio, for the hero strapline. */
const firstSentence = (text) => {
  const s = String(text || '').trim();
  const m = s.match(/^(.+?[.!?])(\s|$)/);
  return (m ? m[1] : s).trim();
};

/** { github: "...", linkedin: "" } -> [{ platform: "GITHUB", url: "..." }] */
const socialsToArray = (obj) =>
  Object.entries(obj || {})
    .filter(([, url]) => isUrl(url))
    .map(([platform, url]) => ({ platform: platform.toUpperCase(), url: clean(url) }));

const joinRole = (role, company) => [clean(role), clean(company)].filter(Boolean).join(' @ ');

// ------------------------------------------------------------ transforms ----
// Each entry: read from `source`, return the documents to write into `target`.

const COLLECTIONS = [
  {
    target: 'skills',
    source: 'skills',
    note: 'identical schema - copied verbatim',
    map: (docs) =>
      docs.map((d, i) => ({
        category: clean(d.category),
        items: Array.isArray(d.items) ? d.items.map(clean) : [],
        order: d.order ?? i,
      })),
  },
  {
    target: 'projects',
    source: 'projects',
    map: (docs) =>
      docs.map((d, i) => {
        const image = clean(d.imageUrl) || '';
        if (image && !isUrl(image)) {
          notes.push(`project "${d.title}" image is a local path (${image}) - will 404 here, fix it in /admin/projects`);
        }
        const link = isUrl(d.liveUrl) ? clean(d.liveUrl) : isUrl(d.githubUrl) ? clean(d.githubUrl) : '#';

        const screenshots = (Array.isArray(d.screenshots) ? d.screenshots : [])
          .filter((s) => s && s.url)
          .map((s) => ({ url: clean(s.url), caption: clean(s.caption) || '' }));
        const localShots = screenshots.filter((s) => !isUrl(s.url)).length;
        if (localShots) {
          notes.push(`project "${d.title}" has ${localShots} screenshot(s) stored as local paths - they will 404 here`);
        }

        return {
          title: clean(d.title) || 'UNTITLED',
          category: clean(d.role) || 'PROJECT',
          year: yearFrom(d.timeline),
          description: clean(d.description) || clean(d.longDescription) || '',
          techStack: Array.isArray(d.tags) ? d.tags.map(clean) : [],
          image,
          link,
          visible: true,
          featured: d.featured === true,
          order: d.order ?? i,

          // detail-page content
          longDescription: clean(d.longDescription) || '',
          challenges: Array.isArray(d.challenges) ? d.challenges.map(clean).filter(Boolean) : [],
          solutions: Array.isArray(d.solutions) ? d.solutions.map(clean).filter(Boolean) : [],
          screenshots,
          role: clean(d.role) || '',
          team: d.team === undefined || d.team === null ? '' : String(d.team).trim(),
          timeline: clean(d.timeline) || '',
          githubUrl: isUrl(d.githubUrl) ? clean(d.githubUrl) : '',
          liveUrl: isUrl(d.liveUrl) ? clean(d.liveUrl) : '',
        };
      }),
  },
  {
    target: 'experiences',
    source: 'experiences',
    map: (docs) =>
      docs.map((d, i) => ({
        role: clean(d.position) || 'ROLE',
        company: clean(d.company) || '',
        period: clean(d.period) || '',
        description: clean(d.description) || '',
        visible: true,
        order: d.order ?? i,

        // detail-page content
        location: clean(d.location) || '',
        startDate: clean(d.startDate) || '',
        endDate: clean(d.endDate) || '',
        industry: clean(d.industry) || '',
        teamSize: d.teamSize === undefined || d.teamSize === null ? '' : String(d.teamSize).trim(),
        website: isUrl(d.website) ? clean(d.website) : '',
        technologies: Array.isArray(d.technologies) ? d.technologies.map(clean).filter(Boolean) : [],
        achievements: Array.isArray(d.achievements) ? d.achievements.map(clean).filter(Boolean) : [],
        responsibilities: Array.isArray(d.responsibilities) ? d.responsibilities.map(clean).filter(Boolean) : [],
        projects: (Array.isArray(d.projects) ? d.projects : [])
          .filter((pr) => pr && pr.name)
          .map((pr) => ({ name: clean(pr.name), description: clean(pr.description) || '' })),
      })),
  },
  {
    target: 'educations',
    source: 'educations',
    map: (docs) =>
      docs.map((d, i) => ({
        degree: clean(d.degree) || '',
        institution: clean(d.institution) || '',
        year: yearFrom(d.period),
        description: clean(d.description) || '',
        visible: true,
        order: d.order ?? i,

        // timeline / certificate detail
        type: ['degree', 'certification', 'course'].includes(d.type) ? d.type : 'degree',
        field: clean(d.field) || '',
        period: clean(d.period) || '',
        startDate: clean(d.startDate) || '',
        endDate: clean(d.endDate) || '',
        location: clean(d.location) || '',
        gpa: d.gpa === undefined || d.gpa === null ? '' : String(d.gpa).trim(),
        achievements: Array.isArray(d.achievements) ? d.achievements.map(clean).filter(Boolean) : [],
        website: isUrl(d.website) ? clean(d.website) : '',
        certificateUrl: isUrl(d.certificateUrl) ? clean(d.certificateUrl) : '',
      })),
  },
  {
    target: 'galleries',
    source: 'galleries',
    map: (docs) =>
      docs.map((d, i) => ({
        url: clean(d.imageUrl) || '',
        caption: clean(d.title) || clean(d.description) || '',
        order: d.order ?? i + 1,
        visible: true,

        // grouping for the /gallery page
        category: clean(d.category) || '',
        description: clean(d.description) || '',
      })).filter((d) => d.url),
  },
  {
    target: 'testimonials',
    // `feedbacks` holds 11 real entries; the legacy `testimonials` collection
    // has a single placeholder, so this is the better source.
    source: 'feedbacks',
    note: 'sourced from legacy "feedbacks" (richer than legacy "testimonials")',
    map: (docs) =>
      docs.map((d, i) => ({
        quote: clean(d.feedback) || '',
        author: clean(d.name) || '',
        role: joinRole(d.role, d.company),
        projectRef: '',
        isFeatured: d.rating === 5,
        order: d.order ?? i + 1,
        visible: d.isVisible !== false && d.isApproved !== false,
      })).filter((d) => d.quote && d.quote.toUpperCase() !== 'NA'),
  },
  {
    target: 'blogs',
    source: 'blogs',
    map: (docs) =>
      docs.map((d) => ({
        title: clean(d.title) || 'UNTITLED',
        excerpt: clean(d.description) || '',
        date: d.publishedAt ? new Date(d.publishedAt).toISOString().split('T')[0] : '',
        content: clean(d.content) || '',
        published: true,
        slug: clean(d.slug) || String(d.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      })),
  },
  {
    target: 'contacts',
    source: 'contacts',
    map: (docs) =>
      docs.map((d) => ({
        name: clean(d.name) || '',
        email: clean(d.email) || '',
        message: clean(d.message) || '',
        date: (d.createdAt ? new Date(d.createdAt) : new Date()).toISOString(),
        read: d.read === true,
      })),
  },
];

// --------------------------------------------------------------- singletons --

function buildSingletons(profileDoc) {
  const p = profileDoc || {};
  const { name, lastName } = splitName(p.name);
  const bio = clean(p.about) || '';

  return {
    profiles: {
      name: name || 'NAME',
      lastName,
      manifestoLine: firstSentence(bio) || bio,
      status: 'AVAILABLE FOR WORK',        // no equivalent in the legacy data
      location: clean(p.location) || '',
      discipline: clean(p.title) || '',
      email: clean(p.email) || '',
      telegram: '',                        // no equivalent in the legacy data
      socialLinks: socialsToArray(p.socialLinks),
    },
    abouts: {
      manifestoHeading: 'THE MANIFESTO',   // no equivalent in the legacy data
      description: bio,
    },
    seos: {
      metaTitle: `${[name, lastName].filter(Boolean).join(' ')} | ${clean(p.title) || 'PORTFOLIO'}`.toUpperCase(),
      metaDescription: firstSentence(bio) || bio,
      keywords: [],
      ogImage: isUrl(p.profileImage) ? clean(p.profileImage) : '',
    },
  };
}

// --------------------------------------------------------------------- run ---

(async () => {
  await mongoose.connect(URI, { serverSelectionTimeoutMS: 20000 });
  const client = mongoose.connection.getClient();
  const src = client.db(FROM);
  const dst = client.db(TO);

  console.log(`\n  source : ${FROM}  (read only)`);
  console.log(`  target : ${TO}`);
  console.log(`  scope  : ${ONLY.length ? ONLY.join(', ') : 'all collections'}`);
  console.log(`  mode   : ${COMMIT ? 'COMMIT - listed collections will be replaced' : 'DRY RUN - nothing will be written'}\n`);
  console.log('  collection      legacy -> migrated   notes');
  console.log('  ' + '-'.repeat(68));

  const plan = [];

  for (const spec of COLLECTIONS) {
    if (!wanted(spec.target)) continue;
    const raw = await src.collection(spec.source).find({}).sort({ order: 1 }).toArray();
    const mapped = spec.map(raw);
    plan.push({ name: spec.target, docs: mapped });
    const arrow = `${String(raw.length).padStart(3)} -> ${String(mapped.length).padEnd(3)}`;
    console.log(`  ${spec.target.padEnd(15)} ${arrow}            ${spec.note || ''}`);
  }

  const profileDoc = await src.collection('profiles').findOne({});
  const singles = buildSingletons(profileDoc);
  for (const [name, doc] of Object.entries(singles)) {
    if (!wanted(name)) continue;
    plan.push({ name, docs: [doc] });
    console.log(`  ${name.padEnd(15)}   1 -> 1              singleton`);
  }

  if (wanted('profiles')) {
  console.log('\n  preview of the migrated identity:');
  console.log(`    name        ${singles.profiles.name} ${singles.profiles.lastName}`);
  console.log(`    discipline  ${singles.profiles.discipline}`);
  console.log(`    location    ${singles.profiles.location}`);
  console.log(`    socials     ${singles.profiles.socialLinks.map((s) => s.platform).join(', ') || '(none)'}`);
  console.log(`    manifesto   ${String(singles.profiles.manifestoLine).slice(0, 70)}`);
  }

  const sampleProject = plan.find((p) => p.name === 'projects')?.docs[0];
  if (sampleProject) {
    console.log('\n  preview of a migrated project:');
    for (const k of ['title', 'category', 'year', 'techStack', 'image', 'link'])
      console.log(`    ${k.padEnd(11)} ${JSON.stringify(sampleProject[k])?.slice(0, 78)}`);
  }

  if (notes.length) {
    console.log('\n  warnings:');
    for (const n of [...new Set(notes)]) console.log(`    - ${n}`);
  }

  if (!COMMIT) {
    console.log('\n  Dry run complete. Re-run with --commit to write.\n');
    await mongoose.disconnect();
    process.exit(0);
  }

  console.log('\n  writing...');
  for (const { name, docs } of plan) {
    await dst.collection(name).deleteMany({});
    if (docs.length) {
      const stamped = docs.map((d) => ({ ...d, createdAt: new Date(), updatedAt: new Date(), __v: 0 }));
      await dst.collection(name).insertMany(stamped);
    }
    console.log(`    ${name.padEnd(15)} ${String(docs.length).padStart(3)} document(s)`);
  }

  // `settings` is not derived from legacy data - seed it only if absent.
  if (ONLY.length === 0 && (await dst.collection('settings').countDocuments()) === 0) {
    await dst.collection('settings').insertOne({
      version: '1.0.0',
      marqueeText: 'SYSTEM DEPLOYED - STABLE - OPTIMIZED - BRUTALIST',
      footerResources: [],
      createdAt: new Date(), updatedAt: new Date(), __v: 0,
    });
    console.log('    settings          1 document(s) (defaults)');
  }

  const untouched = await src.collection('projects').countDocuments();
  console.log(`\n  done. source "${FROM}" still has ${untouched} projects - unmodified.\n`);

  await mongoose.disconnect();
  process.exit(0);
})().catch((e) => {
  console.error('\nMigration failed:', e.message);
  process.exit(1);
});
