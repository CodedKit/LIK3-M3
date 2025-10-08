
'use client';

import { type ImagePlaceholder } from './placeholder-images';
import { PlaceHolderImages } from './placeholder-images';

export type Song = {
  id: string;
  title: string;
  artist: string;
  audioSrc: string | null;
  albumArt: ImagePlaceholder | null;
};

// This list now reflects the actual files in the `public/music` directory.
const songFiles = [
    'Hoping-Ab-Oz.mp3'
];

const defaultAlbumArt = PlaceHolderImages.find(img => img.id === 'default-album-art');

export const Playlist: Song[] = songFiles.map(file => {
    const title = file.replace('.mp3', '').replace(/-/g, ' ');
    return {
        id: file,
        title: title,
        artist: 'Unknown Artist',
        audioSrc: `/music/${file}`,
        albumArt: defaultAlbumArt || null,
    };
});
