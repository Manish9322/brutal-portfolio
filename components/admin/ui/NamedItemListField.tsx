'use client';

import React from 'react';
import { Button, CharCount, IconButton, Input, Label, Textarea } from './primitives';

export interface NamedItem {
  _id?: string;
  name: string;
  description?: string;
}

/**
 * Editor for a list of `{ name, description }` records — currently the products
 * shipped under each role on /experience.
 */
const NamedItemListField: React.FC<{
  label: string;
  value: NamedItem[];
  onChange: (next: NamedItem[]) => void;
  namePlaceholder?: string;
  addLabel?: string;
  /** Character budgets for the two sub-fields. */
  nameMax?: number;
  descriptionMax?: number;
}> = ({
  label,
  value,
  onChange,
  namePlaceholder = 'NAME',
  addLabel = 'ADD ENTRY',
  nameMax,
  descriptionMax,
}) => {
  const items = value ?? [];

  const update = (index: number, patch: Partial<NamedItem>) =>
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));

  const removeAt = (index: number) => onChange(items.filter((_, i) => i !== index));

  const move = (index: number, delta: -1 | 1) => {
    const target = index + delta;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const add = () => onChange([...items, { _id: `new-${Date.now()}`, name: '', description: '' }]);

  return (
    <div className="space-y-2">
      <Label>
        {label} [{items.length}]
      </Label>

      {items.length > 0 && (
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={item._id ?? index} className="border-2 border-black p-3 space-y-2 bg-gray-50">
              <div className="flex items-center gap-1.5">
                <Input
                  value={item.name}
                  onChange={(e) => update(index, { name: e.target.value })}
                  placeholder={namePlaceholder}
                  maxLength={nameMax}
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
              </div>
              <Textarea
                value={item.description ?? ''}
                onChange={(e) => update(index, { description: e.target.value })}
                rows={2}
                placeholder="DESCRIPTION"
                maxLength={descriptionMax}
              />
              {descriptionMax != null && (
                <div className="text-right">
                  <CharCount length={(item.description ?? '').length} max={descriptionMax} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Button variant="ghost" onClick={add}>
        + {addLabel}
      </Button>
    </div>
  );
};

export default NamedItemListField;
