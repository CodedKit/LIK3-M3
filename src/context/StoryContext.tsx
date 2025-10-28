/**
 * @file StoryContext.tsx
 * 
 * @overview
 * This file defines the `StoryProvider` and the `useStory` hook, which together create a React Context 
 * for managing the state of an InkJS story.
 * 
 * @purpose
 * The primary purpose of this context is to bridge the gap between the `NarrativeService` (the story engine)
 * and the React UI components. It abstracts the complexities of loading, state management, and interaction
 * with the story, providing a clean and simple API (`state`, `makeChoice`, `isLoading`) to any component
 * that needs to display or interact with the narrative.
 * 
 * @usage
 * Wrap the parent component of your story-related UI with `<StoryProvider storyJsonPath="...">`.
 * Then, within any child component, use the `useStory()` hook to access the story's state and make choices.
 * 
 * @example
 * ```tsx
 * // In your page or layout
 * <StoryProvider storyJsonPath="/stories/my-story.ink.json">
 *   <StoryComponent />
 * </StoryProvider>
 * 
 * // In StoryComponent.tsx
 * const { state, makeChoice, isLoading } = useStory();
 * if (isLoading) return <p>Loading story...</p>;
 * return (
 *   <div>
 *     {state.text.map((line, i) => <p key={i}>{line}</p>)}
 *     {state.choices.map(choice => (
 *       <button key={choice.index} onClick={() => makeChoice(choice.index)}>
 *         {choice.text}
 *       </button>
 *     ))}
 *   </div>
 * );
 * ```
 */
"use client";

import React, { createContext, useContext, ReactNode, useState, useEffect, useMemo } from 'react';
import { NarrativeService, IStoryState } from '@/services/NarrativeService';

// The API that the context will provide to the outside world
interface IStoryContext {
    state: IStoryState;
    makeChoice: (index: number) => void;
    isLoading: boolean;
}

const StoryContext = createContext<IStoryContext | undefined>(undefined);

// The Provider that will supply the context
export const StoryProvider = ({ children, storyJsonPath }: { children: ReactNode; storyJsonPath: string }) => {
    // We create and store the NarrativeService instance once with useMemo to prevent re-creation on re-renders
    const narrativeService = useMemo(() => new NarrativeService(), []);

    const [state, setState] = useState<IStoryState>(narrativeService.getCurrentState());
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // We tell the service to "call this function when the state changes"
        narrativeService.setOnStateChange(setState);

        // Load the story
        const load = async () => {
            setIsLoading(true);
            await narrativeService.loadStory(storyJsonPath);
            // After loading, initialize the story to read the first text block
            narrativeService.initializeStory();
            // Get the initial state
            setState(narrativeService.getCurrentState());
            setIsLoading(false);
        };

        load();
        // Cleanup function to run when the component unmounts
        return () => {
            narrativeService.setOnStateChange(() => { }); // Clear the listener to prevent memory leaks
        };
    }, [narrativeService, storyJsonPath]); // Reload only when the story (storyJsonPath) changes

    const makeChoice = (index: number) => {
        // makeChoice already calls continueStory internally
        narrativeService.makeChoice(index);
    };

    const contextValue = useMemo(() => ({
        state,
        makeChoice,
        isLoading
    }), [state, makeChoice, isLoading]);

    return (
        <StoryContext.Provider value={contextValue}>
            {children}
        </StoryContext.Provider>
    );
};

// A custom hook to easily access the context from components
export const useStory = () => {
    const context = useContext(StoryContext);
    if (context === undefined) {
        throw new Error('useStory must be used within a StoryProvider');
    }
    return context;
};