"use server"

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

import db from '@/lib/db';
import { createSafeAction } from '@/lib/create-safe-action';

import { InputType, ReturnType } from './types';
import { deleteCardSchema } from './schema';
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
    card = await db.card.delete({
      where: {
        id,
        list: {
          board: {
            orgId,
            id: boardId,
          },
        },
      },
    });

    await createAuditLog({
      entityTitle: card.title,
      entityId: card.id,
      entityType: EntityType.Card,
      action: Action.Delete,
    })

    revalidatePath(`/board/${boardId}`);
    return {
      data: card,
    };
  } catch (error) {
    return {
      error: `Failed to delete`,
    }
  }
}

export const deleteCard = createSafeAction(deleteCardSchema, handler);