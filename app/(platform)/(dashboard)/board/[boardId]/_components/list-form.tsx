'use client';

import { Plus, X } from 'lucide-react';
import { ListWrapper } from './list-wrapper';
import { useState, useRef, KeyboardEvent } from 'react';
import { useEventListener, useOnClickOutside } from 'usehooks-ts';
import { FormInput } from '@/components/form/form-input';
import { useParams, useRouter } from 'next/navigation';
import { FormSubmitButton } from '@/components/form/form-submit-button';
import { Button } from '@/components/ui/button';
import { createList } from '@/actions/create-list/handler';
import { useAction } from '@/hooks/use-action';
import { toast } from 'sonner';

export const ListForm = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState<boolean>(false);

  const params = useParams();
  const router = useRouter();

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    });
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  const { execute, fieldErrors } = useAction(createList, {
    onSuccess: (data) => {
      toast.success(`List ${data.title} created successfully`);
      disableEditing();
      router.refresh();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      disableEditing();
    }
  };

  useEventListener('keydown', onKeyDown);
  useOnClickOutside(formRef, disableEditing);

  const handleOnSubmit = (formData: FormData) => {
    const title = formData.get('title') as string;
    const boardId = formData.get('boardId') as string;

    execute({ title, boardId });
  };

  if (isEditing) {
    return (
      <ListWrapper>
        <form
          ref={formRef}
          className="w-full p-3 rounded-md bg-white space-y-4 shadow-md"
          action={handleOnSubmit}
        >
          <FormInput
            id="title"
            ref={inputRef}
            errors={fieldErrors}
            className="text-sm px-2 py-1 h-7 font-medium border-transparent 
            hover:border-input focus:border-input transition"
            placeholder="Enter title"
          />
          <input
            // 偷偷把params傳遞的好方法
            hidden
            value={params.boardId}
            name="boardId"
          />
          <div className="flex items-center gap-x-1">
            <FormSubmitButton>AddList</FormSubmitButton>
            <Button onClick={disableEditing} size="sm" variant="ghost">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </form>
      </ListWrapper>
    );
  }

  return (
    <ListWrapper>
      {/* <form action="" className="w-full p-3 bg-white space-y-4 shadow-md"> */}
      <button
        onClick={enableEditing}
        className="flex items-center w-full rounded bg-white/90 hover:bg-white/50 transition 
          p-3 font-normal text-ellipsis"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add a List
      </button>
      {/* </form> */}
    </ListWrapper>
  );
};
