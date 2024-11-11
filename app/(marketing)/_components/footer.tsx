import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const Footer = () => {
  return (
    <div className="fixed buttom-0 w-full p-5 border-t bg-zinc-900">
      <div className="mx-auto flex items-center w-full justify-between">
        <Logo />
        <div className="space-x-4 md:block md:w-auto flex items-center justify-between w-full">
          <Button size="sm" variant="ghost">
            <Link href="/sign-in">Privacy policy</Link>
          </Button>
          <Button size="sm" variant="ghost">
            <Link href="/sign-up">Terms of services</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
