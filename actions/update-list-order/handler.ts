'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

import db from '@/lib/db';
import { createSafeAction } from '@/lib/create-safe-action';

import { InputType, ReturnType } from './types';
import { updateListOrderSchema } from './schema';
import { Dna } from 'lucide-react';
import { createAuditLog } from '@/lib/create-audit-log';
import { Action, EntityType } from '@prisma/client';

const handler = async (data: InputType): Promise<ReturnType> => {

  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return {
      error: 'User not authenticated',
    };
  }

  const { items, boardId } = data;
  let lists;

  try {

    // 維持 Consistency
    // 使用 Prisma 的transaction將 updateLists 中的所有操作封裝
    const updateLists = items.map((list) =>
      db.list.update({
        where: {
          id: list.id,
          board: {
            orgId,
          }
        },
        data: {
          order: list.order,
          updatedAt: new Date(),
        }
      })
    )
    lists = await db.$transaction(updateLists);

  } catch (error) {
    // console.error('Error creating board:', error); 
    return {
      error: `Failed to reorder`,
    };
  }

  revalidatePath(`/board/${boardId}`);
  return {
    data: lists,
  };
};

export const updateListOrder = createSafeAction(updateListOrderSchema, handler);
