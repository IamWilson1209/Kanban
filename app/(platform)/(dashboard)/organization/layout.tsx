import { checkSubscription } from '@/lib/subscription';
import { Sidebar } from '../_components/sidebar';
import React from 'react';

const OrganizationLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const isPro = await checkSubscription();
  return (
    <main className="pt-20 md:pt-24 px-4 max-w-full min-h-screen mx-auto my-auto bg-zinc-800">
      <div className="flex gap-x-7">
        <div className="w-64 shrink-0 hidden md:block">
          <Sidebar isPro={isPro} />
        </div>
        {children}
      </div>
    </main>
  );
};

export default OrganizationLayout;
