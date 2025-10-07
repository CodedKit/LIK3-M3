
import { type Command, type CommandExecuteProps } from './types';

export const help: Command = {
  name: 'help',
  description: 'Shows a list of available commands.',
  execute: ({ commands }: CommandExecuteProps) => {
    const commandList = Object.values(commands)
      .map(cmd => (
        <div key={cmd.name} className="flex">
          <span className="w-24 text-primary-foreground">{cmd.name}</span>
          <span>-</span>
          <span className="ml-2">{cmd.description}</span>
        </div>
      ));
    
    return (
      <div>
        <p className="text-primary-foreground mb-2">Available commands:</p>
        {commandList}
        <div className="flex mt-1">
          <span className="w-24 text-primary-foreground">clear</span>
          <span>-</span>
          <span className="ml-2">clear the terminal</span>
        </div>
      </div>
    );
  },
};
