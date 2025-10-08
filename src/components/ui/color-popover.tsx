
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn, isHostnameAllowed } from '@/lib/utils';
import { CheckIcon } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';


export function ColorPopover({
  background,
  setBackground,
  solids,
  gradients,
  defaultTab,
  customUrl,
  setCustomUrl,
}: {
  background: string;
  setBackground: (background: string) => void;
  solids: string[];
  gradients: string[];
  defaultTab: string;
  customUrl: string;
  setCustomUrl: (url: string) => void;
}) {
  const { toast } = useToast();

  const isImage = (str: string) => str.startsWith('http');
  const isWebm = (str: string) => str.endsWith('.webm');
  
  const handleSetBackground = () => {
    if (isImage(customUrl) && !isHostnameAllowed(customUrl)) {
      toast({
        title: 'Unsupported Website',
        description: 'The provided URL is from a domain that is not supported.',
        variant: 'destructive',
      });
      return;
    }
    setBackground(customUrl);
  };

  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <TabsList className="mb-4 w-full grid grid-cols-3">
        <TabsTrigger className="flex-1" value="solid">
          Solid
        </TabsTrigger>
        <TabsTrigger className="flex-1" value="gradient">
          Gradient
        </TabsTrigger>
        <TabsTrigger className="flex-1" value="url">
          URL
        </TabsTrigger>
      </TabsList>

      <TabsContent value="solid" className="mt-0 flex flex-wrap gap-1">
        {solids.map((s) => (
          <div
            key={s}
            style={{ background: s }}
            className="h-6 w-6 cursor-pointer rounded-md active:scale-105"
            onClick={() => setBackground(s)}
          />
        ))}
      </TabsContent>

      <TabsContent value="gradient" className="mt-0">
         <div className="flex flex-wrap gap-1">
            {gradients.map((s) => (
              <div
                key={s}
                style={{ background: s }}
                className="h-6 w-6 cursor-pointer rounded-md active:scale-105"
                onClick={() => setBackground(s)}
              />
            ))}
          </div>
      </TabsContent>
      
      <TabsContent value="url" className="mt-0 space-y-2">
        <div className="flex items-center gap-2">
            <Input
                id="custom-url"
                value={customUrl}
                className="h-8"
                onChange={(e) => setCustomUrl(e.currentTarget.value)}
                placeholder='image, gif, webm...'
            />
            <Button size="icon" className="h-8 w-8" onClick={handleSetBackground}>
                <CheckIcon className="h-4 w-4" />
            </Button>
        </div>
      </TabsContent>

      {!background.startsWith('http') && (
        <Input
          id="custom"
          value={background}
          className="col-span-2 mt-4 h-8"
          onChange={(e) => setBackground(e.currentTarget.value)}
        />
      )}
    </Tabs>
  );
}
