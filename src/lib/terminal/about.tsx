import { type Command } from './types';

export const about: Command = {
  name: 'about',
  description: 'Learn more about LIK3 M3',
  execute: () => {
    return 'LIK3 M3 is a virtual space for exploring identity.';
  },
};
