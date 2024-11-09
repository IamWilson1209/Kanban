"use server"

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

import db from '@/lib/db';
import { createSafeAction } from '@/lib/create-safe-action';

import { InputType, ReturnType } from './types';
import { copyListSchema } from './schema';
import { createAuditLog } from '@/lib/create-audit-log';
import { Action, EntityType } from '@prisma/client';

const handler = async (data: InputType): Promise<ReturnType> => {

  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return {
      error: 'User not authenticated',
    };
  }

  const { id, boardId } = data; // board.id
  let list;

  try {
    const listToCopy = await db.list.findUnique({
      where: {
        id,
        boardId,
        board: {
          orgId,
        }
      },
      include: {
        cards: true,
      }
    })

    if (!listToCopy) {
      return {
        error: 'List not found',
      }
    }

    const lastList = await db.list.findFirst({
      where: { boardId },
      orderBy: { order: "desc" },
      select: { order: true }
    })

    const newOrder = lastList ? lastList.order + 1 : 1;
    list = await db.list.create({
      data: {
        boardId: listToCopy.boardId,
        title: `${listToCopy.title} (Copy)`,
        order: newOrder,
        cards: {
          createMany: {
            data: listToCopy.cards.map((card) => ({
              title: card.title,
              order: card.order,
              description: card.description,
            }))
          }
        }
      },
      include: {
        cards: true,
      }
    })

    await createAuditLog({
      entityTitle: list.title,
      entityId: list.id,
      entityType: EntityType.List,
      action: Action.Create,
    })

  } catch (error) {
    return {
      error: `Failed to copt list`,
    }
  }

  revalidatePath(`/board/${boardId}`);
  return {
    data: list,
  };
}

export const copyList = createSafeAction(copyListSchema, handler);