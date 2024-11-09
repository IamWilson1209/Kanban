"use server"

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

import db from '@/lib/db';
import { createSafeAction } from '@/lib/create-safe-action';

import { InputType, ReturnType } from './types';
import { updateCardSchema } from './schema';
import { createAuditLog } from '@/lib/create-audit-log';
import { Action, EntityType } from '@prisma/client';

const handler = async (data: InputType): Promise<ReturnType> => {

  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return {
      error: 'User not authenticated',
    };
  }

  const { id, boardId, ...values } = data; // board.id
  let card;

  try {
    card = await db.card.update({
      where: {
        id,
        list: {
          board: {
            orgId
          }
        },
      },
      data: {
        ...values,
      },
    })

    await createAuditLog({
      entityTitle: card.title,
      entityId: card.id,
      entityType: EntityType.Card,
      action: Action.Update,
    })
  } catch (error) {
    return {
      error: `Fail to update board`,
    }
  }

  revalidatePath(`/board/${boardId}`);
  return {
    data: card,
  };
}

export const updateCard = createSafeAction(updateCardSchema, handler);