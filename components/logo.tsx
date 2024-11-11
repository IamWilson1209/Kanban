import Image from 'next/image';
import Link from 'next/link';
import localFont from 'next/font/local';
import { cn } from '@/lib/utils';
import { appName } from '@/public/appName';

const headingFont = localFont({
  src: '../public/fonts/CalSans-SemiBold.woff2',
});

export const Logo = () => {
  return (
    <Link href="/">
      <div className="hover:opacity-75 transition item-center gap-x-2 hidden md:flex">
        <Image src="/logo.svg" alt="Logo" height={30} width={30} />
        <p
          className={cn('text-lg text-neutral-700 pt-1', headingFont.className)}
        >
          {appName}
        </p>
      </div>
    </Link>
  );
};
