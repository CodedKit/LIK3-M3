
'use client';

import { useAuth } from './use-auth';
import { useToast } from './use-toast';

export const useFavorites = () => {
  const { activeProfile, updateProfile } = useAuth();
  const { toast } = useToast();

  const favoriteSongs = activeProfile?.favoriteSongs || [];

  const isFavorite = (songId: string) => {
    return favoriteSongs.includes(songId);
  };

  const toggleFavorite = (songId: string) => {
    if (!activeProfile) return;

    const newFavorites = [...favoriteSongs];
    const songIndex = newFavorites.indexOf(songId);

    if (songIndex > -1) {
      // Remove from favorites
      newFavorites.splice(songIndex, 1);
    } else {
      // Add to favorites
      newFavorites.push(songId);
      toast({
        title: "Added to Favorites",
        description: "You can find this song in your favorites list.",
      });
    }

    updateProfile(activeProfile.id, { favoriteSongs: newFavorites });
  };

  return { favoriteSongs, isFavorite, toggleFavorite };
};
