
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { CheckIcon } from 'lucide-react';
import {
  ChromePicker,
  CirclePicker,
  HuePicker,
  TwitterPicker,
  SketchPicker,
} from 'react-color';

export function ColorPopover({
  background,
  setBackground,
  solids,
  defaultTab,
}: {
  background: string;
  setBackground: (background: string) => void;
  solids: string[];
  defaultTab: string;
}) {
  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <TabsList className="mb-4 w-full">
        <TabsTrigger className="flex-1" value="solid">
          Solid
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
