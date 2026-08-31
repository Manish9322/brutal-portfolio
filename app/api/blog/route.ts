import Blog from '@/models/Blog.model';
import { createCrudHandlers } from '@/lib/crud';

export const { GET, POST, PUT, PATCH, DELETE } = createCrudHandlers(Blog, {
  label: 'blog',
  orderField: null,
  sort: { date: -1 },
});
