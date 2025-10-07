
import { type Command, type CommandExecuteProps } from './types';

export const clear: Command = {
  name: 'clear',
  description: 'Clears the terminal history.',
  execute: () => {
    // This command is handled specially in terminal.tsx to modify state
    return 'Clearing history...';
  },
};
