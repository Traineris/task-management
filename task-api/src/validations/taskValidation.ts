import { z } from 'zod';

export const createTaskSchema = z.object({
  projectId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID Project tidak valid'),
  title: z.string().min(2, 'Judul task minimal 2 karakter'),
  description: z.string().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'HIGHEST']).optional(),
  assigneeId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID Assignee tidak valid').optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(2, 'Judul task minimal 2 karakter').optional(),
  description: z.string().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'HIGHEST']).optional(),
  assigneeId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID Assignee tidak valid').nullable().optional(),
  position: z.number().optional(),
});

export const reorderTaskSchema = z.object({
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']),
  position: z.number({ required_error: 'Posisi baru wajib diisi' }),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type ReorderTaskInput = z.infer<typeof reorderTaskSchema>;
