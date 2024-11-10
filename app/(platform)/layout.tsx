import { ModalProvider } from '@/components/providers/modal-provider';
import { QueryProvider } from '@/components/providers/query-provider';
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from 'sonner';
import React from 'react';

// 聽說 clerk 有 static page 問題？所以註冊自己先獨立出來，不放在global layout
const PlatformLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider>
      {/* 還是可以在client component渲染server component */}
      <QueryProvider>
        <Toaster />
        <ModalProvider />
        {children}
      </QueryProvider>
    </ClerkProvider>
  );
};
export default PlatformLayout;
