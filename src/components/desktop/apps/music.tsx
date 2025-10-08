
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Playlist, type Song } from '@/lib/music';
import { eventManager } from '@/lib/event-manager';

interface MusicAppProps {
  onPlayTrack: (trackIndex: number) => void;
}

export default function MusicApp({ onPlayTrack }: MusicAppProps) {
  const [currentPlaylist, setCurrentPlaylist] = useState<Song[]>(Playlist);

  useEffect(() => {
    const handleMetadataChange = (payload: { songId: string; title?: string; artist?: string }) => {
      setCurrentPlaylist(prevPlaylist =>
        prevPlaylist.map(song => {
          if (song.id === payload.songId) {
            return {
              ...song,
              title: payload.title || song.title,
              artist: payload.artist || song.artist,
            };
          }
          return song;
        })
      );
    };

    const unsubscribe = eventManager.on('musicMetadataChanged', handleMetadataChange);

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="h-full w-full bg-background p-4">
      <div className="flex flex-col gap-2">
        {currentPlaylist.map((song, index) => (
          <div
            key={song.id}
            className="flex items-center gap-4 rounded-lg p-2 transition-colors hover:bg-white/10"
          >
            {song.albumArt && (
              <Image
                src={song.albumArt.imageUrl}
                alt={song.albumArt.description}
                width={48}
                height={48}
                className="rounded-sm"
                style={{ width: 'auto', height: 'auto' }}
                data-ai-hint={song.albumArt.imageHint}
              />
            )}
            <div className="flex-grow">
              <p className="font-semibold text-primary-foreground">
                {song.title}
              </p>
              <p className="text-sm text-muted-foreground">{song.artist}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => onPlayTrack(index)}>
              <Play className="h-5 w-5 fill-current" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
