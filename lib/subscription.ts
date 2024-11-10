import db from "./db";
import { auth } from "@clerk/nextjs/server";


const DAY_IN_MS = 84_400_000;

export const checkSubscription = async () => {
  const { orgId } = await auth()
  if (!orgId) {
    return {
      error: 'User not authenticated',
    }
  }

  const orgSubscription = await db.orgSubscription.findUnique({
    where: {
      orgId
    },
    select: {
      subscriptionId: true,
      currentPeriodEnd: true,
      customerId: true,
      priceId: true
    }
  })

  if (!orgSubscription) {
    return false;
  }

  const isValid = orgSubscription.priceId && orgSubscription.currentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now()
  return !!isValid; // 確保返回布林值
}