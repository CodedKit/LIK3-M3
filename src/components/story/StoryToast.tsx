"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import * as Toast from '@radix-ui/react-toast';
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastMessage {
    id: string;
    title: string;
    description?: string;
    type: ToastType;
}

interface ToastContextValue {
    showToast: (title: string, description?: string, type?: ToastType) => void;
    showSuccess: (title: string, description?: string) => void;
    showError: (title: string, description?: string) => void;
    showInfo: (title: string, description?: string) => void;
    showWarning: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

/**
 * Provider component that wraps your app to enable toast notifications
 */
export const StoryToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const showToast = useCallback((title: string, description?: string, type: ToastType = 'info') => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { id, title, description, type }]);

        // Auto remove after 5 seconds
        setTimeout(() => {
            setToasts((prev) => prev.filter((toast) => toast.id !== id));
        }, 5000);
    }, []);

    const showSuccess = useCallback((title: string, description?: string) =>
        showToast(title, description, 'success'), [showToast]);

    const showError = useCallback((title: string, description?: string) =>
        showToast(title, description, 'error'), [showToast]);

    const showInfo = useCallback((title: string, description?: string) =>
        showToast(title, description, 'info'), [showToast]);

    const showWarning = useCallback((title: string, description?: string) =>
        showToast(title, description, 'warning'), [showToast]);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const getToastStyle = (type: ToastType) => {
        const styles = {
            success: {
                background: '#10b981',
                icon: <CheckCircle2 size={20} />
            },
            error: {
                background: '#ef4444',
                icon: <XCircle size={20} />
            },
            info: {
                background: '#3b82f6',
                icon: <Info size={20} />
            },
            warning: {
                background: '#f59e0b',
                icon: <AlertTriangle size={20} />
            }
        };
        return styles[type];
    };

    return (
        <ToastContext.Provider value={{ showToast, showSuccess, showError, showInfo, showWarning }}>
            <Toast.Provider swipeDirection="right">
                {children}

                {toasts.map((toast) => {
                    const style = getToastStyle(toast.type);

                    return (
                        <Toast.Root
                            key={toast.id}
                            duration={5000}
                            style={{
                                background: style.background,
                                color: 'white',
                                borderRadius: '12px',
                                padding: '16px',
                                boxShadow: '0 10px 40px rgba(0,0,0,0.25)',
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '12px',
                                minWidth: '300px',
                                maxWidth: '400px',
                                animation: 'slideIn 0.3s ease-out'
                            }}
                        >
                            {/* Icon */}
                            <div style={{ flexShrink: 0, marginTop: '2px' }}>
                                {style.icon}
                            </div>

                            {/* Content */}
                            <div style={{ flex: 1 }}>
                                <Toast.Title style={{
                                    fontSize: '15px',
                                    fontWeight: '600',
                                    marginBottom: toast.description ? '4px' : '0'
                                }}>
                                    {toast.title}
                                </Toast.Title>
                                {toast.description && (
                                    <Toast.Description style={{
                                        fontSize: '13px',
                                        opacity: 0.9,
                                        lineHeight: '1.4'
                                    }}>
                                        {toast.description}
                                    </Toast.Description>
                                )}
                            </div>

                            {/* Close Button */}
                            <Toast.Close asChild>
                                <button
                                    onClick={() => removeToast(toast.id)}
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.2)',
                                        border: 'none',
                                        borderRadius: '6px',
                                        width: '28px',
                                        height: '28px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        color: 'white',
                                        transition: 'all 0.2s',
                                        flexShrink: 0
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                                    }}
                                    aria-label="Close notification"
                                >
                                    <X size={16} />
                                </button>
                            </Toast.Close>
                        </Toast.Root>
                    );
                })}

                {/* Viewport - where toasts appear */}
                <Toast.Viewport
                    style={{
                        position: 'fixed',
                        bottom: '20px',
                        right: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        width: '400px',
                        maxWidth: '100vw',
                        margin: 0,
                        listStyle: 'none',
                        zIndex: 999999,
                        outline: 'none'
                    }}
                />
            </Toast.Provider>

            {/* CSS Animations */}
            <style>{`
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }

                [data-swipe='end'] {
                    animation: swipeOut 0.2s ease-out;
                }

                @keyframes swipeOut {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
            `}</style>
        </ToastContext.Provider>
    );
};

/**
 * Hook to show toast notifications from any component
 */
export const useStoryToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useStoryToast must be used within StoryToastProvider');
    }
    return context;
};
