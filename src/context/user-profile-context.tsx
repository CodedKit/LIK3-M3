'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useUserProfile, UserProfile } from '@/hooks/use-user-profile';

type UserProfileContextType = {
  profiles: UserProfile[];
  activeProfile: UserProfile | null;
  addProfile: (newProfileData: Omit<UserProfile, 'id'>) => void;
  setActive: (profile: UserProfile | null) => void;
  deleteProfile: (profileId: string) => void;
  clearAllProfiles: () => void;
  isLoading: boolean;
};

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const userProfile = useUserProfile();

  return (
    <UserProfileContext.Provider value={userProfile}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfileContext() {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error('useUserProfileContext must be used within a UserProfileProvider');
  }
  return context;
}
