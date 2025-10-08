
'use client';

import { type ImagePlaceholder } from './placeholder-images';
import { PlaceHolderImages } from './placeholder-images';

// --- Dynamische Audio Imports ---
// Deze imports laden de audiobestanden direct vanuit de `src/lib/music` map.
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

const defaultAlbumArt = PlaceHolderImages.find(img => img.id === 'default-album-art');
if (!defaultAlbumArt) {
  throw new Error("Default album art with id 'default-album-art' not found in placeholder-images.json");
}

// Lijst van de basis bestandsnamen (zonder extensie)
const songBaseNames = [
  '21 inst mix ab oz',
  'bird inst mix ab oz',
  'brave education inst mix ab oz',
  'complete saves inst mix ab oz',
  'dirty ab oz',
  'GB3AD1300074',
  'GB3AD1300080',
  'hi hats ab oz',
  'hoping ab oz',
  'monkey man inst mix ab oz'
];

// Map de expliciete imports naar de basis bestandsnamen
const audioImports: { [key: string]: any } = {
  '21 inst mix ab oz': audio21Inst,
  'bird inst mix ab oz': audioBirdInst,
  'brave education inst mix ab oz': audioBraveEducation,
  'complete saves inst mix ab oz': audioCompleteSaves,
  'dirty ab oz': audioDirtyAbOz,
  'GB3AD1300074': audioGB3AD1300074,
  'GB3AD1300080': audioGB3AD1300080,
  'hi hats ab oz': audioHiHats,
  'hoping ab oz': audioHoping,
  'monkey man inst mix ab oz': audioMonkeyMan
};

// Functie om de bestandsnaam te formatteren naar een titel
const formatTitleFromFileName = (fileName: string): string => {
  return fileName
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const Playlist: Song[] = songBaseNames.map(baseName => {
  let metadata = { title: formatTitleFromFileName(baseName), artist: 'Unknown' };
  let coverImageSrc: string | undefined;

  // Poging 1: Probeer JSON metadata te laden
  try {
    const jsonData = require(`./music/${baseName}.json`);
    if (jsonData.title) metadata.title = jsonData.title;
    if (jsonData.artist) metadata.artist = jsonData.artist;
  } catch (e) {
    // JSON niet gevonden, gebruik de fallback (bestandsnaam) die al is ingesteld.
  }

  // Poging 2: Probeer de cover afbeelding te laden
  try {
    // require() geeft hier de bestands-URL terug, verwerkt door de loader.
    coverImageSrc = require(`./music/${baseName}.jpg`);
  } catch (e) {
    // JPG niet gevonden, coverImageSrc blijft undefined, dus fallback wordt gebruikt.
  }

  const audioSrc = audioImports[baseName]?.default?.src || audioImports[baseName];

  if (!audioSrc) {
    console.warn(`Audio source for '${baseName}' could not be resolved.`);
  }

  const albumArtImage: ImagePlaceholder = coverImageSrc
    ? {
        id: `cover-${baseName}`,
        imageUrl: coverImageSrc,
        description: `Album art for ${metadata.title}`,
        imageHint: 'album cover'
      }
    : defaultAlbumArt;

  return {
    id: baseName.replace(/\s+/g, '-'),
    title: metadata.title,
    artist: metadata.artist,
    audioSrc: audioSrc || null,
    albumArt: albumArtImage,
  };
});
