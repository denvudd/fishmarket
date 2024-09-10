/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
export function isObject(item: unknown): boolean {
    return item && typeof item === 'object' && !Array.isArray(item)
  }