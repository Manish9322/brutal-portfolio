/**
 * Shared contract for the progress screens.
 *
 * A section knows what it is waiting on — profile, projects, skills — so the
 * loader is handed those as named steps rather than a bare spinner. Progress is
 * the share of them that have resolved, which is why every variant can show a
 * real number instead of an indeterminate animation.
 */

export interface LoadStep {
  /** Shown to the reader, e.g. 'PROJECTS'. */
  label: string;
  done: boolean;
}

export interface ProgressScreenProps {
  /** 0–100. */
  progress: number;
  steps: LoadStep[];
  /** Name of the section being loaded. */
  label?: string;
  /** Fills its container rather than the viewport — used by the /ideas frames. */
  inline?: boolean;
}

export const ACCENT = '#FF5F1F';

/** Clamped, rounded, and never showing 100 until it truly is. */
export const pct = (progress: number) => {
  const n = Math.max(0, Math.min(100, progress));
  return n >= 100 ? 100 : Math.floor(n);
};

/**
 * Wrapper every variant shares: full viewport in real use, contained in the
 * showcase. Carries the ARIA progressbar semantics once, so each screen does
 * not have to remember them.
 */
export const shellClass = (inline?: boolean) =>
  inline ? 'relative w-full h-full overflow-hidden' : 'relative w-full min-h-screen overflow-hidden';

export const ariaProps = (progress: number, label?: string) => ({
  role: 'progressbar' as const,
  'aria-valuemin': 0,
  'aria-valuemax': 100,
  'aria-valuenow': pct(progress),
  'aria-label': label ? `Loading ${label}` : 'Loading',
});
