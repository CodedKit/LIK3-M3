// This file is deprecated and will be removed.
// Please use `import { useAuth } from '@/hooks/use-user-profile';` instead.
'use client';

import { useContext } from 'react';
import { UserProfileContext } from '@/context/user-profile-context';

export const useAuth = () => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useAuth must be used within a UserProfileProvider');
  }
  return context;
};
