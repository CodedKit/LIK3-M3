
'use client';

import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from './ui/button';
import { Circle, Contrast } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DebugOverlayProps {
  onClose: () => void;
}

export default function DebugOverlay({ onClose }: DebugOverlayProps) {
  const [storage, setStorage] = useState<[string, string][]>([]);
  const [isOpaque, setIsOpaque] = useState(false);

  useEffect(() => {
    const getStorageData = () => {
      const data: [string, string][] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const value = localStorage.getItem(key);
          data.push([key, value || '']);
        }
      }
      setStorage(data);
    };

    getStorageData();

    window.addEventListener('storage', getStorageData);

    return () => {
      window.removeEventListener('storage', getStorageData);
    };
  }, []);

  return (
    <div className={cn(
        "fixed bottom-4 left-4 z-[101] rounded-lg border p-4 text-card-foreground shadow-lg max-w-lg",
        isOpaque ? "bg-card/80 backdrop-blur-sm" : "bg-transparent"
      )}>
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className='flex items-center gap-2'>
            <Button onClick={onClose} variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0">
                <Circle className="h-4 w-4 text-red-500 fill-current" />
            </Button>
            <h3 className="font-semibold text-xs whitespace-nowrap">localStorage Debug</h3>
        </div>
        <Button onClick={() => setIsOpaque(o => !o)} variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0">
            <Contrast className="h-4 w-4" />
        </Button>
      </div>
      <div className="max-h-64 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs whitespace-nowrap">Key</TableHead>
              <TableHead className="text-xs">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {storage.length > 0 ? (
              storage.map(([key, value]) => (
                <TableRow key={key}>
                  <TableCell className="py-2 align-top text-xs font-medium whitespace-nowrap">
                    {key}
                  </TableCell>
                  <TableCell className="py-2 align-top text-xs whitespace-pre-wrap break-all">
                    {value}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} className="py-2 text-center text-xs text-muted-foreground">
                  localStorage is empty.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
