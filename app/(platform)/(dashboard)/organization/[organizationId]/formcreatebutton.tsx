import { Button } from '@/components/ui/button';
import { useFormStatus } from 'react-dom';

export const FormCreateButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      Create
    </Button>
  );
};
