
'use client';

import { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ProfileFlag } from '@/lib/flags-manager';
import flagDefinitions from '@/lib/flags.json';

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

interface UserProfileContextType {
  profiles: UserProfile[];
  activeProfile: UserProfile | null;
  isLoading: boolean;
  addProfile: (newProfileData: Omit<UserProfile, 'id' | 'showDebug' | 'xp' | 'likes' | 'terminalHistory' | 'money' | 'flags'>) => void;
  deleteProfile: (profileId: string) => void;
  updateProfile: (profileId: string, updatedData: Partial<Omit<UserProfile, 'id'>>) => void;
  setActive: (profile: UserProfile | null) => void;
  resetAllProfiles: () => void;
}

const USER_PROFILE_KEY_PREFIX = 'lik3-m3-profile-';
const ACTIVE_PROFILE_ID_KEY = 'lik3-m3-active-profile-id';

const getProfileKey = (profileId: string) => `${USER_PROFILE_KEY_PREFIX}${profileId}`;

export const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export const UserProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [activeProfile, setActiveProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedProfiles: UserProfile[] = [];
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (key?.startsWith(USER_PROFILE_KEY_PREFIX)) {
          const profileItem = window.localStorage.getItem(key);
          if (profileItem) {
            const profile = JSON.parse(profileItem);
            // Ensure terminal history is not persisted as ReactNodes
            if (profile.terminalHistory) {
              profile.terminalHistory = profile.terminalHistory.map((item: any) => ({
                ...item,
                output: typeof item.output === 'string' ? item.output : '[Formatted Output]'
              }));
            }
            savedProfiles.push(profile);
          }
        }
      }
      setProfiles(savedProfiles);

      const activeProfileIdItem = window.localStorage.getItem(ACTIVE_PROFILE_ID_KEY);
      if (activeProfileIdItem) {
        const activeProfileKey = getProfileKey(activeProfileIdItem);
        const activeProfileItem = window.localStorage.getItem(activeProfileKey);
        if (activeProfileItem) {
            const activeProfileParsed = JSON.parse(activeProfileItem);
             if (activeProfileParsed.terminalHistory) {
                activeProfileParsed.terminalHistory = activeProfileParsed.terminalHistory.map((item: any) => ({
                    ...item,
                    output: typeof item.output === 'string' ? item.output : '[Formatted Output]'
                }));
            }
            setActiveProfile(activeProfileParsed);
        }
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
      
      // Ensure terminal history is serializable
      if (updatedProfile.terminalHistory) {
        updatedProfile.terminalHistory = updatedProfile.terminalHistory.map(item => {
            if (typeof item.output !== 'string') {
                return { ...item, output: '[Formatted Output]' };
            }
            return item;
        });
      }

      window.localStorage.setItem(profileKey, JSON.stringify(updatedProfile));

      setProfiles(prevProfiles => prevProfiles.map(p => p.id === profileId ? updatedProfile : p));

      if (activeProfile?.id === profileId) {
        setActiveProfile(updatedProfile);
      }
    } catch (error) {
      console.error("Failed to update profile in localStorage", error);
    }
  }, [activeProfile?.id]);

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

    const defaultBg = PlaceHolderImages.find(img => img.id === 'desktop-bg-cat-3');

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

  return (
    <UserProfileContext.Provider value={{ profiles, activeProfile, isLoading, addProfile, deleteProfile, updateProfile, setActive, resetAllProfiles }}>
      {children}
    </UserProfileContext.Provider>
  );
};
