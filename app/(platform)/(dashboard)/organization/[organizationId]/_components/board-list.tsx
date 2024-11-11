import { FormPopover } from '@/components/form/form-popover';
import { Hint } from '@/components/hint';
import { Skeleton } from '@/components/ui/skeleton';
import db from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { HelpCircle, Plus, UserPen } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { MAX_FREE_BOARDS } from '@/constants/board';
import { getAvailableCount } from '@/lib/org-limit';
import { checkSubscription } from '@/lib/subscription';

export const BoardList = async () => {
  const { orgId } = await auth();

  if (!orgId) {
    return redirect('/select-org');
  }

  const boards = await db.board.findMany({
    where: {
      orgId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const availableCount = await getAvailableCount();
  const isPro = await checkSubscription();

  return (
    <div className="space-y-4">
      <div className="flex items-center font-semibold text-lg text-zinc-200">
        <UserPen className="h-6 w-6 mr-2 text-zinc-100" />
        Your boards
      </div>
      {/* 響應式設計 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {boards.map((board) => (
          <Link
            key={board.id}
            href={`/board/${board.id}`}
            className="group relative aspect-video bg-no-repeat bg-center
            bg-cover rounded-2xl h-full w-full p-2 overflow-hidden hover:scale-105 "
            style={{ backgroundImage: `url(${board.imageThumbUrl})` }}
          >
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 hover:opacity-75 hover:scale-105 transition duration-300" />
            <p className="relative font-semibold text-white">{board.title}</p>
          </Link>
        ))}

        <FormPopover side="right" sideOffset={10}>
          <div
            role="button"
            className="bg-zinc-700 rounded-2xl relative h-full w-full flex flex-col gap-y-1 items-center justify-center hover:opacity-75 transition aspect-vedio
            hover:scale-105 duration-300"
          >
            <Plus className="pt-2 text-white" />
            <p className="text-xs text-white">Create New Boards</p>
            <span
              className={`text-xs ${
                isPro ? 'text-amber-400/80 font-extrabold' : 'text-white'
              }`}
            >
              {isPro
                ? 'Unlimited'
                : `${MAX_FREE_BOARDS - availableCount} remaining`}
            </span>
            <Hint
              side={'bottom'}
              sideOffset={10}
              description={`Free Workspace can have up to 5 open boards. For unlimited boards upgrade this workspace`}
            >
              <HelpCircle className="absolute buttom-2 right-2 h-4 w-4 text-white" />
            </Hint>
          </div>
        </FormPopover>
      </div>
    </div>
  );
};

BoardList.Skeleton = function SkeletonBoardList() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-colsp-4 gap-4">
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
    </div>
  );
};
