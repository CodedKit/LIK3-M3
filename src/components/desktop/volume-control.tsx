
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Volume2, Volume1, VolumeX } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { Button } from '../ui/button';
import { useAuth } from '@/hooks/use-auth';

export default function VolumeControl() {
  const { activeProfile, updateProfile } = useAuth();
  
  const masterVolume = useMemo(() => activeProfile?.volumeSettings?.master ?? 80, [activeProfile]);

  const handleVolumeChange = useCallback((newVolume: number[]) => {
    if (activeProfile) {
      const volumeValue = newVolume[0];
      const newSettings = {
        ...activeProfile.volumeSettings,
        master: volumeValue,
      };
      // @ts-ignore
      updateProfile(activeProfile.id, { volumeSettings: newSettings });
    }
  }, [activeProfile, updateProfile]);

  const getVolumeIcon = () => {
    if (masterVolume === 0) {
      return <VolumeX className="h-5 w-5" />;
    }
    if (masterVolume < 50) {
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
            value={[masterVolume]}
            max={100}
            step={1}
            orientation="vertical"
            onValueChange={handleVolumeChange}
            className="[&>span:first-child]:bg-white"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
