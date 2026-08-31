import SEO from '@/models/SEO.model';
import { createSingletonHandlers } from '@/lib/crud';
import { DEFAULT_SEO } from '@/lib/seed-data';

export const { GET, PUT } = createSingletonHandlers(SEO, {
  label: 'seo',
  defaults: DEFAULT_SEO,
});
