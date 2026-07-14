import { z } from "zod";

export const screeningDecisionSchema = z.object({
  decision: z.enum([
    "pass",
    "hold",
    "reject",
  ]),

  note: z
    .string()
    .max(1000)
    .optional(),
});