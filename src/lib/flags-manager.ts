
import { type UserProfile } from '@/context/user-profile-context';
import { FlagDefinition, FlagDefinitions, FlagDependency } from './flag-types';
import { flagActions } from './flag-actions';
import { eventManager } from './event-manager';
import flagJson from './flags.json';

export interface ProfileFlag {
  value: boolean | number | string | null;
  expiresAt?: number;
}

const flagDefinitions: FlagDefinitions = flagJson;

const dependenciesMet = (dependencies: FlagDependency[], profileFlags: { [key: string]: ProfileFlag }): boolean => {
  return dependencies.every(dep => {
    const profileFlag = profileFlags[dep.key];
    return profileFlag && profileFlag.value === dep.value;
  });
};

export class FlagManager {
  private profile: UserProfile;
  private updateProfile: (updatedData: Partial<Omit<UserProfile, 'id'>>) => void;
  private unsubscribeCallbacks: (() => void)[] = [];

  constructor(profile: UserProfile, updateProfile: (updatedData: Partial<Omit<UserProfile, 'id'>>) => void) {
    this.profile = profile;
    this.updateProfile = updateProfile;
    this.processTriggers();
  }

  public destroy() {
    this.unsubscribeCallbacks.forEach(unsub => unsub());
  }

  private processTriggers() {
    for (const key in flagDefinitions) {
      const definition = flagDefinitions[key];
      if (definition.trigger) {
        const { event, conditions } = definition.trigger;
        const unsubscribe = eventManager.on(event, (payload: any) => {
          if (this.evaluateConditions(payload, conditions)) {
            this.setFlag(key, definition.trigger?.targetValue ?? true, { isInitial: false });
          }
        });
        this.unsubscribeCallbacks.push(unsubscribe);
      }
    }
  }

  private evaluateConditions(payload: any, conditions: string[]): boolean {
    return conditions.every(conditionStr => {
      const [field, expectedValue] = conditionStr.split('=');
      // eslint-disable-next-line eqeqeq
      return payload[field] == expectedValue;
    });
  }

  setFlag(key: string, value: any, options: { isInitial: boolean } = { isInitial: false }) {
    const definition = flagDefinitions[key];
    if (!definition) return;

    if (definition.dependsOn && !dependenciesMet(definition.dependsOn, this.profile.flags || {})) {
      return;
    }

    const profileFlags = { ...(this.profile.flags || {}) };
    const isNewFlag = !profileFlags[key] || profileFlags[key].value !== value;

    if (!isNewFlag) return;

    console.log(`[FlagManager] Setting flag '${key}' to '${value}'.`);
    const expiresAt = definition.temporaryDuration ? Date.now() + definition.temporaryDuration : undefined;
    profileFlags[key] = { value, expiresAt };
    this.updateProfile({ flags: profileFlags });

    this.runFlagActions(key, value, options.isInitial);
  }

  private runFlagActions(key: string, value: any, isInitial: boolean) {
    const definition = flagDefinitions[key];
    if (!definition) return;

    const actions = this.getActions(definition);
    if (!actions.length) return;

    actions.forEach(actionName => {
      console.log(`[FlagManager] Running action '${actionName}' for flag '${key}'. Initial: ${isInitial}`);
      const action = flagActions[actionName as keyof typeof flagActions];
      if (action) {
        // @ts-ignore
        action({ key, value, isInitial, profile: this.profile });
      } else {
        console.warn(`[FlagManager] Action '${actionName}' not found for flag '${key}'.`);
      }
    });
  }

  private getActions(definition: FlagDefinition): string[] {
    let actions: string[] = [];
    if (definition.onSet) {
      actions = actions.concat(Array.isArray(definition.onSet) ? definition.onSet : [definition.onSet]);
    }
    return actions;
  }

  public evaluateInitialFlags() {
    const profileFlags = this.profile.flags || {};
    console.log(`[FlagManager] Evaluating ${Object.keys(profileFlags).length} initial flags...`);

    for (const key in profileFlags) {
      const flag = profileFlags[key];
      if (flag.value) {
        this.runFlagActions(key, flag.value, true);
      }
    }
  }

  getFlag(key: string): ProfileFlag | null {
    return this.profile.flags?.[key] || null;
  }

  processExpiredFlags() {
    const profileFlags = { ...(this.profile.flags || {}) };
    let flagsChanged = false;

    for (const key in profileFlags) {
      const flag = profileFlags[key];
      if (flag.expiresAt && flag.expiresAt <= Date.now()) {
        delete profileFlags[key];
        flagsChanged = true;
        
        const definition = flagDefinitions[key];
        if (definition && definition.onRemove) {
          const actions = Array.isArray(definition.onRemove) ? definition.onRemove : [definition.onRemove];
          actions.forEach(actionName => {
            const callback = flagActions[actionName as keyof typeof flagActions];
            if (callback) {
              // @ts-ignore
              callback({ key, value: flag.value, isInitial: false, profile: this.profile });
            } else {
              console.warn(`[FlagManager] onRemove callback '${actionName}' not found.`);
            }
          });
        }
      }
    }

    if (flagsChanged) {
      this.updateProfile({ flags: profileFlags });
    }
  }

  removeFlag(key: string) {
    const profileFlags = { ...(this.profile.flags || {}) };
    if (!profileFlags[key]) return;

    const flagValue = profileFlags[key].value;
    delete profileFlags[key];
    this.updateProfile({ flags: profileFlags });

    const definition = flagDefinitions[key];
    if (definition && definition.onRemove) {
      const actions = Array.isArray(definition.onRemove) ? definition.onRemove : [definition.onRemove];
      actions.forEach(actionName => {
        const callback = flagActions[actionName as keyof typeof flagActions];
        if (callback) {
          // @ts-ignore
          callback({ key, value: flagValue, isInitial: false, profile: this.profile });
        } else {
          console.warn(`[FlagManager] onRemove callback '${actionName}' not found.`);
        }
      });
    }
  }
}
