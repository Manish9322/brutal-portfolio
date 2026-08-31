'use client';

import React, { useState } from 'react';
import { Button, IconButton, Input, Label } from './primitives';

/**
 * Editor for a list of plain strings — challenges, solutions, achievements,
 * responsibilities, technologies, skill items.
 *
 * Entries are added from a single input (Enter or ADD), then reordered or
 * removed in place.
 */
const StringListField: React.FC<{
  label: string;
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  /** Uppercase entries as they are added — used for tech/skill tags. */
  caps?: boolean;
  hint?: string;
}> = ({ label, value, onChange, placeholder = 'ADD AN ENTRY...', caps, hint }) => {
  const [draft, setDraft] = useState('');
  const items = value ?? [];

  const add = () => {
    const entry = caps ? draft.trim().toUpperCase() : draft.trim();
    if (!entry) return;
    onChange([...items, entry]);
    setDraft('');
  };

  const removeAt = (index: number) => onChange(items.filter((_, i) => i !== index));

  const move = (index: number, delta: -1 | 1) => {
    const target = index + delta;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const update = (index: number, text: string) =>
    onChange(items.map((item, i) => (i === index ? text : item)));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <Label>
          {label} [{items.length}]
        </Label>
        {hint && <span className="text-[9px] font-bold uppercase tracking-wide text-black/30">{hint}</span>}
      </div>

      {items.length > 0 && (
        <ul className="space-y-1.5">
          {items.map((item, index) => (
            <li key={`${item}-${index}`} className="flex items-start gap-1.5">
              <span className="mt-2 w-6 shrink-0 text-[10px] font-black tabular-nums text-black/30">
                {String(index + 1).padStart(2, '0')}
              </span>
              <Input
                value={item}
                onChange={(e) => update(index, e.target.value)}
                caps={caps}
                className="flex-1"
              />
              <IconButton aria-label="Move up" onClick={() => move(index, -1)} disabled={index === 0}>
                ↑
              </IconButton>
              <IconButton
                aria-label="Move down"
                onClick={() => move(index, 1)}
                disabled={index === items.length - 1}
              >
                ↓
              </IconButton>
              <IconButton aria-label="Remove" variant="danger" onClick={() => removeAt(index)}>
                ✕
              </IconButton>
            </li>
          ))}
        </ul>
      )}

      <div className="flex gap-1.5">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
          caps={caps}
          className="flex-1"
        />
        <Button variant="primary" onClick={add} disabled={!draft.trim()}>
          ADD
        </Button>
      </div>
    </div>
  );
};

export default StringListField;
