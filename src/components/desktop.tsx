
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useAuth } from '@/hooks/use-user-profile';
import Taskbar from '@/components/desktop/taskbar';
import AppIcon from '@/components/desktop/app-icon';
import Likestagram from '@/components/desktop/apps/likestagram';
import TerminalApp from '@/components/desktop/apps/terminal';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, WindowCloseButton } from '@/components/ui/dialog';
import { Heart, Terminal as TerminalIcon, Music, Settings, User, ShoppingCart, MessageSquare, ChartBarDecreasing, MessageCircle } from 'lucide-react';
import MusicApp from '@/components/desktop/apps/music';
import MediaPlayer from '@/components/desktop/media-player';
import SettingsApp from '@/components/desktop/apps/settings';
import ProfileApp from '@/components/desktop/apps/profile';
import EhmazonApp from '@/components/desktop/apps/ehmazon';
import { type LikestagramUser } from '@/lib/likestagram';
import LikestagramProfileApp from '@/components/desktop/apps/likestagram/profile';
import { WindowNavButtons } from '@/components/ui/window-nav-buttons';
import ChatCordApp from './desktop/apps/chatcord';
import { FlagManager } from '@/lib/flags-manager';
import { Playlist } from '@/lib/music';
import { TestChatApp } from './desktop/apps/testChatApp';
import { RadixDemoApp } from './desktop/apps/radixDemo';
import { BubbleChatApp } from './desktop/apps/bubbleChat';


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
  const { activeProfile, updateProfile } = useAuth();
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number | null>(null);

  const activeApp = openApps[openApps.length - 1];

  useEffect(() => {
    if (!activeProfile) return;

    const flagManager = new FlagManager(activeProfile, (updatedData) => {
      updateProfile(activeProfile.id, updatedData);
    });

    flagManager.evaluateInitialFlags();

    const intervalId = setInterval(() => {
      flagManager.processExpiredFlags();
    }, 60000);

    return () => {
      flagManager.destroy();
      clearInterval(intervalId);
    };
  }, [activeProfile, updateProfile]);

  const handlePlayTrack = (trackIndex: number) => {
    setCurrentTrackIndex(trackIndex);
  };

  const handleClosePlayer = () => {
    setCurrentTrackIndex(null);
  };

  const handleNextTrack = () => {
    if (currentTrackIndex === null) return;
    const nextIndex = (currentTrackIndex + 1) % Playlist.length;
    setCurrentTrackIndex(nextIndex);
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
    { id: 'testChatApp', name: 'TestChatApp' },
    { id: 'radixDemo', name: 'Radix Demo' },
    { id: 'bubbleChat', name: 'BubbleChat' },
  ];

  const desktopApps = [
    { id: 'likestagram', name: 'Likestagram', icon: <Heart className="h-12 w-12" /> },
    { id: 'terminal', name: 'Terminal', icon: <TerminalIcon className="h-12 w-12" /> },
    { id: 'music', name: 'Music', icon: <Music className="h-12 w-12" /> },
    { id: 'ehmazon', name: 'Ehmazon', icon: <ShoppingCart className="h-12 w-12" /> },
    { id: 'chatcord', name: 'ChatCord', icon: <MessageSquare className="h-12 w-12" /> },
    { id: 'testChatApp', name: 'TestChatApp', icon: <ChartBarDecreasing className="h-12 w-12" /> },
    { id: 'radixDemo', name: 'Radix Demo', icon: <ChartBarDecreasing className="h-12 w-12" /> },
    { id: 'bubbleChat', name: 'BubbleChat', icon: <MessageCircle className="h-12 w-12" /> },
  ];

  const getAppComponent = (app: AppInstance, props: any = {}): React.ReactNode => {
    switch (app.id) {
      case 'likestagram':
        return <Likestagram onViewProfile={(user) => handleViewProfile(user)} />;
      case 'likestagramProfile':
        return <LikestagramProfileApp user={props.user} />;
      case 'terminal':
        return <TerminalApp setShowDebug={setShowDebug} />;
      case 'music':
        return <MusicApp onPlayTrack={handlePlayTrack} />;
      case 'ehmazon':
        return <EhmazonApp />;
      case 'chatcord':
        return <ChatCordApp />;
      case 'testChatApp':
        return <TestChatApp />;
      case 'radixDemo':
        return <RadixDemoApp />;
      case 'bubbleChat':
        return <BubbleChatApp />;
      case 'settings':
        return <SettingsApp onClose={closeApp} />;
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

  const bgUrl = activeProfile.desktopBgUrl || '';
  const isVideo = bgUrl.endsWith('.webm');
  const isImage = (bgUrl.startsWith('http') || bgUrl.startsWith('/')) && !isVideo;


  return (
    <div
      className="relative flex h-full w-full flex-col-reverse md:flex-col bg-background animate-in fade-in duration-500"
      style={!isImage && !isVideo ? { background: activeProfile.desktopBgUrl } : {}}
    >

      {isImage && (
        <Image
          src={activeProfile.desktopBgUrl!}
          alt="Desktop Background"
          fill
          className="object-cover z-0"
        />
      )}
      {isVideo && (
        <video
          src={activeProfile.desktopBgUrl}
          autoPlay
          loop
          muted
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
        />
      )}

      <div className="relative z-10 flex-grow p-2">
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

      <div className='relative z-[60]'>
        {currentTrackIndex !== null && (
          <MediaPlayer
            currentTrackIndex={currentTrackIndex}
            setCurrentTrackIndex={setCurrentTrackIndex}
            onClose={handleClosePlayer}
          />
        )}
      </div>

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
