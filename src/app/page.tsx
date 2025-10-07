
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUserProfileContext, type UserProfile } from '@/context/user-profile-context';
import BootScreen from '@/components/boot-screen';
import LoginScreen from '@/components/login-screen';
import Desktop from '@/components/desktop';
import DebugOverlay from '@/components/debug-overlay';

type AppState = 'booting' | 'login' | 'desktop';
const USER_SETTINGS_KEY = 'lik3-m3-user-settings';

export default function Home() {
  const [appState, setAppState] = useState<AppState>('booting');
  const { profiles, activeProfile, addProfile, setActive, deleteProfile, isLoading, updateProfile } = useUserProfileContext();
  const [showGlobalDebug, setShowGlobalDebug] = useState(false);

  useEffect(() => {
    try {
      const settingsItem = window.localStorage.getItem(USER_SETTINGS_KEY);
      if (settingsItem) {
        const settings = JSON.parse(settingsItem);
        setShowGlobalDebug(settings.showDebug || false);
      }
    } catch (error) {
      console.error("Failed to load user settings from localStorage", error);
    }
  }, []);

  const handleSetShowGlobalDebug = (value: boolean | ((prevState: boolean) => boolean)) => {
    const newShowDebug = typeof value === 'function' ? value(showGlobalDebug) : value;
    setShowGlobalDebug(newShowDebug);
    try {
      const settingsItem = window.localStorage.getItem(USER_SETTINGS_KEY);
      const settings = settingsItem ? JSON.parse(settingsItem) : {};
      settings.showDebug = newShowDebug;
      window.localStorage.setItem(USER_SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error("Failed to save user settings to localStorage", error);
    }
  };

  const handleSetProfileDebug = (value: boolean | ((prevState: boolean) => boolean)) => {
    if (!activeProfile) return;
    const newShowDebug = typeof value === 'function' ? value(activeProfile.showDebug || false) : value;
    updateProfile(activeProfile.id, { showDebug: newShowDebug });
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

  const handleAccountCreate = (newProfileData: Omit<UserProfile, 'id' | 'showDebug'>) => {
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

  const showDebug = activeProfile ? activeProfile.showDebug : showGlobalDebug;
  const setShowDebug = activeProfile ? handleSetProfileDebug : handleSetShowGlobalDebug;

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
          setShowDebug={setShowDebug}
        />
      )}
      
      {appState === 'desktop' && !isLoading && activeProfile && (
        <Desktop 
          onLogout={handleLogout} 
          showDebug={showDebug || false}
          setShowDebug={setShowDebug} 
        />
      )}

      {showDebug && <DebugOverlay activeProfile={activeProfile} onClose={() => setShowDebug(false)} />}
    </main>
  );
}
