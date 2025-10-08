
import { toast } from '@/hooks/use-toast';
import { type UserProfile } from '@/context/user-profile-context';
import { sceneManager } from './scene-manager';

export type FlagActionArgs = {
  key: string;
  value: any;
  profile: UserProfile;
  isInitial: boolean;
};

export type FlagAction = (args: FlagActionArgs) => void;

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
    sceneManager.makeSceneAvailable('pixel_pioneer_superfan_chat');
    if (!isInitial) {
      toast({
        title: 'Pixel Pioneer Superfan!',
        description: 'Your dedication has been recognized. You are a true pioneer!',
      });
    }
  },
};
