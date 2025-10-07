
import { SceneDefinition, SceneDefinitions } from '../scene-types';

export const scenes: SceneDefinitions = {
  'new_user_introduction': {
    id: 'new_user_introduction',
    title: 'Welcome to LIK3 M3!',
    description: 'Your journey begins here. A quick introduction to the world.',
    avatar: {
      imageUrl: '/bot-avatar.png',
      fallback: 'WM',
    },
  },
  'story-1': {
    id: 'story-1',
    title: 'Mysterious Message',
    description: 'A strange message appears on your console. Where will it lead?',
    avatar: {
      imageUrl: 'https://github.com/shadcn.png',
      fallback: 'MM',
    },
  },
  'story-2': {
    id: 'story-2',
    title: 'The Glitch',
    description: 'Something is wrong with the system. Can you fix it?',
    avatar: {
      imageUrl: '/bot-avatar.png',
      fallback: 'TG',
    },
  },
  'pixel_pioneer_superfan_chat': {
    id: 'pixel_pioneer_superfan_chat',
    title: 'A Message from Pixel Pioneer',
    description: 'A special message for a dedicated fan.',
    avatar: {
        imageUrl: 'https://github.com/shadcn.png',
        fallback: 'PP',
    },
  },
};
