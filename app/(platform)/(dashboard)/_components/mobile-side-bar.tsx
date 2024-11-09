'use client';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useMobileSideBar } from '@/hooks/use-mobile-sidebar';
import { Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Sidebar } from './sidebar';

export const MobileSideBar = () => {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  const onOpen = useMobileSideBar((state) => state.onOpen);
  const onClose = useMobileSideBar((state) => state.onClose);
  const isOpen = useMobileSideBar((state) => state.isOpen);

  // 只有useEffect可以確保component是在client side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // pathname改變，自動關閉sidebar
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  // 如果不是在client side iteration，跳過
  if (!isMounted) {
    return null;
  }

  // 如果是在client side，渲染
  return (
    <>
      <Button
        onClick={onOpen}
        className="block md:hidden"
        variant="ghost"
        size="sm"
      >
        <Menu className="h-4 w-4" />
      </Button>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="p-2 pt-10">
          <Sidebar storage="app-sidebar-mobile-state" />
        </SheetContent>
      </Sheet>
    </>
  );
};
