import { startCase } from 'lodash';
import { OrgControl } from './_components/org-control';
import { auth } from '@clerk/nextjs/server';

// 顯示頁面title，[org.name]
// 顯示資訊從 app/layout->title->template抓
export async function generateMetadata() {
  const { orgSlug } = await auth();
  return {
    title: startCase(orgSlug || 'organization'),
  };
}

const OrganizationIdLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <OrgControl />
      {children}
    </>
  );
};

export default OrganizationIdLayout;
