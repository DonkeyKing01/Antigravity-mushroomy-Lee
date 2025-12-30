/**
 * Utility function to get the correct asset path for both development and production.
 * In development, returns the path as-is (with leading slash).
 * In production (GitHub Pages), prepends the repository name.
 */
export const getAssetPath = (path: string): string => {
    // Remove leading slash if present to avoid double slashes
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;

    // Use relative path for production to avoid hardcoded repo name issues
    // Since we use HashRouter, the page context is always index.html at the root
    // so ./ works correctly for all routes
    const baseUrl = import.meta.env.PROD ? './' : '/';

    return `${baseUrl}${cleanPath}`;
};
