"use server"

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

import db from '@/lib/db';
import { createSafeAction } from '@/lib/create-safe-action';

import { InputType, ReturnType } from './types';
import { deleteListSchema } from './schema';
import { redirect } from 'next/navigation';
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
    list = await db.list.delete({
      where: {
        id,
        boardId,
        board: {
          orgId,
        }
      },
    })

    await createAuditLog({
      entityTitle: list.title,
      entityId: list.id,
      entityType: EntityType.List,
      action: Action.Delete,
    })
  } catch (error) {
    return {
      error: `Failed to delete board`,
    }
  }

  revalidatePath(`/board/${boardId}`);
  return {
    data: list,
  };
}

export const deleteList = createSafeAction(deleteListSchema, handler);