'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { useLocalStorage } from 'usehooks-ts';
import { useOrganization, useOrganizationList } from '@clerk/nextjs';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion } from '@/components/ui/accordion';

import { SideBarItem, Organization } from './sidebar-items';

// Accordion在切換organization，重新渲染後，Sidebar可能不會跟著Expand
// 所以用SideProps傳遞organization資訊紀錄目前選取的org
interface SidebarProps {
  storage?: string;
}

export const Sidebar = ({ storage = 'app-sidebar-state' }: SidebarProps) => {
  // storage props用來分離電腦版跟手機版 state
  // 追蹤哪個 organization 處於 Expand 狀態，重新整理也可以自動展開
  const [expanded, setExpanded] = useLocalStorage<Record<string, any>>(
    storage, // 鍵
    {} // 值，這裡的 {} 看起來會像{"organization-id,..."}
  );

  // {"organization-123": true} => ["organization-123"]
  // 會需要這樣做是因為 Accordion 的 defaultValue 需要 String[]
  const defaultAccordionValue: string[] = Object.keys(expanded).reduce(
    (acc: string[], key: string) => {
      if (expanded[key]) {
        // === true，代表 Expand
        acc.push(key);
      }
      return acc;
    },
    []
  );

  // : activeOrganization解構時重新命名(alias)
  const { organization: activeOrganization, isLoaded: isLoadedOrg } =
    useOrganization();

  const { userMemberships, isLoaded: isLoadedOrgList } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });

  const handleOnExpand = (id: string) => {
    setExpanded((currentValue) => ({
      ...currentValue,
      [id]: !expanded[id],
    }));
  };

  if (!isLoadedOrg || !isLoadedOrgList || userMemberships.isLoading) {
    return (
      <>
        <div className="flex items-center justify-between md-2">
          <Skeleton className="h-10 w-[50%]" />
          <Skeleton className="h-10 w-10" />
        </div>
        <div className="space-y-2 mt-4">
          <SideBarItem.Skeleton />
          <SideBarItem.Skeleton />
          <SideBarItem.Skeleton />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="font-medium text-xs flex items-center mb-1">
        <h3 className="pl-4">Workspace</h3>
        <Button
          asChild
          type="button"
          size="icon"
          variant="ghost"
          className="ml-auto" // 將該元素推到 flexbox 的右側
        >
          <Link href="select-org">
            <Plus className="h-4 w-3" />
          </Link>
        </Button>
      </div>
      <Accordion
        type="multiple"
        defaultValue={defaultAccordionValue}
        className="mt-4"
      >
        {userMemberships.data.map(({ organization }) => (
          // 在dashboard/_components階層自訂義 SidebarItem
          <SideBarItem
            key={organization.id}
            isActive={activeOrganization?.id === organization.id}
            isExpanded={expanded[organization.id]}
            organization={organization as Organization}
            onExpand={handleOnExpand}
          />
        ))}
      </Accordion>
    </>
  );
};
