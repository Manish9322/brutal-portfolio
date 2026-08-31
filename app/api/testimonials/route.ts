import Testimonial from '@/models/Testimonials.model';
import { createCrudHandlers } from '@/lib/crud';

export const { GET, POST, PUT, PATCH, DELETE } = createCrudHandlers(Testimonial, {
  label: 'testimonial',
});
