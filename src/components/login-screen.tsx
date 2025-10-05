'use client';

import { useState } from 'react';
import { useForm, type UseFormReturn, type FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { UserCircle, Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, useFormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import type { UserProfile } from '@/hooks/use-user-profile';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import ProfileCard from './profile-card';
import { cn } from '@/lib/utils';

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
    <div className={cn("relative group w-[144px]")}>
        <div
            onClick={!isCreating ? openCreator : undefined}
            className={cn(
                "relative group flex h-auto flex-col items-center gap-1 rounded-lg text-center transition-all duration-200 overflow-visible p-2",
                !isCreating && "cursor-pointer hover:ring-1 hover:ring-border"
            )}
        >
            <div className='w-full'>
                <div className="aspect-square flex items-center justify-center rounded-lg bg-muted/50 w-full">
                    <UserCircle className="h-12 w-auto text-muted-foreground/50" strokeWidth={1} />
                </div>
            </div>
            {isCreating ? (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="mt-2 w-full">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => {
                                const { error } = useFormField();
                                return (
                                    <FormItem>
                                        <FormControl>
                                            <Input 
                                                placeholder="username..." 
                                                {...field} 
                                                className={cn("h-8 text-left w-full", error && "border-destructive focus-visible:ring-destructive")}
                                            />
                                        </FormControl>
                                    </FormItem>
                                );
                            }}
                        />
                         <Button type="submit" variant="outline" size="icon" className="absolute -bottom-11 left-1/2 -translate-x-1/2 h-8 w-8">
                            <Check className="h-4 w-4" />
                        </Button>
                    </form>
                </Form>
            ) : (
                <Button size="xs" variant="outline" className="mt-2 w-full">
                    + New Profile
                </Button>
            )}
        </div>
    </div>
);

interface LoginScreenProps {
    profiles: UserProfile[];
    onAccountCreate: (newProfileData: Omit<UserProfile, 'id'>) => void;
    onLogin: (profile: UserProfile) => void;
    onProfileDelete: (profileId: string) => void;
}


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

  const showAddProfileCard = profiles.length < 5 || isCreating;
  const showZeroState = profiles.length === 0;

  return (
    <div className="flex h-full w-full flex-col items-center justify-center animate-in fade-in duration-500">
      <div className="flex flex-row flex-wrap items-start justify-center gap-8 p-8">
        {profiles.map((profile) => (
          <ProfileCard
            key={profile.id}
            profile={profile}
            onClick={onLogin}
            onDelete={handleDelete}
          />
        ))}
        
        {showAddProfileCard && (!showZeroState || (showZeroState && isCreating)) && (
          <AddProfileCard 
            isCreating={isCreating}
            openCreator={openCreator}
            form={form}
            onSubmit={onSubmit}
            onInvalid={onInvalid}
          />
        )}

        {showZeroState && !isCreating && (
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
  );
}
