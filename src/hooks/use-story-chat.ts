"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useStory } from "@/context/StoryContext";
import type { StoryMessage } from "@/components/ui/story-bubble";

interface UseChatOptions {
  typingDelay?: number;
  messageDelay?: number;
  autoScroll?: boolean;
}

interface ChatState {
  messages: StoryMessage[];
  isTyping: boolean;
  isLoading: boolean;
}

/**
 * Custom hook for managing story chat state
 * Converts story text into chat messages with typing animation
 */
export function useChat(options: UseChatOptions = {}) {
  const { typingDelay = 1000, messageDelay = 500, autoScroll = true } = options;

  const { state, makeChoice, isLoading: storyLoading } = useStory();
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isTyping: false,
    isLoading: false,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageIdCounter = useRef(0);

  // Auto scroll to bottom
  const scrollToBottom = useCallback(() => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [autoScroll]);

  // Generate unique message ID
  const generateMessageId = useCallback(() => {
    messageIdCounter.current += 1;
    return `msg-${messageIdCounter.current}`;
  }, []);

  // Add message to chat
  const addMessage = useCallback(
    (message: Omit<StoryMessage, "id">) => {
      const newMessage: StoryMessage = {
        ...message,
        id: generateMessageId(),
        timestamp: new Date(),
      };

      setChatState((prev) => ({
        ...prev,
        messages: [...prev.messages, newMessage],
      }));

      // Auto scroll after message is added
      setTimeout(scrollToBottom, 100);
    },
    [generateMessageId, scrollToBottom]
  );

  // Add story text as messages with typing effect
  const addStoryMessages = useCallback(
    async (textArray: string[], choices: any[], isEnded: boolean) => {
      if (textArray.length === 0) return;

      // Show typing indicator
      setChatState((prev) => ({ ...prev, isTyping: true }));

      // Wait for typing delay
      await new Promise((resolve) => setTimeout(resolve, typingDelay));

      // Hide typing indicator
      setChatState((prev) => ({ ...prev, isTyping: false }));

      // Add each text paragraph as a separate message
      for (let i = 0; i < textArray.length; i++) {
        const text = textArray[i];

        if (text.trim()) {
          addMessage({
            content: text,
            variant: "story",
            sender: "Story",
          });

          // Wait between messages (except for the last one)
          if (i < textArray.length - 1) {
            await new Promise((resolve) => setTimeout(resolve, messageDelay));
          }
        }
      }

      // Add choices AFTER story text is completely finished
      if (choices.length > 0 && !isEnded) {
        // Wait a bit more before showing choices
        await new Promise((resolve) => setTimeout(resolve, messageDelay));

        // Add each choice as a clickable message
        for (const choice of choices) {
          addMessage({
            content: choice.text,
            variant: "choice",
            isChoice: true,
            choiceIndex: choice.index,
          });
        }
      }
    },
    [typingDelay, messageDelay, addMessage]
  );

  // Note: Choice messages are now added directly in addStoryMessages

  // Handle choice selection
  const handleChoiceClick = useCallback(
    async (choiceIndex: number) => {
      const choice = state.choices.find((c) => c.index === choiceIndex);
      if (!choice) return;

      // Add player's choice as a message
      addMessage({
        content: choice.text,
        variant: "player",
      });

      // Remove choices from UI (they're no longer needed after selection)
      setChatState((prev) => ({
        ...prev,
        messages: prev.messages.filter((msg) => !msg.isChoice),
      }));

      // Make the choice in the story
      makeChoice(choiceIndex);
    },
    [state.choices, makeChoice, addMessage]
  );

  // Handle story state changes - text first, then choices
  useEffect(() => {
    if (!storyLoading && state.text.length > 0) {
      addStoryMessages(state.text, state.choices, state.isEnded);
    }
  }, [
    state.text,
    state.choices,
    state.isEnded,
    storyLoading,
    addStoryMessages,
  ]);

  // Note: Removed separate choices effect - now handled in addStoryMessages
  // Note: Story end message removed - InkJS naturally shows when story ends

  // Clear chat (reset)
  const clearChat = useCallback(() => {
    setChatState({
      messages: [],
      isTyping: false,
      isLoading: false,
    });
    messageIdCounter.current = 0;
  }, []);

  // Add custom message (for system messages, etc.)
  const addCustomMessage = useCallback(
    (content: string, variant: StoryMessage["variant"] = "system") => {
      addMessage({
        content,
        variant,
      });
    },
    [addMessage]
  );

  return {
    // State
    messages: chatState.messages,
    isTyping: chatState.isTyping,
    isLoading: storyLoading || chatState.isLoading,

    // Story state
    storyState: state,

    // Actions
    handleChoiceClick,
    clearChat,
    addCustomMessage,

    // Refs for scrolling
    messagesEndRef,
    scrollToBottom,
  };
}

// Export types
export type { UseChatOptions, ChatState, StoryMessage };
