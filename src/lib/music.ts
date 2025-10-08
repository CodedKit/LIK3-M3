
'use client';

import { type ImagePlaceholder } from './placeholder-images';
import { PlaceHolderImages } from './placeholder-images';

// --- Automatische Import van Alle Nummers ---
// De volgende imports laden de audiobestanden direct vanuit de `src/lib/music` map.
// Webpack zal deze verwerken en er correcte URLs van maken.

import audio21Inst from './music/21 inst mix ab oz.mp3';
import audioBirdInst from './music/bird inst mix ab oz.mp3';
import audioBraveEducation from './music/brave education inst mix ab oz.mp3';
import audioCompleteSaves from './music/complete saves inst mix ab oz.mp3';
import audioDirtyAbOz from './music/dirty ab oz.mp3';
import audioGB3AD1300074 from './music/GB3AD1300074.mp3';
import audioGB3AD1300080 from './music/GB3AD1300080.mp3';
import audioHiHats from './music/hi hats ab oz.mp3';
import audioHoping from './music/hoping ab oz.mp3';
import audioMonkeyMan from './music/monkey man inst mix ab oz.mp3';


export type Song = {
  id: string;
  title: string;
  artist: string;
  audioSrc: string | null;
  albumArt: ImagePlaceholder | null;
};

// De standaard albumhoes die wordt gebruikt als er geen specifieke hoes is.
const defaultAlbumArt = PlaceHolderImages.find(img => img.id === 'default-album-art');

// Helper functie om een titel te maken van een bestandsnaam.
// bv. "brave education inst mix ab oz.mp3" -> "Brave Education Inst Mix Ab Oz"
const formatTitleFromFileName = (fileName: string): string => {
  return fileName
    .replace('.mp3', '')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// De lijst met nummers, nu direct gekoppeld aan de geïmporteerde bestanden.
const songData: { id: string, file: any, artist: string }[] = [
  { id: '21-inst-mix', file: audio21Inst, artist: 'Ab Oz' },
  { id: 'bird-inst-mix', file: audioBirdInst, artist: 'Ab Oz' },
  { id: 'brave-education', file: audioBraveEducation, artist: 'Ab Oz' },
  { id: 'complete-saves', file: audioCompleteSaves, artist: 'Ab Oz' },
  { id: 'dirty-ab-oz', file: audioDirtyAbOz, artist: 'Ab Oz' },
  { id: 'gb3ad1300074', file: audioGB3AD1300074, artist: 'Unknown' },
  { id: 'gb3ad1300080', file: audioGB3AD1300080, artist: 'Unknown' },
  { id: 'hi-hats', file: audioHiHats, artist: 'Ab Oz' },
  { id: 'hoping-ab-oz', file: audioHoping, artist: 'Ab Oz' },
  { id: 'monkey-man', file: audioMonkeyMan, artist: 'Ab Oz' },
];

// De uiteindelijke playlist die de app gebruikt.
export const Playlist: Song[] = songData.map(data => {
  // Haal de bestandsnaam op uit het pad dat door Webpack wordt gegenereerd.
  const fileName = data.file.split('/').pop();

  return {
    id: data.id,
    title: formatTitleFromFileName(fileName),
    artist: data.artist,
    audioSrc: data.file,
    albumArt: defaultAlbumArt || null, // Gebruik altijd de standaard albumhoes.
  };
});
