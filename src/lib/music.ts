
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

// --- EENVOUDIGE CONFIGURATIE ---
// Voeg hier de bestandsnamen van je MP3's toe die in de `public/music` map staan.
// De code doet de rest.
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


// --- FALLBACKS & STANDAARDWAARDEN ---

// Haal de standaard albumhoes op.
const defaultAlbumArt = PlaceHolderImages.find(img => img.id === 'default-album-art');
if (!defaultAlbumArt) {
  throw new Error("Standaard albumhoes 'default-album-art' niet gevonden in placeholder-images.json");
}

// Functie om een titel te maken van een bestandsnaam (als JSON ontbreekt).
const formatTitleFromFileName = (fileName: string): string => {
  return fileName
    .replace(/ ab oz/g, ' (Ab-Oz)') // Specifieke artiestennaam netjes maken
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// --- PLAYLIST OPBOUWEN ---

// Maak de playlist aan op basis van de lijst met bestandsnamen.
// OPMERKING: Deze aanpak laadt geen externe JSON of JPG bestanden tijdens de build.
// Het bouwt de playlist op met directe links naar de `public` map.
// Als je in de toekomst de metadata dynamisch wilt laden, kan dit in de component zelf met `fetch`.
export const Playlist: Song[] = songBaseNames.map(baseName => {
  const audioSrc = `/music/${baseName}.mp3`;

  // Voor nu gebruiken we de fallbacks, omdat we niet kunnen builden met dynamische `require`.
  const title = formatTitleFromFileName(baseName);
  const artist = baseName.includes('ab oz') ? 'Ab-Oz' : 'Unknown Artist';
  
  // We gebruiken de standaard albumhoes als fallback.
  // Een geavanceerdere implementatie zou in de component zelf kunnen proberen de JPG te fetchen.
  const albumArtImage: ImagePlaceholder = defaultAlbumArt;

  return {
    id: baseName.replace(/\s+/g, '-'),
    title: title,
    artist: artist,
    audioSrc: audioSrc,
    albumArt: albumArtImage,
  };
});
