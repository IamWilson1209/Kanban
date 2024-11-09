'use client';

import { useProModal } from '@/hooks/use-pro-model';
import { Dialog, DialogContent } from '../ui/dialog';
import Image from 'next/image';
import { Button } from '../ui/button';

export const ProModal = () => {
  const proModal = useProModal();

  return (
    <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
      <DialogContent className="max-w-md p-0">
        <div className="flex items-center justify-center aspect-vedio relative">
          <Image
            src="/vercel.svg"
            alt="Subscriptions"
            className="object-cover"
            fill
          />
        </div>
        <div className="text-neutral-700 mx-auto space-y-6 p-6">
          <h2 className="font-semibold text-xl">Upgrage to Pro!!</h2>
          <p className="text-xs font-semibold text-neutral-600">
            Explore the best Taskify
          </p>
          <div className="pl-3">
            <ul className="text-sm list-disc">
              <li>Unlimited boards</li>
              <li>Advanced checklists</li>
              <li>Admin and security features</li>
              <li>And more!!</li>
            </ul>
          </div>
          <Button className="w-full" variant="kanban">
            Upgrade
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
