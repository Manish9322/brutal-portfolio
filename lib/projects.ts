import type { Project } from '@/types';

/** How many projects the homepage shows before linking through to /work. */
export const HOMEPAGE_PROJECT_COUNT = 4;

/**
 * Manual order is the single source of truth, so the ↑/↓ buttons in
 * /admin/projects decide the sequence on the homepage and on /work alike.
 *
 * `featured` is presentation only (it draws a badge on /work) - it deliberately
 * does not affect position, otherwise reordering a non-featured project could
 * never move it above a featured one.
 */
export function sortProjects(projects: Project[]): Project[] {
  return [...projects].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

/** The subset shown on the homepage. */
export function selectHomepageProjects(projects: Project[]): Project[] {
  return sortProjects(projects).slice(0, HOMEPAGE_PROJECT_COUNT);
}
