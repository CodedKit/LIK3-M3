import { StoryPlayer } from '@/components/story/StoryPlayer'
import { StoryProvider } from '@/context/StoryContext'
import React from 'react'

export const TestChatApp = () => {
    const storyToLoad = '/stories/my_story.json';

    return (
        <main>
            <StoryProvider storyJsonPath={storyToLoad}>
                <StoryPlayer />
            </StoryProvider>
        </main>
    )
}
