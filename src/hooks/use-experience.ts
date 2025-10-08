
'use client';

import { useContext } from 'react';
import { UserProfileContext } from '@/context/user-profile-context';
import { calculateLevel } from '@/lib/leveling';
import { toast } from './use-toast';

export const useExperience = () => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useExperience must be used within a UserProfileProvider');
  }

  const { activeProfile, updateProfile } = context;

  const addXp = (amount: number) => {
    if (!activeProfile) return;

    const currentXp = activeProfile.xp || 0;
    const newXp = currentXp + amount;

    const { level: oldLevel } = calculateLevel(currentXp);
    const { level: newLevel } = calculateLevel(newXp);

    if (newLevel > oldLevel) {
      toast({
        title: "Level Up!",
        description: `You\'ve reached level ${newLevel}!`,
      });
    }

    updateProfile(activeProfile.id, { xp: newXp });
  };

  return { xp: activeProfile?.xp || 0, addXp };
};
