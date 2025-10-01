/**
 * Utility functions for string operations
 */

/**
 * Checks if a string is blank (empty or contains only whitespace)
 * @param s - The string to check
 * @returns true if the string is blank, false otherwise
 */
export function isBlank(s: string): boolean {
	return s.trim().length === 0;
}
