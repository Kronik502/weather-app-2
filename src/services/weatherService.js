const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Simple in-memory cache
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Validate API key on module load
 */
export const validateApiKey = () => {
  if (!API_KEY || API_KEY === 'your_openweather_api_key') {
    console.error('⚠️ OpenWeather API key is not configured!');
    console.log('Please add VITE_OPENWEATHER_API_KEY to your .env file');
    return false;
  }
  return true;
};

/**
 * Get cached data if available and not expired
 */
const getCachedData = (key) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

/**
 * Set data in cache
 */
const setCachedData = (key, data) => {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
};

/**
 * Fetch weather data by coordinates
 */
export const fetchWeatherByCoords = async (lat, lon) => {
  const cacheKey = `coords_${lat}_${lon}`;
  const cached = getCachedData(cacheKey);
  
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(
      `${BASE_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Location not found. Please try a different location.');
      }
      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your configuration.');
      }
      if (response.status === 429) {
        throw new Error('Too many requests. Please try again in a few minutes.');
      }
      throw new Error('Failed to fetch weather data. Please try again.');
    }

    const data = await response.json();
    setCachedData(cacheKey, data);
    return data;
  } catch (error) {
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Network error. Please check your internet connection.');
    }
    throw error;
  }
};

/**
 * Fetch weather data by city name
 */
export const fetchWeatherByCity = async (cityName) => {
  const cacheKey = `city_${cityName.toLowerCase()}`;
  const cached = getCachedData(cacheKey);
  
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(
      `${BASE_URL}?q=${encodeURIComponent(cityName)}&units=metric&appid=${API_KEY}`
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`City "${cityName}" not found. Please check the spelling and try again.`);
      }
      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your configuration.');
      }
      if (response.status === 429) {
        throw new Error('Too many requests. Please try again in a few minutes.');
      }
      throw new Error('Failed to fetch weather data. Please try again.');
    }

    const data = await response.json();
    setCachedData(cacheKey, data);
    return data;
  } catch (error) {
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Network error. Please check your internet connection.');
    }
    throw error;
  }
};

/**
 * Clear cache (useful for manual refresh)
 */
export const clearCache = () => {
  cache.clear();
};

/**
 * Get cache statistics (for debugging)
 */
export const getCacheStats = () => {
  return {
    size: cache.size,
    keys: Array.from(cache.keys())
  };
};