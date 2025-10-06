import data from './music.json';
import { PlaceHolderImages, type ImagePlaceholder } from './placeholder-images';

export type Song = {
  id: string;
  title: string;
  artist: string;
  albumArtId: string;
  albumArt?: ImagePlaceholder;
};

export const Playlist: Song[] = data.playlist.map(song => {
    const albumArt = PlaceHolderImages.find(img => img.id === song.albumArtId);
    return { ...song, albumArt };
});
