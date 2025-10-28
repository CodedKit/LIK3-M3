"use client";

import React from 'react';
import * as Popover from '@radix-ui/react-popover';
import { Info } from 'lucide-react';

interface StoryInfoCardProps {
    title?: string;
    description?: string;
    tags?: string[];
}

/**
 * A simple Radix UI Popover component that displays story information
 * in a card format when the info icon is clicked.
 */
export const StoryInfoCard: React.FC<StoryInfoCardProps> = ({
    title = "Story Info",
    description = "No description available",
    tags = []
}) => {
    return (
        <Popover.Root>
            <Popover.Trigger asChild>
                <button
                    style={{
                        background: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#2563eb';
                        e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#3b82f6';
                        e.currentTarget.style.transform = 'scale(1)';
                    }}
                    aria-label="Story information"
                >
                    <Info size={20} />
                </button>
            </Popover.Trigger>

            <Popover.Portal>
                <Popover.Content
                    style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '20px',
                        width: '320px',
                        boxShadow: '0 10px 38px -10px rgba(0,0,0,0.35), 0 10px 20px -15px rgba(0,0,0,0.2)',
                        animation: 'slideUpAndFade 0.3s',
                        border: '1px solid #e5e7eb',
                    }}
                    sideOffset={5}
                >
                    {/* Title */}
                    <div style={{ marginBottom: '12px' }}>
                        <h3 style={{
                            margin: 0,
                            fontSize: '18px',
                            fontWeight: '600',
                            color: '#111827'
                        }}>
                            {title}
                        </h3>
                    </div>

                    {/* Description */}
                    <div style={{ marginBottom: '16px' }}>
                        <p style={{
                            margin: 0,
                            fontSize: '14px',
                            lineHeight: '1.5',
                            color: '#6b7280'
                        }}>
                            {description}
                        </p>
                    </div>

                    {/* Tags */}
                    {tags.length > 0 && (
                        <div>
                            <p style={{
                                fontSize: '12px',
                                fontWeight: '500',
                                color: '#9ca3af',
                                marginBottom: '8px'
                            }}>
                                Tags:
                            </p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                {tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        style={{
                                            background: '#f3f4f6',
                                            padding: '4px 10px',
                                            borderRadius: '6px',
                                            fontSize: '12px',
                                            color: '#374151',
                                        }}
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Arrow */}
                    <Popover.Arrow
                        style={{
                            fill: 'white',
                            filter: 'drop-shadow(0 -1px 0 #e5e7eb)'
                        }}
                    />
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
};
