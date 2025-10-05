'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { UserCircle, UserPlus } from 'lucide-react';

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
}

const formSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters.').max(20, 'Username must be at most 20 characters.'),
});

export default function LoginScreen({ profiles, onAccountCreate, onLogin }: LoginScreenProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
    },
  });

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

  return (
    <div className="flex h-full w-full flex-col items-center justify-center animate-in fade-in duration-500">
      <div className="flex flex-row items-start gap-8">
        {profiles.length > 0 ? (
          <>
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
              </ProfileCard>
            ))}
             <ProfileCard onClick={openDialog}>
                <div className="p-2">
                    <Avatar className="flex h-20 w-20 items-center justify-center bg-muted/50">
                        <UserPlus className="h-8 w-auto text-muted-foreground/50" strokeWidth={1}/>
                    </Avatar>
                </div>
                <Button size="xs" variant="outline" className='mt-2'>+ New Profile</Button>
            </ProfileCard>
          </>
        ) : (
            <ProfileCard onClick={openDialog}>
                <div className="p-2">
                    <Avatar className="flex h-20 w-20 items-center justify-center bg-muted/50">
                        <UserCircle className="h-10 w-10 text-muted-foreground/50" strokeWidth={0.5}/>
                    </Avatar>
                </div>
                <p className="mt-2 text-muted-foreground">Click to create a profile</p>
            </ProfileCard>
        )}
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
