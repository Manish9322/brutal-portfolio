'use client';

import { useEffect, useRef, useState } from 'react';

export function useDebouncedDraft<T>(
  remote: T | undefined,
  save: (draft: T) => void,
  delay = 700
) {
  const [draft, setDraft] = useState<T | undefined>(remote);
  const isDirty = useRef(false);
  const saveRef = useRef(save);

  useEffect(() => {
    saveRef.current = save;
  });

  useEffect(() => {
    if (!isDirty.current) setDraft(remote);
  }, [remote]);

  useEffect(() => {
    if (!isDirty.current || draft === undefined) return;

    const timer = setTimeout(() => saveRef.current(draft), delay);
    return () => clearTimeout(timer);
  }, [draft, delay]);

  const updateDraft = (next: T) => {
    isDirty.current = true;
    setDraft(next);
  };

  return [draft, updateDraft] as const;
}
