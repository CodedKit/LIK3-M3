'use client';

import { useContext } from 'react';
import { UserProfileContext } from '@/context/user-profile-context';
import { calculateLevel } from '@/lib/leveling';
import { toast } from './use-toast';
import { ProfileFlag } from '@/lib/flags-manager';

// This is the primary hook for all user profile management.
// It is intended to be composed into more specific hooks.
export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
};


// Specific hooks composed from the main useUserProfile hook

export const useAuth = () => {
  const context = useUserProfile();
  return {
    profiles: context.profiles,
    activeProfile: context.activeProfile,
    isLoading: context.isLoading,
    addProfile: context.addProfile,
    deleteProfile: context.deleteProfile,
    setActive: context.setActive,
    updateProfile: context.updateProfile,
  };
};

export const useExperience = () => {
  const { activeProfile, updateProfile } = useUserProfile();

  const addXp = (amount: number) => {
    if (!activeProfile) return;

    const currentXp = activeProfile.xp || 0;
    const newXp = currentXp + amount;

    const { level: oldLevel } = calculateLevel(currentXp);
    const { level: newLevel } = calculateLevel(newXp);

    if (newLevel > oldLevel) {
      toast({
        title: "Level Up!",
        description: `You've reached level ${newLevel}!`,
      });
    }

    updateProfile(activeProfile.id, { xp: newXp });
  };

  return { xp: activeProfile?.xp || 0, addXp };
};

export const useFavorites = () => {
    const { activeProfile, updateProfile } = useUserProfile();
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
        newFavorites.splice(songIndex, 1);
      } else {
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

export const useFlags = () => {
    const { activeProfile } = useUserProfile();
  
    const getFlag = (key: string): ProfileFlag | null => {
      if (!activeProfile || !activeProfile.flags) {
        return null;
      }
      return activeProfile.flags[key] || null;
    };
  
    return {
      getFlag,
      setFlag: () => console.warn('setFlag is now managed centrally and should not be called from this hook.'),
      enterScene: () => {},
      exitScene: () => {},
    };
};

export const useLikes = () => {
    const { activeProfile, updateProfile } = useUserProfile();
  
    const getLikes = (postId: string) => {
      return activeProfile?.likes?.[postId];
    };
  
    const likePost = (postId: string, newLikeCount: number) => {
      if (activeProfile) {
        const newLikes = { ...activeProfile.likes, [postId]: newLikeCount };
        updateProfile(activeProfile.id, { likes: newLikes });
      }
    };
  
    return { getLikes, likePost };
};

export const useWallet = () => {
    const { activeProfile, updateProfile } = useUserProfile();
  
    const addMoney = (amount: number) => {
      if (!activeProfile) return;
  
      const currentMoney = activeProfile.money || 0;
      const newMoney = currentMoney + amount;
  
      updateProfile(activeProfile.id, { money: newMoney });
    };
  
    const spendMoney = (amount: number) => {
      if (!activeProfile) return false;
  
      const currentMoney = activeProfile.money || 0;
      if (currentMoney < amount) {
        return false;
      }
      
      const newMoney = currentMoney - amount;
      updateProfile(activeProfile.id, { money: newMoney });
      return true;
    }
  
    return { money: activeProfile?.money || 0, addMoney, spendMoney };
};
