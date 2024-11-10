'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

import db from '@/lib/db';
import { createSafeAction } from '@/lib/create-safe-action';

import { InputType, ReturnType } from './types';
import { createBoardSchema } from './schema';
import { Action, EntityType } from '@prisma/client';
import { createAuditLog } from '@/lib/create-audit-log';
import { hasAvailableCount, incrementAvailableCount } from '@/lib/org-limit';
import { checkSubscription } from '@/lib/subscription';

const handler = async (data: InputType): Promise<ReturnType> => {

  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return {
      error: 'User not authenticated',
    };
  }

  const availableBoardToCreate = await hasAvailableCount();
  const isPro = await checkSubscription();

  if (!availableBoardToCreate && !isPro) {
    return {
      error: 'No available free boards to create, Please update to create more',
    };
  }

  const { title, image } = data;

  // 依據|分割
  const [imageId, imageThumbUrl, imageFullUrl, imageLinkHTML, imageUserName] =
    image.split('|');

  if (
    !imageId ||
    !imageThumbUrl ||
    !imageFullUrl ||
    !imageLinkHTML ||
    !imageUserName
  ) {
    return {
      error: 'Missing fields, Failed to create board',
    };
  }

  let board;

  try {
    board = await db.board.create({
      data: {
        title,
        orgId,
        imageId,
        imageThumbUrl,
        imageFullUrl,
        imageLinkHTML,
        imageUserName,
      },
    });

    if (!isPro) {
      await incrementAvailableCount();
    }

    await createAuditLog({
      entityTitle: board.title,
      entityId: board.id,
      entityType: EntityType.Board,
      action: Action.Create,
    });
  } catch (error) {
    // console.error('Error creating board:', error); // 打印完整錯誤物件
    return {
      error: `Failed to create board`,
    };
  }

  revalidatePath(`/board/${board.id}`);
  return {
    data: board,
  };
};

export const createBoard = createSafeAction(createBoardSchema, handler);
