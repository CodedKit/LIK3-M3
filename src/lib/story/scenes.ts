
import storyContent from './story.ink.json';
import anotherStoryContent from './another-story.ink.json';

export type Scene = {
  id: string;
  title: string;
  description: string;
  avatar: {
    imageUrl: string;
    fallback: string;
  };
  storyContent: any;
};

export const scenes: Scene[] = [
  {
    id: 'story-1',
    title: 'Mysterious Message',
    description: 'A strange message appears on your console. Where will it lead?',
    avatar: {
      imageUrl: 'https://github.com/shadcn.png',
      fallback: 'MM',
    },
    storyContent: storyContent,
  },
  {
    id: 'story-2',
    title: 'The Glitch',
    description: 'Something is wrong with the system. Can you fix it?',
    avatar: {
      imageUrl: '/bot-avatar.png',
      fallback: 'TG',
    },
    storyContent: anotherStoryContent,
  },
];
