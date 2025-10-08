
'use client';

import { useState, useEffect, useRef } from 'react';
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
  const [isPlaying, setIsPlaying] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { isFavorite, toggleFavorite } = useFavorites();

  const currentTrack = Playlist[currentTrackIndex];

  console.log(`[MediaPlayer Render] Index: ${currentTrackIndex}, isPlaying: ${isPlaying}, Track: ${currentTrack?.title}`);

  // Effect to load and play a new track when the index changes
  useEffect(() => {
    console.log('[Effect Load Track] Triggered. currentTrackIndex:', currentTrackIndex);
    if (audioRef.current && currentTrack?.audioSrc) {
      console.log('[Effect Load Track] audioRef exists. Loading new src:', currentTrack.audioSrc);
      audioRef.current.src = currentTrack.audioSrc;
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("[Effect Load Track] Audio play failed:", error);
          setIsPlaying(false);
        });
      }
    } else {
        console.warn('[Effect Load Track] audioRef or audioSrc is missing.', { hasAudioRef: !!audioRef.current, hasAudioSrc: !!currentTrack?.audioSrc });
    }
  }, [currentTrack]); // Only re-run when the track itself changes

  const handlePlayPause = () => {
    console.log('[handlePlayPause] Clicked. Current isPlaying state:', isPlaying);
    if (!audioRef.current) {
        console.error('[handlePlayPause] audioRef is null, cannot play/pause.');
        return;
    };

    if (audioRef.current.paused) {
      console.log('[handlePlayPause] It was paused, calling play().');
      audioRef.current.play().catch(e => console.error("[handlePlayPause] Play error:", e));
    } else {
      console.log('[handlePlayPause] It was playing, calling pause().');
      audioRef.current.pause();
    }
    // We let the onPlay/onPause events handle the state update
  };
  
  const handleNext = () => {
    console.log('[handleNext] Clicked.');
    const nextIndex = (currentTrackIndex + 1) % Playlist.length;
    setCurrentTrackIndex(nextIndex);
  };

  const handlePrevious = () => {
    console.log('[handlePrevious] Clicked.');
    const prevIndex = (currentTrackIndex - 1 + Playlist.length) % Playlist.length;
    setCurrentTrackIndex(prevIndex);
  };

  if (!currentTrack) {
    console.error('[MediaPlayer Render] No currentTrack found for index:', currentTrackIndex);
    return null;
  }
  
  const isCurrentSongFavorite = isFavorite(currentTrack.id);

  return (
    <div className="fixed bottom-14 left-1/2 -translate-x-1/2 w-full max-w-sm px-4">
        <audio 
          ref={audioRef} 
          onEnded={() => {
            console.log('[Audio Event] onEnded');
            handleNext();
          }} 
          onPlay={() => {
            console.log('[Audio Event] onPlay - setting isPlaying to true');
            setIsPlaying(true);
          }}
          onPause={() => {
            console.log('[Audio Event] onPause - setting isPlaying to false');
            setIsPlaying(false);
          }}
        />
        <Card className="flex items-center gap-3 p-2 backdrop-blur-sm">
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
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => {
                      console.log('[Favorite Button] Clicked.');
                      toggleFavorite(currentTrack.id);
                  }}
                >
                    <Heart className={cn("h-5 w-5", isCurrentSongFavorite ? "fill-red-500 text-red-500" : "")} />
                </Button>
                <Button variant="ghost" size="icon" onClick={handlePrevious}>
                    <SkipBack className="h-5 w-5 fill-current" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handlePlayPause} disabled={!currentTrack.audioSrc}>
                    {isPlaying ? <Pause className="h-6 w-6 fill-current" /> : <Play className="h-6 w-6 fill-current" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={handleNext}>
                    <SkipForward className="h-5 w-5 fill-current" />
                </Button>
            </div>
        </Card>
    </div>
  );
}
