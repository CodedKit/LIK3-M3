"use client";

import React from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { BookOpen, ListChecks, Settings, History } from 'lucide-react';

interface StoryTabsProps {
    storyContent: React.ReactNode;
    choicesContent: React.ReactNode;
    settingsContent?: React.ReactNode;
    historyContent?: React.ReactNode;
    defaultTab?: string;
}

/**
 * A Radix UI Tabs component for organizing story UI into sections:
 * - Story: Main narrative text
 * - Choices: Available story branches
 * - Settings: Text size, auto-play, etc.
 * - History: Previous choices and paths taken
 */
export const StoryTabs: React.FC<StoryTabsProps> = ({
    storyContent,
    choicesContent,
    settingsContent,
    historyContent,
    defaultTab = 'story'
}) => {
    const tabs = [
        { value: 'story', label: 'Story', icon: <BookOpen size={18} />, content: storyContent },
        { value: 'choices', label: 'Choices', icon: <ListChecks size={18} />, content: choicesContent },
        ...(settingsContent ? [{ value: 'settings', label: 'Settings', icon: <Settings size={18} />, content: settingsContent }] : []),
        ...(historyContent ? [{ value: 'history', label: 'History', icon: <History size={18} />, content: historyContent }] : [])
    ];

    return (
        <Tabs.Root defaultValue={defaultTab} style={{ width: '100%' }}>
            {/* Tab List */}
            <Tabs.List
                style={{
                    display: 'flex',
                    borderBottom: '2px solid #e5e7eb',
                    gap: '4px',
                    marginBottom: '20px'
                }}
            >
                {tabs.map((tab) => (
                    <Tabs.Trigger
                        key={tab.value}
                        value={tab.value}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            padding: '12px 20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '500',
                            color: '#6b7280',
                            borderBottom: '2px solid transparent',
                            marginBottom: '-2px',
                            transition: 'all 0.2s',
                            position: 'relative'
                        }}
                        onMouseEnter={(e) => {
                            if (!e.currentTarget.getAttribute('data-state')?.includes('active')) {
                                e.currentTarget.style.color = '#111827';
                                e.currentTarget.style.background = '#f9fafb';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!e.currentTarget.getAttribute('data-state')?.includes('active')) {
                                e.currentTarget.style.color = '#6b7280';
                                e.currentTarget.style.background = 'transparent';
                            }
                        }}
                        data-state={undefined}
                    >
                        {tab.icon}
                        {tab.label}
                    </Tabs.Trigger>
                ))}
            </Tabs.List>

            {/* Tab Content */}
            {tabs.map((tab) => (
                <Tabs.Content
                    key={tab.value}
                    value={tab.value}
                    style={{
                        padding: '16px 8px',
                        animation: 'fadeIn 0.3s ease-out'
                    }}
                >
                    {tab.content}
                </Tabs.Content>
            ))}

            {/* CSS for active tab styling */}
            <style jsx>{`
                [data-state="active"] {
                    color: #3b82f6 !important;
                    border-bottom-color: #3b82f6 !important;
                    background: #eff6ff !important;
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-4px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </Tabs.Root>
    );
};

/**
 * Compact version for smaller spaces
 */
export const CompactStoryTabs: React.FC<StoryTabsProps> = (props) => {
    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <StoryTabs {...props} />
        </div>
    );
};
