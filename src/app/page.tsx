'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUserProfileContext, type UserProfile } from '@/context/user-profile-context';
import BootScreen from '@/components/boot-screen';
import LoginScreen from '@/components/login-screen';
import Desktop from '@/components/desktop';

type AppState = 'booting' | 'login' | 'desktop';

export default function Home() {
  const [appState, setAppState] = useState<AppState>('booting');
  const { profiles, activeProfile, addProfile, setActive, deleteProfile, isLoading } = useUserProfileContext();

  const handleBootComplete = useCallback(() => {
    if (!isLoading) {
      if (activeProfile) {
        setAppState('desktop');
      } else {
        setAppState('login');
      }
    }
  }, [isLoading, activeProfile]);

  useEffect(() => {
    if (appState === 'booting') {
      const bootTimer = setTimeout(handleBootComplete, 3000);
      return () => clearTimeout(bootTimer);
    }
  }, [appState, handleBootComplete]);

  const handleAccountCreate = (newProfileData: Omit<UserProfile, 'id'>) => {
    addProfile(newProfileData);
    setAppState('desktop');
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
        />
      )}
      
      {appState === 'desktop' && !isLoading && activeProfile && (
        <Desktop onLogout={handleLogout} />
      )}
    </main>
  );
}
