'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useOrganizationList } from '@clerk/nextjs';

// 當用戶貼上另一個organization時，轉換到另一個organization url
export const OrgControl = () => {
  const params = useParams(); // 取得[organizationId]
  const { setActive } = useOrganizationList();

  useEffect(() => {
    if (!setActive) return;

    // 當 params.organizationId(url)改變時，重新執行 setActive，切換當前組織的狀態
    setActive({
      organization: params.organizationId as string,
    });
  }, [setActive, params.organizationId]);

  return null;
};
