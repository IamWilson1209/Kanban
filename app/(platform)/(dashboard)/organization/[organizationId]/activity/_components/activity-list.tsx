import db from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { ActivityItem } from '@/components/activity-item';

export const ActivityList = async () => {
  const { orgId } = await auth();
  if (!orgId) {
    redirect('/select-org');
  }

  const auditLogs = await db.auditLog.findMany({
    where: {
      orgId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <ol className="space-y-4 mt-4">
      <p className="hidden last:block text-xs text-center text-muted-foreground">
        Not Found
      </p>
      {auditLogs.map((auditLog) => (
        <ActivityItem key={auditLog.id} data={auditLog} />
      ))}
    </ol>
  );
};

ActivityList.Skeleton = function ActivityListSkeleton() {
  return (
    <ol className="space-y-4 mt-4">
      <Skeleton className="w-[80%] h-14" />
      <Skeleton className="w-[70%] h-14" />
      <Skeleton className="w-[60%] h-14" />
      <Skeleton className="w-[50%] h-14" />
      <Skeleton className="w-[40%] h-14" />
    </ol>
  );
};
