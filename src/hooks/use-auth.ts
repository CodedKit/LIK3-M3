
'use client';

import { useContext } from 'react';
import { UserProfileContext } from '@/context/user-profile-context';

export const useAuth = () => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useAuth must be used within a UserProfileProvider');
  }

  const { addProfile, updateProfile, ...rest } = context;

  return {
    ...rest,
    addProfile,
    updateProfile,
  };
};
