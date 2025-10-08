
'use client';

import { type ImagePlaceholder } from './placeholder-images';

// Import metadata from each song's directory
import metadataMoonracer from './music/moonracer/metadata.json';
import metadataEchoes from './music/echoes-in-the-dark/metadata.json';
import metadataStarlight from './music/starlight/metadata.json';

// Import assets from each song's directory
import audioMoonracer from './music/moonracer/audio.mp3';
import imageMoonracer from './music/moonracer/cover.jpg';
import audioEchoes from './music/echoes-in-the-dark/audio.mp3';
import imageEchoes from './music/echoes-in-the-dark/cover.jpg';
import audioStarlight from './music/starlight/audio.mp3';
import imageStarlight from './music/starlight/cover.jpg';


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

const songAssets = {
    'song-1': { audio: audioMoonracer, image: imageMoonracer },
    'song-2': { audio: audioEchoes, image: imageEchoes },
    'song-3': { audio: audioStarlight, image: imageStarlight },
}

const allMetadata = [metadataMoonracer, metadataEchoes, metadataStarlight];

export const Playlist: Song[] = allMetadata.map(metadata => {
    // @ts-ignore
    const assets = songAssets[metadata.id];
    if (!assets) {
        throw new Error(`Could not find assets for song with id ${metadata.id}`);
    }
    
    return {
        ...metadata,
        audioSrc: assets.audio,
        albumArt: {
            id: `album-art-${metadata.id}`,
            description: `Album art for ${metadata.title}`,
            imageUrl: assets.image.src,
            imageHint: 'album cover'
        }
    };
});
