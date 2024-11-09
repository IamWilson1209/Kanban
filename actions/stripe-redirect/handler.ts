"use server"

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

import db from '@/lib/db';
import { createSafeAction } from '@/lib/create-safe-action';

import { InputType, ReturnType } from './types';
import { stripeRedirectSchema } from './schema';
import { createAuditLog } from '@/lib/create-audit-log';
import { Action, EntityType } from '@prisma/client';
import { absoluteUrl } from '@/lib/utils';

const handler = async (data: InputType): Promise<ReturnType> => {

  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return {
      error: 'User not authenticated',
    };
  }

  const settingsUrl = absoluteUrl(`/organization/${orgId}`)

  let url = ""

  console.log('jjj')

  try {
    const orgSubscription = await db.orgSubscription.findUnique({
      where: {
        orgId
      },
    })


  } catch (error) {

  }
}

export const stripeRedirect = createSafeAction(stripeRedirectSchema, handler);