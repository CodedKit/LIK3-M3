
'use client';

import { useEffect, useState } from 'react';
import { useForm, type UseFormReturn, type FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { UserCircle, Check, Bug, PlusIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, useFormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { type UserProfile } from '@/context/user-profile-context';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import ProfileCard from './profile-card';
import { cn } from '@/lib/utils';
import DebugOverlay from './debug-overlay';
import { MobileNav } from './molecules/MobileNav';
import { Header } from './organisms/Header';
import { Head } from 'react-day-picker';
import Taskbar from '@/components/desktop/taskbar';

const formSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters.').max(20, 'Username must be at most 20 characters.'),
});

interface AddProfileCardProps {
  isCreating: boolean;
  openCreator: () => void;
  form: UseFormReturn<z.infer<typeof formSchema>>;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  onInvalid: (errors: FieldErrors<z.infer<typeof formSchema>>) => void;
}

const AddProfileCard = ({ isCreating, openCreator, form, onSubmit, onInvalid }: AddProfileCardProps) => (
  <div className='w-48 h-60 border-2 border-solid border-muted-foreground/10 rounded-lg px-4 pt-4 pb-3 '>
    <div className='flex flex-col items-center justify-center w-full h-full '>
      <div className="aspect-square flex items-center justify-center rounded-lg bg-[#1E293B] w-40 h-40">
        <PlusIcon className="h-6 w-auto text-foreground " />
      </div>
      <div className="flex flex-col items-center justify-center w-40 h-10 pt-2">
        <Button size="xs" variant="outline" className="w-full ">
          <p className='text-sm leading-6 font-medium'>+ New Account</p>
        </Button>
      </div>
    </div>
  </div>
);

interface LoginScreenProps {
  profiles: UserProfile[];
  onAccountCreate: (newProfileData: Omit<UserProfile, 'id' | 'showDebug' | 'xp' | 'money'>) => void;
  onLogin: (profile: UserProfile) => void;
  onProfileDelete: (profileId: string) => void;
  showDebug: boolean;
  setShowDebug: (show: boolean | ((s: boolean) => boolean)) => void;
}


export default function LoginScreen({ profiles, onAccountCreate, onLogin, onProfileDelete, showDebug, setShowDebug }: LoginScreenProps) {
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
    },
  });

  const handleDelete = (e: React.MouseEvent, profileId: string) => {
    e.stopPropagation();
    onProfileDelete(profileId);
    toast({
      title: "Profile Deleted",
      description: "The user profile has been removed.",
    });
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    const avatar = PlaceHolderImages.find(img => img.id === 'user-avatar-1');
    if (!avatar) {
      toast({
        title: "Error",
        description: "Default avatar not found. Please try again.",
        variant: "destructive"
      })
      return;
    }

    try {
      onAccountCreate({
        username: values.username,
        avatarUrl: avatar.imageUrl
      });
      toast({
        title: "Profile Created",
        description: `Welcome, ${values.username}!`,
      });
      setIsCreating(false);
      form.reset();
    } catch (error: any) {
      toast({
        title: "Error Creating Profile",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive"
      });
    }
  }

  const onInvalid: Parameters<typeof form.handleSubmit>[1] = (errors) => {
    if (errors.username?.message) {
      toast({
        title: "Invalid Username",
        description: errors.username.message,
        variant: "destructive",
      });
      form.setError("username", { type: "manual", message: errors.username.message });
    }
  };

  const openCreator = () => {
    if (profiles.length < 5) {
      setIsCreating(true);
    } else {
      toast({
        title: "Profile Limit Reached",
        description: "You can only have a maximum of 5 profiles.",
        variant: "destructive"
      })
    }
  };

  const showAddProfileCard = profiles.length < 5;

  useEffect(() => {
    toast({
      title: "Welcome to LIK3 M3",
      description: "Select an account to log in or create a new one.",
    });
  }, []);

  return (
    <div className="relative flex h-full w-full flex-col-reverse md:flex-col bg-background animate-in fade-in duration-500">
      <Taskbar />
      <div className="absolute top-10 right-4">
        <Button variant="ghost" size="icon" onClick={() => setShowDebug(s => !s)}>
          <Bug className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex flex-1 items-center justify-center pt-4 pl-4 pr-4 pb-3">
        <div className="flex flex-col ">
          {profiles.map((profile) => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              onClick={onLogin}
              onDelete={handleDelete}
            />
          ))}

          {(showAddProfileCard || isCreating) && (
            <AddProfileCard
              isCreating={isCreating}
              openCreator={openCreator}
              form={form}
              onSubmit={onSubmit}
              onInvalid={onInvalid}
            />
          )}
        </div>
      </div>

    </div>
  );
}
