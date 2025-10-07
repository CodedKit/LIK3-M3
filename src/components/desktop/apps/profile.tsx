
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Image from 'next/image';
import { useUserProfileContext } from '@/context/user-profile-context';
import { PlaceHolderImages, type ImagePlaceholder } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const profileSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters.').max(20, 'Username must be at most 20 characters.'),
  description: z.string().max(100, 'Description must be at most 100 characters.').optional(),
});

export default function ProfileApp() {
  const { activeProfile, updateProfile } = useUserProfileContext();
  const { toast } = useToast();
  
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
    } catch (error: any) {
        toast({
            title: "Error",
            description: error.message || "Failed to update profile.",
            variant: "destructive",
        });
    }
  };

  return (
    <div className="h-full w-full bg-background p-4">
      <Card>
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
              
              <Button type="submit">Save Changes</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
