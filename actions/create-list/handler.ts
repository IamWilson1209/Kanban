'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

import db from '@/lib/db';
import { createSafeAction } from '@/lib/create-safe-action';

import { InputType, ReturnType } from './types';
import { createListSchema } from './schema';
import { createAuditLog } from '@/lib/create-audit-log';
import { Action, EntityType } from '@prisma/client';

const handler = async (data: InputType): Promise<ReturnType> => {

  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return {
      error: 'User not authenticated',
    };
  }

  const { title, boardId } = data;
  let list;

  try {

    const board = await db.board.findUnique({
      where: {
        id: boardId,
        orgId,
      }
    })

    if (!board) {
      return {
        error: 'Board not found',
      }
    }

    const lastList = await db.list.findFirst({
      where: { boardId: boardId },
      orderBy: { order: "desc" },
      select: { order: true }
    })

    const newOrder = lastList ? lastList.order + 1 : 1;

    list = await db.list.create({
      data: {
        title,
        boardId,
        order: newOrder
      },
    });

    await createAuditLog({
      entityTitle: list.title,
      entityId: list.id,
      entityType: EntityType.List,
      action: Action.Create,
    })
  } catch (error) {
    // console.error('Error creating board:', error); // 打印完整錯誤物件
    return {
      error: `Failed to create list`,
    };
  }

  revalidatePath(`/board/${boardId}`);
  return {
    data: list,
  };
};

export const createList = createSafeAction(createListSchema, handler);
