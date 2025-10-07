
'use client';

import { useState } from 'react';
import { Volume2, Volume1, VolumeX } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { Button } from '../ui/button';

export default function VolumeControl() {
  const [volume, setVolume] = useState(50);

  const getVolumeIcon = () => {
    if (volume === 0) {
      return <VolumeX className="h-5 w-5" />;
    }
    if (volume < 50) {
      return <Volume1 className="h-5 w-5" />;
    }
    return <Volume2 className="h-5 w-5" />;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-auto w-auto p-0">
          {getVolumeIcon()}
        </Button>
      </PopoverTrigger>
      <PopoverContent side="top" className="w-auto p-2">
        <div className="h-32">
          <Slider
            defaultValue={[volume]}
            max={100}
            step={1}
            orientation="vertical"
            onValueChange={(value) => setVolume(value[0])}
            className="[&>span:first-child]:bg-white"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
