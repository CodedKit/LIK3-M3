
'use client';

// This file has been deprecated and its functionality split into smaller, more focused hooks.
// - useAuth: for profile management and authentication
// - useExperience: for XP and leveling
// - useWallet: for money/currency
// - useLikes: for managing likes on posts
// - useFlags: for the event/flag system
// Please import from these hooks directly instead of using this file.

import { useContext } from 'react';
import { UserProfileContext, type UserProfile } from '@/context/user-profile-context';
import { calculateLevel } from '@/lib/leveling';
import { toast } from './use-toast';
import { FlagManager } from '@/lib/flags-manager';

export { type UserProfile };

/**
 * @deprecated This hook is deprecated. Use the more specific hooks like `useAuth`, `useExperience`, etc.
 */
export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }

  const { activeProfile, updateProfile } = context;

  // Experience
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

  // Wallet
  const addMoney = (amount: number) => {
    if (!activeProfile) return;
    const currentMoney = activeProfile.money || 0;
    const newMoney = currentMoney + amount;
    updateProfile(activeProfile.id, { money: newMoney });
  };

  // Likes
  const getLikes = (postId: string) => {
    return activeProfile?.likes?.[postId];
  };

  const likePost = (postId: string) => {
    if (activeProfile) {
      const currentLikes = activeProfile.likes?.[postId] || 0;
      const newLikes = { ...activeProfile.likes, [postId]: currentLikes + 1 };
      updateProfile(activeProfile.id, { likes: newLikes });
    }
  };

  // Flags
  let flagManager: FlagManager | null = null;
  if (activeProfile) {
      flagManager = new FlagManager(activeProfile, (updatedData) => {
        updateProfile(activeProfile.id, updatedData);
    });
  }

  const setFlag = (key: string, value: any) => flagManager?.setFlag(key, value);
  const getFlag = (key: string) => flagManager?.getFlag(key);
  const enterScene = (sceneId: string) => { /* Not implemented in deprecated hook */ };
  const exitScene = (sceneId: string) => { /* Not implemented in deprecated hook */ };


  return {
    ...context,
    // Experience
    xp: activeProfile?.xp || 0,
    addXp,
    // Wallet
    money: activeProfile?.money || 0,
    addMoney,
    // Likes
    getLikes,
    likePost,
    // Flags
    setFlag,
    getFlag,
    enterScene,
    exitScene,
  };
};
