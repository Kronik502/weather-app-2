const STORAGE_KEYS = {
  FAVORITES: 'weathernow_favorites',
  RECENT_SEARCHES: 'weathernow_recent_searches',
  LAST_LOCATION: 'weathernow_last_location',
  PREFERENCES: 'weathernow_preferences'
};

const MAX_RECENT_SEARCHES = 5;
const MAX_FAVORITES = 10;

/**
 * Get data from localStorage
 */
const getItem = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error getting ${key} from localStorage:`, error);
    return null;
  }
};

/**
 * Set data in localStorage
 */
const setItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error setting ${key} in localStorage:`, error);
    return false;
  }
};

/**
 * Remove data from localStorage
 */
const removeItem = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
    return false;
  }
};

// ============ FAVORITES ============

/**
 * Get favorite cities
 */
export const getFavorites = () => {
  return getItem(STORAGE_KEYS.FAVORITES) || [];
};

/**
 * Add city to favorites
 */
export const addFavorite = (city) => {
  const favorites = getFavorites();
  
  // Check if already exists
  if (favorites.some(fav => fav.id === city.id)) {
    return favorites;
  }

  // Add to beginning and limit to MAX_FAVORITES
  const updated = [city, ...favorites].slice(0, MAX_FAVORITES);
  setItem(STORAGE_KEYS.FAVORITES, updated);
  return updated;
};

/**
 * Remove city from favorites
 */
export const removeFavorite = (cityId) => {
  const favorites = getFavorites();
  const updated = favorites.filter(fav => fav.id !== cityId);
  setItem(STORAGE_KEYS.FAVORITES, updated);
  return updated;
};

/**
 * Check if city is in favorites
 */
export const isFavorite = (cityId) => {
  const favorites = getFavorites();
  return favorites.some(fav => fav.id === cityId);
};

/**
 * Toggle favorite status
 */
export const toggleFavorite = (city) => {
  if (isFavorite(city.id)) {
    return removeFavorite(city.id);
  } else {
    return addFavorite(city);
  }
};

// ============ RECENT SEARCHES ============

/**
 * Get recent searches
 */
export const getRecentSearches = () => {
  return getItem(STORAGE_KEYS.RECENT_SEARCHES) || [];
};

/**
 * Add search to recent searches
 */
export const addRecentSearch = (search) => {
  const recent = getRecentSearches();
  
  // Remove if already exists
  const filtered = recent.filter(s => s.toLowerCase() !== search.toLowerCase());
  
  // Add to beginning and limit to MAX_RECENT_SEARCHES
  const updated = [search, ...filtered].slice(0, MAX_RECENT_SEARCHES);
  setItem(STORAGE_KEYS.RECENT_SEARCHES, updated);
  return updated;
};

/**
 * Clear recent searches
 */
export const clearRecentSearches = () => {
  removeItem(STORAGE_KEYS.RECENT_SEARCHES);
};

// ============ LAST LOCATION ============

/**
 * Get last viewed location
 */
export const getLastLocation = () => {
  return getItem(STORAGE_KEYS.LAST_LOCATION);
};

/**
 * Save last viewed location
 */
export const saveLastLocation = (location) => {
  setItem(STORAGE_KEYS.LAST_LOCATION, {
    ...location,
    timestamp: Date.now()
  });
};

/**
 * Clear last location
 */
export const clearLastLocation = () => {
  removeItem(STORAGE_KEYS.LAST_LOCATION);
};

// ============ USER PREFERENCES ============

/**
 * Get user preferences
 */
export const getPreferences = () => {
  return getItem(STORAGE_KEYS.PREFERENCES) || {
    temperatureUnit: 'celsius',
    timeFormat: '12hour',
    theme: 'auto'
  };
};

/**
 * Update user preferences
 */
export const updatePreferences = (updates) => {
  const current = getPreferences();
  const updated = { ...current, ...updates };
  setItem(STORAGE_KEYS.PREFERENCES, updated);
  return updated;
};

// ============ CLEAR ALL ============

/**
 * Clear all stored data
 */
export const clearAllStorage = () => {
  Object.values(STORAGE_KEYS).forEach(key => {
    removeItem(key);
  });
};