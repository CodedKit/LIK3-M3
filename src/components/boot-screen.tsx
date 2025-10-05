'use client';

import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';

export default function BootScreen() {
  const [progress, setProgress] = useState(0);

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
      <div className="w-full max-w-md p-8 text-center">
        <h1 className="font-headline text-5xl font-bold text-primary-foreground mb-4">
          Virtual Temptations
        </h1>
        <Progress value={progress} className="h-2 w-full" />
        <p className="mt-2 text-sm text-muted-foreground">{progress}%</p>
      </div>
    </div>
  );
}
