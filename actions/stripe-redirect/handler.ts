/* eslint-disable @typescript-eslint/no-unused-vars */
"use server"

import { auth, currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

import db from '@/lib/db';
import { createSafeAction } from '@/lib/create-safe-action';

import { InputType, ReturnType } from './types';
import { stripeRedirectSchema } from './schema';
import { absoluteUrl } from '@/lib/utils';
import { stripe } from '@/lib/stripe';

const handler = async (data: InputType): Promise<ReturnType> => {

  const user = currentUser();
  const { userId, orgId } = await auth();
  if (!userId || !orgId || !user) {
    return {
      error: 'User not authenticated',
    };
  }

  const settingsUrl = absoluteUrl(`/organization/${orgId}`)

  let url = ""

  try {
    const orgSubscription = await db.orgSubscription.findUnique({
      where: {
        orgId
      },
    })

    if (orgSubscription && orgSubscription.customerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: orgSubscription.customerId,
        return_url: settingsUrl,
      })

      url = stripeSession.url;
    } else {
      const stripeSession = await stripe.checkout.sessions.create({
        success_url: settingsUrl,
        cancel_url: settingsUrl,
        payment_method_types: ["card"],
        mode: "subscription",
        billing_address_collection: "auto",
        // customer_email: user.emailAddresses[0].emailAddress,
        line_items: [
          {
            price_data: {
              currency: "TWD",
              product_data: {
                name: "Pro mode",
                description: "Unlimited boards for our ordanization"
              },
              unit_amount: 2000, // $20
              recurring: {
                interval: "month"
              }
            },
            quantity: 1,
          }
        ],
        metadata: {
          orgId
        }
      })
      url = stripeSession.url || ""
    }
  } catch (error) {
    console.log(error)
    return {
      error: "Something went wrong, please try again"
    }
  }

  revalidatePath(`/organization/${orgId}`)
  return {
    data: url,
  }
}

export const stripeRedirect = createSafeAction(stripeRedirectSchema, handler);