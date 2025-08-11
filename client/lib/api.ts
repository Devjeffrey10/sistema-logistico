// API configuration for both development and production
const getBaseURL = () => {
  // In development, use relative URLs (Vite proxy handles it)
  if (import.meta.env.DEV) {
    return "";
  }

  // In production, detect if we're on Netlify
  if (window.location.hostname.includes("netlify.app")) {
    return window.location.origin;
  }

  // Default to relative URLs
  return "";
};

export const BASE_URL = getBaseURL();

// Helper function to make API calls with proper URL handling
export const apiCall = async (endpoint: string, options?: RequestInit) => {
  const url = `${BASE_URL}${endpoint}`;

  // Log API calls in development
  if (import.meta.env.DEV) {
    console.log(`API Call: ${options?.method || "GET"} ${url}`);
  }

  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
};
