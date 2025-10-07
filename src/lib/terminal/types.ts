
import { type UserProfile } from "@/hooks/use-user-profile";

export interface CommandExecuteProps {
    args: string[];
    commands: { [key: string]: Command };
    user: string;
    setShowDebug: (show: boolean | ((s: boolean) => boolean)) => void;
    activeProfile: UserProfile | null;
    updateProfile: (profileId: string, updatedData: Partial<Omit<UserProfile, 'id'>>) => void;
}

export interface Command {
  name: string;
  description: string;
  execute: (props: CommandExecuteProps) => React.ReactNode;
}
