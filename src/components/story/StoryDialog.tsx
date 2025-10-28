"use client";

import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Maximize2 } from 'lucide-react';

interface StoryDialogProps {
    trigger?: React.ReactNode;
    title?: string;
    description?: string;
    children: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

/**
 * A Radix UI Dialog component for displaying story content in a modal overlay.
 * Features: backdrop overlay, close button, keyboard shortcuts (ESC), focus trap.
 */
export const StoryDialog: React.FC<StoryDialogProps> = ({
    trigger,
    title = "Story Viewer",
    description,
    children,
    open,
    onOpenChange
}) => {
    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            {trigger && (
                <Dialog.Trigger asChild>
                    {trigger}
                </Dialog.Trigger>
            )}

            <Dialog.Portal>
                {/* Overlay with animation */}
                <Dialog.Overlay
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0, 0, 0, 0.5)',
                        backdropFilter: 'blur(4px)',
                        animation: 'fadeIn 0.2s ease-out',
                        zIndex: 50
                    }}
                />

                {/* Dialog Content */}
                <Dialog.Content
                    style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        background: 'white',
                        borderRadius: '16px',
                        padding: '24px',
                        width: '90vw',
                        maxWidth: '800px',
                        maxHeight: '85vh',
                        overflow: 'auto',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        animation: 'slideUp 0.3s ease-out',
                        zIndex: 51
                    }}
                >
                    {/* Header */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '16px',
                        paddingBottom: '16px',
                        borderBottom: '1px solid #e5e7eb'
                    }}>
                        <div>
                            <Dialog.Title style={{
                                fontSize: '24px',
                                fontWeight: '700',
                                color: '#111827',
                                margin: 0
                            }}>
                                {title}
                            </Dialog.Title>
                            {description && (
                                <Dialog.Description style={{
                                    fontSize: '14px',
                                    color: '#6b7280',
                                    marginTop: '4px'
                                }}>
                                    {description}
                                </Dialog.Description>
                            )}
                        </div>

                        {/* Close Button */}
                        <Dialog.Close asChild>
                            <button
                                style={{
                                    background: 'transparent',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    width: '40px',
                                    height: '40px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    color: '#6b7280'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = '#f3f4f6';
                                    e.currentTarget.style.color = '#111827';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.color = '#6b7280';
                                }}
                                aria-label="Close dialog"
                            >
                                <X size={20} />
                            </button>
                        </Dialog.Close>
                    </div>

                    {/* Content */}
                    <div style={{
                        color: '#374151',
                        lineHeight: '1.7'
                    }}>
                        {children}
                    </div>
                </Dialog.Content>
            </Dialog.Portal>

            {/* CSS Animations */}
            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translate(-50%, -45%);
                    }
                    to {
                        opacity: 1;
                        transform: translate(-50%, -50%);
                    }
                }
            `}</style>
        </Dialog.Root>
    );
};

/**
 * Trigger button for opening story in fullscreen dialog
 */
export const FullscreenStoryButton: React.FC<{ onClick?: () => void }> = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            style={{
                background: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.background = '#059669';
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.background = '#10b981';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
            }}
        >
            <Maximize2 size={16} />
            Fullscreen Story
        </button>
    );
};
