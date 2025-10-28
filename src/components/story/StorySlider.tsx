"use client";

import React from 'react';
import * as Slider from '@radix-ui/react-slider';
import { Type } from 'lucide-react';

interface StoryTextSizeSliderProps {
    value?: number;
    onChange?: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    label?: string;
}

/**
 * A Radix UI Slider component for adjusting story text size.
 * Provides smooth, accessible font size control with visual feedback.
 */
export const StoryTextSizeSlider: React.FC<StoryTextSizeSliderProps> = ({
    value = 16,
    onChange,
    min = 12,
    max = 24,
    step = 1,
    label = "Text Size"
}) => {
    const handleValueChange = (values: number[]) => {
        onChange?.(values[0]);
    };

    return (
        <div style={{ width: '100%' }}>
            {/* Label with current value */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px'
            }}>
                <label style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <Type size={16} />
                    {label}
                </label>
                <span style={{
                    fontSize: '13px',
                    color: '#6b7280',
                    fontWeight: '600',
                    background: '#f3f4f6',
                    padding: '4px 12px',
                    borderRadius: '6px'
                }}>
                    {value}px
                </span>
            </div>

            {/* Slider */}
            <Slider.Root
                value={[value]}
                onValueChange={handleValueChange}
                min={min}
                max={max}
                step={step}
                style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    userSelect: 'none',
                    touchAction: 'none',
                    width: '100%',
                    height: '20px'
                }}
            >
                {/* Track */}
                <Slider.Track
                    style={{
                        background: '#e5e7eb',
                        position: 'relative',
                        flexGrow: 1,
                        borderRadius: '9999px',
                        height: '6px'
                    }}
                >
                    {/* Range (filled part) */}
                    <Slider.Range
                        style={{
                            position: 'absolute',
                            background: '#3b82f6',
                            borderRadius: '9999px',
                            height: '100%'
                        }}
                    />
                </Slider.Track>

                {/* Thumb (draggable handle) */}
                <Slider.Thumb
                    style={{
                        display: 'block',
                        width: '20px',
                        height: '20px',
                        background: 'white',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
                        borderRadius: '50%',
                        border: '2px solid #3b82f6',
                        cursor: 'grab',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.15)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(59,130,246,0.4)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.15)';
                    }}
                    aria-label="Text size"
                />
            </Slider.Root>

            {/* Min/Max labels */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '8px',
                fontSize: '11px',
                color: '#9ca3af'
            }}>
                <span>Small ({min}px)</span>
                <span>Large ({max}px)</span>
            </div>
        </div>
    );
};

/**
 * Settings panel with multiple sliders
 */
export const StorySettingsPanel: React.FC = () => {
    const [textSize, setTextSize] = React.useState(16);
    const [lineHeight, setLineHeight] = React.useState(1.6);
    const [animationSpeed, setAnimationSpeed] = React.useState(300);

    return (
        <div style={{
            padding: '20px',
            background: '#f9fafb',
            borderRadius: '12px',
            border: '1px solid #e5e7eb'
        }}>
            <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '20px',
                marginTop: 0
            }}>
                Story Settings
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Text Size */}
                <StoryTextSizeSlider
                    value={textSize}
                    onChange={setTextSize}
                    label="Text Size"
                />

                {/* Line Height */}
                <div style={{ width: '100%' }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '12px'
                    }}>
                        <label style={{
                            fontSize: '14px',
                            fontWeight: '500',
                            color: '#374151'
                        }}>
                            Line Spacing
                        </label>
                        <span style={{
                            fontSize: '13px',
                            color: '#6b7280',
                            fontWeight: '600',
                            background: '#fff',
                            padding: '4px 12px',
                            borderRadius: '6px'
                        }}>
                            {lineHeight.toFixed(1)}
                        </span>
                    </div>
                    <Slider.Root
                        value={[lineHeight]}
                        onValueChange={(values) => setLineHeight(values[0])}
                        min={1.2}
                        max={2.5}
                        step={0.1}
                        style={{
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            width: '100%',
                            height: '20px'
                        }}
                    >
                        <Slider.Track
                            style={{
                                background: '#e5e7eb',
                                position: 'relative',
                                flexGrow: 1,
                                borderRadius: '9999px',
                                height: '6px'
                            }}
                        >
                            <Slider.Range
                                style={{
                                    position: 'absolute',
                                    background: '#10b981',
                                    borderRadius: '9999px',
                                    height: '100%'
                                }}
                            />
                        </Slider.Track>
                        <Slider.Thumb
                            style={{
                                display: 'block',
                                width: '20px',
                                height: '20px',
                                background: 'white',
                                boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
                                borderRadius: '50%',
                                border: '2px solid #10b981',
                                cursor: 'grab'
                            }}
                            aria-label="Line spacing"
                        />
                    </Slider.Root>
                </div>

                {/* Animation Speed */}
                <div style={{ width: '100%' }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '12px'
                    }}>
                        <label style={{
                            fontSize: '14px',
                            fontWeight: '500',
                            color: '#374151'
                        }}>
                            Animation Speed
                        </label>
                        <span style={{
                            fontSize: '13px',
                            color: '#6b7280',
                            fontWeight: '600',
                            background: '#fff',
                            padding: '4px 12px',
                            borderRadius: '6px'
                        }}>
                            {animationSpeed}ms
                        </span>
                    </div>
                    <Slider.Root
                        value={[animationSpeed]}
                        onValueChange={(values) => setAnimationSpeed(values[0])}
                        min={100}
                        max={1000}
                        step={50}
                        style={{
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            width: '100%',
                            height: '20px'
                        }}
                    >
                        <Slider.Track
                            style={{
                                background: '#e5e7eb',
                                position: 'relative',
                                flexGrow: 1,
                                borderRadius: '9999px',
                                height: '6px'
                            }}
                        >
                            <Slider.Range
                                style={{
                                    position: 'absolute',
                                    background: '#f59e0b',
                                    borderRadius: '9999px',
                                    height: '100%'
                                }}
                            />
                        </Slider.Track>
                        <Slider.Thumb
                            style={{
                                display: 'block',
                                width: '20px',
                                height: '20px',
                                background: 'white',
                                boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
                                borderRadius: '50%',
                                border: '2px solid #f59e0b',
                                cursor: 'grab'
                            }}
                            aria-label="Animation speed"
                        />
                    </Slider.Root>
                </div>
            </div>

            {/* Preview */}
            <div style={{
                marginTop: '24px',
                padding: '16px',
                background: 'white',
                borderRadius: '8px',
                border: '1px solid #e5e7eb'
            }}>
                <p style={{
                    fontSize: `${textSize}px`,
                    lineHeight: lineHeight,
                    margin: 0,
                    color: '#374151',
                    transition: `all ${animationSpeed}ms`
                }}>
                    This is a preview of your story text. Adjust the settings above to see changes in real-time!
                </p>
            </div>
        </div>
    );
};
