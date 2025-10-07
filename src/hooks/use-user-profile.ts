
'use client';

import { useState, useEffect, useCallback } from 'react';

export type UserProfile = {
  id: string;
  username: string;
  avatarUrl: string;
  description?: string;
};

const USER_PROFILES_KEY = 'virtual-temptations-user-profiles';
const ACTIVE_PROFILE_ID_KEY = 'virtual-temptations-active-profile-id';

export function useUserProfile() {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [activeProfile, setActiveProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const profilesItem = window.localStorage.getItem(USER_PROFILES_KEY);
      const savedProfiles = profilesItem ? JSON.parse(profilesItem) : [];
      setProfiles(savedProfiles);

      const activeProfileIdItem = window.localStorage.getItem(ACTIVE_PROFILE_ID_KEY);
      if (activeProfileIdItem) {
        const profile = savedProfiles.find((p: UserProfile) => p.id === activeProfileIdItem);
        setActiveProfile(profile || null);
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
      setProfiles([]);
      setActiveProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setActive = useCallback((profile: UserProfile | null) => {
    setActiveProfile(profile);
    try {
      if (profile) {
        window.localStorage.setItem(ACTIVE_PROFILE_ID_KEY, profile.id);
      } else {
        window.localStorage.removeItem(ACTIVE_PROFILE_ID_KEY);
      }
    } catch (error) {
        console.error("Failed to save active profile ID to localStorage", error);
    }
  }, []);

  const addProfile = useCallback((newProfileData: Omit<UserProfile, 'id'>) => {
    setProfiles(prevProfiles => {
      if (prevProfiles.some(p => p.username.toLowerCase() === newProfileData.username.toLowerCase())) {
          throw new Error('A profile with this username already exists.');
      }
      
      const newProfile: UserProfile = {
        ...newProfileData,
        id: `profile_${Date.now()}_${Math.random()}`,
        description: 'New to Virtual Temptations!'
      };
      
      try {
        const updatedProfiles = [...prevProfiles, newProfile];
        window.localStorage.setItem(USER_PROFILES_KEY, JSON.stringify(updatedProfiles));
        setActive(newProfile);
        return updatedProfiles;
      } catch (error) {
        console.error("Failed to save user profile to localStorage", error);
        throw new Error('Failed to save profile.');
      }
    });
  }, [setActive]);

  const updateProfile = useCallback((profileId: string, updatedData: Partial<Omit<UserProfile, 'id'>>) => {
    setProfiles(prevProfiles => {
      const updatedProfiles = prevProfiles.map(p => {
        if (p.id === profileId) {
          return { ...p, ...updatedData };
        }
        return p;
      });

      try {
        window.localStorage.setItem(USER_PROFILES_KEY, JSON.stringify(updatedProfiles));
        const active = updatedProfiles.find(p => p.id === activeProfile?.id);
        if (active) {
            setActiveProfile(active);
        }
      } catch (error) {
        console.error("Failed to save updated profiles to localStorage", error);
      }
      
      return updatedProfiles;
    });

  }, [activeProfile?.id]);
  
  const deleteProfile = useCallback((profileId: string) => {
    try {
      const updatedProfiles = profiles.filter(p => p.id !== profileId);
      window.localStorage.setItem(USER_PROFILES_KEY, JSON.stringify(updatedProfiles));
      setProfiles(updatedProfiles);
      if (activeProfile?.id === profileId) {
        setActive(null);
      }
    } catch (error) {
      console.error("Failed to delete user profile from localStorage", error);
    }
  }, [profiles, activeProfile, setActive]);

  const clearAllProfiles = useCallback(() => {
    try {
      window.localStorage.removeItem(USER_PROFILES_KEY);
      window.localStorage.removeItem(ACTIVE_PROFILE_ID_KEY);
      setProfiles([]);
      setActiveProfile(null);
    } catch (error) {
      console.error("Failed to clear user profiles from localStorage", error);
    }
  }, []);

  return { profiles, activeProfile, addProfile, setActive, deleteProfile, updateProfile, clearAllProfiles, isLoading };
}
