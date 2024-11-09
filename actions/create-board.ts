'use server';

import { z } from "zod"
// import { auth } from "@clerk/nextjs"
import { revalidatePath } from "next/cache";

import db from '@/lib/db';
// import { createSafeAction } from "@/lib/create-safe-action"
// import { InputType, ReturnType } from "./types"
// import { CreateBoard } from "./schema";
import { redirect } from "next/navigation";


export type State = {
  errors?: {
    title?: string[];
  }
  message?: string | null;
}

const CreateBoard = z.object({
  title: z.string().min(3, {
    message: "Minimum length of board should be at least 3"
  })
})

export async function create(prevState: State, formData: FormData) {
  // const title = formData.get('title') as string;
  const validatedFields = CreateBoard.safeParse({ title: formData.get('title') });

  if (!validatedFields) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing fields"
    }
  }

  const { title } = validatedFields.data || {};

  try {
    await db.board.create({
      data: {
        title,
      },
    });
  } catch (error) {
    return {
      message: "Database Error"
    }
  }

  revalidatePath("/organization/org_2oL8Npr5JFNv0FVADda5gkQtQGL")
  redirect("/organization/org_2oL8Npr5JFNv0FVADda5gkQtQGL")
}