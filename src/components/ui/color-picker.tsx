
'use client';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Paintbrush } from 'lucide-react';
import { useMemo } from 'react';
import { ColorPopover } from './color-popover';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function ColorPicker({
  background,
  setBackground,
  className,
}: {
  background: string;
  setBackground: (background: string) => void;
  className?: string;
}) {
  const solids = [
    '#E2E2E2',
    '#ff75c3',
    '#ffa647',
    '#ffe83f',
    '#9fff5b',
    '#70e2ff',
    '#cd93ff',
    '#09203f',
  ];

  const gradients = [
    'linear-gradient(to top left,#accbee,#e7f0fd)',
    'linear-gradient(to top left,#d5d4d0,#d5d4d0,#eeeeec)',
    'linear-gradient(to top left,#000000,#434343)',
    'linear-gradient(to top left,#09203f,#537895)',
    'linear-gradient(to top left,#f2994a,#f2c94c)',
    'linear-gradient(to top left,#ee9ca7,#ffdde1)',
    'linear-gradient(to top left,#a6c1ee,#fbc2eb)',
    'linear-gradient(to top left,#8abd, #654ea3, #eaafc8)',
    'linear-gradient(to top left,#84fab0,#8fd3f4)',
    'linear-gradient(to top left,#a1c4fd,#c2e9fb)',
    'linear-gradient(to top left,#d4fc79,#96e6a1)',
    'linear-gradient(to top left,#fda085,#f6d365)',
  ];

  const images = PlaceHolderImages.filter(img => img.id.startsWith('desktop-bg-'));

  const defaultTab = useMemo(() => {
    if (background.includes('url') || background.includes('https')) return 'image';
    if (background.includes('gradient')) return 'gradient';
    return 'solid';
  }, [background]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-full justify-start text-left font-normal',
            !background && 'text-muted-foreground',
            className
          )}
        >
          <div className="flex w-full items-center gap-2">
            {background ? (
              <div
                className="h-4 w-4 rounded !bg-cover !bg-center transition-all"
                style={{ background }}
              ></div>
            ) : (
              <Paintbrush className="h-4 w-4" />
            )}
            <div className="flex-1 truncate">
              {background ? background : 'Pick a color'}
            </div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <ColorPopover
          background={background}
          setBackground={setBackground}
          solids={solids}
          gradients={gradients}
          images={images}
          defaultTab={defaultTab}
        />
      </PopoverContent>
    </Popover>
  );
}
