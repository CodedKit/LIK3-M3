
'use client';

import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useAudio } from '@/context/audio-context';

interface BootScreenProps {
    onSkip: () => void;
}

export default function BootScreen({ onSkip }: BootScreenProps) {
  const [progress, setProgress] = useState(0);
  const { playSound } = useAudio();

  useEffect(() => {
    playSound('/sounds/reactos-boot-85864.mp3', 'effects');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 28); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-background animate-in fade-in duration-500">
      <div className="flex flex-col items-center">
        <h1 className="font-headline text-2xl font-bold text-primary-foreground mb-4">
          LIK3 M3
        </h1>
        <div className="w-full text-center">
            <Progress value={progress} className="h-1 w-full" />
            <p className="mt-2 text-[8px] text-muted-foreground">{progress}%</p>
        </div>
      </div>
      <Button onClick={onSkip} variant="link" className="absolute bottom-10 text-xs text-muted-foreground">
        Skip
      </Button>
    </div>
  );
}
