
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Circle, GripVertical, Play, SkipBack, SkipForward, Pause } from 'lucide-react';
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
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = Playlist[currentTrackIndex];
  console.log(`[MediaPlayer Render] Index: ${currentTrackIndex}, isPlaying: ${isPlaying}, Track: ${currentTrack?.title}`);


  // Effect 1: Handles loading a new track
  useEffect(() => {
    console.log('[Effect 1: Load Track] Triggered. Current track:', currentTrack?.title);
    if (audioRef.current && currentTrack?.audioSrc) {
        console.log('[Effect 1: Load Track] Loading new src:', currentTrack.audioSrc);
        audioRef.current.src = currentTrack.audioSrc;
        if (isPlaying) {
            console.log('[Effect 1: Load Track] Attempting to play new track.');
            audioRef.current.play().catch(e => console.error("[Effect 1: Load Track] Audio play failed on new track load", e));
        }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack]); // This effect ONLY runs when the track changes.

  // Effect 2: Handles toggling play/pause for the CURRENT track
  useEffect(() => {
    console.log(`[Effect 2: Play/Pause] Triggered. isPlaying: ${isPlaying}`);
    if (audioRef.current) {
        if (isPlaying) {
            console.log('[Effect 2: Play/Pause] Calling play().');
            audioRef.current.play().catch(e => console.error("[Effect 2: Play/Pause] Audio play failed on toggle", e));
        } else {
            console.log('[Effect 2: Play/Pause] Calling pause().');
            audioRef.current.pause();
        }
    }
  }, [isPlaying]); // This effect ONLY runs when isPlaying state changes.

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
        <audio ref={audioRef} onEnded={handleNext} />
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
