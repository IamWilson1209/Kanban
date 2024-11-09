import { z } from "zod";

/* Create List Schema，handler的 data 部分*/
export const createListSchema = z.object({
  title: z.string({
    required_error: "Title is required",
    invalid_type_error: "Title is required",
  }).min(3, {
    message: "Title is too short."
  }),
  boardId: z.string() // 記得有偷偷傳boardId
})