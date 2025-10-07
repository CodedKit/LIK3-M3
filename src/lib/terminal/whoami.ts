
import { type Command, type CommandExecuteProps } from './types';

export const whoami: Command = {
  name: 'whoami',
  description: 'Displays the current user.',
  execute: ({ user }: CommandExecuteProps) => {
    return user;
  },
};
