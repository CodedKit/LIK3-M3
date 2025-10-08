
'use client';

import { useAuth } from '@/hooks/use-auth';
import { type ProfileFlag } from '@/lib/flags-manager';

// This hook is now a simple accessor for flag data from the active profile.
// The FlagManager logic has been centralized in the Desktop component.
export const useFlags = () => {
  const { activeProfile } = useAuth();

  const getFlag = (key: string): ProfileFlag | null => {
    if (!activeProfile || !activeProfile.flags) {
      return null;
    }
    return activeProfile.flags[key] || null;
  };

  return {
    getFlag,
    // The following functions are no longer implemented here as the FlagManager
    // is not instantiated in this hook. They are kept for API compatibility
    // to avoid breaking components that might still call them.
    setFlag: () => console.warn('setFlag is now managed centrally and should not be called from this hook.'),
    enterScene: () => {},
    exitScene: () => {},
  };
};
