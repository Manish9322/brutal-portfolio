import Education from '@/models/Education.model';
import { createCrudHandlers } from '@/lib/crud';

export const { GET, POST, PUT, PATCH, DELETE } = createCrudHandlers(Education, {
  label: 'education',
});
