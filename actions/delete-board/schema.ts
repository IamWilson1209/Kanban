import { z } from "zod";

/* Create Board Schema，handler的 data 部分*/
export const deleteBoardSchema = z.object({
  id: z.string(),
})