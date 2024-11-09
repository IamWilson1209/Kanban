import { z } from "zod";

/* Copy Card Schema，handler的 data 部分*/
export const copyCardSchema = z.object({
  id: z.string(),
  boardId: z.string(),
})