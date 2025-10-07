
import { type Command, type CommandExecuteProps } from './types';

export const cheat: Command = {
  name: 'cheat',
  description: 'Applies a cheat code. Usage: cheat [code]',
  execute: ({ args, activeProfile, updateProfile }: CommandExecuteProps) => {
    if (!activeProfile) {
      return 'Error: No active profile to apply cheat to.';
    }

    const cheatCode = args[0];

    if (!cheatCode) {
      return 'Usage: cheat [code]';
    }

    switch (cheatCode.toLowerCase()) {
      case 'rosebud':
        const currentMoney = activeProfile.money || 0;
        const newMoney = currentMoney + 1000;
        updateProfile(activeProfile.id, { money: newMoney });
        return 'Added $1,000.';
      default:
        return 'Invalid cheat code.';
    }
  },
};
