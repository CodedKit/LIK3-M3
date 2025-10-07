
'use client';

import Image from 'next/image';
import { User, Power, Settings, Wifi, Battery, CircleDollarSign } from 'lucide-react';
import { type UserProfile } from '@/context/user-profile-context';
import { calculateLevel } from '@/lib/leveling';
import { Progress } from '@/components/ui/progress';
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
    const { level, progress } = calculateLevel(userProfile.xp);

    return (
        <div className="relative z-40 w-full bg-card/80 backdrop-blur-sm md:border-t border-b md:border-b-0 h-14 shrink-0 flex items-center justify-between px-4">
            <div className="flex items-center gap-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-3 focus:outline-none">
                            <div className="relative">
                                {userProfile.avatarUrl && (
                                    <Image
                                        src={userProfile.avatarUrl}
                                        alt={userProfile.username}
                                        width={36}
                                        height={36}
                                        className="h-9 w-9 rounded-sm object-cover"
                                    />
                                )}
                                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-green-500 ring-1 ring-background" />
                            </div>
                            <div className="flex flex-col items-start">
                                <div className='flex items-center gap-2'>
                                    <p className="text-sm font-medium text-primary-foreground">{userProfile.username}</p>
                                    <p className="text-xs font-bold text-primary">Lvl. {level}</p>
                                </div>
                                <div className='w-full mt-1'>
                                    <Progress value={progress} className="h-1 w-24" />
                                    <p className="text-[8px] text-muted-foreground">{Math.floor(progress)}%</p>
                                </div>
                            </div>
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="bottom" sideOffset={8} align="start" className="w-56 md:side-top">
                        <DropdownMenuLabel>
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
                <div className="flex items-center gap-1 text-primary-foreground">
                    <CircleDollarSign className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">{userProfile.money?.toLocaleString() || 0}</span>
                </div>
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
