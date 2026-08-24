import { z } from 'zod';

export const createCommentSchema = z.object({
  content: z.string().min(1, 'Komentar tidak boleh kosong'),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
