import { z } from 'zod';

export const createSprintSchema = z.object({
  projectId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID Project tidak valid'),
  name: z.string().min(2, 'Nama sprint minimal 2 karakter'),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  goal: z.string().optional(),
});

export const updateSprintSchema = z.object({
  name: z.string().min(2, 'Nama sprint minimal 2 karakter').optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  goal: z.string().optional(),
  status: z.enum(['PLANNED', 'ACTIVE', 'COMPLETED']).optional(),
});

export type CreateSprintInput = z.infer<typeof createSprintSchema>;
export type UpdateSprintInput = z.infer<typeof updateSprintSchema>;
