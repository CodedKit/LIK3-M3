import React from 'react';
import { type Command, type CommandExecuteProps } from './types';

export const help: Command = {
  name: 'help',
  description: 'Shows a list of available commands.',
  execute: ({ commands }: CommandExecuteProps) => {
    return (
      <ul className="list-disc pl-5">
        {Object.values(commands).map((cmd) => (
          <li key={cmd.name}>
            <span className="font-bold text-pink-400">{cmd.name}</span> - {cmd.description}
          </li>
        ))}
        <li>
            <span className="font-bold text-pink-400">clear</span> - clear the terminal
        </li>
      </ul>
    );
  },
};
