'use client';

import Image from 'next/image';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Playlist } from '@/lib/music';

export default function MusicApp() {
  return (
    <div className="h-full w-full bg-background p-4">
      <div className="flex flex-col gap-2">
        {Playlist.map((song) => (
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
                data-ai-hint={song.albumArt.imageHint}
              />
            )}
            <div className="flex-grow">
              <p className="font-semibold text-primary-foreground">
                {song.title}
              </p>
              <p className="text-sm text-muted-foreground">{song.artist}</p>
            </div>
            <Button variant="ghost" size="icon">
              <Play className="h-5 w-5 fill-current" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
