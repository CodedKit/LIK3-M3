
'use client';

import { type ImagePlaceholder } from './placeholder-images';
import { PlaceHolderImages } from './placeholder-images';

// Import metadata from each song's directory
import metadataHopingAbOz from './music/hoping-ab-oz/metadata.json';

// Import media assets. Webpack will handle these imports and provide a URL.
import audioHopingAbOz from './music/hoping-ab-oz/audio.mp3';
import imageHopingAbOz from './music/hoping-ab-oz/cover.jpg';


export type Song = {
  id: string;
  title: string;
  artist: string;
  audioSrc: string | null;
  albumArt: ImagePlaceholder | null;
};

// Find the default album art from the placeholder images
const defaultAlbumArt = PlaceHolderImages.find(img => img.id === 'default-album-art') || null;

const songData = [
  {
    id: 'hoping-ab-oz',
    metadata: metadataHopingAbOz,
    audioSrc: audioHopingAbOz,
    albumArtSrc: imageHopingAbOz,
  },
  // To add a new song:
  // 1. Create a new folder in `src/lib/music/` (e.g., `my-new-song`).
  // 2. Add `audio.mp3`, `cover.jpg`, and `metadata.json` to that folder.
  // 3. Import the files here and add a new object to this `songData` array.
];


export const Playlist: Song[] = songData.map(data => {
  const albumArtImage = data.albumArtSrc ? {
      id: `album-art-${data.id}`,
      description: `Album art for ${data.metadata.title}`,
      imageUrl: data.albumArtSrc,
      imageHint: `album art`
  } : defaultAlbumArt;
  
  return {
    id: data.id,
    title: data.metadata.title,
    artist: data.metadata.artist,
    audioSrc: data.audioSrc,
    albumArt: albumArtImage,
  };
});
