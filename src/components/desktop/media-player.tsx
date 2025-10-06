'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Circle, GripVertical, Play, SkipBack, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Playlist } from '@/lib/music';
import { Card } from '@/components/ui/card';

interface MediaPlayerProps {
    currentTrackIndex: number;
    setCurrentTrackIndex: (index: number) => void;
    onClose: () => void;
}

export default function MediaPlayer({ currentTrackIndex, setCurrentTrackIndex, onClose }: MediaPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(true);

  const currentTrack = Playlist[currentTrackIndex];

  const handleNext = () => {
    setCurrentTrackIndex((currentTrackIndex + 1) % Playlist.length);
  };

  const handlePrevious = () => {
    setCurrentTrackIndex((currentTrackIndex - 1 + Playlist.length) % Playlist.length);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  if (!currentTrack) {
    return null;
  }

  return (
    <div className="fixed bottom-14 left-1/2 -translate-x-1/2 w-full max-w-sm px-4">
        <Card className="flex items-center gap-3 p-2 bg-card/80 backdrop-blur-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
                    <Circle className="h-4 w-4 text-red-500 fill-current" />
                </Button>
                <GripVertical className="h-6 w-6" />
            </div>

            {currentTrack.albumArt && (
                <Image
                    src={currentTrack.albumArt.imageUrl}
                    alt={currentTrack.albumArt.description}
                    width={48}
                    height={48}
                    className="rounded-sm"
                    data-ai-hint={currentTrack.albumArt.imageHint}
                />
            )}

            <div className="flex-grow">
                <p className="font-semibold text-sm text-primary-foreground">{currentTrack.title}</p>
                <p className="text-xs text-muted-foreground">{currentTrack.artist}</p>
            </div>

            <div className="flex items-center gap-1 text-primary-foreground">
                <Button variant="ghost" size="icon" onClick={handlePrevious}>
                    <SkipBack className="h-5 w-5 fill-current" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handlePlayPause}>
                    <Play className="h-6 w-6 fill-current" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleNext}>
                    <SkipForward className="h-5 w-5 fill-current" />
                </Button>
            </div>
        </Card>
    </div>
  );
}
