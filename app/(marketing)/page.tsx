import Link from 'next/link';
import localFont from 'next/font/local';
import { Poppins } from 'next/font/google';
import { Award, Star, ChartSpline } from 'lucide-react';
import Image from 'next/image';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { appName } from '@/public/appName';
import { Separator } from '@/components/ui/separator';

// 用來localFont設定頁面font格式，這裡練習用cal.com font
const headingFont = localFont({
  src: '../../public/fonts/CalSans-SemiBold.woff2',
});

// 用來localFont設定頁面font格式，這裡用Poppins字體
const textFont = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

const imageSize = {
  height: 100,
  width: 100,
};

const MarketingPage = () => {
  return (
    <div className="flex items-center justify-center flex-col">
      <div
        className={cn(
          'flex items-center justify-center flex-col',
          headingFont.className
        )}
      >
        <div className="flex items-center justify-center gap-x-5">
          <div
            className="flex items-center border-spacing-11 shadow-sm px-10 py-4 mb-10 bg-gradient-to-br
         from-gray-300 to-blue-900 text-white rounded-full uppercase hover:scale-105 transition-transform duration-300"
          >
            <Star className="h-6 w-6 mr-2" />
            No 1 app rated by aqqle
          </div>
          <div
            className="flex items-center border-spacing-11 shadow-sm px-10 py-4 mb-10 bg-gradient-to-br
         from-gray-300 to-blue-900 text-white rounded-full uppercase hover:scale-105 transition-transform duration-300"
          >
            <Award className="h-6 w-6 mr-2" />
            No 1 download app in 2030
          </div>
          <div
            className="flex items-center border-spacing-11 shadow-sm px-10 py-4 mb-10 bg-gradient-to-br
         from-gray-300 to-blue-900 text-white rounded-full uppercase hover:scale-105 transition-transform duration-300"
          >
            <ChartSpline className="h-6 w-6 mr-2" />
            No 1 usage app in 2030
          </div>
        </div>
        <h1 className="text-3xl md:text-6xl text-center text-neutral-800 mb-6 mt-10">
          {appName} helps team working with agility
        </h1>
        <div className="text-3xl md:text-6xl text-blue-800 px-4 p-2 rounded-md pb-2 w-fit">
          Let{"'"}s get started!!
        </div>
      </div>
      <div
        className={cn(
          'text-sm md:text-xl text-neutral-400 mt-4 max-w-xs md:max-w-2xl',
          textFont.className
        )}
      >
        Using this app to build a extraordinary scrum working environment for
        your team, easily track each project{"'"}s working status, responsiblity
        and deadline.
      </div>
      <div className="flex items-center">
        <Image
          src="/logo.svg"
          alt="Logo"
          height={imageSize.height}
          width={imageSize.width}
          className="hover:scale-110 transition-transform duration-300"
        />
        <Button
          className="mt-20 mb-20 font-semibold text-xl px-10 py-8"
          size="lg"
          asChild
          variant="dark"
        >
          <Link href="sign-up">Start {appName} for free</Link>
        </Button>
      </div>
      <Separator className="mt-10" />
      <h1 className="mt-10 text-2xl font-semibold">
        {appName} is made by following technologies...
      </h1>
      <div className="flex items-center mt-10 gap-x-10">
        <Image
          src="/nextjs-icon.svg"
          alt="Logo"
          height={imageSize.height}
          width={imageSize.width}
          className="hover:scale-110 transition-transform duration-300"
        />
        <Image
          src="/mysql-icon.svg"
          alt="Logo"
          height={imageSize.height}
          width={imageSize.width}
          className="hover:scale-110 transition-transform duration-300"
        />
        <Image
          src="/prisma-icon.svg"
          alt="Logo"
          height={imageSize.height}
          width={imageSize.width}
          className="hover:scale-110 transition-transform duration-300"
        />
        <Image
          src="/docker-icon.svg"
          alt="Logo"
          height={imageSize.height}
          width={imageSize.width}
          className="hover:scale-110 transition-transform duration-300"
        />
        <Image
          src="/clerk-icon.jpg"
          alt="Logo"
          height={imageSize.height}
          width={imageSize.width}
          className="hover:scale-110 transition-transform duration-300"
        />
      </div>
    </div>
  );
};
export default MarketingPage;
