
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
import React from 'react';
import { MobileNav } from '../molecules/MobileNav';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { NavLink } from '../atoms/NavLink';

interface TaskbarProps {
    userProfile?: UserProfile;
    onLogout?: () => void;
    onOpenSettings?: () => void;
    onOpenProfile?: () => void;
    onToggleDebug?: () => void;
}

export default function Taskbar({ userProfile, onLogout, onOpenSettings, onOpenProfile, onToggleDebug }: TaskbarProps) {
    const { level, progress } = calculateLevel(userProfile?.xp || 40);

    return (
        <div className="relative z-50 w-full backdrop-blur-sm md:border-t border-b md:border-b-0 h-10 shrink-0 flex items-center justify-between px-4">
            <div className="flex items-center gap-4">
                <MobileNav />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-3 focus:outline-none">
                            <div className="relative">
                                {/* {userProfile.avatarUrl && (
                                    <Image
                                        src={userProfile.avatarUrl}
                                        alt={userProfile.username}
                                        width={36}
                                        height={36}
                                        className="h-6 w-6 rounded-full object-cover"
                                    />
                                )} */}
                                <Avatar className='flex w-6 h-6'>
                                    <AvatarImage src="https://github.com/shadcn.png" className=' rounded-full' alt="@shadcn" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-green-500 ring-1 ring-background" />
                            </div>
                            <div className="flex flex-col items-start">
                                <div className='flex items-center w-28 gap-1'>
                                    <p className="text-sm font-medium text-primary-foreground">{userProfile?.username || 'Guest'}</p>
                                    <div className='w-[34px] bg-blue-700 '>
                                        <p className="text-xs font-bold text-primary-foreground">Lvl. {level}</p>
                                    </div>
                                </div>
                                <div className="relative w-28 ">
                                    <Progress value={40} className="h-1" />
                                </div>
                            </div>
                        </button>

                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="bottom" sideOffset={20} align="start" className="w-56 md:side-top">
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


                <div className="flex items-center gap-1 text-primary-">
                    <NavLink href="/" label='Label' isActive={false} />
                    <NavLink href="/" label='Label' isActive={false} />
                    <NavLink href="/" label='Label' isActive={false} />
                    <NavLink href="/" label='Label' isActive={false} />

                </div>
            </div>
            <div className="flex gap-1 w-22 h-8 text-sm font-medium text-foreground">
                <div className="flex items-center gap-1">
                    <Wifi className="h-5 w-5" />
                    <VolumeControl />
                    <div className="flex items-center gap-1">
                        <Battery className="h-5 w-5" />
                        <span className="text-[10px] font-medium">98%</span>
                    </div>
                </div>
                <TaskbarClock onClick={onToggleDebug} />
            </div>
        </div>
    );
}
