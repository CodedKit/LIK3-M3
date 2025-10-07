
import { type Command, type CommandExecuteProps } from './types';

export const help: Command = {
  name: 'help',
  description: 'Shows a list of available commands.',
  execute: ({ commands }: CommandExecuteProps) => {
    const commandList = Object.values(commands)
      .map(cmd => `  ${cmd.name.padEnd(10)} - ${cmd.description}`)
      .join('\n');
    
    return `Available commands:\n${commandList}\n  clear         - Clears the terminal history.`;
  },
};
