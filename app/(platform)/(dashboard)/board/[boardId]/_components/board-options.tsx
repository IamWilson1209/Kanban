'use client';

import { MoreHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { deleteBoard } from '@/actions/delete-board/handler';
import { useAction } from '@/hooks/use-action';
import { toast } from 'sonner';

interface BoardOptionsProps {
  id: string;
}

export const BoardOptions = ({ id }: BoardOptionsProps) => {
  const { execute, isLoading } = useAction(deleteBoard, {
    onError: (error) => {
      toast.error(error);
    },
  });

  const handleOnDelete = () => {
    execute({
      id,
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="h-auto w-auto p-2" variant="transparent">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="px-0 pt-3 pb-3" side="bottom" align="start">
        <div className="text-sm font-medium text-center text-neutral-600 pb-4">
          Board actions
        </div>
        <PopoverClose>
          <Button className="h-auto w-auto p-2 absolute right-1 top-1 text-neutral-300">
            <X className="h-3 w-3" />
          </Button>
        </PopoverClose>
        <Button
          variant="ghost"
          onClick={handleOnDelete}
          disabled={isLoading}
          className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
        >
          Delete Board
        </Button>
      </PopoverContent>
    </Popover>
  );
};
