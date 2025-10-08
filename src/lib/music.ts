
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
    // Construct the path based on the convention: src/lib/music/{song-title-folder}/
    // The public path will be /_next/static/music/{file}
    // This requires a custom webpack config in next.config.ts to handle mp3/jpg files.
    const songFolder = metadata.title.toLowerCase().replace(/\s+/g, '-');
    
    return {
        ...metadata,
        // These paths will be handled by the file-loader in next.config.ts
        audioSrc: `/music/${songFolder}/audio.mp3`,
        albumArt: {
            id: `album-art-${metadata.id}`,
            description: `Album art for ${metadata.title}`,
            imageUrl: `/music/${songFolder}/cover.jpg`,
            imageHint: 'album cover'
        }
    };
});
