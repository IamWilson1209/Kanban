import { Board } from '@prisma/client';
import { BoardTitleForm } from './board-title-form';
import { BoardOptions } from './board-options';

interface BoardNavBarProps {
  data: Board;
}

export const BoardNavBar = async ({ data }: BoardNavBarProps) => {
  return (
    <div className="flex items-center px-6 gap-x-4 text-white w-full h-14 z-[40] bg-black/50 fixed top-14">
      <BoardTitleForm data={data} />
      <div>
        <BoardOptions id={data.id} />
      </div>
    </div>
  );
};
