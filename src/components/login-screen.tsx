'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { UserCircle, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import type { UserProfile } from '@/hooks/use-user-profile';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import ProfileCard from './profile-card';

interface LoginScreenProps {
  profiles: UserProfile[];
  onAccountCreate: (profile: Omit<UserProfile, 'id'>) => void;
  onLogin: (profile: UserProfile) => void;
  onProfileDelete: (profileId: string) => void;
}

const formSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters.').max(20, 'Username must be at most 20 characters.'),
});

export default function LoginScreen({ profiles, onAccountCreate, onLogin, onProfileDelete }: LoginScreenProps) {
  const [isOpen, setIsOpen] = useState(false);
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
    setIsOpen(false);
    form.reset();
  };
  
  const openDialog = () => setIsOpen(true);
  const onDialogStateChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      form.reset();
    }
  }

  const AddProfileCard = () => (
    <ProfileCard onClick={openDialog}>
      <div className="p-2">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted/50">
            <UserCircle className="h-8 w-auto text-muted-foreground/50" strokeWidth={1}/>
        </div>
      </div>
      <Button size="xs" variant="outline" className='mt-2'>+ New Profile</Button>
    </ProfileCard>
  );

  return (
    <div className="flex h-full w-full flex-col items-center justify-center animate-in fade-in duration-500">
      <div className="flex flex-row flex-wrap items-start justify-center gap-8 p-8">
        {profiles.map((profile) => (
          <ProfileCard
            key={profile.id}
            onClick={() => onLogin(profile)}
          >
              <div className="p-2">
                <Avatar className="h-20 w-20">
                    <AvatarImage src={profile.avatarUrl} alt={profile.username} />
                    <AvatarFallback>{profile.username.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
              <p className="mt-2 text-lg font-headline text-primary-foreground">{profile.username}</p>
              <Button variant="ghost" size="icon" className="h-auto py-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => handleDelete(e, profile.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
          </ProfileCard>
        ))}
        {profiles.length < 5 && <AddProfileCard />}
      </div>

      <Dialog open={isOpen} onOpenChange={onDialogStateChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className='font-headline'>Create Your Profile</DialogTitle>
            <DialogDescription>
              Choose a username to begin your journey in Virtual Temptations.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Create Account</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
