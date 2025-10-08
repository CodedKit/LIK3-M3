
'use client';

import { useAuth } from './use-auth';

export const useWallet = () => {
  const { activeProfile, updateProfile } = useAuth();

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
