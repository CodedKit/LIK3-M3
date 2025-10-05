'use client';

import { useState, useEffect, useCallback } from 'react';

export type UserProfile = {
  id: string;
  username: string;
  avatarUrl: string;
};

const USER_PROFILES_KEY = 'virtual-temptations-user-profiles';

export function useUserProfile() {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [activeProfile, setActiveProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(USER_PROFILES_KEY);
      if (item) {
        const savedProfiles = JSON.parse(item);
        if (Array.isArray(savedProfiles)) {
          setProfiles(savedProfiles);
        }
      }
    } catch (error) {
      console.error("Failed to load user profiles from localStorage", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addProfile = useCallback((newProfileData: Omit<UserProfile, 'id'>) => {
    const newProfile: UserProfile = {
      ...newProfileData,
      id: `profile_${Date.now()}_${Math.random()}`
    };
    
    try {
      const updatedProfiles = [...profiles, newProfile];
      window.localStorage.setItem(USER_PROFILES_KEY, JSON.stringify(updatedProfiles));
      setProfiles(updatedProfiles);
      setActiveProfile(newProfile); // Automatically log in with the new profile
    } catch (error) {
      console.error("Failed to save user profile to localStorage", error);
    }
  }, [profiles]);
  
  const setActive = useCallback((profile: UserProfile | null) => {
    setActiveProfile(profile);
  }, []);

  const deleteProfile = useCallback((profileId: string) => {
    try {
      const updatedProfiles = profiles.filter(p => p.id !== profileId);
      window.localStorage.setItem(USER_PROFILES_KEY, JSON.stringify(updatedProfiles));
      setProfiles(updatedProfiles);
      if (activeProfile?.id === profileId) {
        setActiveProfile(null);
      }
    } catch (error) {
      console.error("Failed to delete user profile from localStorage", error);
    }
  }, [profiles, activeProfile]);

  const clearAllProfiles = useCallback(() => {
    try {
      window.localStorage.removeItem(USER_PROFILES_KEY);
      setProfiles([]);
      setActiveProfile(null);
    } catch (error) {
      console.error("Failed to clear user profiles from localStorage", error);
    }
  }, []);

  return { profiles, activeProfile, addProfile, setActive, deleteProfile, clearAllProfiles, isLoading };
}
