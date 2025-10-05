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
import { Separator } from './ui/separator';

interface LoginScreenProps {
  onAccountCreate: (profile: UserProfile) => void;
  onLogin: () => void;
  hasProfile: boolean;
  profile: UserProfile | null;
}

const formSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters.').max(20, 'Username must be at most 20 characters.'),
});

export default function LoginScreen({ onAccountCreate, onLogin, hasProfile, profile }: LoginScreenProps) {
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
        {hasProfile && profile ? (
          <>
            <div className="text-center">
              <Button variant="ghost" className="h-48 w-48 p-0 rounded-full hover:bg-accent/20 transition-colors duration-300" onClick={onLogin}>
                  <Avatar className="h-48 w-48">
                      <AvatarImage src={profile.avatarUrl} alt={profile.username} />
                      <AvatarFallback>{profile.username.charAt(0)}</AvatarFallback>
                  </Avatar>
              </Button>
              <p className="mt-4 text-2xl font-headline text-primary-foreground">{profile.username}</p>
              <p className="mt-1 text-muted-foreground">Click avatar to login</p>
            </div>
            <div className="text-center">
              <Button variant="ghost" className="h-48 w-48 p-0 rounded-full hover:bg-accent/20 transition-colors duration-300" onClick={openDialog}>
                <UserPlus className="h-32 w-32 text-muted-foreground/50" strokeWidth={0.5}/>
              </Button>
              <p className="mt-4 text-2xl font-headline text-primary-foreground">+ New Profile</p>
            </div>
          </>
        ) : (
          <div className="text-center">
            <Button variant="ghost" className="h-48 w-48 p-0 rounded-full hover:bg-accent/20 transition-colors duration-300" onClick={openDialog}>
              <UserCircle className="h-48 w-48 text-muted-foreground/50" strokeWidth={0.5}/>
            </Button>
            <p className="mt-4 text-muted-foreground">Click to create a profile</p>
          </div>
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
