import { z } from "zod";

/* Copy List Schema，handler的 data 部分*/
export const copyListSchema = z.object({
  id: z.string(),
  boardId: z.string(),
})