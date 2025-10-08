
'use client';

import React, { createContext, useContext, useCallback, ReactNode } from 'react';
import { useAuth } from '@/hooks/use-auth';

type AudioType = 'music' | 'ui' | 'effects';

interface AudioContextType {
  playSound: (soundUrl: string, type: AudioType) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider = ({ children }: { children: ReactNode }) => {
  const { activeProfile } = useAuth();

  const playSound = useCallback((soundUrl: string, type: AudioType) => {
    if (!activeProfile || !activeProfile.volumeSettings) return;
    
    const { master, music, ui, effects } = activeProfile.volumeSettings;

    let typeVolume = 100;
    switch(type) {
        case 'music':
            typeVolume = music;
            break;
        case 'ui':
            typeVolume = ui;
            break;
        case 'effects':
            typeVolume = effects;
            break;
    }

    // A master volume of 0 should mute everything.
    if (master === 0) return;

    const finalVolume = (master / 100) * (typeVolume / 100);

    if (finalVolume > 0) {
        const audio = new Audio(soundUrl);
        audio.volume = finalVolume;
        audio.play().catch(e => console.error(`[AudioProvider] Error playing sound ${soundUrl}:`, e));
    }

  }, [activeProfile]);

  return (
    <AudioContext.Provider value={{ playSound }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
