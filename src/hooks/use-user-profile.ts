
'use client';

import { useState, useEffect, useCallback } from 'react';
import { calculateLevel } from '@/lib/leveling';
import { toast } from './use-toast';
import { FlagManager, ProfileFlag } from '@/lib/flags-manager';
import flagDefinitions from '@/lib/flags.json';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const definitions = flagDefinitions as {
  [key: string]: {
    defaultValue: any;
  }
};

type LikeData = {
    [postId: string]: number;
};

type TerminalHistoryItem = {
    command: string;
    output: React.ReactNode;
};

export type UserProfile = {
  id: string;
  username: string;
  avatarUrl: string;
  desktopBgUrl?: string;
  description?: string;
  showDebug?: boolean;
  xp?: number;
  likes?: LikeData;
  terminalHistory?: TerminalHistoryItem[];
  money?: number;
  flags?: { [key: string]: ProfileFlag };
};

const USER_PROFILE_KEY_PREFIX = 'lik3-m3-profile-';
const ACTIVE_PROFILE_ID_KEY = 'lik3-m3-active-profile-id';

const getProfileKey = (profileId: string) => `${USER_PROFILE_KEY_PREFIX}${profileId}`;

export function useUserProfile() {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [activeProfile, setActiveProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [flagManager, setFlagManager] = useState<FlagManager | null>(null);

  useEffect(() => {
    try {
      const savedProfiles: UserProfile[] = [];
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (key?.startsWith(USER_PROFILE_KEY_PREFIX)) {
          const profileItem = window.localStorage.getItem(key);
          if (profileItem) {
            savedProfiles.push(JSON.parse(profileItem));
          }
        }
      }
      setProfiles(savedProfiles);

      const activeProfileIdItem = window.localStorage.getItem(ACTIVE_PROFILE_ID_KEY);
      if (activeProfileIdItem) {
        const activeProfileKey = getProfileKey(activeProfileIdItem);
        const activeProfileItem = window.localStorage.getItem(activeProfileKey);
        setActiveProfile(activeProfileItem ? JSON.parse(activeProfileItem) : null);
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
      setProfiles([]);
      setActiveProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback((profileId: string, updatedData: Partial<Omit<UserProfile, 'id'>>) => {
    try {
      const profileKey = getProfileKey(profileId);
      const profileItem = window.localStorage.getItem(profileKey);
      if (!profileItem) {
        console.error(`Profile with id ${profileId} not found in localStorage.`);
        return;
      }

      const currentProfile: UserProfile = JSON.parse(profileItem);
      const updatedProfile: UserProfile = { ...currentProfile, ...updatedData };

      window.localStorage.setItem(profileKey, JSON.stringify(updatedProfile));

      setProfiles(prevProfiles => prevProfiles.map(p => p.id === profileId ? updatedProfile : p));

      if (activeProfile?.id === profileId) {
        setActiveProfile(updatedProfile);
      }
    } catch (error) {
      console.error("Failed to update profile in localStorage", error);
    }
  }, [activeProfile?.id]);

  useEffect(() => {
    if (activeProfile) {
      console.log(`[useUserProfile] Active profile set: ${activeProfile.username}. Initializing FlagManager.`);
      const manager = new FlagManager(activeProfile, (updatedData) => {
        updateProfile(activeProfile.id, updatedData);
      });

      console.log("[useUserProfile] Calling evaluateInitialFlags to process pre-existing flags.");
      manager.evaluateInitialFlags();
      console.log("[useUserProfile] Initial flag evaluation complete.");

      setFlagManager(manager);

      const intervalId = setInterval(() => {
        manager.processExpiredFlags();
      }, 30 * 1000);

      return () => {
        console.log(`[useUserProfile] Cleaning up FlagManager for profile: ${activeProfile.username}.`);
        clearInterval(intervalId);
        manager.destroy();
      };
    } else {
      setFlagManager(null);
    }
  }, [activeProfile, updateProfile]);

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

  const addProfile = useCallback((newProfileData: Omit<UserProfile, 'id' | 'showDebug' | 'xp' | 'likes' | 'terminalHistory' | 'money' | 'flags'>) => {
    if (profiles.some(p => p.username.toLowerCase() === newProfileData.username.toLowerCase())) {
        throw new Error('A profile with this username already exists.');
    }
    
    const defaultFlags: { [key: string]: ProfileFlag } = {};
    for (const key in definitions) {
        const def = definitions[key];
        if (def.defaultValue !== null && def.defaultValue !== undefined) {
            defaultFlags[key] = { value: def.defaultValue };
        }
    }

    const defaultBg = PlaceHolderImages.find(img => img.id === 'desktop-bg-5');

    const newProfile: UserProfile = {
      ...newProfileData,
      id: `profile_${Date.now()}_${Math.random()}`,
      desktopBgUrl: defaultBg?.imageUrl || '',
      description: 'New to LIK3 M3!',
      showDebug: false,
      xp: 0,
      likes: {},
      terminalHistory: [],
      money: 500,
      flags: defaultFlags,
    };
    
    try {
      const profileKey = getProfileKey(newProfile.id);
      window.localStorage.setItem(profileKey, JSON.stringify(newProfile));
      const updatedProfiles = [...profiles, newProfile];
      setProfiles(updatedProfiles);
      setActive(newProfile);
    } catch (error) {
      console.error("Failed to save user profile to localStorage", error);
      throw new Error('Failed to save profile.');
    }
  }, [profiles, setActive]);
  
  const deleteProfile = useCallback((profileId: string) => {
    try {
      const profileKey = getProfileKey(profileId);
      window.localStorage.removeItem(profileKey);

      setProfiles(profiles.filter(p => p.id !== profileId));
      
      if (activeProfile?.id === profileId) {
        setActive(null);
      }
    } catch (error) {
      console.error("Failed to delete user profile from localStorage", error);
    }
  }, [profiles, activeProfile, setActive]);

  const resetAllProfiles = useCallback(() => {
    try {
        for (let i = 0; i < window.localStorage.length; i++) {
            const key = window.localStorage.key(i);
            if (key?.startsWith(USER_PROFILE_KEY_PREFIX)) {
                window.localStorage.removeItem(key);
                i--; 
            }
        }
      window.localStorage.removeItem(ACTIVE_PROFILE_ID_KEY);
      setProfiles([]);
      setActiveProfile(null);
    } catch (error) {
      console.error("Failed to clear user profiles from localStorage", error);
    }
  }, []);

  const addXp = useCallback((amount: number) => {
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
  }, [activeProfile, updateProfile]);

  const setFlag = useCallback((key: string, value: any) => {
    flagManager?.setFlag(key, value);
  }, [flagManager]);

  const getFlag = useCallback((key: string) => {
    return flagManager?.getFlag(key);
  }, [flagManager]);

  const removeFlag = useCallback((key: string) => {
    flagManager?.removeFlag(key);
  }, [flagManager]);

  const enterScene = useCallback((sceneId: string) => {
    flagManager?.enterScene(sceneId);
  }, [flagManager]);

  const exitScene = useCallback((sceneId: string) => {
    flagManager?.exitScene(sceneId);
  }, [flagManager]);

  return { profiles, activeProfile, addProfile, setActive, deleteProfile, updateProfile, resetAllProfiles, isLoading, addXp, setFlag, getFlag, removeFlag, enterScene, exitScene };
}
