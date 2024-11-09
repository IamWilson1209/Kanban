import { z } from "zod";

/* Create Card Schema，handler的 data 部分*/
export const createCardSchema = z.object({
  title: z.string({
    required_error: "Title is required",
    invalid_type_error: "Title is required",
  }).min(3, {
    message: "Title is too short."
  }),
  boardId: z.string(),
  listId: z.string()
})