
'use client';

import Image from 'next/image';
import { User, Power, Settings, Wifi, Battery } from 'lucide-react';
import { type UserProfile } from '@/context/user-profile-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import TaskbarClock from './taskbar-clock';
import VolumeControl from './volume-control';

interface TaskbarProps {
  userProfile: UserProfile;
  onLogout: () => void;
  onOpenSettings: () => void;
  onOpenProfile: () => void;
}

export default function Taskbar({ userProfile, onLogout, onOpenSettings, onOpenProfile }: TaskbarProps) {
    return (
        <div className="w-full bg-card/80 backdrop-blur-sm md:border-t border-b md:border-b-0 h-10 shrink-0 flex items-center justify-between px-4">
            <div className="flex items-center gap-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-2 focus:outline-none">
                            {userProfile.avatarUrl && (
                                <div className="relative">
                                    <Image
                                        src={userProfile.avatarUrl}
                                        alt={userProfile.username}
                                        width={28}
                                        height={28}
                                        className="h-7 w-7 rounded-sm object-cover"
                                    />
                                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-green-500 ring-1 ring-background" />
                                </div>
                            )}
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="bottom" sideOffset={8} align="start" className="w-56 md:side-top">
                        <DropdownMenuLabel>
                            <p className="font-bold">{userProfile.username}</p>
                            <p className="text-xs text-muted-foreground">Online</p>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem onClick={onOpenProfile}>
                                <User className="mr-2 h-4 w-4" />
                                <span>Account Info</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={onOpenSettings}>
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
            </div>
            <div className="flex items-center gap-4 text-sm font-medium text-primary-foreground">
                <div className="flex items-center gap-2">
                    <Wifi className="h-5 w-5" />
                    <VolumeControl />
                    <div className="flex items-center gap-1">
                      <Battery className="h-5 w-5" />
                      <span className="text-[10px] font-medium">98%</span>
                    </div>
                </div>
                <TaskbarClock />
            </div>
        </div>
    );
}
