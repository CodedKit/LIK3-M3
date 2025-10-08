
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { CheckIcon, Paintbrush } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import {
  ChromePicker
} from 'react-color';

export function ColorPopover({
  background,
  setBackground,
  solids,
  gradients,
  defaultTab,
}: {
  background: string;
  setBackground: (background: string) => void;
  solids: string[];
  gradients: string[];
  defaultTab: string;
}) {
  const [url, setUrl] = useState(background.startsWith('http') ? background : '');

  const isImage = (str: string) => str.startsWith('http');
  const isGif = (str: string) => isImage(str) && str.endsWith('.gif');
  const isWebm = (str: string) => isImage(str) && str.endsWith('.webm');

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
        {(isImage(url) && !isWebm(url)) && (
          <div className="relative aspect-video w-full rounded-md overflow-hidden border">
              <Image 
                src={url} 
                alt="Preview" 
                fill 
                className="object-cover" 
                unoptimized={isGif(url)}
              />
          </div>
        )}
         {isWebm(url) && (
            <div className="relative aspect-video w-full rounded-md overflow-hidden border flex items-center justify-center bg-black">
                <p className="text-xs text-white">Video preview not supported</p>
            </div>
         )}
        <div className="flex items-center gap-2">
            <Input
                id="custom-url"
                value={url}
                className="h-8"
                onChange={(e) => setUrl(e.currentTarget.value)}
                placeholder='https://... (image, gif, webm)'
            />
            <Button size="icon" className="h-8 w-8" onClick={() => setBackground(url)}>
                <CheckIcon className="h-4 w-4" />
            </Button>
        </div>
      </TabsContent>

      <TabsContent value="picker" className="mt-0">
        <ChromePicker
          color={background}
          onChange={(color) => setBackground(color.hex)}
        />
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
