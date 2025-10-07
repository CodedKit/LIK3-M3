
'use client';

import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from './ui/button';
import { Circle } from 'lucide-react';

interface DebugOverlayProps {
  onClose: () => void;
}

export default function DebugOverlay({ onClose }: DebugOverlayProps) {
  const [storage, setStorage] = useState<[string, string][]>([]);

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

    // Optional: listen for storage changes from other tabs/windows
    window.addEventListener('storage', getStorageData);

    return () => {
      window.removeEventListener('storage', getStorageData);
    };
  }, []);

  return (
    <div className="fixed bottom-4 left-4 z-[101] rounded-lg border bg-card/80 p-4 text-card-foreground shadow-lg backdrop-blur-sm max-w-[90vw]">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-xs">localStorage Debug</h3>
        <Button onClick={onClose} variant="ghost" size="icon" className="h-6 w-6">
          <Circle className="h-4 w-4 text-red-500 fill-current" />
        </Button>
      </div>
      <div className="max-h-64 overflow-y-auto overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">Key</TableHead>
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
