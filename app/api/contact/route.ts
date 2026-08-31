import Contact from '@/models/Contact.model';
import { createCrudHandlers } from '@/lib/crud';

// Messages are never reordered: newest first, PUT is used to flip `read`.
export const { GET, POST, PUT, DELETE } = createCrudHandlers(Contact, {
  label: 'message',
  orderField: null,
  sort: { createdAt: -1 },
});
