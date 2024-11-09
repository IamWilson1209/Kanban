import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { FormTextarea } from '@/components/form/form-textarea';
import { FormSubmitButton } from '@/components/form/form-submit-button';
import { useAction } from '@/hooks/use-action';
import { createCard } from '@/actions/create-card/handler';
import { useRef, forwardRef, KeyboardEventHandler } from 'react';
import { useParams } from 'next/navigation';
import { useOnClickOutside, useEventListener } from 'usehooks-ts';
import { toast } from 'sonner';

interface CardFormProps {
  listId: string;
  isEditing: boolean;
  enableEditing: () => void;
  disableEditing: () => void;
}

export const CardForm = forwardRef<HTMLTextAreaElement, CardFormProps>(
  ({ listId, isEditing, enableEditing, disableEditing }, ref) => {
    const params = useParams();
    const formRef = useRef<HTMLFormElement>(null);

    const { execute, fieldErrors } = useAction(createCard, {
      onSuccess: (data) => {
        toast.success(`Card ${data.title} created successfully`);
        disableEditing();
        formRef.current?.reset(); // 重置ref的表單
      },
      onError: (error) => {
        toast.error(`Failed to create card: ${error}`);
      },
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        disableEditing();
      }
    };

    // 監聽點擊事件，使用者在表單以外的地方點擊，會觸發 disableEditing()
    useOnClickOutside(formRef, disableEditing);

    // 監聽鍵盤 keydown 事件，確保在任何情況下，Escape 狀態都會取消編輯
    useEventListener('keydown', onKeyDown);

    // 監聽文本區域的 onKeyDown (Enter) 事件
    const onTextareakeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (
      event
    ) => {
      // 當使用者按下 Enter 鍵且沒有按 Shift 鍵時
      // 觸發 formRef.current?.requestSubmit() 來提交表單
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        formRef.current?.requestSubmit();
      }
    };

    const handleOnSubmit = (formData: FormData) => {
      const title = formData.get('title') as string;
      const listId = formData.get('listId') as string;
      const boardId = params.boardId as string;

      execute({ title, listId, boardId });
    };

    if (isEditing) {
      return (
        <form
          ref={formRef}
          action={handleOnSubmit}
          className="m-1 py-0.5 px-1 space-y-4"
        >
          <FormTextarea
            id="title"
            onKeyDown={onTextareakeyDown}
            ref={ref}
            placeholder="Enter a title..."
            errors={fieldErrors}
          />
          <input hidden id="listId" name="listId" value={listId} />
          <div className="flex items-center gap-x-1">
            <FormSubmitButton>Add Card</FormSubmitButton>
          </div>
          <Button onClick={disableEditing} size="sm" variant="ghost">
            <X className="gap-x-0.5" />
            Cancel
          </Button>
        </form>
      );
    }

    return (
      <div className="pt-2 px-2">
        <Button
          onClick={enableEditing}
          className="justify-end h-auto w-full px-2 py-2 text-sm text-muted-foreground"
          size="sm"
          variant="ghost"
        >
          <Plus />
          Add a card
        </Button>
      </div>
    );
  }
);

CardForm.displayName = 'CardForm';
