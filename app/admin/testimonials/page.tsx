'use client';

import React, { useState } from 'react';
import {
  useGetTestimonialsQuery,
  useAddTestimonialMutation,
  useUpdateTestimonialMutation,
  useDeleteTestimonialMutation,
  useUpdateTestimonialOrderMutation,
} from '@/services/api';
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
  Badge,
  ListRow,
  ListPanel,
  EmptyState,
  EditorShell,
  Loading,
} from '@/components/admin/ui';
import type { Testimonial } from '@/types';
import { LIMITS } from '@/lib/field-limits';

const L = LIMITS.testimonial;

const TestimonialsPage: React.FC = () => {
  const { data: testimonials = [], isLoading } = useGetTestimonialsQuery();
  const [addTestimonial] = useAddTestimonialMutation();
  const [updateTestimonial] = useUpdateTestimonialMutation();
  const [deleteTestimonial] = useDeleteTestimonialMutation();
  const [updateOrder] = useUpdateTestimonialOrderMutation();

  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Testimonial>>({});
  const [saving, setSaving] = useState(false);

  const list = (testimonials as Testimonial[]).slice().sort((a, b) => a.order - b.order);
  const set = (patch: Partial<Testimonial>) => setForm({ ...form, ...patch });

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing === 'new')
        await addTestimonial({ ...form, isFeatured: form.isFeatured ?? false, visible: form.visible ?? true });
      else await updateTestimonial({ ...form, _id: editing });
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
    updateOrder({ orderedIds: reordered.map((t) => t._id) });
  };

  const remove = (item: Testimonial) => {
    if (window.confirm(`Delete the testimonial from ${item.author}? This cannot be undone.`))
      deleteTestimonial(item._id);
  };

  if (isLoading) return <Loading label="LOADING TESTIMONIALS" />;

  if (editing) {
    return (
      <EditorShell
        title={editing === 'new' ? 'NEW TESTIMONIAL' : 'EDIT TESTIMONIAL'}
        onCancel={() => setEditing(null)}
        onSave={handleSave}
        saving={saving}
        extraActions={
          <>
            <Toggle
              on={!!form.isFeatured}
              onChange={() => set({ isFeatured: !form.isFeatured })}
              onLabel="FEATURED"
              offLabel="NOT FEATURED"
            />
            <Toggle on={form.visible !== false} onChange={() => set({ visible: form.visible === false })} />
          </>
        }
      >
        <Panel title="QUOTE">
          <Field label="TESTIMONIAL TEXT" max={L.quote} value={form.quote ?? ''}>
            <Textarea
              value={form.quote ?? ''}
              onChange={(e) => set({ quote: e.target.value.toUpperCase() })}
              rows={5}
              caps
            />
          </Field>
        </Panel>

        <Panel title="ATTRIBUTION">
          <FormGrid>
            <Field label="AUTHOR" max={L.author} value={form.author ?? ''}>
              <Input
                value={form.author ?? ''}
                onChange={(e) => set({ author: e.target.value.toUpperCase() })}
                caps
              />
            </Field>
            <Field label="ROLE / COMPANY" max={L.role} value={form.role ?? ''}>
              <Input
                value={form.role ?? ''}
                onChange={(e) => set({ role: e.target.value.toUpperCase() })}
                caps
              />
            </Field>
            <Field label="RELATED PROJECT" wide hint="Optional" max={L.projectRef} value={form.projectRef ?? ''}>
              <Input
                value={form.projectRef ?? ''}
                onChange={(e) => set({ projectRef: e.target.value.toUpperCase() })}
                caps
              />
            </Field>
          </FormGrid>
        </Panel>
      </EditorShell>
    );
  }

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <PageHeader
        title="TESTIMONIALS"
        subtitle="Social proof shown on the homepage"
        actions={
          <Button
            variant="primary"
            onClick={() => {
              setEditing('new');
              setForm({ visible: true, isFeatured: false });
            }}
          >
            + NEW TESTIMONIAL
          </Button>
        }
      />

      {list.length === 0 ? (
        <EmptyState label="No testimonials yet" />
      ) : (
        <ListPanel>
          {list.map((t, index) => (
            <ListRow
              key={t._id}
              dimmed={!t.visible}
              eyebrow={t.author}
              title={
                <span className="font-bold normal-case text-[13px] leading-relaxed line-clamp-2 block">
                  “{t.quote}”
                </span>
              }
              meta={
                <span className="flex flex-wrap items-center gap-2">
                  <span>{t.role}</span>
                  {t.isFeatured && <Badge tone="accent">FEATURED</Badge>}
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
                    on={t.visible}
                    onChange={() => updateTestimonial({ _id: t._id, visible: !t.visible })}
                  />
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => {
                      setEditing(t._id);
                      setForm(t);
                    }}
                  >
                    EDIT
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => remove(t)}>
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

export default TestimonialsPage;
