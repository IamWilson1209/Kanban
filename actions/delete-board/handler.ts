"use server"

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

import db from '@/lib/db';
import { createSafeAction } from '@/lib/create-safe-action';

import { InputType, ReturnType } from './types';
import { deleteBoardSchema } from './schema';
import { redirect } from 'next/navigation';
import { createAuditLog } from '@/lib/create-audit-log';
import { Action, EntityType } from '@prisma/client';
import { decreaseAvailableCount } from '@/lib/org-limit';

const handler = async (data: InputType): Promise<ReturnType> => {

  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return {
      error: 'User not authenticated',
    };
  }

  const { id } = data; // board.id
  let board;

  try {
    board = await db.board.delete({
      where: {
        id,
        orgId,
      },
    })

    await decreaseAvailableCount()

    await createAuditLog({
      entityTitle: board.title,
      entityId: board.id,
      entityType: EntityType.Board,
      action: Action.Delete,
    })
  } catch (error) {
    return {
      error: `Failed to delete board`,
    }
  }

  revalidatePath(`/organization/${orgId}`); // 先重新刷新再redirect
  redirect(`/organization/${orgId}`)
}

export const deleteBoard = createSafeAction(deleteBoardSchema, handler);