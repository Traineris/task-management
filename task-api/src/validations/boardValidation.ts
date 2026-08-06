import { z } from "zod";

export const createBoardSchema = z.object({
  name: z
    .string({ error: "Board name is required" })
    .min(3, "Board name must be at least 3 characters")
    .max(50, "Board name must be at most 50 characters"),
  dates: z.coerce.date({ error: "Date is required" }),
  code: z
    .string({ error: "Board code is required" })
    .min(1, "Board code cannot be empty"),
  description: z.string().optional(),
});

export const updateBoardSchema = createBoardSchema.partial();
