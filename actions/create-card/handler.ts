'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

import db from '@/lib/db';
import { createSafeAction } from '@/lib/create-safe-action';

import { InputType, ReturnType } from './types';
import { createCardSchema } from './schema';
import { createAuditLog } from '@/lib/create-audit-log';
import { Action, EntityType } from '@prisma/client';

const handler = async (data: InputType): Promise<ReturnType> => {

  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return {
      error: 'User not authenticated',
    };
  }

  const { title, boardId, listId } = data;
  let card;

  try {

    const list = await db.list.findUnique({
      where: {
        id: listId,
        boardId,
        board: {
          orgId,
        }
      }
    });

    if (!list) {
      return {
        error: 'List not found',
      };
    }

    const lastCard = await db.card.findFirst({
      where: {
        listId
      },
      orderBy: { order: "desc" },
      select: { order: true }
    })

    const newCardOrder = lastCard ? lastCard.order + 1 : 1;

    card = await db.card.create({
      data: {
        title,
        listId,
        order: newCardOrder
      },
    });

    await createAuditLog({
      entityId: card.id,
      entityType: EntityType.Card,
      entityTitle: card.title,
      action: Action.Create,
    })
  } catch (error) {
    // console.error('Error creating board:', error); // 打印完整錯誤物件
    return {
      error: `Failed to create board`,
    };
  }

  revalidatePath(`/board/${boardId}`);
  return {
    data: card,
  };
};

export const createCard = createSafeAction(createCardSchema, handler);
