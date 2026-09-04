'use client';

import { useEffect, useState } from 'react';

const TICK_MS = 40;
/** Never creep past this while work is outstanding. */
const WAITING_CEILING = 90;

/**
 * Eases a displayed percentage toward the real one.
 *
 * A page waiting on a single request only ever reports 0 or 100, which would
 * snap the bar across in one frame. So while work is outstanding the value
 * eases toward a ceiling just above the last completed step and never reaches
 * it; only genuine completion takes it to 100.
 *
 * The ceiling is derived from the step size rather than fixed, which keeps both
 * shapes honest: on a one-source page it creeps most of the way across, while
 * on the seven-source homepage it advances just past each milestone and cannot
 * overtake the next one.
 *
 * @param target   The real percentage: settled sources over total.
 * @param complete Every source has settled.
 * @param stepSize One source's worth of the bar, i.e. 100 / total.
 */
export function useSmoothProgress(target: number, complete: boolean, stepSize: number) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      setValue(complete ? 100 : target);
      return;
    }

    const id = setInterval(() => {
      setValue((current) => {
        const ceiling = complete
          ? 100
          : Math.max(target, Math.min(WAITING_CEILING, target + stepSize * 0.85));

        // Ease toward the ceiling; faster once there is nothing left to wait for.
        const next = current + (ceiling - current) * (complete ? 0.3 : 0.05);

        if (complete && next > 99.5) return 100;
        return next;
      });
    }, TICK_MS);

    return () => clearInterval(id);
  }, [target, complete, stepSize]);

  return value;
}
