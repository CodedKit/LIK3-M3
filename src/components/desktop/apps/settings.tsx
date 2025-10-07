
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SettingsApp() {
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
                <CardContent className="space-y-4">
                    <p>Visual options will be available here.</p>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
