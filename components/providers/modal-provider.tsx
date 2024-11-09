'use client';

import { CardModal } from '@/components/modals/card-modal';
import { useEffect, useState } from 'react';
import { ProModal } from '../modals/pro-modal';

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  // 防止 Hydration Error，只有在 useEffect 生效的時候才能確定是在client side
  useEffect(() => {
    setIsMounted(true);
  }, []);
  // 如果不是在client side，回傳 null
  if (!isMounted) {
    return null;
  }

  return (
    <>
      <CardModal />
      <ProModal />
    </>
  );
};
