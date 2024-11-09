import { z } from "zod";

/* Create List Schema，handler的 data 部分*/
export const updateListSchema = z.object({
  title: z.string({
    required_error: "Title is required",
    invalid_type_error: "Title is required",
  }).min(3, {
    message: "Title is too short."
  }),
  id: z.string(),
  boardId: z.string(),
})