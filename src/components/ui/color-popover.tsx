
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { CheckIcon, Paintbrush } from 'lucide-react';
import Image from 'next/image';
import {
  ChromePicker
} from 'react-color';

export function ColorPopover({
  background,
  setBackground,
  solids,
  gradients,
  images,
  defaultTab,
}: {
  background: string;
  setBackground: (background: string) => void;
  solids: string[];
  gradients: string[];
  images: { id: string; imageUrl: string; description: string; imageHint: string }[];
  defaultTab: string;
}) {
  const defaultTabValue = defaultTab === 'image' ? 'images' : defaultTab;
  return (
    <Tabs defaultValue={defaultTabValue} className="w-full">
      <TabsList className="mb-4 w-full grid grid-cols-3">
        <TabsTrigger className="flex-1" value="solid">
          Solid
        </TabsTrigger>
        <TabsTrigger className="flex-1" value="gradient">
          Gradient
        </TabsTrigger>
        <TabsTrigger className="flex-1" value="images">
          Image
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

      <TabsContent value="images" className="mt-0">
          <div className="grid grid-cols-3 gap-2">
            {images.map((img) => (
              <button
                key={img.id}
                onClick={() => setBackground(img.imageUrl)}
                className={cn(
                  'relative aspect-square w-full rounded-md overflow-hidden border-2',
                  background === img.imageUrl ? 'border-primary' : 'border-transparent'
                )}
              >
                <Image
                  src={img.imageUrl}
                  alt={img.description}
                  fill
                  className="object-cover"
                />
                 {background === img.imageUrl && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><CheckIcon className="h-4 w-4 text-white" /></div>}
              </button>
            ))}
          </div>
      </TabsContent>

      <TabsContent value="picker" className="mt-0">
        <ChromePicker
          color={background}
          onChange={(color) => setBackground(color.hex)}
        />
      </TabsContent>

      <Input
        id="custom"
        value={background}
        className="col-span-2 mt-4 h-8"
        onChange={(e) => setBackground(e.currentTarget.value)}
      />
    </Tabs>
  );
}

