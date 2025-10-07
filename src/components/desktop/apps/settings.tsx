
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserProfileContext } from '@/context/user-profile-context';
import { PlaceHolderImages, type ImagePlaceholder } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface SettingsAppProps {
  onClose: () => void;
}

export default function SettingsApp({ onClose }: SettingsAppProps) {
  const { activeProfile, updateProfile } = useUserProfileContext();
  const { toast } = useToast();
  
  const [selectedBg, setSelectedBg] = useState(activeProfile?.desktopBgUrl || '');
  const backgroundOptions = PlaceHolderImages.filter(img => img.id.startsWith('desktop-bg-'));

  const handleSaveVisuals = () => {
    if (!activeProfile) return;
    try {
      updateProfile(activeProfile.id, { desktopBgUrl: selectedBg });
      toast({
        title: "Settings Saved",
        description: "Your visual settings have been updated.",
      });
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save settings.",
        variant: "destructive",
      });
    }
  };


  return (
    <div className="h-full w-full bg-background p-4">
      <Tabs defaultValue="gameplay" className="h-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="gameplay">Gameplay</TabsTrigger>
          <TabsTrigger value="sound">Sound</TabsTrigger>
          <TabsTrigger value="visuals">Visuals</TabsTrigger>
        </TabsList>
        <TabsContent value="gameplay" className="h-full">
            <Card>
                <CardHeader>
                    <CardTitle>Gameplay Settings</CardTitle>
                    <CardDescription>Adjust your gameplay experience.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cheat-code">Enter Cheat Code</Label>
                      <div className="flex gap-2">
                        <Input id="cheat-code" placeholder="Enter your cheat code..." />
                        <Button>Submit</Button>
                      </div>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="sound" className="h-full">
            <Card>
                <CardHeader>
                    <CardTitle>Sound Settings</CardTitle>
                    <CardDescription>Manage audio settings.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p>Sound options will be available here.</p>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="visuals" className="h-full">
            <Card>
                <CardHeader>
                    <CardTitle>Visuals Settings</CardTitle>
                    <CardDescription>Customize the look of the game.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="space-y-4">
                      <Label>Desktop Background</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {backgroundOptions.map((bg: ImagePlaceholder) => (
                          <button
                            key={bg.id}
                            type="button"
                            onClick={() => setSelectedBg(bg.imageUrl)}
                            className={cn(
                              'relative aspect-video w-full rounded-lg overflow-hidden border-2',
                              selectedBg === bg.imageUrl ? 'border-primary' : 'border-transparent'
                            )}
                          >
                            <Image
                              src={bg.imageUrl}
                              alt={bg.description}
                              fill
                              className="object-cover"
                              data-ai-hint={bg.imageHint}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <Button onClick={handleSaveVisuals}>Save Changes</Button>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
