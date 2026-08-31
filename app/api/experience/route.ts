import Experience from '@/models/Experience.model';
import { createCrudHandlers } from '@/lib/crud';

export const { GET, POST, PUT, PATCH, DELETE } = createCrudHandlers(Experience, {
  label: 'experience',
});
