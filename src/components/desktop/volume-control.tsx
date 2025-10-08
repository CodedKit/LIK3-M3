
'use client';

import { useState, useEffect } from 'react';
import { Volume2, Volume1, VolumeX } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { Button } from '../ui/button';

interface VolumeControlProps {
  audioRef: React.RefObject<HTMLAudioElement>;
}

export default function VolumeControl({ audioRef }: VolumeControlProps) {
  const [volume, setVolume] = useState(50);

  // Set initial volume and listen for external changes
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const initialVolume = Math.round(audio.volume * 100);
      setVolume(initialVolume);

      const handleVolumeChange = () => {
        setVolume(Math.round(audio.volume * 100));
      };

      audio.addEventListener('volumechange', handleVolumeChange);
      return () => {
        audio.removeEventListener('volumechange', handleVolumeChange);
      };
    }
  }, [audioRef]);


  const handleVolumeChange = (newVolume: number[]) => {
    const volumeValue = newVolume[0];
    setVolume(volumeValue);
    if (audioRef.current) {
      audioRef.current.volume = volumeValue / 100;
    }
  };

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
            value={[volume]}
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
