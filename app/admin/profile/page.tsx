'use client';

import React from 'react';
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetSettingsQuery,
  useUpdateSettingsMutation,
} from '@/services/api';
import { useDebouncedDraft } from '@/hooks/use-debounced-draft';
import FileField from '@/components/admin/FileField';
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
  EmptyState,
  Loading,
} from '@/components/admin/ui';

const ProfilePage: React.FC = () => {
  const { data: remoteProfile } = useGetProfileQuery();
  const [updateProfile] = useUpdateProfileMutation();
  const { data: remoteSettings } = useGetSettingsQuery();
  const [updateSettings] = useUpdateSettingsMutation();

  const [profile, setProfile] = useDebouncedDraft<any>(remoteProfile, (draft) => {
    // Links added in the browser carry a placeholder id; drop it so Mongoose
    // mints a real ObjectId instead of rejecting the cast.
    updateProfile({
      ...draft,
      socialLinks: (draft.socialLinks ?? []).map(({ _id, ...rest }: any) =>
        typeof _id === 'string' && _id.startsWith('new-') ? rest : { _id, ...rest }
      ),
    });
  });

  const [settings, setSettings] = useDebouncedDraft<any>(remoteSettings, (draft) => {
    updateSettings({
      ...draft,
      footerResources: (draft.footerResources ?? []).map(({ _id, ...rest }: any) =>
        typeof _id === 'string' && _id.startsWith('new-') ? rest : { _id, ...rest }
      ),
    });
  });

  if (!profile) return <Loading label="LOADING PROFILE" />;

  const socialLinks: any[] = profile.socialLinks ?? [];
  const footerResources: any[] = settings?.footerResources ?? [];
  const telegramVisible = profile.telegramVisible !== false;

  const set = (field: string, value: unknown) => setProfile({ ...profile, [field]: value });

  const IDENTITY_FIELDS = [
    { key: 'name', label: 'FIRST NAME' },
    { key: 'lastName', label: 'LAST NAME' },
    { key: 'discipline', label: 'DISCIPLINE' },
    { key: 'status', label: 'STATUS' },
    { key: 'location', label: 'LOCATION' },
    { key: 'email', label: 'CONTACT EMAIL' },
  ];

  /* ------------------------------------------------------ social links -- */

  const updateLink = (id: string, patch: Record<string, string>) =>
    setProfile({
      ...profile,
      socialLinks: socialLinks.map((l) => (l._id === id ? { ...l, ...patch } : l)),
    });

  const moveLink = (index: number, delta: -1 | 1) => {
    const target = index + delta;
    if (target < 0 || target >= socialLinks.length) return;
    const next = [...socialLinks];
    [next[index], next[target]] = [next[target], next[index]];
    setProfile({ ...profile, socialLinks: next });
  };

  /* -------------------------------------------------- footer resources -- */

  const updateResource = (id: string, patch: Record<string, string>) =>
    setSettings({
      ...settings,
      footerResources: footerResources.map((r) => (r._id === id ? { ...r, ...patch } : r)),
    });

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <PageHeader
        title="PROFILE"
        subtitle="Identity used across the site"
        actions={<Badge tone="muted">SAVES AUTOMATICALLY</Badge>}
      />

      <Panel title="IDENTITY">
        <FormGrid>
          {IDENTITY_FIELDS.map((f) => (
            <Field key={f.key} label={f.label}>
              <Input value={profile[f.key] ?? ''} onChange={(e) => set(f.key, e.target.value)} caps />
            </Field>
          ))}

          <Field label="TELEGRAM HANDLE" hint={telegramVisible ? undefined : 'Hidden from the contact section'}>
            <div className="flex gap-2">
              <Input
                value={profile.telegram ?? ''}
                onChange={(e) => set('telegram', e.target.value)}
                className={telegramVisible ? '' : 'opacity-40'}
                caps
              />
              <Toggle
                on={telegramVisible}
                onChange={() => set('telegramVisible', !telegramVisible)}
                onLabel="SHOWN"
                offLabel="HIDDEN"
                aria-label="Toggle telegram visibility on the site"
              />
            </div>
          </Field>

          <Field label="MANIFESTO LINE" wide hint="The large statement in the hero">
            <Textarea
              value={profile.manifestoLine ?? ''}
              onChange={(e) => set('manifestoLine', e.target.value)}
              rows={3}
              caps
            />
          </Field>
        </FormGrid>
      </Panel>

      <Panel
        title="SOCIAL LINKS"
        description={`${socialLinks.length} shown in the footer`}
        actions={
          <Button
            size="sm"
            variant="primary"
            onClick={() =>
              setProfile({
                ...profile,
                socialLinks: [...socialLinks, { _id: `new-${Date.now()}`, platform: '', url: '' }],
              })
            }
          >
            + ADD LINK
          </Button>
        }
      >
        {socialLinks.length === 0 ? (
          <EmptyState label="No social links yet" />
        ) : (
          <div className="space-y-2">
            {socialLinks.map((link, index) => (
              <div key={link._id} className="flex flex-col sm:flex-row gap-2 sm:items-center">
                <Input
                  value={link.platform ?? ''}
                  onChange={(e) => updateLink(link._id, { platform: e.target.value.toUpperCase() })}
                  placeholder="PLATFORM"
                  caps
                  className="sm:w-40 shrink-0"
                />
                <Input
                  value={link.url ?? ''}
                  onChange={(e) => updateLink(link._id, { url: e.target.value })}
                  placeholder="https://"
                  className="flex-1"
                />
                <div className="flex gap-1.5 shrink-0">
                  <IconButton aria-label="Move up" onClick={() => moveLink(index, -1)} disabled={index === 0}>
                    ↑
                  </IconButton>
                  <IconButton
                    aria-label="Move down"
                    onClick={() => moveLink(index, 1)}
                    disabled={index === socialLinks.length - 1}
                  >
                    ↓
                  </IconButton>
                  <IconButton
                    aria-label="Remove link"
                    variant="danger"
                    onClick={() =>
                      setProfile({
                        ...profile,
                        socialLinks: socialLinks.filter((l) => l._id !== link._id),
                      })
                    }
                  >
                    ✕
                  </IconButton>
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>

      <Panel
        title="FOOTER RESOURCES"
        description="Downloadable links in the site footer"
        actions={
          <Button
            size="sm"
            variant="primary"
            disabled={!settings}
            onClick={() =>
              setSettings({
                ...settings,
                footerResources: [
                  ...footerResources,
                  { _id: `new-${Date.now()}`, label: 'NEW RESOURCE', url: '' },
                ],
              })
            }
          >
            + ADD RESOURCE
          </Button>
        }
      >
        {!settings ? (
          <Loading label="LOADING RESOURCES" />
        ) : footerResources.length === 0 ? (
          <EmptyState label="No footer resources yet" />
        ) : (
          <div className="space-y-3">
            {footerResources.map((res) => (
              <div key={res._id} className="border-2 border-black p-3 bg-gray-50 space-y-3">
                <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                  <Input
                    value={res.label ?? ''}
                    onChange={(e) => updateResource(res._id, { label: e.target.value.toUpperCase() })}
                    placeholder="LABEL"
                    caps
                    className="sm:w-52 shrink-0"
                  />
                  <Input
                    value={res.url ?? ''}
                    onChange={(e) => updateResource(res._id, { url: e.target.value })}
                    placeholder="OR PASTE A LINK"
                    className="flex-1"
                  />
                  <Button
                    size="sm"
                    variant="danger"
                    className="shrink-0"
                    onClick={() =>
                      setSettings({
                        ...settings,
                        footerResources: footerResources.filter((r) => r._id !== res._id),
                      })
                    }
                  >
                    DELETE
                  </Button>
                </div>
                <FileField
                  label="FILE"
                  module="resources"
                  value={res.url ?? ''}
                  onChange={(url) => updateResource(res._id, { url })}
                />
              </div>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
};

export default ProfilePage;
