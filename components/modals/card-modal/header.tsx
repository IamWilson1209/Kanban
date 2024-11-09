'use client';

import { updateCard } from '@/actions/update-card/handler';
import { FormInput } from '@/components/form/form-input';
import { Skeleton } from '@/components/ui/skeleton';
import { useAction } from '@/hooks/use-action';
import { CardWithLists } from '@/type';
import { useQueryClient } from '@tanstack/react-query';
import { Layout } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

interface HeaderProps {
  data: CardWithLists;
}

export const Header = ({ data }: HeaderProps) => {
  const { execute } = useAction(updateCard, {
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['card', data.id],
      });
      queryClient.invalidateQueries({
        queryKey: ['card-logs', data.id],
      });
      toast.success(`Rename to ${data.title}`);
      setTitle(data.title);
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const queryClient = useQueryClient();
  const params = useParams();
  const inputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(data.title);

  const onBlur = () => {
    inputRef.current?.form?.requestSubmit();
  };

  const handleOnSubmit = (formData: FormData) => {
    const title = formData.get('title') as string;
    const boardId = params.boardId as string;
    if (title === data.title) {
      return;
    }
    execute({
      boardId,
      id: data.id,
      title,
    });
  };

  return (
    <div className="flex items-start gap-x-3 mb-6 w-full">
      <Layout className="h-5 w-5 mt-1 text-neutral-600" />
      <div className="w-full">
        <form action={handleOnSubmit}>
          <FormInput
            id="title"
            defaultValue={title}
            className="font-semibold text-xl px-1 text-neutral-700
            bg-transparent border-transparent relative -left-1.5 w-[95%]
            focus-visible:bg-white focus-visible:border-input md-0.5
            truncate"
            ref={inputRef}
            onBlur={onBlur}
          />
        </form>
        <p className="text-sm text-muted-foreground">
          in list <span className="underline">{data.list.title}</span>
        </p>
      </div>
    </div>
  );
};

Header.Skeleton = function HeaderSkeleton() {
  return (
    <div className="flex items-start gap-x-3 mb-6 w-full">
      <Skeleton className="h-6 w-6 mt-1 bg-neutral-200" />
      <div>
        <Skeleton className="h-6 w-24 mb-1 bg-neutral-200" />
        <Skeleton className="h-4 w-12 bg-neutral-200" />
      </div>
    </div>
  );
};
