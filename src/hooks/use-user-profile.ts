"use client";

import { useState, useEffect, useCallback } from 'react';

export type UserProfile = {
  username: string;
  avatarUrl: string;
};

const USER_PROFILE_KEY = 'virtual-temptations-user-profile';

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(USER_PROFILE_KEY);
      if (item) {
        setProfile(JSON.parse(item));
      }
    } catch (error) {
      console.error("Failed to load user profile from localStorage", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveProfile = useCallback((newProfile: UserProfile) => {
    try {
      window.localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(newProfile));
      setProfile(newProfile);
    } catch (error) {
      console.error("Failed to save user profile to localStorage", error);
    }
  }, []);

  const clearProfile = useCallback(() => {
    try {
      window.localStorage.removeItem(USER_PROFILE_KEY);
      setProfile(null);
    } catch (error) {
      console.error("Failed to clear user profile from localStorage", error);
    }
  }, []);

  return { profile, saveProfile, clearProfile, isLoading };
}
