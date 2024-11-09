import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { EntityType } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { cardId: string } }) {
  try {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const auditLogs = await db.auditLog.findMany({
      where: {
        orgId,
        entityType: EntityType.Card,
        entityId: params.cardId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 3
    })

    return NextResponse.json(auditLogs)
  } catch (error) {
    return new NextResponse("Internal error", { status: 500 })
  }
}