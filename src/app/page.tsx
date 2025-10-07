
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUserProfileContext, type UserProfile } from '@/context/user-profile-context';
import BootScreen from '@/components/boot-screen';
import LoginScreen from '@/components/login-screen';
import Desktop from '@/components/desktop';
import DebugOverlay from '@/components/debug-overlay';

type AppState = 'booting' | 'login' | 'desktop';
const USER_SETTINGS_KEY = 'user-settings';

export default function Home() {
  const [appState, setAppState] = useState<AppState>('booting');
  const { profiles, activeProfile, addProfile, setActive, deleteProfile, isLoading } = useUserProfileContext();
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    try {
      const settingsItem = window.localStorage.getItem(USER_SETTINGS_KEY);
      if (settingsItem) {
        const settings = JSON.parse(settingsItem);
        setShowDebug(settings.showDebug || false);
      }
    } catch (error) {
      console.error("Failed to load user settings from localStorage", error);
    }
  }, []);

  const handleSetShowDebug = (value: boolean | ((prevState: boolean) => boolean)) => {
    const newShowDebug = typeof value === 'function' ? value(showDebug) : value;
    setShowDebug(newShowDebug);
    try {
      const settingsItem = window.localStorage.getItem(USER_SETTINGS_KEY);
      const settings = settingsItem ? JSON.parse(settingsItem) : {};
      settings.showDebug = newShowDebug;
      window.localStorage.setItem(USER_SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error("Failed to save user settings to localStorage", error);
    }
  };

  const handleBootComplete = useCallback(() => {
    setAppState('login');
  }, []);

  useEffect(() => {
    if (appState === 'booting') {
      const bootTimer = setTimeout(handleBootComplete, 3000);
      return () => clearTimeout(bootTimer);
    }
  }, [appState, handleBootComplete]);

  useEffect(() => {
    if (!isLoading && activeProfile) {
      setAppState('desktop');
    } else if (!isLoading && !activeProfile) {
      setAppState('login');
    }
  }, [isLoading, activeProfile]);

  const handleAccountCreate = (newProfileData: Omit<UserProfile, 'id'>) => {
    addProfile(newProfileData);
  };
  
  const handleLogin = (profile: UserProfile) => {
    setActive(profile);
    setAppState('desktop');
  };
  
  const handleLogout = () => {
    setActive(null);
    setAppState('login');
  }

  return (
    <main className="h-screen w-screen overflow-hidden bg-background">
      {appState === 'booting' && <BootScreen onSkip={handleBootComplete} />}
      
      {appState === 'login' && !isLoading && (
        <LoginScreen 
          profiles={profiles}
          onAccountCreate={handleAccountCreate} 
          onLogin={handleLogin} 
          onProfileDelete={deleteProfile}
          showDebug={showDebug}
          setShowDebug={handleSetShowDebug}
        />
      )}
      
      {appState === 'desktop' && !isLoading && activeProfile && (
        <Desktop onLogout={handleLogout} setShowDebug={handleSetShowDebug} />
      )}

      {showDebug && <DebugOverlay />}
    </main>
  );
}
