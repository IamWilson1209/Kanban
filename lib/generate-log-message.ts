import { Action, AuditLog } from "@prisma/client"

export const generateLogMessage = (log: AuditLog) => {
  const { action, entityTitle, entityType } = log;

  switch (action) {
    case Action.Create:
      return `Create ${entityType.toLowerCase()} "${entityTitle}"`;
    case Action.Update:
      return `Update ${entityType.toLowerCase()} "${entityTitle}"`;
    case Action.Delete:
      return `Delete ${entityType.toLowerCase()} "${entityTitle}"`;
    default:
      return `Unknown action ${entityType.toLowerCase()} "${entityTitle}`;
  }
}