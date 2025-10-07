
import { type Command } from './types';

export const test: Command = {
  name: 'test',
  description: 'A test command.',
  execute: () => {
    return 'This is a test command. It works!';
  },
};
