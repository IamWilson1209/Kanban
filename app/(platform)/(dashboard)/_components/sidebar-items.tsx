'use client';

import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation'; // 記得不要用next/router，已經不能用了

import { cn } from '@/lib/utils';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Activity, CreditCard, Layout, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export type Organization = {
  id: string;
  slug: string;
  imageUrl: string;
  name: string;
};

interface SideBarItemsProps {
  isPro: boolean;
  isExpanded: boolean;
  isActive: boolean;
  organization: Organization;
  onExpand: (id: string) => void; // 接收 id 參數，類型為 string，沒有回傳值 void
}

export const SideBarItem = ({
  isExpanded,
  isActive,
  organization,
  onExpand,
  isPro,
}: SideBarItemsProps) => {
  const router = useRouter();
  const pathname = usePathname();

  // 自訂義多個路由的陣列
  const sidebarItemsRoutes = [
    {
      label: 'Boards',
      icon: <Layout className="h-4 w-4 mr-2" />,
      href: `/organization/${organization.id}`,
    },
    {
      label: 'Activity',
      icon: <Activity className="h-4 w-4 mr-2" />,
      href: `/organization/${organization.id}/activity`,
    },
    {
      label: 'Settings',
      icon: <Settings className="h-4 w-4 mr-2" />,
      href: `/organization/${organization.id}/settings`,
    },
    {
      label: 'Billing',
      icon: <CreditCard className="h-4 w-4 mr-2" />,
      href: `/organization/${organization.id}/billing`,
    },
  ];

  const handleOnClink = (href: string) => {
    router.push(href);
  };

  return (
    <AccordionItem value={organization.id} className="border-none">
      <AccordionTrigger
        onClick={() => onExpand(organization.id)}
        className={cn(
          'text-neutral-400 font-bold flex items-center gap-x-2 p-1.5 rounded-md hover:bg-neutral-400/10 transition text-start no-underline hover:no-underline',
          isActive && !isExpanded && 'bg-neutral-500/10 text-slate-200',
          isActive && isPro && 'text-amber-400/80'
        )}
      >
        <div className="flex items-center gap-x-2">
          <div className="w-6 h-6 relative">
            <Image
              fill
              src={organization.imageUrl}
              alt="Organization"
              className="rounded-sm object-cover"
            />
          </div>
          <span className="font-semibold text-balance">
            {isPro && isActive
              ? organization.name + ' ' + '- premium'
              : organization.name}
          </span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pt-1 text-neutral-700">
        {sidebarItemsRoutes.map((route) => {
          return (
            <Button
              key={route.href}
              size="icon"
              onClick={() => handleOnClink(route.href)}
              className={cn(
                'w-full font-medium justify-start pl-10 mb-1 text-zinc-400',
                pathname === route.href &&
                  'bg-slate-600/10 text-zinc-300 font-semibold'
              )}
              variant="ghost"
            >
              {route.icon}
              {route.label}
            </Button>
          );
        })}
      </AccordionContent>
    </AccordionItem>
  );
};

// shadcn 加 skeleton 就是這麼簡單，笑死
SideBarItem.Skeleton = function SkeletonNavItem() {
  return (
    <div className="flex items-center justify-content gap-x-2">
      <div className="w-10 h-10 relative shrink-0">
        <Skeleton className="h-full w-full absolute" />
      </div>
      <Skeleton className="h-10 w-full" />
    </div>
  );
};
