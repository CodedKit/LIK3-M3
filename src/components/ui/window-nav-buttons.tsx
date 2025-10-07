
'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface WindowNavButtonsProps {
  onBack?: () => void;
  onForward?: () => void;
  canGoBack?: boolean;
  canGoForward?: boolean;
}

export function WindowNavButtons({ onBack, onForward, canGoBack, canGoForward }: WindowNavButtonsProps) {
  return (
    <div className="absolute left-16 top-1/2 -translate-y-1/2 flex items-center">
      <Button
        variant="ghost"
        size="icon"
        onClick={onBack}
        disabled={!canGoBack}
        className="h-6 w-6"
      >
        <ChevronLeft className={cn("h-5 w-5", !canGoBack && "text-muted-foreground")} />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onForward}
        disabled={!canGoForward}
        className="h-6 w-6"
      >
        <ChevronRight className={cn("h-5 w-5", !canGoForward && "text-muted-foreground")} />
      </Button>
    </div>
  );
}
