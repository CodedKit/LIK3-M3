
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

// Since gradient-picker is a web component, we need to declare its type for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'gradient-picker': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

interface GradientPickerProps {
  value?: string;
  onValueChange: (value: string) => void;
  className?: string;
}

export function GradientPicker({ value, onValueChange, className }: GradientPickerProps) {
  const ref = useRef<HTMLElement>(null);
  const [picker, setPicker] = useState<any>(null);

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    const initPicker = () => {
      const gp = new (window as any).GradientPicker({
        parent: currentRef,
      });

      setPicker(gp);

      const handleChange = (e: CustomEvent) => {
        const detail = e.detail;
        if (detail && typeof detail.getSafeValue === 'function') {
          onValueChange(detail.getSafeValue());
        }
      };

      gp.on('change', handleChange);

      return () => {
        gp.off('change', handleChange);
        if (gp.destroy) {
          gp.destroy();
        }
      };
    };

    if ((window as any).GradientPicker) {
      const cleanup = initPicker();
      return cleanup;
    } else {
      const intervalId = setInterval(() => {
        if ((window as any).GradientPicker) {
          clearInterval(intervalId);
          initPicker();
        }
      }, 100);
      return () => clearInterval(intervalId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (picker && value && (value.startsWith('linear-gradient') || value.startsWith('radial-gradient'))) {
        try {
            picker.setValue(value);
        } catch (error) {
            console.error("Failed to set gradient picker value:", error);
        }
    }
  }, [picker, value]);

  return <div ref={ref as React.RefObject<HTMLDivElement>} className={cn("w-full", className)} />;
}
