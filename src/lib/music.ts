
'use client';

import { type ImagePlaceholder } from './placeholder-images';

// Import metadata from each song's directory
import metadataMoonracer from './music/moonracer/metadata.json';
import metadataEchoes from './music/echoes-in-the-dark/metadata.json';
import metadataStarlight from './music/starlight/metadata.json';

export type Song = {
  id: string;
  title: string;
  artist: string;
  audioSrc: string;
  albumArt: {
    id: string;
    description: string;
    imageUrl: string;
    imageHint: string;
  };
};

const allMetadata = [metadataMoonracer, metadataEchoes, metadataStarlight];

export const Playlist: Song[] = allMetadata.map(metadata => {
    const songFolder = metadata.title.toLowerCase().replace(/\s+/g, '-');
    
    return {
        ...metadata,
        audioSrc: `/music/${songFolder}/audio.mp3`,
        albumArt: {
            id: `album-art-${metadata.id}`,
            description: `Album art for ${metadata.title}`,
            imageUrl: `/music/${songFolder}/cover.jpg`,
            imageHint: 'album cover'
        }
    };
});
