
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserProfileContext } from '@/context/user-profile-context';
import { useToast } from '@/hooks/use-toast';
import { ColorPicker } from '@/components/ui/color-picker';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

interface SettingsAppProps {
  onClose: () => void;
}

export default function SettingsApp({ onClose }: SettingsAppProps) {
  const { activeProfile, updateProfile } = useUserProfileContext();
  const { toast } = useToast();
  
  const [background, setBackground] = useState(activeProfile?.desktopBgUrl || '');
  const images = PlaceHolderImages.filter(img => img.id.startsWith('desktop-bg-'));


  const handleBackgroundChange = (newBackground: string) => {
    if (!activeProfile) return;
    try {
      setBackground(newBackground);
      updateProfile(activeProfile.id, { desktopBgUrl: newBackground });
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
      <Tabs defaultValue="visuals" className="h-full">
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
                      <Label>Custom Color</Label>
                      <ColorPicker
                        background={background}
                        setBackground={handleBackgroundChange}
                      />
                    </div>
                    <Separator />
                     <div className="space-y-4">
                        <Label>Background Images</Label>
                        <div className="grid grid-cols-3 gap-2">
                        {images.map((img) => (
                            <button
                            key={img.id}
                            onClick={() => handleBackgroundChange(img.imageUrl)}
                            className={cn(
                                'relative aspect-video w-full rounded-md overflow-hidden border-2',
                                background === img.imageUrl ? 'border-primary' : 'border-transparent'
                            )}
                            >
                            <Image
                                src={img.imageUrl}
                                alt={img.description}
                                fill
                                className="object-cover"
                            />
                            </button>
                        ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
