"use server"

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

import db from '@/lib/db';
import { createSafeAction } from '@/lib/create-safe-action';

import { InputType, ReturnType } from './types';
import { copyCardSchema } from './schema';
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
  let card;

  try {
    const cardToCopy = await db.card.findUnique({
      where: {
        id,
        list: {
          board: {
            orgId,
            id: boardId
          }
        }
      }
    })

    if (!cardToCopy) {
      return {
        error: 'Card not found',
      };
    }

    const lastCard = await db.card.findFirst({
      where: { listId: cardToCopy.listId },
      orderBy: { order: "desc" },
      select: { order: true }
    })

    const newOrder = lastCard ? lastCard.order + 1 : 1;

    card = await db.card.create({
      data: {
        title: `${cardToCopy.title} (Copy)`,
        listId: cardToCopy.listId,
        description: cardToCopy.description,
        order: newOrder + 1,
      },
      include: {
        list: true,
      },
    })

    await createAuditLog({
      entityTitle: card.title,
      entityId: card.id,
      entityType: EntityType.Card,
      action: Action.Create,
    })

  } catch (error) {
    return {
      error: `Failed to copt list`,
    }
  }
  revalidatePath(`/board/${boardId}`);
  return {
    data: card,
  };
}

export const copyCard = createSafeAction(copyCardSchema, handler);