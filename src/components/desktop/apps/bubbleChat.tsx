"use client";

import React from 'react';
import { StoryProvider } from '@/context/StoryContext';
import { useChat } from '@/hooks/use-story-chat';
import { StoryBubble, StoryTypingIndicator, StoryChat, StoryChatHeader } from '@/components/ui/story-bubble';
import { Button } from '@/components/ui/button';
import { RotateCcw, Play } from 'lucide-react';

/**
 * Internal BubbleChat component that uses the story context
 */
const BubbleChatContent: React.FC = () => {
    const {
        messages,
        isTyping,
        isLoading,
        storyState,
        handleChoiceClick,
        clearChat,
        addCustomMessage,
        messagesEndRef
    } = useChat({
        typingDelay: 1200,  // 1.2 seconds typing delay
        messageDelay: 600,  // 0.6 seconds between messages
        autoScroll: true
    });

    const handleRestart = () => {
        clearChat();
        addCustomMessage('🔄 Story restarted. Welcome back!', 'system');
        // Note: You might want to add story restart functionality to StoryContext
    };

    const getChatStatus = () => {
        if (isLoading) return 'offline';
        if (isTyping) return 'typing';
        return 'online';
    };

    const getSubtitle = () => {
        if (isLoading) return 'Loading story...';
        if (isTyping) return 'typing...';
        if (storyState.isEnded) return 'Story completed';
        return `${messages.length} messages`;
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
            {/* Chat Header */}
            <StoryChatHeader
                title="Interactive Story"
                subtitle={getSubtitle()}
                avatar="📖"
                status={getChatStatus()}
            />

            {/* Chat Messages Container */}
            <StoryChat className="flex-1">

                {/* Messages */}
                {messages.map((message) => (
                    <StoryBubble
                        key={message.id}
                        message={message}
                        onChoiceClick={handleChoiceClick}
                        className="animate-in slide-in-from-bottom-1 duration-300"
                    />
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                    <StoryTypingIndicator
                        sender="Story"
                        variant="story"
                    />
                )}

                {/* Loading indicator */}
                {isLoading && !isTyping && (
                    <div className="flex justify-center items-center p-4">
                        <div className="flex space-x-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        </div>
                    </div>
                )}

                {/* Auto-scroll target */}
                <div ref={messagesEndRef} />
            </StoryChat>

            {/* Chat Footer */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                        <div className={`w-2 h-2 rounded-full ${getChatStatus() === 'online' ? 'bg-green-500' :
                            getChatStatus() === 'typing' ? 'bg-yellow-500 animate-pulse' :
                                'bg-gray-400'
                            }`} />
                        <span>
                            {getChatStatus() === 'typing' ? 'Story is typing...' :
                                getChatStatus() === 'online' ? 'Ready for your choice' :
                                    'Loading...'}
                        </span>
                    </div>

                    <div className="flex space-x-2">
                        {/* Restart button */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleRestart}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            <RotateCcw className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

/**
 * Main BubbleChat App component with story provider
 */
export const BubbleChatApp: React.FC = () => {
    const storyToLoad = '/stories/my_story.json';

    return (
        <div className="w-full h-full p-4 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
            <StoryProvider storyJsonPath={storyToLoad}>
                <BubbleChatContent />
            </StoryProvider>
        </div>
    );
};

/**
 * Demo component showing different bubble variants
 */
export const BubbleChatDemo: React.FC = () => {
    const sampleMessages = [
        {
            id: '1',
            content: 'Once upon a time, in a quiet alley, there lived a small orange cat...',
            variant: 'story' as const,
            sender: 'Story',
            timestamp: new Date(Date.now() - 180000)
        },
        {
            id: '2',
            content: 'What should I do?',
            variant: 'player' as const,
            timestamp: new Date(Date.now() - 120000)
        },
        {
            id: '3',
            content: 'Pet the cat gently',
            variant: 'choice' as const,
            isChoice: true,
            choiceIndex: 0,
            timestamp: new Date(Date.now() - 60000)
        },
        {
            id: '4',
            content: 'Give the cat some food',
            variant: 'choice' as const,
            isChoice: true,
            choiceIndex: 1,
            timestamp: new Date(Date.now() - 60000)
        },
        {
            id: '5',
            content: 'The cat purrs contentedly...',
            variant: 'character' as const,
            sender: 'Cat',
            timestamp: new Date()
        }
    ];

    return (
        <div className="w-full max-w-md mx-auto h-96 bg-white rounded-lg shadow-lg overflow-hidden">
            <StoryChatHeader
                title="Story Demo"
                subtitle="Chat bubble examples"
                avatar="🎭"
                status="online"
            />

            <StoryChat>
                {sampleMessages.map((message) => (
                    <StoryBubble
                        key={message.id}
                        message={message}
                        onChoiceClick={(index) => console.log('Choice clicked:', index)}
                    />
                ))}

                <StoryTypingIndicator sender="Story" />
            </StoryChat>
        </div>
    );
};