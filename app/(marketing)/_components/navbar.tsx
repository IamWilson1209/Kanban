import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { appName } from '@/public/appName';
import Link from 'next/link';

export const Navbar = () => {
  return (
    <div className="flex items-center fixed top-0 w-full h-14 px-4 border-b shadow-sm bg-zinc-900">
      <div className="mx-auto flex items-center w-full justify-between">
        <Logo />
        <div className="space-x-4 md:block md:w-auto flex items-center justify-between w-full">
          <Button size="sm" variant="blue" asChild>
            <Link href="/sign-in">Sign in</Link>
          </Button>
          <Button size="sm" variant="dark" asChild>
            <Link href="/sign-up">Get {appName} for free</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
