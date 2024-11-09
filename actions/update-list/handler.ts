"use server"

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

import db from '@/lib/db';
import { createSafeAction } from '@/lib/create-safe-action';

import { InputType, ReturnType } from './types';
import { updateListSchema } from './schema';
import { createAuditLog } from '@/lib/create-audit-log';
import { Action, EntityType } from '@prisma/client';

const handler = async (data: InputType): Promise<ReturnType> => {

  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return {
      error: 'User not authenticated',
    };
  }

  const { id, title, boardId } = data; // board.id
  let list;

  try {
    list = await db.list.update({
      where: {
        id,
        boardId,
        board: {
          orgId,
        }
      },
      data: {
        title,
      },
    })

    await createAuditLog({
      entityTitle: list.title,
      entityId: list.id,
      entityType: EntityType.List,
      action: Action.Update,
    })
  } catch (error) {
    return {
      error: `Fail to update list`,
    }
  }

  revalidatePath(`/board/${boardId}`);
  return {
    data: list,
  };
}

export const updateList = createSafeAction(updateListSchema, handler);