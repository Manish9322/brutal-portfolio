import Settings from '@/models/Settings.model';
import { createSingletonHandlers } from '@/lib/crud';
import { DEFAULT_SETTINGS } from '@/lib/seed-data';

export const { GET, PUT } = createSingletonHandlers(Settings, {
  label: 'settings',
  defaults: DEFAULT_SETTINGS,
});
