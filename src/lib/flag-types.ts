/**
 * Defines a prerequisite for a flag. The flag will only be set if the dependency
 * flag's key exists and its value matches the specified condition.
 */
export type FlagDependency = {
  key: string;
  value: string | number | boolean;
};

/**
 * Defines the complete structure and behavior for a single flag.
 * It serves as the blueprint for how a flag should operate, including its triggers,
 * dependencies, and the actions it performs.
 */
export type FlagDefinition = {
  description: string;
  type: 'boolean' | 'number' | 'string';
  defaultValue: boolean | number | string | null;
  temporaryDuration?: number; // in milliseconds, for flags that should expire
  sceneId?: string; // If provided, the flag is considered scene-specific
  dependsOn?: FlagDependency[];
  onSet?: string | string[]; // Key(s) for functions in flag-callbacks.ts
  onRemove?: string | string[]; // Key(s) for functions in flag-callbacks.ts
  trigger?: {
    event: string;
    conditions: string[];
    targetValue?: any;
  };
};

/**
 * A collection of all flag definitions for the application.
 * The key is the flag's unique identifier.
 */
export type FlagDefinitions = {
  [key: string]: FlagDefinition;
};
