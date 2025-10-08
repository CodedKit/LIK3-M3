
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Image from 'next/image';
import { useAuth } from '@/hooks/use-auth';
import { PlaceHolderImages, type ImagePlaceholder } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { calculateLevel } from '@/lib/leveling';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { DialogFooter } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Separator } from '@/components/ui/separator';
import { Trash2 } from 'lucide-react';


const profileSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters.').max(20, 'Username must be at most 20 characters.'),
  description: z.string().max(100, 'Description must be at most 100 characters.').optional(),
});

interface ProfileAppProps {
  onClose: () => void;
  onLogout: () => void;
}

export default function ProfileApp({ onClose, onLogout }: ProfileAppProps) {
  const { activeProfile, updateProfile, deleteProfile } = useAuth();
  const { toast } = useToast();
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  
  const [selectedAvatar, setSelectedAvatar] = useState(activeProfile?.avatarUrl || '');
  const avatarOptions = PlaceHolderImages.filter(img => img.id.startsWith('user-avatar-'));

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: activeProfile?.username || '',
      description: activeProfile?.description || '',
    },
  });

  useEffect(() => {
    if (activeProfile) {
      form.reset({
        username: activeProfile.username,
        description: activeProfile.description || '',
      });
      setSelectedAvatar(activeProfile.avatarUrl);
    }
  }, [activeProfile, form]);

  const handleResetConfirm = () => {
    if (activeProfile) {
      deleteProfile(activeProfile.id);
      onLogout();
    }
    setIsResetDialogOpen(false);
  }

  if (!activeProfile) {
    return <p>No active profile. Please log in.</p>;
  }

  const onSubmit = (data: z.infer<typeof profileSchema>) => {
    if (!activeProfile) return;

    try {
        updateProfile(activeProfile.id, { 
            username: data.username, 
            description: data.description,
            avatarUrl: selectedAvatar,
        });
        toast({
            title: "Profile Updated",
            description: "Your profile has been saved successfully.",
        });
        onClose();
    } catch (error: any) {
        toast({
            title: "Error",
            description: error.message || "Failed to update profile.",
            variant: "destructive",
        });
    }
  };

  const { level, progress, xpForCurrentLevel, totalXpForNextLevel } = calculateLevel(activeProfile.xp);
  const currentXp = activeProfile.xp || 0;

  return (
    <div className="h-full w-full bg-background">
      <Card className="border-0 shadow-none">
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
          <CardDescription>Update your username, description, and profile picture.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-4">
                <Label>Profile Picture</Label>
                <div className="grid grid-cols-3 gap-4">
                  {avatarOptions.map((avatar: ImagePlaceholder) => (
                    <button
                      key={avatar.id}
                      type="button"
                      onClick={() => setSelectedAvatar(avatar.imageUrl)}
                      className={cn(
                        'relative aspect-square w-full rounded-lg overflow-hidden border-2',
                        selectedAvatar === avatar.imageUrl ? 'border-primary' : 'border-transparent'
                      )}
                    >
                      <Image
                        src={avatar.imageUrl}
                        alt={avatar.description}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <Label>Experience</Label>
                <div className='flex items-center gap-2'>
                    <p className="text-sm font-bold text-primary">Lvl. {level}</p>
                    <p className="text-xs font-medium text-primary-foreground">({currentXp} XP)</p>
                </div>
                <Progress value={progress} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{currentXp - xpForCurrentLevel} / {totalXpForNextLevel - xpForCurrentLevel} XP</span>
                  <span>{Math.floor(progress)}%</span>
                </div>
              </div>
              
              <DialogFooter>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </Form>

          <Separator className="my-8" />
            
          <Card>
            <CardHeader>
              <CardTitle>Delete Account</CardTitle>
              <CardDescription>
                This action is permanent and cannot be undone. All your data will be permanently deleted.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" onClick={() => setIsResetDialogOpen(true)}>Delete Account</Button>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
      <AlertDialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <AlertDialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete your account?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account
              and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>no huh</AlertDialogCancel>
            <AlertDialogAction onClick={handleResetConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              Yes bbi
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
