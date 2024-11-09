"use server"

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

import db from '@/lib/db';
import { createSafeAction } from '@/lib/create-safe-action';

import { InputType, ReturnType } from './types';
import { updateBoardSchema } from './schema';
import { createAuditLog } from '@/lib/create-audit-log';
import { Action, EntityType } from '@prisma/client';

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    return {
      error: 'User not authenticated',
    };
  }

  const { id, title } = data; // board.id
  let board;

  try {
    board = await db.board.update({
      where: {
        id,
        orgId,
      },
      data: {
        title,
      },
    })

    await createAuditLog({
      entityTitle: board.title,
      entityId: board.id,
      entityType: EntityType.Board,
      action: Action.Update,
    })
  } catch (error) {
    return {
      error: `Fail to update board`,
    }
  }

  revalidatePath(`/board/${id}`);
  return {
    data: board,
  };
}

export const updateBoard = createSafeAction(updateBoardSchema, handler);