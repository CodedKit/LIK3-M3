'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

export const WindowCloseButton = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Close
    ref={ref}
    className={cn(
      'absolute left-4 top-1/2 -translate-y-1/2 rounded-sm opacity-100 ring-offset-background transition-opacity focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground',
      className
    )}
    {...props}
  >
    <Circle className="h-4 w-4 text-red-500 fill-current" />
    <span className="sr-only">Close</span>
  </DialogPrimitive.Close>
));
WindowCloseButton.displayName = 'WindowCloseButton';
