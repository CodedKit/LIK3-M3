"use client";

import React, { useState } from 'react';
import { StoryInfoCard } from './StoryInfoCard';
import { StoryDialog, FullscreenStoryButton } from './StoryDialog';
import { StoryTabs } from './StoryTabs';
import { StoryToastProvider, useStoryToast } from './StoryToast';
import { StoryHistoryAccordion, type StoryHistoryItem } from './StoryHistoryAccordion';
import { StoryTextSizeSlider, StorySettingsPanel } from './StorySlider';
import { Sparkles } from 'lucide-react';

/**
 * Internal component that uses toast notifications
 */
const ShowcaseContent: React.FC = () => {
    const toast = useStoryToast();
    const [textSize, setTextSize] = useState(16);
    const [dialogOpen, setDialogOpen] = useState(false);

    // Sample story history
    const sampleHistory: StoryHistoryItem[] = [
        {
            id: '1',
            choiceText: 'Pet the cat',
            timestamp: new Date(Date.now() - 120000),
            resultText: 'The cat purrs contentedly and rubs against your hand. It seems to trust you now.'
        },
        {
            id: '2',
            choiceText: 'Give the cat some food',
            timestamp: new Date(Date.now() - 60000),
            resultText: 'The cat eagerly eats the food. Its tail wags happily as it munches.'
        },
        {
            id: '3',
            choiceText: 'Take the cat home',
            timestamp: new Date(),
            resultText: 'You carefully pick up the cat. It nestles into your arms, feeling safe and warm.'
        }
    ];

    return (
        <div style={{
            maxWidth: '900px',
            margin: '40px auto',
            padding: '20px'
        }}>
            {/* Header */}
            <div style={{
                textAlign: 'center',
                marginBottom: '40px',
                padding: '30px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '16px',
                color: 'white'
            }}>
                <Sparkles size={48} style={{ margin: '0 auto 16px' }} />
                <h1 style={{
                    fontSize: '32px',
                    fontWeight: '700',
                    margin: '0 0 12px 0'
                }}>
                    Radix UI Story Components
                </h1>
                <p style={{
                    fontSize: '16px',
                    opacity: 0.9,
                    margin: 0
                }}>
                    Modern, accessible UI components for interactive storytelling
                </p>
            </div>

            {/* Grid Layout */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '24px',
                marginBottom: '40px'
            }}>
                {/* Card 1: Info Popover */}
                <div style={cardStyle}>
                    <h3 style={cardTitleStyle}>1. Info Popover</h3>
                    <p style={cardDescStyle}>
                        Click the info icon to see story details in a popup card.
                    </p>
                    <div style={{ marginTop: '16px' }}>
                        <StoryInfoCard
                            title="Story Example"
                            description="A heartwarming tale about a lonely cat"
                            tags={['adventure', 'friendship', 'cats']}
                        />
                    </div>
                </div>

                {/* Card 2: Dialog Modal */}
                <div style={cardStyle}>
                    <h3 style={cardTitleStyle}>2. Fullscreen Dialog</h3>
                    <p style={cardDescStyle}>
                        Open story in a beautiful modal overlay with backdrop.
                    </p>
                    <div style={{ marginTop: '16px' }}>
                        <StoryDialog
                            trigger={<FullscreenStoryButton />}
                            title="The Cat's Journey"
                            description="Chapter 1: A New Beginning"
                            open={dialogOpen}
                            onOpenChange={setDialogOpen}
                        >
                            <div style={{ fontSize: `${textSize}px`, lineHeight: '1.7' }}>
                                <p>Once upon a time, in a quiet alley, there lived a small orange cat...</p>
                                <p>The cat had no home, no family, but it had something more precious: hope.</p>
                                <p>Every day, it would wait by the corner shop, hoping someone would notice...</p>
                            </div>
                        </StoryDialog>
                    </div>
                </div>

                {/* Card 3: Text Size Slider */}
                <div style={cardStyle}>
                    <h3 style={cardTitleStyle}>3. Text Size Control</h3>
                    <p style={cardDescStyle}>
                        Adjust text size dynamically for better readability.
                    </p>
                    <div style={{ marginTop: '16px' }}>
                        <StoryTextSizeSlider
                            value={textSize}
                            onChange={setTextSize}
                        />
                    </div>
                </div>
            </div>

            {/* Toast Demo Buttons */}
            <div style={cardStyle}>
                <h3 style={cardTitleStyle}>4. Toast Notifications</h3>
                <p style={cardDescStyle}>
                    Show elegant notifications for story events.
                </p>
                <div style={{
                    display: 'flex',
                    gap: '12px',
                    flexWrap: 'wrap',
                    marginTop: '16px'
                }}>
                    <button
                        onClick={() => toast.showSuccess('Choice Made!', 'You decided to help the cat.')}
                        style={{
                            ...buttonStyle,
                            background: '#10b981',
                            borderColor: '#10b981'
                        }}
                    >
                        Success Toast
                    </button>
                    <button
                        onClick={() => toast.showError('Invalid Choice', 'This path is not available yet.')}
                        style={{
                            ...buttonStyle,
                            background: '#ef4444',
                            borderColor: '#ef4444'
                        }}
                    >
                        Error Toast
                    </button>
                    <button
                        onClick={() => toast.showInfo('New Chapter', 'Chapter 2 is now unlocked!')}
                        style={{
                            ...buttonStyle,
                            background: '#3b82f6',
                            borderColor: '#3b82f6'
                        }}
                    >
                        Info Toast
                    </button>
                    <button
                        onClick={() => toast.showWarning('Save Your Progress', 'Story will reset if you leave.')}
                        style={{
                            ...buttonStyle,
                            background: '#f59e0b',
                            borderColor: '#f59e0b'
                        }}
                    >
                        Warning Toast
                    </button>
                </div>
            </div>

            {/* Tabs Demo */}
            <div style={{ ...cardStyle, marginTop: '24px' }}>
                <h3 style={cardTitleStyle}>5. Story Tabs</h3>
                <p style={cardDescStyle}>
                    Organize story UI into navigable sections.
                </p>
                <div style={{ marginTop: '16px' }}>
                    <StoryTabs
                        storyContent={
                            <div style={{ fontSize: `${textSize}px`, lineHeight: '1.7' }}>
                                <p>The cat looked up with hopeful eyes...</p>
                                <p>What will you do?</p>
                            </div>
                        }
                        choicesContent={
                            <div>
                                <button style={choiceButtonStyle}>🐱 Pet the cat</button>
                                <button style={choiceButtonStyle}>🍖 Give it food</button>
                                <button style={choiceButtonStyle}>🏠 Take it home</button>
                            </div>
                        }
                        settingsContent={<StorySettingsPanel />}
                        historyContent={<StoryHistoryAccordion history={sampleHistory} />}
                    />
                </div>
            </div>

            {/* Accordion Demo */}
            <div style={{ ...cardStyle, marginTop: '24px' }}>
                <h3 style={cardTitleStyle}>6. Story History</h3>
                <p style={cardDescStyle}>
                    View previous choices in an expandable accordion.
                </p>
                <div style={{ marginTop: '16px' }}>
                    <StoryHistoryAccordion history={sampleHistory} />
                </div>
            </div>
        </div>
    );
};

/**
 * Main showcase component wrapped with toast provider
 */
export const RadixShowcase: React.FC = () => {
    return (
        <StoryToastProvider>
            <ShowcaseContent />
        </StoryToastProvider>
    );
};

// Styles
const cardStyle: React.CSSProperties = {
    background: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    transition: 'all 0.2s'
};

const cardTitleStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    marginTop: 0,
    marginBottom: '8px'
};

const cardDescStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0,
    lineHeight: '1.5'
};

const buttonStyle: React.CSSProperties = {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '8px',
    color: 'white',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s'
};

const choiceButtonStyle: React.CSSProperties = {
    display: 'block',
    width: '100%',
    padding: '12px',
    margin: '8px 0',
    background: 'white',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.2s'
};
