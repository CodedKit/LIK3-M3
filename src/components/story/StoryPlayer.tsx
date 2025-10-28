"use client";

import React from 'react';
import { useStory } from '@/context/StoryContext';
import { parseTag, TAG_PREFIX } from '@/lib/story-utils';

export const StoryPlayer = () => {
    const { state, makeChoice, isLoading } = useStory();

    if (isLoading) {
        return <div>Loading story...</div>;
    }

    // Parse tags for UI elements
    const imageUrl = parseTag(state.tags, TAG_PREFIX.IMAGE);
    const musicUrl = parseTag(state.tags, TAG_PREFIX.MUSIC);

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: 'auto' }}>
            {/* Music Tag Indicator (optional visual feedback) */}
            {musicUrl && (
                <div
                    style={{
                        padding: '8px',
                        background: '#e3f2fd',
                        borderRadius: '4px',
                        marginBottom: '10px',
                        fontSize: '0.9em',
                        color: '#1976d2'
                    }}
                >
                    DEBUG: 🎵 Playing: {musicUrl.split('/').pop()}
                </div>
            )}
            {/* 
        Advanced Usage: Tags
        You can use tags in Ink like #image: "sea.jpg" or #music: "song.mp3" 
        to dynamically change the UI.
      */}
            <div className="story-tags" style={{ marginTop: '20px' }}>
                {/* Image Tag */}
                {imageUrl && (
                    <img
                        src={imageUrl}
                        alt="Scene illustration"
                        style={{
                            maxWidth: '100%',
                            height: '25em',
                            borderRadius: '8px',
                            marginBottom: '10px'
                        }}
                    />
                )}
            </div>


            {/* Story Text */}
            <div className="story-text">
                {state.text.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                ))}
            </div>

            {/* End of Story */}
            {state.isEnded && (
                <div style={{ color: 'gray', marginTop: '20px' }}>
                    - END OF STORY -
                </div>
            )}

            {/* Choices */}
            <div className="story-choices" style={{ marginTop: '20px' }}>
                {state.choices.map((choice) => (
                    <button
                        key={choice.index}
                        onClick={() => makeChoice(choice.index)}
                        style={{
                            display: 'block',
                            width: '100%',
                            padding: '10px',
                            margin: '5px 0',
                            textAlign: 'left',
                            cursor: 'pointer',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                        }}
                    >
                        {choice.text}
                    </button>
                ))}
            </div>


        </div>
    );
};