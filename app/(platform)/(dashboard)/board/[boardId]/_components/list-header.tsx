'use client';

import { useState, useRef } from 'react';
import { List } from '@prisma/client';
import { useEventListener } from 'usehooks-ts';
import { FormInput } from '@/components/form/form-input';
import { useAction } from '@/hooks/use-action';
import { updateList } from '@/actions/update-list/handler';
import { toast } from 'sonner';
import { ListOptions } from './list-options';

interface ListHeaderProps {
  data: List;
  onAddCard: () => void;
}

export const ListHeader = ({ data, onAddCard }: ListHeaderProps) => {
  const [title, setTitle] = useState(data.title);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  const { execute } = useAction(updateList, {
    onSuccess: (data) => {
      toast.success(`List ${data.title} updated successfully`);
      setTitle(data.title);
      disableEditing();
    },
    onError: (error) => {
      toast.error(`Failed to update list: ${error}`);
    },
  });

  const handleOnSubmit = (formData: FormData) => {
    const title = formData.get('title') as string;
    const id = formData.get('id') as string;
    const boardId = formData.get('boardId') as string;

    if (title === data.title) {
      disableEditing();
    }

    execute({ id, title, boardId });
  };

  const onBlur = () => {
    formRef.current?.requestSubmit();
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      formRef.current?.requestSubmit();
    }
  };

  useEventListener('keydown', onKeyDown);

  return (
    <div
      className="flex justify-between items-start gap-x-2 pt-2
     px-2 text-sm font-semibold"
    >
      {isEditing ? (
        <form ref={formRef} action={handleOnSubmit} className="flex-1 px-[2px]">
          <input hidden id="id" name="id" value={data.id} />
          <input hidden id="board" name="boardId" value={data.boardId} />
          <FormInput
            id="title"
            placeholder="Enter title"
            defaultValue={title}
            ref={inputRef}
            onBlur={onBlur}
            className="text-sm px-[7px] py-1 h-7 font-medium border-transparent
            hover:border-input focus:border-input transition truncate br-transparent focus:bg-white"
          />
          <button type="submit" hidden />
        </form>
      ) : (
        <div
          onClick={enableEditing}
          className="w-full text-sm px-2 py-1 h-7 font-medium
      border-transparent"
        >
          {title}
        </div>
      )}
      <ListOptions onAddCard={onAddCard} data={data} />
    </div>
  );
};
