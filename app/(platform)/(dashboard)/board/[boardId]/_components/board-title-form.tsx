'use client';

import { toast } from 'sonner';
import { FormInput } from '@/components/form/form-input';
import { Button } from '@/components/ui/button';
import { Board } from '@prisma/client';
import { ElementRef, useRef, useState } from 'react';

import { updateBoard } from '@/actions/update-board/handler';
import { useAction } from '@/hooks/use-action';

interface BoardTitleProps {
  data: Board;
}
export const BoardTitleForm = ({ data }: BoardTitleProps) => {
  const { execute } = useAction(updateBoard, {
    onSuccess: (data) => {
      toast.success(`Board ${data.title} changed!!`);
      setTitle(data.title);
      disabledEditing(); // 輸入完成後終止操作
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const formRef = useRef<ElementRef<'form'>>(null);
  const inputRef = useRef<ElementRef<'input'>>(null);

  const [title, setTitle] = useState(data.title);
  const [isEditing, setIsEditing] = useState(false);

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus(); // 輸入框成為當前的輸入目標
      inputRef.current?.select(); // 方便用戶直接輸入新內容而不需要手動刪除原始文字
    });
  };

  const disabledEditing = () => {
    setIsEditing(false);
  };

  const handleOnSubmit = (formData: FormData) => {
    const title = formData.get('title') as string;
    console.log(title, 'submitted');

    execute({ id: data.id, title });
  };

  // 使用者在沒有按下提交按鈕的情況下直接提交表單內容。
  const onBlur = () => {
    formRef.current?.requestSubmit();
  };

  if (isEditing) {
    return (
      <form
        action={handleOnSubmit}
        ref={formRef}
        className="flex items-center gap-x-2"
      >
        <FormInput
          ref={inputRef}
          id="title"
          onBlur={onBlur}
          defaultValue={title} // useState->title
          className="text-lg font-bold px-[7px] py-1 h-7 bg-transparent
          focus-visible:outline:none focus-visible:ring-transparent 
          border-none"
        />
      </form>
    );
  }

  return (
    <Button
      onClick={enableEditing}
      className="font-bold text-lg h-auto w-auto p-1 px-2"
      variant="transparent"
    >
      {title}
    </Button>
  );
};
