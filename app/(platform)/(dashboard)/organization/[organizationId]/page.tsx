import { Separator } from '@/components/ui/separator';
import { Info } from './_components/info';
import { BoardList } from './_components/board-list';
import { Suspense } from 'react';
import { checkSubscription } from '@/lib/subscription';

const OrganizationPage = async () => {
  const isPro = await checkSubscription();
  return (
    <div className="w-full mb-20">
      <Info isPro={isPro}></Info>
      <Separator className="my-4" />
      <div className="px-2 md:px-4">
        {/* 等待資源時（e.g. 資料載入），顯示「佔位符」來提升用戶體驗。 */}
        <Suspense fallback={<BoardList.Skeleton />}>
          <BoardList />
        </Suspense>
      </div>
    </div>
  );
};

export default OrganizationPage;
