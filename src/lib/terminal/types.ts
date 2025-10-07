import type React from 'react';

export interface CommandExecuteProps {
    args: string[];
    commands: { [key: string]: Command };
    user: string;
}

export interface Command {
  name: string;
  description: string;
  execute: (props: CommandExecuteProps) => React.ReactNode;
}
