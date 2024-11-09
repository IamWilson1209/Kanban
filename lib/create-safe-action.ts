import { z } from "zod"

/*
type FormData = {
  title: string;
  description: string;
};

const formErrors: FieldErrors<FormData> = {
  title: ["標題不能為空"], // title 欄位有一個錯誤
  description: ["描述不能超過 100 字", "必填欄位"] 
}; 
*/


/* 
使用泛型來表示不同情況下的錯誤、結果資料結構
T 代表某個物件的結構（e.g. 表單的欄位） 
*/
export type FieldErrors<T> = {
  [K in keyof T]?: string[]; // 代表 FieldErrors 中的每個鍵值（K）都來自 T 的鍵值
}

/* 
type FormData = {
  title: string;
  description: string;
};

type Board = {
  id: string;
  title: string;
}; 

ActionState<FormData, Board>

const actionState: ActionState<FormData, Board> = {
  fieldErrors: {
    title: ["標題不能為空"]
  },
  error: null, // 沒有一般錯誤
  data: { id: "123", title: "看板123" } // 成功時返回的看板資料
};
*/

export type ActionState<TInput, TOutput> = {
  fieldErrors?: FieldErrors<TInput>; // 型態 key(title): string[error]
  error?: string | null; // 如果有 Error 回傳 Error
  data?: TOutput // Success 則回傳 Prisma data
}

/*
const formSchema = z.object({
  title: z.string().min(3),
});

const handler = async (data: { title: string }) => {
  // 處裡資料
  return { data: { id: "123", title: data.title }, error: null };
};

const safeAction = createSafeAction(formSchema(或各種schema), handler(或各種資料handler));

使用 safeAction 傳入表單資料
safeAction({ title: "Hi" }).then(console.log); // 若 title 太短，會顯示錯誤訊息

return 經過驗證的 handler 與 data

*/

export const createSafeAction = <TInput, TOutput>(
  schema: z.Schema<TInput>,
  handler: (validatedData: TInput) => Promise<ActionState<TInput, TOutput>>
) => {
  return async (data: TInput): Promise<ActionState<TInput, TOutput>> => {
    /*
      Zod 的 safeParse 方法驗證資料是否符合模式
      若驗證失敗，success 會為 false，且 validationResult.error 包含錯誤資訊
    */
    const validationResult = schema.safeParse(data);
    if (!validationResult.success) {
      return {
        fieldErrors: validationResult.error.flatten().fieldErrors as FieldErrors<TInput>,
      }
    }
    return handler(validationResult.data)
  }
}