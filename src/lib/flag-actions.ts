
import { toast } from '@/hooks/use-toast';
import { type UserProfile } from '@/context/user-profile-context';
// Removed direct import to prevent circular dependencies
// import { sceneManager } from './scene-manager'; 
import { eventManager } from './event-manager';

export type FlagActionArgs = {
  key: string;
  value: any;
  profile: UserProfile;
  isInitial: boolean;
};

export type FlagAction = (args: FlagActionArgs) => void;

// This type should match the structure of the value for the updateMusicMetadata flag
type MusicMetadataPayload = {
  songId: string;
  title?: string;
  artist?: string;
};


export const flagActions: { [key: string]: FlagAction } = {
  showWelcomeMessage: ({ isInitial }) => {
    if (isInitial) return;
    toast({ title: 'Welcome!', description: 'This is a welcome message for new users.' });
  },
  hideWelcomeMessage: () => {
    // In a real app, you might have a way to dismiss a specific toast.
    // For now, we'll just log it.
    console.log('Hide welcome message callback triggered.');
  },
  superfan: ({ isInitial }) => {
    // Import dynamically inside the function to avoid circular dependency issues
    const { sceneManager } = require('./scene-manager');
    sceneManager.makeSceneAvailable('pixel_pioneer_superfan_chat');
    if (!isInitial) {
      toast({
        title: 'Pixel Pioneer Superfan!',
        description: 'Your dedication has been recognized. You are a true pioneer!',
      });
    }
  },
  updateMusicMetadata: ({ value }) => {
    const payload = value as MusicMetadataPayload;
    if (payload && payload.songId) {
      console.log('[FlagAction] Emitting musicMetadataChanged event', payload);
      eventManager.emit('musicMetadataChanged', payload);
    } else {
      console.warn('[FlagAction] updateMusicMetadata called with invalid payload:', value);
    }
  },
};
