import Stripe from "stripe"
import { headers } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

import db from "@/lib/db"
import { stripe } from "@/lib/stripe"

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = (await headers()).get("Stripe-Signature") as string

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    return new NextResponse("Web hook error: ", { status: 400 })
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    )

    if (!session?.metadata?.orgId) {
      return new NextResponse("Missing organization ID", { status: 400 })
    }

    await db.orgSubscription.create({
      data: {
        orgId: session?.metadata?.orgId,
        subscriptionId: subscription.id,
        customerId: subscription.customer as string,
        priceId: subscription.items.data[0].price.id,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000)
      }
    })

    if (event.type === "invoice.payment_succeeded") {
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      )

      await db.orgSubscription.update({
        where: {
          subscriptionId: subscription.id,
        },
        data: {
          priceId: subscription.items.data[0].price.id,
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        }
      })
    }
  }
  return new NextResponse(null, { status: 200 })
}