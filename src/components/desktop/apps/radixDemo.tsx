import { RadixShowcase } from '@/components/story/RadixShowcase';
import React from 'react';

export const RadixDemoApp = () => {
    return (
        <div style={{
            width: '100%',
            height: '100%',
            overflow: 'auto',
            background: '#f9fafb'
        }}>
            <RadixShowcase />
        </div>
    );
};
