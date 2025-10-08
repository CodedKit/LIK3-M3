
'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserProfileContext } from '@/context/user-profile-context';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ColorPopover } from '@/components/ui/color-popover';
import { Paintbrush } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SettingsAppProps {
  onClose: () => void;
}

export default function SettingsApp({ onClose }: SettingsAppProps) {
  const { activeProfile, updateProfile } = useUserProfileContext();
  const { toast } = useToast();
  
  const [background, setBackground] = useState(activeProfile?.desktopBgUrl || '');
  const images = PlaceHolderImages.filter(img => img.id.startsWith('desktop-bg-'));

  const solids = [
    '#E2E2E2',
    '#ff75c3',
    '#ffa647',
    '#ffe83f',
    '#9fff5b',
    '#70e2ff',
    '#cd93ff',
    '#09203f',
  ];

  const gradients = [
    'linear-gradient(to top left,#accbee,#e7f0fd)',
    'linear-gradient(to top left,#d5d4d0,#d5d4d0,#eeeeec)',
    'linear-gradient(to top left,#000000,#434343)',
    'linear-gradient(to top left,#09203f,#537895)',
    'linear-gradient(to top left,#f2994a,#f2c94c)',
    'linear-gradient(to top left,#ee9ca7,#ffdde1)',
    'linear-gradient(to top left,#a6c1ee,#fbc2eb)',
    'linear-gradient(to top left,#8abd, #654ea3, #eaafc8)',
    'linear-gradient(to top left,#84fab0,#8fd3f4)',
    'linear-gradient(to top left,#a1c4fd,#c2e9fb)',
    'linear-gradient(to top left,#d4fc79,#96e6a1)',
    'linear-gradient(to top left,#fda085,#f6d365)',
  ];

  const defaultTab = useMemo(() => {
    if (background.startsWith('http')) return 'url';
    if (background.includes('gradient')) return 'gradient';
    return 'solid';
  }, [background]);

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

  const isColor = !background.startsWith('http') && !background.startsWith('/');

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
                        <Label>Backgrounds</Label>
                        <div className="grid grid-cols-3 gap-2">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <button
                                        className={cn(
                                            'relative aspect-video w-full rounded-md overflow-hidden border-2 flex items-center justify-center group',
                                            isColor ? 'border-primary' : 'border-border'
                                        )}
                                        style={isColor ? { background } : {}}
                                    >
                                        {!isColor && <div className="absolute inset-0 bg-background/50" />}
                                        <Paintbrush className={cn("h-8 w-8 z-10", isColor ? "text-white/50" : "text-foreground")} />
                                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                                            <Badge variant="secondary" className="bg-black/50 text-white/90 border-transparent text-xs capitalize">
                                                Custom
                                            </Badge>
                                        </div>
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent className="w-72">
                                    <ColorPopover
                                    background={background}
                                    setBackground={handleBackgroundChange}
                                    solids={solids}
                                    gradients={gradients}
                                    defaultTab={defaultTab}
                                    />
                                </PopoverContent>
                            </Popover>
                            {images.map((img) => (
                                <button
                                key={img.id}
                                onClick={() => handleBackgroundChange(img.imageUrl)}
                                className={cn(
                                    'relative aspect-video w-full rounded-md overflow-hidden border-2 group',
                                    background === img.imageUrl ? 'border-primary' : 'border-transparent'
                                )}
                                >
                                <Image
                                    src={img.imageUrl}
                                    alt={img.description}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent transition-opacity opacity-0 group-hover:opacity-100"></div>
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                                    <Badge variant="secondary" className="bg-black/50 text-white/90 border-transparent text-xs capitalize">
                                        {img.imageHint}
                                    </Badge>
                                </div>
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
