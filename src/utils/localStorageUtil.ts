// Set a single key-value pair (string)
export const setValue = (key: string, value: string): void => {
  localStorage.setItem(key, value);
};

// Get a single value by key
export const getValue = (key: string): string | null => {
  return localStorage.getItem(key);
};

// Remove a single key
export const removeSingleValue = (key: string): void => {
  localStorage.removeItem(key);
};

// Set multiple key-value pairs at once
export const setBulkValue = (items: Record<string, string>): void => {
  for (const [key, value] of Object.entries(items)) {
    localStorage.setItem(key, value);
  }
};

// Remove multiple keys at once
export const removeBulkValue = (keys: string[]): void => {
  keys.forEach((key) => localStorage.removeItem(key));
};
