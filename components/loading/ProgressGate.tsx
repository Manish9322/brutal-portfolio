'use client';

import React, { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  useGetProfileQuery,
  useGetProjectsQuery,
  useGetProjectQuery,
  useGetSkillsQuery,
  useGetExperiencesQuery,
  useGetGalleryQuery,
  useGetEducationQuery,
  useGetTestimonialsQuery,
  useGetBlogsQuery,
  useGetSettingsQuery,
} from '@/services/api';
import { useSmoothProgress } from '@/hooks/use-smooth-progress';
import WipeScreen from './WipeScreen';

/**
 * Holds a page behind a progress screen until its data has arrived.
 *
 * The gate subscribes to the sources itself, which both drives the percentage
 * and warms the cache — so when the children finally mount, their own queries
 * resolve from cache and render immediately. RTK Query shares one request per
 * endpoint, so subscribing here costs no extra network calls.
 *
 * Nothing renders behind the screen on purpose: this is the trade for dropping
 * skeletons. The page appears complete rather than in pieces.
 */

export type LoadSource =
  | 'profile'
  | 'projects'
  | 'skills'
  | 'experience'
  | 'gallery'
  | 'education'
  | 'testimonials'
  | 'blogs'
  | 'settings';

const LABELS: Record<LoadSource, string> = {
  profile: 'PROFILE',
  projects: 'PROJECTS',
  skills: 'SKILLS',
  experience: 'EXPERIENCE',
  gallery: 'GALLERY',
  education: 'EDUCATION',
  testimonials: 'TESTIMONIALS',
  blogs: 'JOURNAL',
  settings: 'SETTINGS',
};

/** Reveal regardless after this long, so one hanging request cannot trap the page. */
const FALLBACK_MS = 6000;
/** Let the bar visibly finish before the page replaces it. */
const HOLD_MS = 420;

/**
 * Routes already loaded during this browsing session.
 *
 * RTK Query drops unused data after 60 seconds, so returning to a page you saw
 * a few minutes ago would re-gate it — and because Next paints its cached copy
 * of that page first, the loader appeared *over* content that was already on
 * screen. A loading screen is for the first time you see a page; coming back is
 * not that. Module scope, so it survives client-side navigation and resets on a
 * genuine reload.
 */
const visited = new Set<string>();

interface ProgressGateProps {
  /** The word the fill travels through. */
  label: string;
  sources: LoadSource[];
  /** Small line above the word. Defaults to what is currently being fetched. */
  caption?: string;
  /** Also wait for one specific project, for /work/[id]. */
  projectId?: string;
  children: React.ReactNode;
}

const ProgressGate: React.FC<ProgressGateProps> = ({
  label,
  sources,
  caption,
  projectId,
  children,
}) => {
  const pathname = usePathname();
  const need = new Set(sources);

  // Every hook is called on every render — order must never vary — and the ones
  // this page does not need are skipped, so they issue no request.
  const results: Record<LoadSource, { isSuccess: boolean; isError: boolean }> = {
    profile: useGetProfileQuery(undefined, { skip: !need.has('profile') }),
    projects: useGetProjectsQuery(undefined, { skip: !need.has('projects') }),
    skills: useGetSkillsQuery(undefined, { skip: !need.has('skills') }),
    experience: useGetExperiencesQuery(undefined, { skip: !need.has('experience') }),
    gallery: useGetGalleryQuery(undefined, { skip: !need.has('gallery') }),
    education: useGetEducationQuery(undefined, { skip: !need.has('education') }),
    testimonials: useGetTestimonialsQuery(undefined, { skip: !need.has('testimonials') }),
    blogs: useGetBlogsQuery(undefined, { skip: !need.has('blogs') }),
    settings: useGetSettingsQuery(undefined, { skip: !need.has('settings') }),
  };

  // The detail page reads one project by id, so the gate must subscribe to that
  // exact query — otherwise it would warm the list but not the record shown.
  const project = useGetProjectQuery(projectId ?? '', { skip: !projectId });

  // A failed request counts as settled: the bar must not stall at 85% because
  // one endpoint is down. The page renders and the section shows its own error.
  const isSettled = (r: { isSuccess: boolean; isError: boolean }) => r.isSuccess || r.isError;

  const settledSources = sources.filter((k) => isSettled(results[k]));
  const total = sources.length + (projectId ? 1 : 0);
  const settledCount = settledSources.length + (projectId && isSettled(project) ? 1 : 0);
  const allSettled = settledCount === total;

  // Decided once, on the first render: either the data was already cached, or
  // this route has been through the gate before in this session.
  const decided = useRef(false);
  const skipEntirely = useRef(false);
  if (!decided.current) {
    decided.current = true;
    skipEntirely.current = allSettled || visited.has(pathname);
  }

  const [revealed, setRevealed] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (allSettled || skipEntirely.current) visited.add(pathname);
  }, [allSettled, pathname]);

  useEffect(() => {
    if (skipEntirely.current || !allSettled) return;
    setLeaving(true);
    const timer = setTimeout(() => setRevealed(true), HOLD_MS);
    return () => clearTimeout(timer);
  }, [allSettled]);

  useEffect(() => {
    if (skipEntirely.current) return;
    const timer = setTimeout(() => setRevealed(true), FALLBACK_MS);
    return () => clearTimeout(timer);
  }, []);

  const stepSize = 100 / Math.max(1, total);
  const progress = useSmoothProgress((settledCount / Math.max(1, total)) * 100, allSettled, stepSize);

  if (skipEntirely.current || revealed) return <>{children}</>;

  const pendingSource = sources.find((k) => !isSettled(results[k]));
  const status =
    caption ??
    (pendingSource
      ? `FETCHING ${LABELS[pendingSource]}`
      : projectId && !isSettled(project)
        ? 'FETCHING PROJECT'
        : 'READY');

  return (
    <WipeScreen
      progress={progress}
      label={label}
      status={status}
      settled={settledCount}
      total={total}
      leaving={leaving}
    />
  );
};

export default ProgressGate;
