'use client';

import { List } from '@prisma/client';
import { useAction } from '@/hooks/use-action';
import { deleteList } from '@/actions/delete-list/handler';
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { MoreHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormSubmitButton } from '@/components/form/form-submit-button';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useRef } from 'react';
import { copyList } from '@/actions/copy-list/handler';

interface ListOptionProps {
  data: List;
  onAddCard: () => void;
}

export const ListOptions = ({ data, onAddCard }: ListOptionProps) => {
  // 確保 popover close
  const closeRef = useRef<HTMLButtonElement>(null);

  const { execute: executeDelete } = useAction(deleteList, {
    onSuccess: (data) => {
      toast.success(`List ${data.title} was successfully deleted`);
      closeRef.current?.click(); // popover closes
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const { execute: executeCopy } = useAction(copyList, {
    onSuccess: (data) => {
      toast.success(`List ${data.title} was copied successfully`);
      closeRef.current?.click(); // popover closes
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const handleOnDelete = (formData: FormData) => {
    const id = formData.get('id') as string;
    const boardId = formData.get('boardId') as string;
    executeDelete({ id, boardId });
  };

  const handleOnCopy = (formData: FormData) => {
    const id = formData.get('id') as string;
    const boardId = formData.get('boardId') as string;
    executeCopy({ id, boardId });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="h-auto w-auto p-1.5" variant="ghost">
          <MoreHorizontal className="h-3 w-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="px-1 pt-2 pb-2" side="bottom" align="start">
        <div className="text-sm font-semibold text-center text-neutral-700 pb-4">
          List Option
        </div>
        <PopoverClose ref={closeRef} asChild>
          <Button
            className="h-auto w-auto p-1 absolute top-2 right-2
          text-balance"
            variant="ghost"
          >
            <X className="h-4 w-4" />
          </Button>
        </PopoverClose>
        <Button
          onClick={onAddCard}
          className="h-auto w-full rounded-none py-2 px-5 font-normal
          justify-center text-sm"
          variant="ghost"
        >
          Add Card
        </Button>
        <form action={handleOnCopy}>
          <button type="submit" className="hidden" />
          <input hidden id="id" name="id" value={data.id} />
          <input hidden id="boardId" name="boardId" value={data.boardId} />
          <FormSubmitButton
            className="h-auto w-full rounded-none py-2 px-5 font-normal
          justify-center text-sm"
            variant="ghost"
          >
            Copy List
          </FormSubmitButton>
        </form>
        <Separator />
        <form action={handleOnDelete}>
          <button type="submit" className="hidden" />
          <input hidden id="id" name="id" value={data.id} />
          <input hidden id="boardId" name="boardId" value={data.boardId} />
          <FormSubmitButton
            className="h-auto w-full rounded-none py-2 px-5 font-normal
          justify-center text-sm"
            variant="ghost"
          >
            Delete this List
          </FormSubmitButton>
        </form>
      </PopoverContent>
    </Popover>
  );
};
