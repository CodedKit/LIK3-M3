'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Power, Settings, User, Wifi, BatteryFull, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { UserProfile } from '@/hooks/use-user-profile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


interface TaskbarProps {
  userProfile: UserProfile;
  onLogout: () => void;
}

export default function Taskbar({ userProfile, onLogout }: TaskbarProps) {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <footer className="h-12 w-full flex-shrink-0 border-t border-white/10 bg-black/30 backdrop-blur-sm">
      <div className="flex h-full items-center justify-between px-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 px-3 font-headline text-lg">
                VT
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 mb-2" side="top" align="start">
            <DropdownMenuLabel>
                <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarImage src={userProfile.avatarUrl} alt={userProfile.username} />
                        <AvatarFallback>{userProfile.username.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{userProfile.username}</span>
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Account Info</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout}>
              <Power className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center gap-4 text-sm text-primary-foreground">
            <div className='flex items-center gap-2'>
                <Wifi className="h-4 w-4" />
                <BatteryFull className="h-4 w-4" />
                <Volume2 className="h-4 w-4" />
            </div>
            <div className='w-px h-5 bg-border' />
            <span>{currentTime}</span>
        </div>
      </div>
    </footer>
  );
}
