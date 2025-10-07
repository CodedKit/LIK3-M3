type EventCallback = (...args: any[]) => void;

class EventManager {
  private static instance: EventManager;
  private listeners: { [eventName: string]: EventCallback[] } = {};

  private constructor() { }

  public static getInstance(): EventManager {
    if (!EventManager.instance) {
      EventManager.instance = new EventManager();
    }
    return EventManager.instance;
  }

  public on(eventName: string, callback: EventCallback): () => void {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push(callback);

    // Return a function to unsubscribe
    return () => {
      this.listeners[eventName] = this.listeners[eventName].filter(
        (listener) => listener !== callback
      );
    };
  }

  public emit(eventName: string, ...args: any[]): void {
    const eventListeners = this.listeners[eventName];
    if (eventListeners) {
      eventListeners.forEach((callback) => {
        try {
          callback(...args);
        } catch (error) {
            console.error(`[EventManager] Error in callback for event '${eventName}':`, error);
        }
      });
    }
  }
}

// Export a singleton instance
export const eventManager = EventManager.getInstance();
