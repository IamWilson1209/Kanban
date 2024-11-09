import { z } from "zod";

/* Update List Schema，handler的 data 部分*/
export const updateListOrderSchema = z.object({
  items: z.array(
    z.object(
      {
        id: z.string(),
        title: z.string(),
        order: z.number(),
        createdAt: z.date(),
        updatedAt: z.date()
      }
    )
  ),
  boardId: z.string()
})