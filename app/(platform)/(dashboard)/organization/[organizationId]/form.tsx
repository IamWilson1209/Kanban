'use client';

// import { create } from '@/actions/create-board';
// import { useFormState } from 'react-dom';
import { createBoard } from '@/actions/create-board/handler';
import { FormInput } from '@/components/form/form-input';
import { useAction } from '@/hooks/use-action';
import { FormSubmitButton } from '@/components/form/form-submit-button';

export const SimpleForm = () => {
  // const initialState = { message: null, errors: {} };
  // const [state, dispatch] = useFormState(create, initialState);

  const { execute, fieldErrors } = useAction(createBoard, {
    onSuccess: (data) => {
      console.log('Success', data);
    },
    onError: (error) => {
      console.error('Error', error);
    },
  });

  const handleOnSubmit = (formData: FormData) => {
    const title = formData.get('title') as string;
    console.log({ title });
    execute({ title });
  };

  return (
    // dispatch -> handleOnSubmit
    <form action={handleOnSubmit}>
      <div className="flex flex-col space-y-2">
        <FormInput id="title" errors={fieldErrors} />
      </div>
      <FormSubmitButton>Create Board</FormSubmitButton>
    </form>
  );
};
