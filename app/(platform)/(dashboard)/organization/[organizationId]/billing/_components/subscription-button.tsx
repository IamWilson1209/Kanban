'use client';

import { stripeRedirect } from '@/actions/stripe-redirect/handler';
import { useProModal } from '@/hooks/use-pro-model';
import { Button } from '@/components/ui/button';
import { useAction } from '@/hooks/use-action';
import { toast } from 'sonner';

interface SubscriptionButtonProps {
  isPro: boolean;
}

export const SubscriptionButton = ({ isPro }: SubscriptionButtonProps) => {
  const proModal = useProModal();

  const { execute, isLoading } = useAction(stripeRedirect, {
    onSuccess: (data) => {
      window.location.href = data;
    },
    onError: (error) => {
      toast.error('Failed to subscribe. Please try againnn.');
    },
  });

  const handleOnClick = () => {
    if (isPro) {
      execute({});
    } else {
      proModal.onOpen();
    }
  };

  return (
    <div>
      <Button onClick={handleOnClick} variant="kanban" disabled={isLoading}>
        {isPro ? 'Manage Subscription' : 'Upgrade to Premium'}
      </Button>
    </div>
  );
};
