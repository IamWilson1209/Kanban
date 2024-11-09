import { z } from "zod";

/* Update Board Schema，handler的 data 部分*/
export const updateCardSchema = z.object({
  title: z.optional(z.string({
    required_error: "Title is required",
    invalid_type_error: "Title is required",
  }).min(3, {
    message: "Title is too short."
  })),
  id: z.string(),
  boardId: z.string(),
  description: z.optional(
    z.string({
      required_error: "Description is required",
      invalid_type_error: "Description is required",
    }).min(3, {
      message: "Description is too short."
    }),
  ),
})