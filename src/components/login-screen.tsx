'use client';

import { useState } from 'react';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { UserCircle, Trash2, Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import type { UserProfile } from '@/hooks/use-user-profile';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import ProfileCard from './profile-card';
import { cn } from '@/lib/utils';

interface LoginScreenProps {
  profiles: UserProfile[];
  onAccountCreate: (profile: Omit<UserProfile, 'id'>) => void;
  onLogin: (profile: UserProfile) => void;
  onProfileDelete: (profileId: string) => void;
}

const formSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters.').max(20, 'Username must be at most 20 characters.'),
});

interface AddProfileCardProps {
    isCreating: boolean;
    openCreator: () => void;
    form: UseFormReturn<z.infer<typeof formSchema>>;
    onSubmit: (values: z.infer<typeof formSchema>) => void;
}

const AddProfileCard = ({ isCreating, openCreator, form, onSubmit }: AddProfileCardProps) => (
    <ProfileCard onClick={!isCreating ? openCreator : undefined} className={cn("w-[200px]")}>
        <div className="flex h-[88px] w-full items-center justify-center p-2">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted/50">
                <UserCircle className="h-8 w-auto text-muted-foreground/50" strokeWidth={1} />
            </div>
        </div>
        {isCreating ? (
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-2 w-full">
                <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                    <FormItem>
                    <div className="flex w-full items-start justify-center gap-2">
                        <FormControl>
                        <Input placeholder="Username" {...field} className="h-8 text-xs w-full" />
                        </FormControl>
                        <Button type="submit" size="icon" className="h-8 w-8 flex-shrink-0">
                        <Check />
                        </Button>
                    </div>
                    <FormMessage className="text-xs" />
                    </FormItem>
                )}
                />
            </form>
            </Form>
        ) : (
            <Button size="xs" variant="outline" className="mt-2">
            + New Profile
            </Button>
        )}
    </ProfileCard>
);

export default function LoginScreen({ profiles, onAccountCreate, onLogin, onProfileDelete }: LoginScreenProps) {
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

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const avatar = PlaceHolderImages.find(img => img.id === 'user-avatar-1');
    if (!avatar) {
        toast({
            title: "Error",
            description: "Default avatar not found. Please try again.",
            variant: "destructive"
        })
        return;
    }
    
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
  };
  
  const openCreator = () => {
    if (profiles.length < 5) {
      setIsCreating(true);
    }
  };

  const showAddProfileCard = profiles.length < 5 || isCreating;
  const showZeroState = profiles.length === 0;

  return (
    <div className="flex h-full w-full flex-col items-center justify-center animate-in fade-in duration-500">
      <div className="flex flex-row flex-wrap items-start justify-center gap-8 p-8">
        {profiles.map((profile) => (
          <ProfileCard key={profile.id} onClick={() => onLogin(profile)} className="w-[200px]">
            <div className="p-2">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile.avatarUrl} alt={profile.username} />
                <AvatarFallback>{profile.username.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
            <p className="mt-2 text-lg font-headline text-primary-foreground">{profile.username}</p>
            <Button
              variant="ghost"
              size="icon"
              className="absolute bottom-2 right-2 h-auto py-1 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => handleDelete(e, profile.id)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </ProfileCard>
        ))}
        
        {showAddProfileCard && (!showZeroState || (showZeroState && isCreating)) && (
          <AddProfileCard 
            isCreating={isCreating}
            openCreator={openCreator}
            form={form}
            onSubmit={onSubmit}
          />
        )}

        {showZeroState && !isCreating && (
            <AddProfileCard 
              isCreating={isCreating}
              openCreator={openCreator}
              form={form}
              onSubmit={onSubmit}
            />
        )}
      </div>
    </div>
  );
}
