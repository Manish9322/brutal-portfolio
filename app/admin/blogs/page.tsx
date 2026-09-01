'use client';

import React, { useState } from 'react';
import {
  useGetBlogsQuery,
  useAddBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} from '@/services/api';
import {
  PageHeader,
  Panel,
  Field,
  FormGrid,
  Input,
  Textarea,
  Button,
  Toggle,
  Badge,
  ListRow,
  ListPanel,
  EmptyState,
  EditorShell,
  Loading,
} from '@/components/admin/ui';
import type { Blog } from '@/types';
import { LIMITS } from '@/lib/field-limits';

const L = LIMITS.blog;

const slugify = (text: string) =>
  text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const BlogsPage: React.FC = () => {
  const { data: blogs = [], isLoading } = useGetBlogsQuery();
  const [addBlog] = useAddBlogMutation();
  const [updateBlog] = useUpdateBlogMutation();
  const [deleteBlog] = useDeleteBlogMutation();

  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Blog>>({});
  const [saving, setSaving] = useState(false);

  const list = blogs as Blog[];
  const set = (patch: Partial<Blog>) => setForm({ ...form, ...patch });

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        slug: form.slug?.trim() || slugify(form.title ?? ''),
        date: form.date || new Date().toISOString().split('T')[0],
      };
      if (editing === 'new') await addBlog({ ...payload, published: form.published ?? true });
      else await updateBlog({ ...payload, _id: editing });
      setEditing(null);
    } finally {
      setSaving(false);
    }
  };

  const remove = (item: Blog) => {
    if (window.confirm(`Delete "${item.title}"? This cannot be undone.`)) deleteBlog(item._id);
  };

  if (isLoading) return <Loading label="LOADING POSTS" />;

  if (editing) {
    return (
      <EditorShell
        title={editing === 'new' ? 'NEW POST' : 'EDIT POST'}
        onCancel={() => setEditing(null)}
        onSave={handleSave}
        saving={saving}
        extraActions={
          <Toggle
            on={form.published !== false}
            onChange={() => set({ published: form.published === false })}
            onLabel="PUBLISHED"
            offLabel="DRAFT"
          />
        }
      >
        <Panel title="POST">
          <FormGrid>
            <Field label="TITLE" wide max={L.title} value={form.title ?? ''}>
              <Input
                value={form.title ?? ''}
                onChange={(e) => {
                  const title = e.target.value;
                  // Keep the slug in step until it has been edited by hand.
                  const autoSlug = !form.slug || form.slug === slugify(form.title ?? '');
                  set(autoSlug ? { title, slug: slugify(title) } : { title });
                }}
              />
            </Field>
            <Field label="SLUG" hint="Used in the URL" max={L.slug} value={form.slug ?? ''}>
              <Input value={form.slug ?? ''} onChange={(e) => set({ slug: slugify(e.target.value) })} />
            </Field>
            <Field label="DATE" hint="YYYY-MM-DD" max={L.date} value={form.date ?? ''}>
              <Input value={form.date ?? ''} onChange={(e) => set({ date: e.target.value })} />
            </Field>
            <Field label="EXCERPT" wide hint="Shown on the journal index" max={L.excerpt} value={form.excerpt ?? ''}>
              <Textarea
                value={form.excerpt ?? ''}
                onChange={(e) => set({ excerpt: e.target.value })}
                rows={2}
              />
            </Field>
          </FormGrid>
        </Panel>

        <Panel title="CONTENT" description="Markdown: # heading, ## subheading, blank line for a break">
          <Field label="BODY" max={L.content} value={form.content ?? ''}>
            <Textarea
              value={form.content ?? ''}
              onChange={(e) => set({ content: e.target.value })}
              rows={18}
              mono
              placeholder="# START WRITING..."
            />
          </Field>
        </Panel>
      </EditorShell>
    );
  }

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <PageHeader
        title="BLOG"
        subtitle={`${list.filter((b) => b.published).length} published · ${list.filter((b) => !b.published).length} drafts`}
        actions={
          <Button
            variant="primary"
            onClick={() => {
              setEditing('new');
              setForm({ published: true, content: '', date: new Date().toISOString().split('T')[0] });
            }}
          >
            + NEW POST
          </Button>
        }
      />

      {list.length === 0 ? (
        <EmptyState label="No posts yet" />
      ) : (
        <ListPanel>
          {list.map((blog) => (
            <ListRow
              key={blog._id}
              dimmed={!blog.published}
              eyebrow={blog.date}
              title={blog.title}
              meta={
                <span className="flex flex-wrap items-center gap-2">
                  <Badge tone={blog.published ? 'success' : 'muted'}>
                    {blog.published ? 'PUBLISHED' : 'DRAFT'}
                  </Badge>
                  <span className="normal-case">/journal/{blog.slug}</span>
                </span>
              }
              actions={
                <>
                  <Toggle
                    on={blog.published}
                    onChange={() => updateBlog({ _id: blog._id, published: !blog.published })}
                    onLabel="PUBLISHED"
                    offLabel="DRAFT"
                  />
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => {
                      setEditing(blog._id);
                      setForm(blog);
                    }}
                  >
                    EDIT
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => remove(blog)}>
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

export default BlogsPage;
