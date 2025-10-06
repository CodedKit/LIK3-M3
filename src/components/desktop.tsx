'use client';

import { useState } from 'react';
import { useUserProfileContext } from '@/context/user-profile-context';
import Taskbar from '@/components/desktop/taskbar';
import AppIcon from '@/components/desktop/app-icon';
import Likestagram from '@/components/desktop/apps/likestagram';
import TerminalApp from '@/components/desktop/apps/terminal';
import MusicApp from '@/components/desktop/apps/music';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Heart, Terminal as TerminalIcon, Music } from 'lucide-react';
import MediaPlayer from './desktop/media-player';

interface DesktopProps {
  onLogout: () => void;
}

export default function Desktop({ onLogout }: DesktopProps) {
  const [activeApp, setActiveApp] = useState<{id: string, name: string, component: React.ReactNode} | null>(null);
  const { activeProfile, clearAllProfiles } = useUserProfileContext();
  const [isMediaPlayerVisible, setIsMediaPlayerVisible] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  const handlePlayTrack = (trackIndex: number) => {
    setCurrentTrackIndex(trackIndex);
    setIsMediaPlayerVisible(true);
  };
  
  const handleCloseMediaPlayer = () => {
    setIsMediaPlayerVisible(false);
  };

  const apps = [
    { id: 'likestagram', name: 'Likestagram', icon: <Heart className="h-12 w-12" />, component: <Likestagram /> },
    { id: 'terminal', name: 'Terminal', icon: <TerminalIcon className="h-12 w-12" />, component: <TerminalApp /> },
    { id: 'music', name: 'Music', icon: <Music className="h-12 w-12" />, component: <MusicApp onPlayTrack={handlePlayTrack} /> },
  ];

  const openApp = (appId: string) => {
    const app = apps.find(a => a.id === appId);
    if(app) {
        setActiveApp(app);
    }
  };

  const closeApp = () => {
    setActiveApp(null);
  };
  
  const handleReset = () => {
    clearAllProfiles();
    onLogout();
  }

  if (!activeProfile) {
    return null;
  }

  return (
    <div className="flex h-full w-full flex-col bg-background animate-in fade-in duration-500">
      <div className="flex-grow p-2">
        <div className="flex h-full flex-wrap content-start gap-2">
          {apps.map((app) => (
            <AppIcon
              key={app.id}
              name={app.name}
              icon={app.icon}
              onClick={() => openApp(app.id)}
            />
          ))}
        </div>
      </div>

      {isMediaPlayerVisible && (
        <MediaPlayer 
          currentTrackIndex={currentTrackIndex}
          setCurrentTrackIndex={setCurrentTrackIndex}
          onClose={handleCloseMediaPlayer}
        />
      )}

      <Taskbar userProfile={activeProfile} onLogout={onLogout} onReset={handleReset} />

      <Dialog open={!!activeApp} onOpenChange={(open) => !open && closeApp()}>
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0">
          <DialogHeader className="p-4 border-b bg-card rounded-t-lg">
            <DialogTitle className='font-headline'>{activeApp?.name}</DialogTitle>
          </DialogHeader>
          <div className="flex-grow overflow-y-auto">
            {activeApp?.component}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
