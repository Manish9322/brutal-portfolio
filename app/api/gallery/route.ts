import Gallery from '@/models/Gallery.model';
import { createCrudHandlers } from '@/lib/crud';

export const { GET, POST, PUT, PATCH, DELETE } = createCrudHandlers(Gallery, {
  label: 'gallery item',
});
