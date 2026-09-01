'use client';

import React from 'react';
import {
  useGetAboutQuery,
  useUpdateAboutMutation,
  useGetSettingsQuery,
  useUpdateSettingsMutation,
} from '@/services/api';
import { useDebouncedDraft } from '@/hooks/use-debounced-draft';
import { PageHeader, Panel, Field, FormGrid, Input, Textarea, Loading, Badge } from '@/components/admin/ui';
import { LIMITS } from '@/lib/field-limits';

const L = LIMITS.settings;

const SettingsPage: React.FC = () => {
  const { data: remoteAbout } = useGetAboutQuery();
  const { data: remoteSettings } = useGetSettingsQuery();
  const [updateAbout] = useUpdateAboutMutation();
  const [updateSettings] = useUpdateSettingsMutation();

  const [about, setAbout] = useDebouncedDraft<any>(remoteAbout, (draft) => updateAbout(draft));
  const [settings, setSettings] = useDebouncedDraft<any>(remoteSettings, (draft) => {
    // Resources added in the browser carry a placeholder id; drop it so Mongoose
    // mints a real ObjectId instead of rejecting the cast.
    updateSettings({
      ...draft,
      footerResources: (draft.footerResources ?? []).map(({ _id, ...rest }: any) =>
        typeof _id === 'string' && _id.startsWith('new-') ? rest : { _id, ...rest }
      ),
    });
  });

  if (!about || !settings) return <Loading label="LOADING CONFIG" />;

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <PageHeader
        title="SETTINGS"
        subtitle="Site-wide content that is not tied to a single section"
        actions={<Badge tone="muted">SAVES AUTOMATICALLY</Badge>}
      />

      <Panel title="ABOUT MANIFESTO" description="Currently hidden on the homepage">
        <div className="space-y-4">
          <Field label="HEADING" max={L.manifestoHeading} value={about.manifestoHeading ?? ''}>
            <Input
              value={about.manifestoHeading ?? ''}
              onChange={(e) => setAbout({ ...about, manifestoHeading: e.target.value.toUpperCase() })}
              caps
            />
          </Field>
          <Field label="DESCRIPTION" max={L.manifestoDescription} value={about.description ?? ''}>
            <Textarea
              value={about.description ?? ''}
              onChange={(e) => setAbout({ ...about, description: e.target.value })}
              rows={5}
            />
          </Field>
        </div>
      </Panel>

      <Panel title="SYSTEM INFO" description="Shown in the site footer">
        <FormGrid>
          <Field label="VERSION" max={L.version} value={settings.version ?? ''}>
            <Input
              value={settings.version ?? ''}
              onChange={(e) => setSettings({ ...settings, version: e.target.value })}
            />
          </Field>
          <Field label="MARQUEE TEXT" wide max={L.marqueeText} value={settings.marqueeText ?? ''}>
            <Input
              value={settings.marqueeText ?? ''}
              onChange={(e) => setSettings({ ...settings, marqueeText: e.target.value.toUpperCase() })}
              caps
            />
          </Field>
        </FormGrid>
      </Panel>

      <Panel title="FOOTER RESOURCES">
        <p className="text-[11px] font-bold uppercase tracking-wide text-black/40">
          Managed on the <a href="/admin/profile" className="underline hover:text-[#FF5F1F]">Profile</a> page,
          alongside the rest of your identity details.
        </p>
      </Panel>
    </div>
  );
};

export default SettingsPage;
