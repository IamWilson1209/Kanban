import { z } from "zod";

/* Create List Schema，handler的 data 部分*/
export const deleteListSchema = z.object({
  id: z.string(),
  boardId: z.string(),
})