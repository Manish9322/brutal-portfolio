'use client';

import React, { useState } from 'react';
import {
  useGetExperiencesQuery,
  useAddExperienceMutation,
  useUpdateExperienceMutation,
  useDeleteExperienceMutation,
  useUpdateExperienceOrderMutation,
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
  ListRow,
  ListPanel,
  EmptyState,
  EditorShell,
  StringListField,
  NamedItemListField,
  Loading,
} from '@/components/admin/ui';
import type { Experience } from '@/types';
import { LIMITS } from '@/lib/field-limits';

const L = LIMITS.experience;

const ExperiencePage: React.FC = () => {
  const { data: experiences = [], isLoading } = useGetExperiencesQuery();
  const [addExperience] = useAddExperienceMutation();
  const [updateExperience] = useUpdateExperienceMutation();
  const [deleteExperience] = useDeleteExperienceMutation();
  const [updateOrder] = useUpdateExperienceOrderMutation();

  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Experience>>({});
  const [saving, setSaving] = useState(false);

  const list = experiences as Experience[];
  const set = (patch: Partial<Experience>) => setForm({ ...form, ...patch });

  const handleSave = async () => {
    setSaving(true);
    try {
      // Entries added in the browser carry a placeholder id Mongoose can't cast.
      const projects = (form.projects ?? []).map(({ _id, ...rest }: any) =>
        typeof _id === 'string' && _id.startsWith('new-') ? rest : { _id, ...rest }
      );
      const payload = { ...form, projects };
      if (editing === 'new') await addExperience({ ...payload, visible: form.visible ?? true });
      else await updateExperience({ ...payload, _id: editing });
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
    updateOrder({ orderedIds: reordered.map((e) => e._id) });
  };

  const remove = (item: Experience) => {
    if (window.confirm(`Delete "${item.role} @ ${item.company}"? This cannot be undone.`))
      deleteExperience(item._id);
  };

  if (isLoading) return <Loading label="LOADING ROLES" />;

  if (editing) {
    return (
      <EditorShell
        title={editing === 'new' ? 'NEW ROLE' : 'EDIT ROLE'}
        onCancel={() => setEditing(null)}
        onSave={handleSave}
        saving={saving}
        extraActions={
          <Toggle on={form.visible !== false} onChange={() => set({ visible: form.visible === false })} />
        }
      >
        <Panel title="ROLE">
          <FormGrid>
            <Field label="POSITION" max={L.role} value={form.role ?? ''}>
              <Input value={form.role ?? ''} onChange={(e) => set({ role: e.target.value })} />
            </Field>
            <Field label="COMPANY" max={L.company} value={form.company ?? ''}>
              <Input value={form.company ?? ''} onChange={(e) => set({ company: e.target.value })} />
            </Field>
            <Field label="LOCATION" max={L.location} value={form.location ?? ''}>
              <Input value={form.location ?? ''} onChange={(e) => set({ location: e.target.value })} />
            </Field>
            <Field label="INDUSTRY" max={L.industry} value={form.industry ?? ''}>
              <Input value={form.industry ?? ''} onChange={(e) => set({ industry: e.target.value })} />
            </Field>
            <Field label="TEAM SIZE" max={L.teamSize} value={form.teamSize ?? ''}>
              <Input value={form.teamSize ?? ''} onChange={(e) => set({ teamSize: e.target.value })} />
            </Field>
            <Field label="COMPANY WEBSITE" max={L.url} value={form.website ?? ''}>
              <Input
                value={form.website ?? ''}
                onChange={(e) => set({ website: e.target.value })}
                placeholder="https://"
              />
            </Field>
          </FormGrid>
        </Panel>

        <Panel title="DATES">
          <FormGrid>
            <Field label="START" hint="YYYY-MM" max={L.date} value={form.startDate ?? ''}>
              <Input
                value={form.startDate ?? ''}
                onChange={(e) => set({ startDate: e.target.value })}
                placeholder="2025-01"
              />
            </Field>
            <Field label="END" hint="Leave blank or 'Present' for current" max={L.date} value={form.endDate ?? ''}>
              <Input
                value={form.endDate ?? ''}
                onChange={(e) => set({ endDate: e.target.value })}
                placeholder="Present"
              />
            </Field>
            <Field label="PERIOD LABEL" hint="Free text fallback" wide max={L.period} value={form.period ?? ''}>
              <Input value={form.period ?? ''} onChange={(e) => set({ period: e.target.value })} />
            </Field>
          </FormGrid>
        </Panel>

        <Panel title="DETAIL">
          <div className="space-y-4">
            <Field label="DESCRIPTION" max={L.description} value={form.description ?? ''}>
              <Textarea
                value={form.description ?? ''}
                onChange={(e) => set({ description: e.target.value })}
                rows={3}
              />
            </Field>
            <StringListField
              label="TECHNOLOGIES"
              value={form.technologies ?? []}
              onChange={(technologies) => set({ technologies })}
              placeholder="ADD A TECHNOLOGY..."
              caps
              max={L.technology}
            />
            <StringListField
              label="RESPONSIBILITIES"
              value={form.responsibilities ?? []}
              onChange={(responsibilities) => set({ responsibilities })}
              placeholder="ADD A RESPONSIBILITY..."
              max={L.responsibility}
              hint="Shown as MANDATE"
            />
            <StringListField
              label="ACHIEVEMENTS"
              value={form.achievements ?? []}
              onChange={(achievements) => set({ achievements })}
              placeholder="ADD AN ACHIEVEMENT..."
              max={L.achievement}
              hint="Shown as OUTPUT"
            />
          </div>
        </Panel>

        <Panel title="PRODUCTS SHIPPED">
          <NamedItemListField
            label="PRODUCTS"
            value={(form.projects ?? []) as any}
            onChange={(projects) => set({ projects: projects as Experience['projects'] })}
            namePlaceholder="PRODUCT NAME"
            addLabel="ADD PRODUCT"
            nameMax={L.projectName}
            descriptionMax={L.projectDescription}
          />
        </Panel>
      </EditorShell>
    );
  }

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <PageHeader
        title="EXPERIENCE"
        subtitle="Roles shown on the homepage and /experience"
        actions={
          <Button
            variant="primary"
            onClick={() => {
              setEditing('new');
              setForm({ visible: true, technologies: [], responsibilities: [], achievements: [], projects: [] });
            }}
          >
            + NEW ROLE
          </Button>
        }
      />

      {list.length === 0 ? (
        <EmptyState label="No roles yet" />
      ) : (
        <ListPanel>
          {list.map((exp, index) => (
            <ListRow
              key={exp._id}
              dimmed={!exp.visible}
              eyebrow={exp.period}
              title={`${exp.role} @ ${exp.company}`}
              meta={[exp.location, exp.industry].filter(Boolean).join(' · ')}
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
                    on={exp.visible}
                    onChange={() => updateExperience({ _id: exp._id, visible: !exp.visible })}
                  />
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => {
                      setEditing(exp._id);
                      setForm(exp);
                    }}
                  >
                    EDIT
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => remove(exp)}>
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

export default ExperiencePage;
