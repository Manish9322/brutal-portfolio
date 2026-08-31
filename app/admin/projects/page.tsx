'use client';

import React, { useState } from 'react';
import {
  useGetProjectsQuery,
  useAddProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useUpdateProjectOrderMutation,
} from '@/services/api';
import ImageField from '@/components/admin/ImageField';
import ImageListField from '@/components/admin/ImageListField';
import ProjectImage from '@/components/ProjectImage';
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
  StringListField,
  Loading,
} from '@/components/admin/ui';
import type { Project } from '@/types';

const ProjectsPage: React.FC = () => {
  const { data: projects = [], isLoading } = useGetProjectsQuery();
  const [addProject] = useAddProjectMutation();
  const [updateProject] = useUpdateProjectMutation();
  const [deleteProject] = useDeleteProjectMutation();
  const [updateOrder] = useUpdateProjectOrderMutation();

  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Project>>({});
  const [saving, setSaving] = useState(false);

  const list = projects as Project[];
  const set = (patch: Partial<Project>) => setForm({ ...form, ...patch });

  const handleSave = async () => {
    setSaving(true);
    try {
      const screenshots = (form.screenshots ?? []).map(({ _id, ...rest }: any) =>
        typeof _id === 'string' && _id.startsWith('new-') ? rest : { _id, ...rest }
      );
      const payload = { ...form, screenshots };
      if (editing === 'new') await addProject({ ...payload, visible: form.visible ?? true });
      else await updateProject({ ...payload, _id: editing });
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
    updateOrder({ orderedIds: reordered.map((p) => p._id) });
  };

  const remove = (item: Project) => {
    if (window.confirm(`Delete "${item.title}"? This cannot be undone.`)) deleteProject(item._id);
  };

  if (isLoading) return <Loading label="LOADING PROJECTS" />;

  if (editing) {
    return (
      <EditorShell
        title={editing === 'new' ? 'NEW PROJECT' : 'EDIT PROJECT'}
        onCancel={() => setEditing(null)}
        onSave={handleSave}
        saving={saving}
        extraActions={
          <>
            <Toggle
              on={!!form.featured}
              onChange={() => set({ featured: !form.featured })}
              onLabel="FEATURED"
              offLabel="NOT FEATURED"
            />
            <Toggle on={form.visible !== false} onChange={() => set({ visible: form.visible === false })} />
          </>
        }
      >
        <Panel title="BASICS">
          <FormGrid>
            <Field label="TITLE" wide>
              <Input value={form.title ?? ''} onChange={(e) => set({ title: e.target.value })} />
            </Field>
            <Field label="CATEGORY" hint="Shown as the orange eyebrow">
              <Input value={form.category ?? ''} onChange={(e) => set({ category: e.target.value })} />
            </Field>
            <Field label="YEAR">
              <Input value={form.year ?? ''} onChange={(e) => set({ year: e.target.value })} />
            </Field>
            <Field label="ROLE">
              <Input value={form.role ?? ''} onChange={(e) => set({ role: e.target.value })} />
            </Field>
            <Field label="TEAM SIZE">
              <Input value={form.team ?? ''} onChange={(e) => set({ team: e.target.value })} />
            </Field>
            <Field label="TIMELINE" wide hint="E.g. June 2025 - July 2025">
              <Input value={form.timeline ?? ''} onChange={(e) => set({ timeline: e.target.value })} />
            </Field>
            <Field label="SHORT DESCRIPTION" wide hint="Used on the cards">
              <Textarea
                value={form.description ?? ''}
                onChange={(e) => set({ description: e.target.value })}
                rows={3}
              />
            </Field>
          </FormGrid>
        </Panel>

        <Panel title="COVER IMAGE">
          <ImageField
            label="COVER"
            module="projects"
            value={form.image ?? ''}
            onChange={(image) => set({ image })}
          />
        </Panel>

        <Panel title="LINKS">
          <FormGrid>
            <Field label="LIVE URL">
              <Input
                value={form.liveUrl ?? ''}
                onChange={(e) => set({ liveUrl: e.target.value })}
                placeholder="https://"
              />
            </Field>
            <Field label="SOURCE URL">
              <Input
                value={form.githubUrl ?? ''}
                onChange={(e) => set({ githubUrl: e.target.value })}
                placeholder="https://"
              />
            </Field>
            <Field label="CARD LINK" wide hint="Where the card's link points if set">
              <Input value={form.link ?? ''} onChange={(e) => set({ link: e.target.value })} />
            </Field>
          </FormGrid>
        </Panel>

        <Panel title="CASE STUDY" description="Shown on the project detail page">
          <div className="space-y-4">
            <Field label="FULL DESCRIPTION">
              <Textarea
                value={form.longDescription ?? ''}
                onChange={(e) => set({ longDescription: e.target.value })}
                rows={6}
              />
            </Field>
            <StringListField
              label="TECH STACK"
              value={form.techStack ?? []}
              onChange={(techStack) => set({ techStack })}
              placeholder="ADD A TECHNOLOGY..."
              caps
              hint="Cards show the first 5"
            />
            <StringListField
              label="CHALLENGES"
              value={form.challenges ?? []}
              onChange={(challenges) => set({ challenges })}
              placeholder="ADD A CHALLENGE..."
              hint="Shown as FRICTION"
            />
            <StringListField
              label="SOLUTIONS"
              value={form.solutions ?? []}
              onChange={(solutions) => set({ solutions })}
              placeholder="ADD A SOLUTION..."
              hint="Shown as RESOLUTION"
            />
          </div>
        </Panel>

        <Panel title="SCREENSHOTS">
          <ImageListField
            label="CAPTURES"
            module="projects/screenshots"
            value={(form.screenshots ?? []) as any}
            onChange={(items) => set({ screenshots: items as Project['screenshots'] })}
          />
        </Panel>
      </EditorShell>
    );
  }

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <PageHeader
        title="PROJECTS"
        subtitle="Order here decides the homepage and /work sequence"
        actions={
          <Button
            variant="primary"
            onClick={() => {
              setEditing('new');
              setForm({
                visible: true,
                featured: false,
                techStack: [],
                challenges: [],
                solutions: [],
                screenshots: [],
                year: String(new Date().getFullYear()),
              });
            }}
          >
            + NEW PROJECT
          </Button>
        }
      />

      {list.length === 0 ? (
        <EmptyState label="No projects yet" />
      ) : (
        <ListPanel>
          {list.map((p, index) => (
            <ListRow
              key={p._id}
              dimmed={!p.visible}
              media={
                <div className="w-14 h-14 border-2 border-black overflow-hidden bg-gray-100">
                  <ProjectImage src={p.image} alt={p.title} width={120} className="w-full h-full object-cover" />
                </div>
              }
              eyebrow={p.category}
              title={p.title}
              meta={
                <span className="flex flex-wrap items-center gap-2">
                  <span className="tabular-nums">#{index + 1}</span>
                  {p.year && <span>· {p.year}</span>}
                  {p.featured && <Badge tone="accent">FEATURED</Badge>}
                  {!p.image && <Badge tone="muted">NO IMAGE</Badge>}
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
                  <Toggle on={p.visible} onChange={() => updateProject({ _id: p._id, visible: !p.visible })} />
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => {
                      setEditing(p._id);
                      setForm(p);
                    }}
                  >
                    EDIT
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => remove(p)}>
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

export default ProjectsPage;
