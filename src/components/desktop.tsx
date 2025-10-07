
'use client';

import { useState } from 'react';
import { useUserProfileContext } from '@/context/user-profile-context';
import Taskbar from '@/components/desktop/taskbar';
import AppIcon from '@/components/desktop/app-icon';
import Likestagram from '@/components/desktop/apps/likestagram';
import TerminalApp from '@/components/desktop/apps/terminal';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, WindowCloseButton } from '@/components/ui/dialog';
import { Heart, Terminal as TerminalIcon, Music, Settings, User } from 'lucide-react';
import MusicApp from '@/components/desktop/apps/music';
import MediaPlayer from '@/components/desktop/media-player';
import SettingsApp from '@/components/desktop/apps/settings';
import ProfileApp from '@/components/desktop/apps/profile';

interface DesktopProps {
  onLogout: () => void;
}

export default function Desktop({ onLogout }: DesktopProps) {
  const [activeApp, setActiveApp] = useState<{id: string, name: string, component: React.ReactNode} | null>(null);
  const { activeProfile, clearAllProfiles } = useUserProfileContext();
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number | null>(null);

  const handlePlayTrack = (trackIndex: number) => {
    setCurrentTrackIndex(trackIndex);
  };

  const handleClosePlayer = () => {
    setCurrentTrackIndex(null);
  };

  const closeApp = () => {
    setActiveApp(null);
  };

  const apps = [
    { id: 'likestagram', name: 'Likestagram', icon: <Heart className="h-12 w-12" />, component: <Likestagram /> },
    { id: 'terminal', name: 'Terminal', icon: <TerminalIcon className="h-12 w-12" />, component: <TerminalApp /> },
    { id: 'music', name: 'Music', icon: <Music className="h-12 w-12" />, component: <MusicApp onPlayTrack={handlePlayTrack} /> },
    { id: 'settings', name: 'Settings', icon: <Settings className="h-12 w-12" />, component: <SettingsApp />, desktop: false },
    { id: 'profile', name: 'Profile', icon: <User className="h-12 w-12" />, component: <ProfileApp onClose={closeApp} />, desktop: false },
  ];
  
  const openApp = (appId: string) => {
    const app = apps.find(a => a.id === appId);
    if(app) {
      setActiveApp(app);
    }
  };
  
  const handleReset = () => {
    clearAllProfiles();
    onLogout();
  }

  if (!activeProfile) {
    return null;
  }

  const desktopApps = apps.filter(app => app.desktop !== false);

  return (
    <div className="flex h-full w-full flex-col-reverse md:flex-col bg-background animate-in fade-in duration-500">
      <div className="flex-grow p-2">
        <div className="flex h-auto flex-row flex-wrap gap-2">
          {desktopApps.map((app) => (
            <AppIcon
              key={app.id}
              name={app.name}
              icon={app.icon}
              onClick={() => openApp(app.id)}
            />
          ))}
        </div>
      </div>

      {currentTrackIndex !== null && (
        <MediaPlayer 
            currentTrackIndex={currentTrackIndex}
            setCurrentTrackIndex={setCurrentTrackIndex}
            onClose={handleClosePlayer}
        />
      )}

      <Taskbar 
        userProfile={activeProfile} 
        onLogout={onLogout} 
        onReset={handleReset} 
        onOpenSettings={() => openApp('settings')}
        onOpenProfile={() => openApp('profile')}
      />

      <Dialog open={!!activeApp} onOpenChange={(open) => !open && closeApp()}>
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0">
          <DialogHeader className="p-4 border-b bg-card rounded-t-lg">
            <WindowCloseButton />
            <DialogTitle className='font-headline text-center'>{activeApp?.name}</DialogTitle>
            <DialogDescription className="sr-only">Opened application: {activeApp?.name}</DialogDescription>
          </DialogHeader>
          <div className="flex-grow overflow-y-auto p-6">
            {activeApp?.component}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
