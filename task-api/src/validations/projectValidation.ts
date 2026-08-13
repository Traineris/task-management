import { z } from 'zod';

export const createProjectSchema = z.object({
  name: z.string().min(2, 'Nama project minimal 2 karakter'),
  key: z.string().min(2, 'Key project minimal 2 karakter').max(10, 'Key project maksimal 10 karakter').toUpperCase(),
  description: z.string().optional(),
  members: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID member tidak valid')).optional(),
});

export const updateProjectSchema = z.object({
  name: z.string().min(2, 'Nama project minimal 2 karakter').optional(),
  description: z.string().optional(),
  leadId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID Lead tidak valid').optional(),
  members: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID member tidak valid')).optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
