'use client';

import React, { useState } from 'react';
import {
  useGetGalleryQuery,
  useAddGalleryItemMutation,
  useUpdateGalleryItemMutation,
  useDeleteGalleryItemMutation,
  useUpdateGalleryOrderMutation,
} from '@/services/api';
import ImageField from '@/components/admin/ImageField';
import { LIMITS } from '@/lib/field-limits';

const L = LIMITS.gallery;
import {
  PageHeader,
  Panel,
  Field,
  FormGrid,
  Input,
  Textarea,
  Button,
  IconButton,
  Toggle,
  ListRow,
  ListPanel,
  EmptyState,
  EditorShell,
  Loading,
  Badge,
} from '@/components/admin/ui';
import type { GalleryItem } from '@/types';
import { cdn } from '@/lib/image-url';

const GalleryPage: React.FC = () => {
  const { data: gallery = [], isLoading } = useGetGalleryQuery();
  const [addItem] = useAddGalleryItemMutation();
  const [updateItem] = useUpdateGalleryItemMutation();
  const [deleteItem] = useDeleteGalleryItemMutation();
  const [updateOrder] = useUpdateGalleryOrderMutation();

  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<GalleryItem>>({});
  const [saving, setSaving] = useState(false);

  const list = (gallery as GalleryItem[]).slice().sort((a, b) => a.order - b.order);
  const categories = Array.from(new Set(list.map((g) => g.category).filter(Boolean)));
  const set = (patch: Partial<GalleryItem>) => setForm({ ...form, ...patch });

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing === 'new') await addItem({ ...form, visible: form.visible ?? true });
      else await updateItem({ ...form, _id: editing });
      setEditing(null);
    } finally {
      setSaving(false);
    }
  };

  const move = (index: number, delta: -1 | 1) => {
    const target = index + delta;
    if (target < 0 || target >= list.length) return;
    const reordered = [...list];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    updateOrder({ orderedIds: reordered.map((g) => g._id) });
  };

  const remove = (item: GalleryItem) => {
    if (window.confirm('Delete this frame? This cannot be undone.')) deleteItem(item._id);
  };

  if (isLoading) return <Loading label="LOADING FRAMES" />;

  if (editing) {
    return (
      <EditorShell
        title={editing === 'new' ? 'NEW FRAME' : 'EDIT FRAME'}
        onCancel={() => setEditing(null)}
        onSave={handleSave}
        saving={saving}
        extraActions={
          <Toggle on={form.visible !== false} onChange={() => set({ visible: form.visible === false })} />
        }
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Panel title="IMAGE">
            <ImageField
              label="FRAME"
              module="gallery"
              aspect="square"
              value={form.url ?? ''}
              onChange={(url) => set({ url })}
            />
          </Panel>

          <Panel title="DETAILS">
            <div className="space-y-4">
              <Field label="CAPTION" max={L.caption} value={form.caption ?? ''}>
                <Textarea
                  value={form.caption ?? ''}
                  onChange={(e) => set({ caption: e.target.value })}
                  rows={3}
                />
              </Field>
              <Field
                label="SET / CATEGORY"
                hint={categories.length ? `Existing: ${categories.slice(0, 4).join(', ')}` : 'Groups frames into albums'}
                max={L.category}
                value={form.category ?? ''}
              >
                <Input
                  value={form.category ?? ''}
                  onChange={(e) => set({ category: e.target.value })}
                  list="gallery-categories"
                />
                <datalist id="gallery-categories">
                  {categories.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </Field>
              <Field label="DESCRIPTION" hint="Optional" max={L.description} value={form.description ?? ''}>
                <Textarea
                  value={form.description ?? ''}
                  onChange={(e) => set({ description: e.target.value })}
                  rows={2}
                />
              </Field>
            </div>
          </Panel>
        </div>
      </EditorShell>
    );
  }

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <PageHeader
        title="GALLERY"
        subtitle={`${list.length} frames across ${categories.length || 1} sets`}
        actions={
          <Button
            variant="primary"
            onClick={() => {
              setEditing('new');
              setForm({ visible: true, caption: '', category: '' });
            }}
          >
            + NEW FRAME
          </Button>
        }
      />

      {list.length === 0 ? (
        <EmptyState label="No gallery frames yet" />
      ) : (
        <ListPanel>
          {list.map((item, index) => (
            <ListRow
              key={item._id}
              dimmed={!item.visible}
              media={
                <div className="w-14 h-14 border-2 border-black overflow-hidden bg-gray-100">
                  <img src={cdn(item.url, { width: 120 })} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                </div>
              }
              title={item.caption || 'UNTITLED'}
              meta={
                <span className="flex flex-wrap items-center gap-2">
                  <span className="tabular-nums">#{index + 1}</span>
                  {item.category && <Badge tone="muted">{item.category}</Badge>}
                </span>
              }
              actions={
                <>
                  <IconButton aria-label="Move up" onClick={() => move(index, -1)} disabled={index === 0}>
                    ↑
                  </IconButton>
                  <IconButton
                    aria-label="Move down"
                    onClick={() => move(index, 1)}
                    disabled={index === list.length - 1}
                  >
                    ↓
                  </IconButton>
                  <Toggle
                    on={item.visible}
                    onChange={() => updateItem({ _id: item._id, visible: !item.visible })}
                  />
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => {
                      setEditing(item._id);
                      setForm(item);
                    }}
                  >
                    EDIT
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => remove(item)}>
                    DELETE
                  </Button>
                </>
              }
            />
          ))}
        </ListPanel>
      )}
    </div>
  );
};

export default GalleryPage;
