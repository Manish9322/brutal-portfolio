import Profile from '@/models/Profile.model';
import { createSingletonHandlers } from '@/lib/crud';
import { DEFAULT_PROFILE } from '@/lib/seed-data';

export const { GET, PUT } = createSingletonHandlers(Profile, {
  label: 'profile',
  defaults: DEFAULT_PROFILE,
});
