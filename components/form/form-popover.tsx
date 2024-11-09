'use client';

import React, { ElementRef, useRef } from 'react';
import { X } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverClose,
} from '@/components/ui/popover';
import { Button } from '../ui/button';
import { useAction } from '@/hooks/use-action';
import { createBoard } from '@/actions/create-board/handler';
import { FormInput } from '@/components/form/form-input';
import { FormSubmitButton } from '@/components/form/form-submit-button';
import { toast } from 'sonner';
import { FormPicker } from './form-picker';
import { useRouter } from 'next/navigation';
import { useProModal } from '@/hooks/use-pro-model';

interface FormPopoverProps {
  children: React.ReactNode;
  side?: 'left' | 'right' | 'top' | 'bottom';
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
}

export const FormPopover = ({
  children,
  side = 'bottom',
  align,
  sideOffset = 10,
}: FormPopoverProps) => {
  const proModal = useProModal();
  const router = useRouter();
  const closeRef = useRef<ElementRef<'button'>>(null);
  const { execute, fieldErrors } = useAction(createBoard, {
    onSuccess: (data) => {
      toast.success('Board created!!');
      closeRef.current?.click(); // 創建成功後自動關閉(PopoverClose)
      router.push(`/board/${data.id}`);
    },
    onError: (error) => {
      toast.error(error);
      proModal.onOpen();
    },
  });

  const handleOnSubmit = (formData: FormData) => {
    const title = formData.get('title') as string;
    const image = formData.get('image') as string;
    execute({ title, image });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        align={align}
        side={side}
        className="w-80 pt-3"
        sideOffset={sideOffset}
      >
        <div className="text-sm font-medium text-center text-neutral-600 pb-4">
          Create Board
        </div>
        <PopoverClose ref={closeRef} asChild>
          <Button
            className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-700"
            variant="ghost"
          >
            <X className="h-6 w-6 text-neutral-400" />
          </Button>
        </PopoverClose>
        <form className="space-y-4" action={handleOnSubmit}>
          <div className="space-y-4">
            <FormPicker
              id="image" // 對應 form-picker 的 html input
              errors={fieldErrors}
            />
            <FormInput
              id="title"
              label="Board title"
              type="text"
              errors={fieldErrors}
            />
          </div>
          <FormSubmitButton className="w-full">Create board</FormSubmitButton>
        </form>
      </PopoverContent>
    </Popover>
  );
};
