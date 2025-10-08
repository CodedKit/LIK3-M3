
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

// =========================================================================
// INSTRUCTIE: Voeg hier de bestandsnamen van uw MP3's uit de
// 'public/music' map toe.
//
// Voorbeeld:
// const songFiles = [
//   'Hoping-Ab-Oz.mp3',
//   'Een-Ander-Nummer.mp3',
//   'Nog-Een-Nummer.mp3'
// ];
// =========================================================================
const songFiles: string[] = [
    'Hoping-Ab-Oz.mp3'
];

const defaultAlbumArt = PlaceHolderImages.find(img => img.id === 'default-album-art');

export const Playlist: Song[] = songFiles.map(file => {
    // Verwijder de .mp3 extensie en vervang streepjes door spaties voor een nette titel.
    const title = file.replace(/\.mp3$/, '').replace(/-/g, ' ');
    return {
        id: file,
        title: title,
        artist: 'Unknown Artist',
        audioSrc: `/music/${file}`,
        albumArt: defaultAlbumArt || null,
    };
});
