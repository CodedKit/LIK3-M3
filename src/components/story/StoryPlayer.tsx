"use client";

import React from 'react';
import { useStory } from '@/context/StoryContext';

export const StoryPlayer = () => {
    const { state, makeChoice, isLoading } = useStory();

    if (isLoading) {
        return <div>Loading story...</div>;
    }

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: 'auto' }}>

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

            {/* 
        Advanced Usage: Tags
        You can use tags in Ink like #image: "sea.jpg" or #audio: "storm.mp3" 
        to dynamically change the UI.
      */}
            <div className="story-tags" style={{ display: 'none' }}>
                {state.tags.map(tag => {
                    // e.g., if tag is "image: sea.jpg"
                    if (tag.startsWith("image:")) {
                        console.log("img")
                        // const imageUrl = tag.split(":")[1].trim();
                        // return <img src={`/images/${imageUrl}`} alt="story image" />;
                    }
                    return null;
                })}
            </div>

        </div>
    );
};