import { type Command, type CommandExecuteProps } from './types';

export const debug: Command = {
  name: 'debug',
  description: 'Toggles the debug overlay.',
  execute: ({ setShowDebug }: CommandExecuteProps) => {
    setShowDebug(s => !s);
    return 'Toggled debug overlay.';
  },
};
