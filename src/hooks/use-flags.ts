
'use client';

import { useAuth } from '@/hooks/use-auth';
import { FlagManager } from '@/lib/flags-manager';

export const useFlags = () => {
  const { activeProfile, updateProfile } = useAuth();

  if (!activeProfile) {
    return {
      setFlag: () => {},
      getFlag: () => null,
      enterScene: () => {},
      exitScene: () => {},
    };
  }

  const flagManager = new FlagManager(activeProfile, (updatedData) => {
    updateProfile(activeProfile.id, updatedData);
  });

  return {
    setFlag: flagManager.setFlag.bind(flagManager),
    getFlag: flagManager.getFlag.bind(flagManager),
    enterScene: (sceneId: string) => {
      // Not implemented
    },
    exitScene: (sceneId: string) => {
      // Not implemented
    },
  };
};
