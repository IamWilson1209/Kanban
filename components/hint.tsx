import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import React from 'react';

interface HintProps {
  children: React.ReactNode;
  description: string;
  side?: 'left' | 'right' | 'top' | 'bottom';
  sideOffset?: number;
}

export const Hint = ({
  children,
  description,
  side = 'bottom',
  sideOffset = 10,
}: HintProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent
          sideOffset={sideOffset}
          side={side}
          className="text-xs max-w-[220px] break-words"
        >
          {description}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
