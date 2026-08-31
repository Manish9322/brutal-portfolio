'use client';

import React, { useState } from 'react';
import {
  useGetEducationQuery,
  useAddEducationMutation,
  useUpdateEducationMutation,
  useDeleteEducationMutation,
} from '@/services/api';
import {
  PageHeader,
  Panel,
  Field,
  FormGrid,
  Input,
  Textarea,
  Select,
  Button,
  Toggle,
  Badge,
  ListRow,
  ListPanel,
  EmptyState,
  EditorShell,
  StringListField,
  Loading,
} from '@/components/admin/ui';
import type { Education } from '@/types';

const EducationPage: React.FC = () => {
  const { data: education = [], isLoading } = useGetEducationQuery();
  const [addEducation] = useAddEducationMutation();
  const [updateEducation] = useUpdateEducationMutation();
  const [deleteEducation] = useDeleteEducationMutation();

  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Education>>({});
  const [saving, setSaving] = useState(false);

  const list = education as Education[];
  const set = (patch: Partial<Education>) => setForm({ ...form, ...patch });

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing === 'new') await addEducation({ ...form, visible: form.visible ?? true });
      else await updateEducation({ ...form, _id: editing });
      setEditing(null);
    } finally {
      setSaving(false);
    }
  };

  const remove = (item: Education) => {
    if (window.confirm(`Delete "${item.degree}"? This cannot be undone.`)) deleteEducation(item._id);
  };

  if (isLoading) return <Loading label="LOADING RECORDS" />;

  if (editing) {
    return (
      <EditorShell
        title={editing === 'new' ? 'NEW ENTRY' : 'EDIT ENTRY'}
        onCancel={() => setEditing(null)}
        onSave={handleSave}
        saving={saving}
        extraActions={
          <Toggle on={form.visible !== false} onChange={() => set({ visible: form.visible === false })} />
        }
      >
        <Panel title="QUALIFICATION">
          <FormGrid>
            <Field label="DEGREE / PROGRAM" wide>
              <Input value={form.degree ?? ''} onChange={(e) => set({ degree: e.target.value })} />
            </Field>
            <Field label="FIELD OF STUDY">
              <Input value={form.field ?? ''} onChange={(e) => set({ field: e.target.value })} />
            </Field>
            <Field label="TYPE">
              <Select
                value={form.type ?? 'degree'}
                onChange={(e) => set({ type: e.target.value as Education['type'] })}
              >
                <option value="degree">DEGREE</option>
                <option value="certification">CERTIFICATION</option>
                <option value="course">COURSE</option>
              </Select>
            </Field>
            <Field label="INSTITUTION" wide>
              <Input value={form.institution ?? ''} onChange={(e) => set({ institution: e.target.value })} />
            </Field>
            <Field label="LOCATION">
              <Input value={form.location ?? ''} onChange={(e) => set({ location: e.target.value })} />
            </Field>
            <Field label="SCORE / GPA">
              <Input value={form.gpa ?? ''} onChange={(e) => set({ gpa: e.target.value })} />
            </Field>
          </FormGrid>
        </Panel>

        <Panel title="DATES" description="Start and end drive the timeline order on /education">
          <FormGrid>
            <Field label="START" hint="YYYY-MM">
              <Input
                value={form.startDate ?? ''}
                onChange={(e) => set({ startDate: e.target.value })}
                placeholder="2023-08"
              />
            </Field>
            <Field label="END" hint="YYYY-MM or Present">
              <Input
                value={form.endDate ?? ''}
                onChange={(e) => set({ endDate: e.target.value })}
                placeholder="2025-06"
              />
            </Field>
            <Field label="PERIOD LABEL" hint="Free text fallback">
              <Input value={form.period ?? ''} onChange={(e) => set({ period: e.target.value })} />
            </Field>
            <Field label="YEAR">
              <Input value={form.year ?? ''} onChange={(e) => set({ year: e.target.value })} />
            </Field>
          </FormGrid>
        </Panel>

        <Panel title="DETAIL">
          <div className="space-y-4">
            <Field label="DESCRIPTION">
              <Textarea
                value={form.description ?? ''}
                onChange={(e) => set({ description: e.target.value })}
                rows={3}
              />
            </Field>
            <StringListField
              label="ACHIEVEMENTS"
              value={form.achievements ?? []}
              onChange={(achievements) => set({ achievements })}
              placeholder="ADD AN ACHIEVEMENT..."
            />
            <FormGrid>
              <Field label="INSTITUTION WEBSITE">
                <Input
                  value={form.website ?? ''}
                  onChange={(e) => set({ website: e.target.value })}
                  placeholder="https://"
                />
              </Field>
              <Field label="CERTIFICATE URL">
                <Input
                  value={form.certificateUrl ?? ''}
                  onChange={(e) => set({ certificateUrl: e.target.value })}
                  placeholder="https://"
                />
              </Field>
            </FormGrid>
          </div>
        </Panel>
      </EditorShell>
    );
  }

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <PageHeader
        title="EDUCATION"
        subtitle="Degrees and certifications on the timeline"
        actions={
          <Button
            variant="primary"
            onClick={() => {
              setEditing('new');
              setForm({ type: 'degree', visible: true, achievements: [] });
            }}
          >
            + NEW ENTRY
          </Button>
        }
      />

      {list.length === 0 ? (
        <EmptyState label="No education entries yet" />
      ) : (
        <ListPanel>
          {list.map((edu) => (
            <ListRow
              key={edu._id}
              dimmed={!edu.visible}
              eyebrow={edu.period || edu.year}
              title={edu.degree}
              meta={
                <span className="flex flex-wrap items-center gap-2">
                  <Badge tone={edu.type === 'certification' ? 'accent' : 'muted'}>
                    {edu.type ?? 'degree'}
                  </Badge>
                  <span>{edu.institution}</span>
                  {edu.gpa && <span>· SCORE {edu.gpa}</span>}
                </span>
              }
              actions={
                <>
                  <Toggle
                    on={edu.visible}
                    onChange={() => updateEducation({ _id: edu._id, visible: !edu.visible })}
                  />
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => {
                      setEditing(edu._id);
                      setForm(edu);
                    }}
                  >
                    EDIT
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => remove(edu)}>
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

export default EducationPage;
