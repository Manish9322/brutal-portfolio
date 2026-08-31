'use client';

import React, { useEffect, useState } from 'react';
import {
  useGetSkillsQuery,
  useAddSkillMutation,
  useUpdateSkillMutation,
  useDeleteSkillMutation,
} from '@/services/api';
import {
  PageHeader,
  Panel,
  Button,
  Input,
  Field,
  Loading,
  EmptyState,
  StringListField,
  Badge,
} from '@/components/admin/ui';
import type { Skill } from '@/types';

const SkillsPage: React.FC = () => {
  const { data: skills = [], isLoading } = useGetSkillsQuery();
  const [addSkill] = useAddSkillMutation();
  const [updateSkill] = useUpdateSkillMutation();
  const [deleteSkill] = useDeleteSkillMutation();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState('');

  const list = skills as Skill[];
  const active = list.find((s) => s._id === activeId) ?? list[0];

  useEffect(() => {
    if (!activeId && list.length > 0) setActiveId(list[0]._id);
  }, [list, activeId]);

  const addCategory = async () => {
    if (!newCategory.trim()) return;
    await addSkill({ category: newCategory.trim().toUpperCase(), items: [] });
    setNewCategory('');
  };

  const removeCategory = async (group: Skill) => {
    if (!window.confirm(`Delete the "${group.category}" category and its ${group.items.length} skills?`)) return;
    await deleteSkill(group._id);
    setActiveId(null);
  };

  if (isLoading) return <Loading label="LOADING SKILLS" />;

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <PageHeader
        title="SKILLS"
        subtitle="Grouped into categories shown on the homepage"
        actions={<Badge tone="muted">{list.length} CATEGORIES</Badge>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Panel title="CATEGORIES" flush className="lg:col-span-1 h-fit">
          <div className="divide-y-2 divide-black/10">
            {list.map((s) => (
              <button
                key={s._id}
                onClick={() => setActiveId(s._id)}
                className={`w-full px-4 py-2.5 text-left flex items-center justify-between gap-2 text-[11px] font-black uppercase tracking-widest transition-colors ${
                  active?._id === s._id ? 'bg-[#FF5F1F] text-white' : 'hover:bg-gray-100'
                }`}
              >
                <span className="truncate">{s.category}</span>
                <span className={`shrink-0 tabular-nums ${active?._id === s._id ? 'text-white/70' : 'text-black/30'}`}>
                  {s.items.length}
                </span>
              </button>
            ))}
            {list.length === 0 && (
              <p className="px-4 py-6 text-[11px] font-black uppercase tracking-widest text-black/30">
                No categories yet
              </p>
            )}
          </div>

          <div className="border-t-2 border-black p-3 space-y-2">
            <Field label="NEW CATEGORY">
              <Input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addCategory()}
                placeholder="E.G. BACKEND"
                caps
              />
            </Field>
            <Button variant="primary" block onClick={addCategory} disabled={!newCategory.trim()}>
              ADD CATEGORY
            </Button>
          </div>
        </Panel>

        <div className="lg:col-span-2">
          {active ? (
            <Panel
              title={active.category}
              description={`${active.items.length} skills`}
              actions={
                <Button variant="danger" size="sm" onClick={() => removeCategory(active)}>
                  DELETE CATEGORY
                </Button>
              }
            >
              <StringListField
                label="SKILLS"
                value={active.items}
                onChange={(items) => updateSkill({ _id: active._id, items })}
                placeholder="ADD A SKILL..."
                caps
                hint="Homepage shows the first 5"
              />
            </Panel>
          ) : (
            <EmptyState label="Create a category to start adding skills" />
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillsPage;
