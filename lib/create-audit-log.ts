import { auth, currentUser } from "@clerk/nextjs/server";
import { Action, EntityType } from "@prisma/client";
import { DevBundlerService } from "next/dist/server/lib/dev-bundler-service";
import db from "./db";

interface Props {
  entityId: string;
  entityType: EntityType;
  entityTitle: string;
  action: Action
}

export const createAuditLog = async (props: Props) => {
  try {
    const { userId, orgId } = await auth();
    const user = await currentUser();

    if (!user || !orgId) {
      return {
        error: 'User not authenticated',
      }
    }

    const { entityId, entityType, entityTitle, action } = props;

    await db.auditLog.create({
      data: {
        entityId,
        entityType,
        entityTitle,
        action,
        userId: user?.id,
        userImage: user?.imageUrl,
        userName: user?.firstName + ' ' + user?.lastName,
        orgId,
      },
    })

  } catch (error) {
    console.log("[AUDIT_LOG_ERROR]", error)
  }
}