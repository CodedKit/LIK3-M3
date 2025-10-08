
'use client';

import { useContext } from 'react';
import { UserProfileContext } from '@/context/user-profile-context';

export const useAuth = () => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useAuth must be used within a UserProfileProvider');
  }

  return {
    profiles: context.profiles,
    activeProfile: context.activeProfile,
    isLoading: context.isLoading,
    addProfile: context.addProfile,
    deleteProfile: context.deleteProfile,
    setActive: context.setActive,
    resetAllProfiles: context.resetAllProfiles,
    updateProfile: context.updateProfile,
  };
};
