import Skill from '@/models/Skills.model';
import { createCrudHandlers } from '@/lib/crud';

export const { GET, POST, PUT, PATCH, DELETE } = createCrudHandlers(Skill, { label: 'skill' });
