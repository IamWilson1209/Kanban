'use client';

import { copyCard } from '@/actions/copy-card/handler';
import { deleteCard } from '@/actions/delete-card/handler';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAction } from '@/hooks/use-action';
import { CardWithLists } from '@/type';
import { Copy, Trash } from 'lucide-react';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { useCardModal } from '@/hooks/use-card-model';

interface ActionsProps {
  data: CardWithLists;
}

export const Actions = ({ data }: ActionsProps) => {
  const CardModal = useCardModal();
  const { execute: executeCopyCard, isLoading: isLoadingCopy } = useAction(
    copyCard,
    {
      onSuccess: (data) => {
        toast.success(`Card "${data.title}" has copied to your clipboard`);
        CardModal.onClose();
      },
      onError: (error) => {
        toast.error(`Failed to copy card "${data.title}": ${error}`);
      },
    }
  );
  const { execute: executeDeleteCard, isLoading: isLoadingDelete } = useAction(
    deleteCard,
    {
      onSuccess: (data) => {
        toast.success(`Card "${data.title}" has deleted`);
        CardModal.onClose();
      },
      onError: (error) => {
        toast.error(`Failed to copy card "${data.title}": ${error}`);
      },
    }
  );

  const params = useParams();

  const onCopyCard = () => {
    const boardId = params.boardId as string;
    executeCopyCard({
      boardId,
      id: data.id,
    });
  };

  const onDeleteCard = () => {
    const boardId = params.boardId as string;
    executeDeleteCard({
      boardId,
      id: data.id,
    });
  };

  return (
    <div className="space-y-2 mt-1">
      <p className="text-base font-semibold">Actions</p>
      <Button
        onClick={onCopyCard}
        disabled={isLoadingCopy}
        variant="gray"
        className="w-full justify-start"
        size="inline"
      >
        <Copy className="h-4 w-4 mr-2" /> Copy
      </Button>
      <Button
        onClick={onDeleteCard}
        disabled={isLoadingDelete}
        variant="gray"
        className="w-full justify-start"
        size="inline"
      >
        <Trash className="h-4 w-4 mr-2" /> Delete
      </Button>
    </div>
  );
};

Actions.Skeleton = function ActionSkeleton() {
  return (
    <div className="space-y-2 mt-2">
      <Skeleton className="h-4 w-20 bg-neutral-200" />
      <Skeleton className="h-6 w-full mb-2 bg-neutral-200" />
      <Skeleton className="h-[76px] w-full bg-neutral-200" />
    </div>
  );
};
