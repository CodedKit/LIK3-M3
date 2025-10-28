"use client";

import React from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDown, Clock, BookmarkCheck } from 'lucide-react';

export interface StoryHistoryItem {
    id: string;
    choiceText: string;
    timestamp: Date;
    resultText?: string;
}

interface StoryHistoryAccordionProps {
    history: StoryHistoryItem[];
    emptyMessage?: string;
}

/**
 * A Radix UI Accordion component for displaying story choice history.
 * Shows previous choices made by the player with timestamps.
 */
export const StoryHistoryAccordion: React.FC<StoryHistoryAccordionProps> = ({
    history,
    emptyMessage = "No choices made yet. Start your journey!"
}) => {
    if (history.length === 0) {
        return (
            <div style={{
                padding: '40px 20px',
                textAlign: 'center',
                color: '#9ca3af'
            }}>
                <BookmarkCheck size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                <p style={{ fontSize: '14px', margin: 0 }}>{emptyMessage}</p>
            </div>
        );
    }

    return (
        <Accordion.Root type="multiple" style={{ width: '100%' }}>
            {history.map((item, index) => (
                <Accordion.Item
                    key={item.id}
                    value={item.id}
                    style={{
                        borderBottom: '1px solid #e5e7eb',
                        overflow: 'hidden'
                    }}
                >
                    {/* Trigger - Click to expand */}
                    <Accordion.Header style={{ margin: 0 }}>
                        <Accordion.Trigger
                            style={{
                                width: '100%',
                                background: 'transparent',
                                border: 'none',
                                padding: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                cursor: 'pointer',
                                fontSize: '14px',
                                color: '#374151',
                                transition: 'all 0.2s',
                                textAlign: 'left'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#f9fafb';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent';
                            }}
                        >
                            <div style={{ flex: 1 }}>
                                {/* Choice number and text */}
                                <div style={{
                                    fontWeight: '500',
                                    marginBottom: '4px',
                                    color: '#111827'
                                }}>
                                    <span style={{
                                        color: '#3b82f6',
                                        fontWeight: '600',
                                        marginRight: '8px'
                                    }}>
                                        #{history.length - index}
                                    </span>
                                    {item.choiceText}
                                </div>

                                {/* Timestamp */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    fontSize: '12px',
                                    color: '#9ca3af'
                                }}>
                                    <Clock size={12} />
                                    {new Date(item.timestamp).toLocaleTimeString()}
                                </div>
                            </div>

                            {/* Chevron icon */}
                            <ChevronDown
                                size={20}
                                style={{
                                    transition: 'transform 0.3s',
                                    color: '#9ca3af',
                                    flexShrink: 0,
                                    marginLeft: '12px'
                                }}
                                data-chevron="true"
                            />
                        </Accordion.Trigger>
                    </Accordion.Header>

                    {/* Content - Expands on click */}
                    <Accordion.Content
                        style={{
                            overflow: 'hidden',
                            background: '#f9fafb',
                            transition: 'all 0.3s ease-out'
                        }}
                    >
                        <div style={{
                            padding: '16px',
                            fontSize: '14px',
                            lineHeight: '1.6',
                            color: '#6b7280'
                        }}>
                            {item.resultText || 'This choice led you down a new path...'}
                        </div>
                    </Accordion.Content>
                </Accordion.Item>
            ))}

            {/* CSS for chevron rotation on open */}
            <style>{`
                [data-state="open"] [data-chevron="true"] {
                    transform: rotate(180deg);
                }
            `}</style>
        </Accordion.Root>
    );
};

/**
 * Compact version with limited height and scroll
 */
export const CompactStoryHistory: React.FC<StoryHistoryAccordionProps> = (props) => {
    return (
        <div style={{
            maxHeight: '400px',
            overflow: 'auto',
            border: '1px solid #e5e7eb',
            borderRadius: '8px'
        }}>
            <StoryHistoryAccordion {...props} />
        </div>
    );
};
