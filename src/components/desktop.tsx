
'use client';

import { useState, useEffect } from 'react';
import { useUserProfileContext } from '@/context/user-profile-context';
import Taskbar from '@/components/desktop/taskbar';
import AppIcon from '@/components/desktop/app-icon';
import Likestagram from '@/components/desktop/apps/likestagram';
import TerminalApp from '@/components/desktop/apps/terminal';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, WindowCloseButton } from '@/components/ui/dialog';
import { Heart, Terminal as TerminalIcon, Music, Settings, User, ShoppingCart, MessageSquare } from 'lucide-react';
import MusicApp from '@/components/desktop/apps/music';
import MediaPlayer from '@/components/desktop/media-player';
import SettingsApp from '@/components/desktop/apps/settings';
import ProfileApp from '@/components/desktop/apps/profile';
import EhmazonApp from '@/components/desktop/apps/ehmazon';
import { type LikestagramUser } from '@/lib/likestagram';
import LikestagramProfileApp from '@/components/desktop/apps/likestagram/profile';
import { WindowNavButtons } from '@/components/ui/window-nav-buttons';
import ChatCordApp from './desktop/apps/chatcord';


interface DesktopProps {
  onLogout: () => void;
  showDebug: boolean;
  setShowDebug: (show: boolean | ((s: boolean) => boolean)) => void;
}

type AppInstance = {
  id: string;
  name: string;
  component: React.ReactNode;
  hasNav?: boolean;
};

export default function Desktop({ onLogout, showDebug, setShowDebug }: DesktopProps) {
  const [openApps, setOpenApps] = useState<AppInstance[]>([]);
  const { activeProfile, updateProfile } = useUserProfileContext();
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number | null>(null);
  
  const activeApp = openApps[openApps.length - 1];

  const handlePlayTrack = (trackIndex: number) => {
    setCurrentTrackIndex(trackIndex);
  };

  const handleClosePlayer = () => {
    setCurrentTrackIndex(null);
  };

  const closeApp = () => {
    setOpenApps([]);
  };

  const apps: Omit<AppInstance, 'component'>[] = [
    { id: 'likestagram', name: 'Likestagram', hasNav: true },
    { id: 'likestagramProfile', name: 'Profile', hasNav: true },
    { id: 'terminal', name: 'Terminal' },
    { id: 'music', name: 'Music' },
    { id: 'ehmazon', name: 'Ehmazon', hasNav: true },
    { id: 'chatcord', name: 'ChatCord' },
    { id: 'settings', name: 'Settings' },
    { id: 'profile', name: 'Profile' },
  ];

  const desktopApps = [
    { id: 'likestagram', name: 'Likestagram', icon: <Heart className="h-12 w-12" /> },
    { id: 'terminal', name: 'Terminal', icon: <TerminalIcon className="h-12 w-12" /> },
    { id: 'music', name: 'Music', icon: <Music className="h-12 w-12" /> },
    { id: 'ehmazon', name: 'Ehmazon', icon: <ShoppingCart className="h-12 w-12" /> },
    { id: 'chatcord', name: 'ChatCord', icon: <MessageSquare className="h-12 w-12" /> },
  ];

  const getAppComponent = (app: AppInstance, props: any = {}): React.ReactNode => {
    switch (app.id) {
      case 'likestagram':
        return <Likestagram onViewProfile={(user) => handleViewProfile(user)} />;
      case 'likestagramProfile':
        return <LikestagramProfileApp user={props.user} />;
      case 'terminal':
        return <TerminalApp setShowDebug={setShowDebug} updateProfile={updateProfile} activeProfile={activeProfile} />;
      case 'music':
        return <MusicApp onPlayTrack={handlePlayTrack} />;
      case 'ehmazon':
        return <EhmazonApp />;
      case 'chatcord':
        return <ChatCordApp />;
      case 'settings':
        return <SettingsApp />;
      case 'profile':
        return <ProfileApp onClose={closeApp} onLogout={onLogout} />;
      default:
        return null;
    }
  };
  
  const openApp = (appId: string, props: any = {}) => {
    const appDef = apps.find(a => a.id === appId) || { id: appId, name: props.name || appId };
    const newAppInstance: AppInstance = {
      ...appDef,
      component: getAppComponent({ ...appDef, component: null }, props),
    };

    if (newAppInstance.hasNav) {
      setOpenApps(prev => [...prev, newAppInstance]);
    } else {
      setOpenApps([newAppInstance]);
    }
  };

  const handleViewProfile = (user: LikestagramUser) => {
    openApp('likestagramProfile', { user, name: user.username });
  };

  const back = () => {
    setOpenApps(prev => prev.slice(0, -1));
  };
  
  if (!activeProfile) {
    return null;
  }

  const canGoBack = openApps.length > 1;

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
        onOpenSettings={() => openApp('settings')}
        onOpenProfile={() => openApp('profile')}
        onToggleDebug={() => setShowDebug(s => !s)}
      />

      <Dialog open={!!activeApp} onOpenChange={(open) => !open && closeApp()}>
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0">
          <DialogHeader showNav={activeApp?.hasNav} onBack={back} canGoBack={canGoBack}>
            <WindowCloseButton />
            <DialogTitle className='text-center text-sm font-medium leading-none tracking-tight'>{activeApp?.name}</DialogTitle>
            <DialogDescription className="sr-only">Opened application: {activeApp?.name}</DialogDescription>
          </DialogHeader>
          <div className="flex-grow overflow-y-auto">
            {activeApp?.component}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
