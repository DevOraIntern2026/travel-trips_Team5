/**
 * Escape LIKE wildcards so user input only ever matches literally.
 * Shared by search filters across feature modules.
 */
export function escapeLikePattern(value: string): string {
  return value.replace(/[\\%_]/g, (char) => `\\${char}`);
}
