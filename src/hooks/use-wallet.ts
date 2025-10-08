
'use client';

import { useContext } from 'react';
import { UserProfileContext } from '@/context/user-profile-context';

export const useWallet = () => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useWallet must be used within a UserProfileProvider');
  }

  const { activeProfile, updateProfile } = context;

  const addMoney = (amount: number) => {
    if (!activeProfile) return;

    const currentMoney = activeProfile.money || 0;
    const newMoney = currentMoney + amount;

    updateProfile(activeProfile.id, { money: newMoney });
  };

  return { money: activeProfile?.money || 0, addMoney };
};
