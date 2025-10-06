'use client';

import Image from 'next/image';
import { Circle, GripVertical, Play, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card } from '@/components/ui/card';

export default function MediaPlayer() {
  const albumArt = PlaceHolderImages.find(img => img.id === 'album-art-1');

  return (
    <div className="fixed bottom-14 left-1/2 -translate-x-1/2 w-full max-w-sm px-4">
        <Card className="flex items-center gap-3 p-2 bg-card/80 backdrop-blur-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
                <Circle className="h-4 w-4 text-red-500 fill-current" />
                <GripVertical className="h-6 w-6" />
            </div>

            {albumArt && (
                <Image
                src={albumArt.imageUrl}
                alt={albumArt.description}
                width={48}
                height={48}
                className="rounded-sm"
                data-ai-hint={albumArt.imageHint}
                />
            )}

            <div className="flex-grow">
                <p className="font-semibold text-sm text-primary-foreground">Moonracer</p>
                <p className="text-xs text-muted-foreground">Tommi Waring</p>
            </div>

            <div className="flex items-center gap-1 text-primary-foreground">
                <Button variant="ghost" size="icon">
                <Play className="h-6 w-6 fill-current" />
                </Button>
                <Button variant="ghost" size="icon">
                <SkipForward className="h-5 w-5 fill-current" />
                </Button>
            </div>
        </Card>
    </div>
  );
}
