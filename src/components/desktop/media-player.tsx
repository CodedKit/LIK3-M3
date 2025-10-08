
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Circle, GripVertical, Play, SkipBack, SkipForward, Pause, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Playlist } from '@/lib/music';
import { Card } from '@/components/ui/card';
import { useFavorites } from '@/hooks/use-favorites';
import { cn } from '@/lib/utils';

interface MediaPlayerProps {
    currentTrackIndex: number;
    setCurrentTrackIndex: (index: number) => void;
    onClose: () => void;
}

export default function MediaPlayer({ currentTrackIndex, setCurrentTrackIndex, onClose }: MediaPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { isFavorite, toggleFavorite } = useFavorites();

  const currentTrack = Playlist[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current && currentTrack?.audioSrc) {
      if (audioRef.current.src !== window.location.origin + currentTrack.audioSrc) {
          audioRef.current.src = currentTrack.audioSrc;
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            playPromise.then(() => {
              setIsPlaying(true);
            }).catch(error => {
              console.error("[MediaPlayer] Autoplay failed:", error);
              setIsPlaying(false);
            });
          }
      }
    }
  }, [currentTrackIndex, currentTrack?.audioSrc]);

  const handlePlayPause = useCallback(() => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current.play().catch(e => console.error("Play error:", e));
    } else {
      audioRef.current.pause();
    }
  }, []);
  
  const handleNext = useCallback(() => {
    const nextIndex = (currentTrackIndex + 1) % Playlist.length;
    setCurrentTrackIndex(nextIndex);
  }, [currentTrackIndex, setCurrentTrackIndex]);

  const handlePrevious = useCallback(() => {
    const prevIndex = (currentTrackIndex - 1 + Playlist.length) % Playlist.length;
    setCurrentTrackIndex(prevIndex);
  }, [currentTrackIndex, setCurrentTrackIndex]);

  if (!currentTrack) {
    return null;
  }
  
  const isCurrentSongFavorite = isFavorite(currentTrack.id);

  return (
    <div className="fixed bottom-20 md:bottom-14 left-1/2 -translate-x-1/2 w-full max-w-sm px-4 z-[60]">
        <audio 
          ref={audioRef} 
          onEnded={handleNext}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
        <Card className="flex items-center gap-3 p-2 backdrop-blur-sm bg-card/80">
            <div className="flex items-center gap-1 text-muted-foreground">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
                    <Circle className="h-4 w-4 text-red-500 fill-current" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 cursor-grab">
                    <GripVertical className="h-5 w-5" />
                </Button>
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
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => toggleFavorite(currentTrack.id)}
                >
                    <Heart className={cn("h-5 w-5", isCurrentSongFavorite ? "fill-red-500 text-red-500" : "")} />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handlePrevious}>
                    <SkipBack className="h-5 w-5 fill-current" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handlePlayPause} disabled={!currentTrack.audioSrc}>
                    {isPlaying ? <Pause className="h-6 w-6 fill-current" /> : <Play className="h-6 w-6 fill-current" />}
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleNext}>
                    <SkipForward className="h-5 w-5 fill-current" />
                </Button>
            </div>
        </Card>
    </div>
  );
}
