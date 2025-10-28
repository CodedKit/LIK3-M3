/**
 * Utility functions for parsing and handling Ink story tags
 */

/**
 * Parse a tag value from Ink story tags
 * @param tags - Array of tags from the story
 * @param prefix - The tag prefix to search for (e.g., "music:", "image:", "sound:")
 * @returns The value after the prefix, or undefined if not found
 */
export function parseTag(tags: string[], prefix: string): string | undefined {
  const tag = tags.find((t) => t.startsWith(prefix));
  if (!tag) return undefined;

  return tag.substring(prefix.length).trim();
}

/**
 * Parse multiple tags with the same prefix
 * @param tags - Array of tags from the story
 * @param prefix - The tag prefix to search for
 * @returns Array of values for all matching tags
 */
export function parseTags(tags: string[], prefix: string): string[] {
  return tags
    .filter((t) => t.startsWith(prefix))
    .map((t) => t.substring(prefix.length).trim());
}

/**
 * Common tag prefixes used in stories
 */
export const TAG_PREFIX = {
  IMAGE: "image:",
  MUSIC: "music:",
  SOUND: "sound:",
  EFFECT: "effect:",
  BACKGROUND: "background:",
} as const;
