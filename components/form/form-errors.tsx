import { XCircle } from 'lucide-react';

interface FormErrorsProps {
  id: string;
  errors?: Record<string, string[] | undefined>;
}

export const FormErrors = ({ id, errors }: FormErrorsProps) => {
  return (
    <div className="flex items-center justify-between gap-2 text-sm text-rose-800">
      {errors?.[id]?.map((error: string) => (
        <div
          key={error}
          className="flex items-center font-medium p-2 border border-rose-800 bg-rose-500/10 rounded-sm"
        >
          <XCircle className="h-5 w-5 text-red-800" />
          {error}
        </div>
      ))}
    </div>
  );
};
