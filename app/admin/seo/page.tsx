'use client';

import React from 'react';
import { useGetSeoQuery, useUpdateSeoMutation } from '@/services/api';
import { useDebouncedDraft } from '@/hooks/use-debounced-draft';
import ImageField from '@/components/admin/ImageField';
import { PageHeader, Panel, Field, Input, Textarea, Loading, Badge } from '@/components/admin/ui';

const SEOPage: React.FC = () => {
  const { data: remoteSeo } = useGetSeoQuery();
  const [updateSeo] = useUpdateSeoMutation();
  const [seo, setSeo] = useDebouncedDraft<any>(remoteSeo, (draft) => updateSeo(draft));

  if (!seo) return <Loading label="LOADING METADATA" />;

  const set = (field: string, value: unknown) => setSeo({ ...seo, [field]: value });
  const keywords: string[] = seo.keywords ?? [];

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <PageHeader
        title="SEO"
        subtitle="How the site appears in search results and link previews"
        actions={<Badge tone="muted">SAVES AUTOMATICALLY</Badge>}
      />

      <Panel title="SEARCH LISTING">
        <div className="space-y-4">
          <Field label="META TITLE" hint={`${(seo.metaTitle ?? '').length} / 60 characters recommended`}>
            <Input value={seo.metaTitle ?? ''} onChange={(e) => set('metaTitle', e.target.value)} caps />
          </Field>

          <Field
            label="META DESCRIPTION"
            hint={`${(seo.metaDescription ?? '').length} / 160 characters recommended`}
          >
            <Textarea
              value={seo.metaDescription ?? ''}
              onChange={(e) => set('metaDescription', e.target.value)}
              rows={3}
            />
          </Field>

          <Field label="KEYWORDS" hint="Comma separated">
            <Input
              value={keywords.join(', ')}
              onChange={(e) => set('keywords', e.target.value.split(',').map((s) => s.trim()))}
            />
          </Field>
        </div>
      </Panel>

      <Panel title="SOCIAL PREVIEW" description="Shown when the site is shared on social platforms">
        <ImageField
          label="OG IMAGE"
          module="seo"
          value={seo.ogImage ?? ''}
          onChange={(url) => set('ogImage', url)}
        />
      </Panel>
    </div>
  );
};

export default SEOPage;
