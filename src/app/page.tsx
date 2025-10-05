'use client';

import { useState, useEffect } from 'react';
import { useUserProfile, type UserProfile } from '@/hooks/use-user-profile';
import BootScreen from '@/components/boot-screen';
import LoginScreen from '@/components/login-screen';
import Desktop from '@/components/desktop';

type AppState = 'booting' | 'login' | 'desktop';

export default function Home() {
  const [appState, setAppState] = useState<AppState>('booting');
  const { profile, saveProfile, isLoading } = useUserProfile();

  useEffect(() => {
    const bootTimer = setTimeout(() => {
      if (!isLoading) {
        if (profile) {
          setAppState('desktop');
        } else {
          setAppState('login');
        }
      }
    }, 3000);

    return () => clearTimeout(bootTimer);
  }, [isLoading, profile]);

  const handleAccountCreate = (newProfile: UserProfile) => {
    saveProfile(newProfile);
    setAppState('desktop');
  };
  
  const handleLogin = () => {
    setAppState('desktop');
  };
  
  const handleLogout = () => {
    setAppState('login');
  }

  return (
    <main className="h-screen w-screen overflow-hidden bg-background">
      {(appState === 'booting' || (appState === 'desktop' && isLoading)) && <BootScreen />}
      
      {appState === 'login' && !isLoading && (
        <LoginScreen onAccountCreate={handleAccountCreate} onLogin={handleLogin} hasProfile={!!profile} />
      )}
      
      {appState === 'desktop' && !isLoading && profile && (
        <Desktop userProfile={profile} onLogout={handleLogout} />
      )}
    </main>
  );
}
