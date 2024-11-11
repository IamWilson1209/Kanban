import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { OrganizationSwitcher, UserButton } from '@clerk/nextjs';
import { Plus } from 'lucide-react';
import { MobileSideBar } from './mobile-side-bar';
import { FormPopover } from '@/components/form/form-popover';
import { checkSubscription } from '@/lib/subscription';

export const Navbar = async () => {
  const isPro = await checkSubscription();
  return (
    <nav className="fixed z-50 top-0 px-4 w-full h-14 border-b shadow-sm bg-zinc-900 flex items-center">
      <MobileSideBar />
      <div className="flex items-center gap-x-4">
        <div className="hidden md:flex">
          <Logo />
        </div>
        <FormPopover align="start" side="bottom" sideOffset={18}>
          <Button
            size="sm"
            className="rounded-sm hidden md:block h-auto py-1.5 px-2"
            variant="dark"
          >
            Create
          </Button>
        </FormPopover>
        <FormPopover>
          <Button size="sm" className="rounded-sm block md:hidden">
            <Plus className="h-4 w-4"></Plus>
          </Button>
        </FormPopover>
      </div>
      <div className="ml-auto flex items-center ">
        <OrganizationSwitcher
          hidePersonal
          afterCreateOrganizationUrl="/organization/:id"
          afterLeaveOrganizationUrl="/select-org"
          afterSelectOrganizationUrl="/organization/:id"
          appearance={{
            elements: {
              rootBox: {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              },
            },
          }}
        />
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: {
                height: 30,
                width: 30,
                borderRadius: '50%',
                overflow: 'hidden',
              },
            },
          }}
        />
      </div>
    </nav>
  );
};
