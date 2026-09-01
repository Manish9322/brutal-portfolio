/**
 * Character budgets for the admin CONTENT forms.
 *
 * The public site sets everything in oversized brutalist type, so a field's
 * budget is driven by the largest place it renders — a project title is 7vw on
 * the case-file page, so 60 characters is already three lines there, while a
 * long description flows as body copy and can afford far more.
 *
 * Every limit sits above the longest value currently stored, so applying these
 * never truncates existing content; they only stop new content from outgrowing
 * the layout. Fields whose shape is fixed by format (dates, slugs, URLs) are
 * budgeted for the format, not for the design.
 */
export const LIMITS = {
  project: {
    /** 7vw display heading on /work/[id]. */
    title: 60,
    /** Orange badge above the title. */
    category: 30,
    year: 4,
    /** Meta strip cells, one line each. */
    role: 40,
    team: 30,
    timeline: 40,
    /** Card subtitle on the homepage; 3xl lede on the detail page. */
    description: 400,
    /** Flows as paragraphs under THE BRIEF. */
    longDescription: 3000,
    url: 300,
    /** Bordered tag pills. */
    techStack: 30,
    /** Numbered list items under FRICTION / RESOLUTION. */
    challenge: 300,
    solution: 400,
    screenshotCaption: 80,
  },
  experience: {
    role: 60,
    company: 60,
    location: 60,
    industry: 60,
    teamSize: 30,
    url: 300,
    /** "JAN 2023 — PRESENT" style label. */
    period: 40,
    date: 20,
    description: 400,
    technology: 30,
    responsibility: 300,
    achievement: 300,
    projectName: 60,
    projectDescription: 500,
  },
  education: {
    degree: 80,
    field: 60,
    institution: 80,
    location: 60,
    gpa: 20,
    period: 40,
    date: 20,
    year: 10,
    description: 400,
    achievement: 200,
    url: 300,
  },
  skill: {
    category: 40,
    item: 30,
  },
  testimonial: {
    /** Set large and uppercase in the testimonial block. */
    quote: 300,
    author: 60,
    role: 80,
    projectRef: 60,
  },
  blog: {
    title: 90,
    slug: 100,
    /** ISO yyyy-mm-dd. */
    date: 10,
    /** Shown on the journal index card and under the post title. */
    excerpt: 300,
    /** Markdown body. */
    content: 20000,
  },
  gallery: {
    /** Overlaid on the frame, so it has to stay short. */
    caption: 80,
    /** Album name, also rendered as a filter chip on /gallery. */
    category: 60,
    description: 300,
  },
  media: {
    /** Library-only label; never rendered on the public site. */
    label: 60,
    url: 300,
  },
  profile: {
    name: 40,
    lastName: 40,
    /** Set beside the name in the hero. */
    discipline: 60,
    status: 60,
    location: 60,
    email: 120,
    telegram: 60,
    /** The large hero statement. */
    manifestoLine: 200,
    socialPlatform: 30,
    url: 300,
    footerLabel: 40,
  },
  settings: {
    version: 20,
    /** Repeated four times across the footer marquee track. */
    marqueeText: 120,
    manifestoHeading: 80,
    manifestoDescription: 600,
  },
  seo: {
    /** Google truncates a search-result title past roughly this width. */
    metaTitle: 60,
    metaDescription: 160,
    /** The comma-separated string, not each keyword. */
    keywords: 200,
  },
} as const;
