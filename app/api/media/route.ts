import Media from '@/models/Media.model';
import { createCrudHandlers } from '@/lib/crud';

export const { GET, POST, PUT, PATCH, DELETE } = createCrudHandlers(Media, {
  label: 'media asset',
  orderField: null,
  sort: { createdAt: -1 },
});
