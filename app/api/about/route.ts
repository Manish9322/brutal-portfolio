import About from '@/models/About.model';
import { createSingletonHandlers } from '@/lib/crud';
import { DEFAULT_ABOUT } from '@/lib/seed-data';

export const { GET, PUT } = createSingletonHandlers(About, {
  label: 'about',
  defaults: DEFAULT_ABOUT,
});
