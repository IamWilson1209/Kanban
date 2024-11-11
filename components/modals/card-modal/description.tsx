'use client';

import { updateCard } from '@/actions/update-card/handler';
import { FormSubmitButton } from '@/components/form/form-submit-button';
import { FormTextarea } from '@/components/form/form-textarea';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAction } from '@/hooks/use-action';
import { CardWithLists } from '@/type';
import { useQueryClient } from '@tanstack/react-query';
import { AlignLeft } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { useEventListener, useOnClickOutside } from 'usehooks-ts';

interface DescriptionProps {
  data: CardWithLists;
}

export const Description = ({ data }: DescriptionProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const queryClient = useQueryClient();
  const params = useParams();

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      textAreaRef.current?.focus();
    });
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      disableEditing();
    }
  };

  useEventListener('keydown', onKeyDown);
  useOnClickOutside(formRef, disableEditing);

  const { execute, fieldErrors } = useAction(updateCard, {
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['card', data.id],
      });
      queryClient.invalidateQueries({
        queryKey: ['card-logs', data.id],
      });
      toast.success(`Description of Card ${data.title} has been updated`);
      queryClient.invalidateQueries({ queryKey: ['card', data.id] });
    },
    onError: (error) => {
      toast.error(`Failed to update card: ${error}`);
      disableEditing();
    },
  });

  const handleOnSubmit = (formData: FormData) => {
    const desc = formData.get('description') as string;
    const boardId = params.boardId as string;

    execute({
      id: data.id,
      boardId,
      description: desc,
    });
  };

  return (
    <div className="flex items gap-x-3 w-full">
      <AlignLeft className="h-4 w-4 mt-1" />
      <div className="w-full">
        <p className="text-neutral-700 font-semibold mt-0.5">Description</p>
        {isEditing ? (
          <form action={handleOnSubmit} ref={formRef} className="space-y-2">
            <FormTextarea
              id="description"
              className="w-full mt-2"
              placeholder="Add a description here..."
              defaultValue={data.description || undefined}
              errors={fieldErrors}
              ref={textAreaRef}
              onKeyDown={undefined}
            />
            <div className="flex items-center gap-x-2">
              <FormSubmitButton>Save</FormSubmitButton>
              <Button
                type="button"
                onClick={disableEditing}
                size="sm"
                variant="ghost"
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div
            onClick={enableEditing}
            role="button"
            className="w-full h-20 bg-gray-300 text-sm text-ellipsis pt-2 mt-2 px-2"
          >
            {data.description || 'Add detailed description...'}
          </div>
        )}
      </div>
      {/* {data.description} */}
    </div>
  );
};

Description.Skeleton = function DescriptionSkeleton() {
  return (
    <div className="flex items-center gap-x-3 w-full">
      <Skeleton className="h-6 w-6 bg-neutral-200" />
      <div className="w-full">
        <Skeleton className="h-6 w-24 mb-2 bg-neutral-200" />
        <Skeleton className="h-[76px] w-full bg-neutral-200" />
      </div>
    </div>
  );
};
