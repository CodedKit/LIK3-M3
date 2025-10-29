"use client";

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Story bubble variants using class-variance-authority (shadcn pattern)
const storyBubbleVariants = cva(
    // Base styles - modern chat bubble
    "relative max-w-xs lg:max-w-md px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-300 animate-in fade-in-0 slide-in-from-bottom-1",
    {
        variants: {
            variant: {
                // Player responses - Blue gradient (RIGHT ALIGNED)
                player: "bg-gradient-to-r from-blue-500 to-blue-600 text-white ml-auto rounded-br-md shadow-lg hover:from-blue-600 hover:to-blue-700",
                // Story narrator - Neutral gray (LEFT ALIGNED)
                story: "bg-gray-100 text-gray-900 mr-auto rounded-bl-md shadow-sm hover:bg-gray-150 dark:bg-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700",
                // System messages - Purple (LEFT ALIGNED)
                system: "bg-gradient-to-r from-purple-100 to-purple-150 text-purple-900 mr-auto rounded-bl-md shadow-sm dark:from-purple-900/20 dark:to-purple-800/20 dark:text-purple-300",
                // Character speech - Green (LEFT ALIGNED)
                character: "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white mr-auto rounded-bl-md shadow-lg hover:from-emerald-600 hover:to-emerald-700",
                // Choices - Orange (LEFT ALIGNED - story sunuyor)
                choice: "bg-gradient-to-r from-orange-100 to-orange-150 text-orange-900 hover:from-orange-200 hover:to-orange-250 border-2 border-orange-200 rounded-xl cursor-pointer transition-all duration-200 shadow-sm ml-auto dark:from-orange-900/20 dark:to-orange-800/20 dark:text-orange-300 dark:border-orange-700",
                // Error - Red
                error: "bg-gradient-to-r from-red-100 to-red-150 text-red-900 mx-auto text-center rounded-full shadow-sm dark:from-red-900/20 dark:to-red-800/20 dark:text-red-300"
            },
            size: {
                sm: "px-3 py-1.5 text-xs max-w-xs",
                md: "px-4 py-2 text-sm max-w-md",
                lg: "px-5 py-3 text-base max-w-lg"
            },
            animation: {
                none: "",
                typewriter: "overflow-hidden",
                bounce: "animate-bounce",
                pulse: "animate-pulse"
            }
        },
        defaultVariants: {
            variant: "story",
            size: "md",
            animation: "none"
        }
    }
);

// Story message interface
export interface StoryMessage {
    id: string;
    content: string;
    variant?: "player" | "story" | "system" | "character" | "choice" | "error";
    timestamp?: Date;
    sender?: string;
    avatar?: string;
    isChoice?: boolean;
    choiceIndex?: number;
}

// StoryBubble component props
export interface StoryBubbleProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof storyBubbleVariants> {
    message: StoryMessage;
    onChoiceClick?: (choiceIndex: number) => void;
}

// Main StoryBubble component (shadcn style)
export const StoryBubble = React.forwardRef<HTMLDivElement, StoryBubbleProps>(
    ({ message, variant, size, animation, className, onChoiceClick, ...props }, ref) => {
        const bubbleVariant = variant || message.variant || "story";
        const isClickable = message.isChoice && onChoiceClick && typeof message.choiceIndex === 'number';

        const handleClick = () => {
            if (isClickable) {
                onChoiceClick(message.choiceIndex!);
            }
        };

        return (
            <div
                ref={ref}
                className={cn("flex flex-col space-y-1", className)}
                {...props}
            >
                {/* Message bubble */}
                <div
                    className={cn(
                        storyBubbleVariants({ variant: bubbleVariant, size, animation }),
                        isClickable && "hover:scale-105 active:scale-95"
                    )}
                    onClick={handleClick}
                    role={isClickable ? "button" : undefined}
                    tabIndex={isClickable ? 0 : undefined}
                    onKeyDown={isClickable ? (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleClick();
                        }
                    } : undefined}
                >
                    {/* Message content */}
                    <div className="break-words leading-relaxed">
                        {message.content}
                    </div>

                    {/* Timestamp (optional) */}
                    {message.timestamp && (
                        <div className={cn(
                            "text-xs mt-1 opacity-70",
                            bubbleVariant === "player" ? "text-blue-100" :
                                bubbleVariant === "character" ? "text-emerald-100" : "text-gray-500"
                        )}>
                            {message.timestamp.toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </div>
                    )}
                </div>

                {/* Sender name (for story/character messages) */}
                {message.sender && (bubbleVariant === "story" || bubbleVariant === "character") && (
                    <div className="text-xs text-gray-500 px-2 dark:text-gray-400">
                        {message.sender}
                    </div>
                )}
            </div>
        );
    }
);

StoryBubble.displayName = "StoryBubble";

// Typing indicator with custom animation
export const StoryTypingIndicator: React.FC<{ sender?: string; variant?: "story" | "character" }> = ({
    sender = "Story",
    variant = "story"
}) => {
    return (
        <div className="flex flex-col space-y-1">
            <div className={cn(
                storyBubbleVariants({ variant }),
                "flex items-center space-x-2"
            )}>
                {/* Typing text */}
                <span className="text-xs opacity-70">typing</span>
                {/* Animated dots */}
                <div className="flex space-x-1">
                    <div className={cn(
                        "w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:-0.3s]",
                        variant === "story" ? "bg-gray-400" : "bg-emerald-300"
                    )}></div>
                    <div className={cn(
                        "w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:-0.15s]",
                        variant === "story" ? "bg-gray-400" : "bg-emerald-300"
                    )}></div>
                    <div className={cn(
                        "w-1.5 h-1.5 rounded-full animate-bounce",
                        variant === "story" ? "bg-gray-400" : "bg-emerald-300"
                    )}></div>
                </div>
            </div>

            {/* Sender name */}
            <div className="text-xs text-gray-500 px-2 dark:text-gray-400">
                {sender} is typing...
            </div>
        </div>
    );
};

// Story chat container
export const StoryChat = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "flex flex-col space-y-4 p-4 h-full overflow-y-auto",
            "scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100",
            "dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800",
            // Custom gradient background
            "bg-gradient-to-b from-blue-50/30 via-white to-purple-50/30",
            "dark:from-gray-900 dark:via-gray-900 dark:to-gray-800",
            className
        )}
        {...props}
    >
        {children}
    </div>
));

StoryChat.displayName = "StoryChat";

// Story chat header with status
export const StoryChatHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
        title?: string;
        subtitle?: string;
        avatar?: string;
        status?: "online" | "typing" | "offline";
    }
>(({ className, title, subtitle, avatar, status = "online", ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "flex items-center space-x-3 p-4 border-b border-gray-200 bg-white/90 backdrop-blur-sm",
            "dark:border-gray-700 dark:bg-gray-900/90",
            className
        )}
        {...props}
    >
        {/* Avatar with status */}
        <div className="relative">
            {avatar && (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-emerald-500 flex items-center justify-center text-white font-semibold text-lg shadow-md">
                    {avatar}
                </div>
            )}
            {/* Status indicator */}
            <div className={cn(
                "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900",
                status === "online" && "bg-green-500",
                status === "typing" && "bg-yellow-500 animate-pulse",
                status === "offline" && "bg-gray-400"
            )} />
        </div>

        {/* Title and subtitle */}
        <div className="flex-1">
            {title && (
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {title}
                </h2>
            )}
            {subtitle && (
                <p className={cn(
                    "text-sm dark:text-gray-400",
                    status === "typing" ? "text-blue-600 dark:text-blue-400" : "text-gray-500"
                )}>
                    {status === "typing" ? "typing..." : subtitle}
                </p>
            )}
        </div>
    </div>
));

StoryChatHeader.displayName = "StoryChatHeader";