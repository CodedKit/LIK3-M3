
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
  audioSrc: string | null;
  albumArt: ImagePlaceholder | null;
};

const allMetadata = [metadataMoonracer, metadataEchoes, metadataStarlight];

const fallbackImage: ImagePlaceholder = {
    id: 'fallback-album-art',
    description: 'Fallback album art',
    imageUrl: 'https://placehold.co/48x48/101010/333333?text=404',
    imageHint: 'placeholder',
};

export const Playlist: Song[] = allMetadata.map(metadata => {
    const songId = metadata.id;
    const songFolder = metadata.title.toLowerCase().replace(/ /g, '-');
    
    let audioSrc = null;
    let imageSrc = null;

    try {
        audioSrc = require(`./music/${songFolder}/audio.mp3`).default;
    } catch (e) {
        console.warn(`Audio file not found for ${metadata.title}`);
    }

    try {
        imageSrc = require(`./music/${songFolder}/cover.jpg`).default;
    } catch (e) {
        console.warn(`Cover art not found for ${metadata.title}`);
    }

    return {
        ...metadata,
        audioSrc: audioSrc?.src || null,
        albumArt: imageSrc ? {
            id: `album-art-${songId}`,
            description: `Album art for ${metadata.title}`,
            imageUrl: imageSrc.src,
            imageHint: 'album cover'
        } : fallbackImage
    };
});
