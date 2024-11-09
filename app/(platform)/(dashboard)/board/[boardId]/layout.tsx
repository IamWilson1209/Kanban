import db from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { notFound, redirect } from 'next/navigation';
import { BoardNavBar } from './_components/board-navbar';

// 顯示頁面 title 用
export async function generateMetadata({
  params,
}: {
  params: { boardId: string };
}) {
  const { orgId } = await auth();

  if (!orgId) {
    return {
      title: 'Board',
    };
  }

  const board = await db.board.findUnique({
    where: {
      id: params.boardId,
      orgId,
    },
  });

  return { title: board?.title || 'Board' };
}

// server component 可以直接解構 params
const BoardIdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { boardId: string };
}) => {
  const { orgId } = await auth();

  if (!orgId) {
    redirect('/select-org');
  }

  const board = await db.board.findUnique({
    where: {
      id: params.boardId,
      orgId,
    },
  });

  if (!board) {
    notFound();
  }

  return (
    <div
      className="relative h-full bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: `url(${board.imageFullUrl})` }}
    >
      <BoardNavBar data={board} />
      {/* 調深背景顏色 */}
      <div className="absolute inset-0 bg-black/20" />
      <main className="relative pt-28 h-full">{children}</main>
    </div>
  );
};

export default BoardIdLayout;
