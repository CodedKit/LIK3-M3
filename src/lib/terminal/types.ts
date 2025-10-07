
export interface CommandExecuteProps {
    args: string[];
    commands: { [key: string]: Command };
    user: string;
    setShowDebug: (show: boolean | ((s: boolean) => boolean)) => void;
}

export interface Command {
  name: string;
  description: string;
  execute: (props: CommandExecuteProps) => React.ReactNode;
}
