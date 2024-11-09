'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

import db from '@/lib/db';
import { createSafeAction } from '@/lib/create-safe-action';

import { InputType, ReturnType } from './types';
import { updateCardOrderSchema } from './schema';
import { createAuditLog } from '@/lib/create-audit-log';

const handler = async (data: InputType): Promise<ReturnType> => {

  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return {
      error: 'User not authenticated',
    };
  }

  const { items, boardId } = data;
  let cards;

  try {

    // 維持 Consistency
    // 使用 Prisma 的transaction將 updateLists 中的所有操作封裝
    const updateCards = items.map((card) =>
      db.card.update({
        where: {
          id: card.id,
          list: {
            board: {
              orgId
            }
          }
        },
        data: {
          order: card.order,
          listId: card.listId,
          updatedAt: new Date(),
        }
      })
    )
    cards = await db.$transaction(updateCards);

  } catch (error) {
    // console.error('Error creating board:', error); 
    return {
      error: `Failed to reorder`,
    };
  }

  revalidatePath(`/board/${boardId}`);
  return {
    data: cards,
  };
};

export const updateCardOrder = createSafeAction(updateCardOrderSchema, handler);
