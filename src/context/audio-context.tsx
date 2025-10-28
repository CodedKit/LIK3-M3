
'use client';

import React, { createContext, useContext, useCallback, useRef, ReactNode } from 'react';
import { useAuth } from '@/hooks/use-auth';

type AudioType = 'music' | 'ui' | 'effects';

interface AudioContextType {
  playSound: (soundUrl: string, type: AudioType) => void;
  playMusic: (musicUrl: string, loop?: boolean) => void;
  stopMusic: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider = ({ children }: { children: ReactNode }) => {
  const { activeProfile } = useAuth();
  const musicAudioRef = useRef<HTMLAudioElement | null>(null);

  const playSound = useCallback((soundUrl: string, type: AudioType) => {
    if (!activeProfile || !activeProfile.volumeSettings) return;

    const { master, music, ui, effects } = activeProfile.volumeSettings;

    let typeVolume = 100;
    switch (type) {
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

  const playMusic = useCallback((musicUrl: string, loop: boolean = true) => {
    if (!activeProfile || !activeProfile.volumeSettings) return;

    const { master, music } = activeProfile.volumeSettings;

    // Stop current music if playing
    if (musicAudioRef.current) {
      musicAudioRef.current.pause();
      musicAudioRef.current = null;
    }

    // A master volume of 0 should mute everything.
    if (master === 0) return;

    const finalVolume = (master / 100) * (music / 100);

    if (finalVolume > 0) {
      const audio = new Audio(musicUrl);
      audio.volume = finalVolume;
      audio.loop = loop;
      musicAudioRef.current = audio;
      audio.play().catch(e => console.error(`[AudioProvider] Error playing music ${musicUrl}:`, e));
    }
  }, [activeProfile]);

  const stopMusic = useCallback(() => {
    if (musicAudioRef.current) {
      musicAudioRef.current.pause();
      musicAudioRef.current = null;
    }
  }, []);

  return (
    <AudioContext.Provider value={{ playSound, playMusic, stopMusic }}>
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
