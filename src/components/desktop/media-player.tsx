
'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import Image from 'next/image';
import { Circle, GripVertical, Play, SkipBack, SkipForward, Pause, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Playlist } from '@/lib/music';
import { Card } from '@/components/ui/card';
import { useFavorites } from '@/hooks/use-favorites';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-user-profile';

interface MediaPlayerProps {
    currentTrackIndex: number;
    setCurrentTrackIndex: (index: number) => void;
    onClose: () => void;
}

export default function MediaPlayer({ currentTrackIndex, setCurrentTrackIndex, onClose }: MediaPlayerProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { activeProfile } = useAuth();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const currentTrack = Playlist[currentTrackIndex];

  useEffect(() => {
    audioRef.current = new Audio();
    const audio = audioRef.current;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => handleNext();

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('pause', handlePause);
        audio.removeEventListener('ended', handleEnded);
        audio.pause();
        audio.src = '';
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Effect 1: Handles LOADING a new track when the index changes.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack?.audioSrc) return;

    if (audio.src !== window.location.origin + currentTrack.audioSrc) {
        audio.src = currentTrack.audioSrc;
        audio.load();
        audio.play().catch(e => console.error("Audio play failed on new track load", e));
    }
  }, [currentTrackIndex, currentTrack]);


  // Effect 2: Handles SYNCHRONIZING volume when settings change.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !activeProfile || !activeProfile.volumeSettings) return;

    const { master, music } = activeProfile.volumeSettings;
    const masterVolume = typeof master === 'number' ? master : 0;
    const musicVolume = typeof music === 'number' ? music : 0;
    const finalVolume = (masterVolume / 100) * (musicVolume / 100);
    audio.volume = finalVolume;

  }, [activeProfile?.volumeSettings]);


  const handlePlayPause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play().catch(e => console.error("Play error:", e));
    } else {
      audio.pause();
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
