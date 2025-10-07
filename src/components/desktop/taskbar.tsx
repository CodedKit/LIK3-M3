
'use client';

import Image from 'next/image';
import { User, Power, Settings, Trash2, Wifi, Volume2, Battery } from 'lucide-react';
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

interface TaskbarProps {
  userProfile: UserProfile;
  onLogout: () => void;
  onReset: () => void;
  onOpenSettings: () => void;
}

export default function Taskbar({ userProfile, onLogout, onReset, onOpenSettings }: TaskbarProps) {
    return (
        <div className="w-full bg-card/80 backdrop-blur-sm border-t h-16 shrink-0 flex items-center justify-between px-4">
            <div className="flex items-center gap-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-2 focus:outline-none">
                            {userProfile.avatarUrl && (
                                <Image
                                    src={userProfile.avatarUrl}
                                    alt={userProfile.username}
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                />
                            )}
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="top" align="start" className="w-56">
                        <DropdownMenuLabel>
                            <p className="font-bold">{userProfile.username}</p>
                            <p className="text-xs text-muted-foreground">Online</p>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
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
                        <DropdownMenuItem onClick={onReset} className="text-destructive focus:text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Reset Profile</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="flex items-center gap-4 text-sm font-medium text-primary-foreground">
                <div className="flex items-center gap-2">
                    <Wifi className="h-5 w-5" />
                    <Volume2 className="h-5 w-5" />
                    <Battery className="h-5 w-5" />
                </div>
                <TaskbarClock />
            </div>
        </div>
    );
}
