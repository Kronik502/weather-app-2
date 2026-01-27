export const API_ENDPOINTS = {
  WEATHER: 'https://api.openweathermap.org/data/2.5/weather',
  FORECAST: 'https://api.openweathermap.org/data/2.5/forecast',
  GEOCODING: 'https://us1.locationiq.com/v1/search',
  REVERSE_GEOCODING: 'https://us1.locationiq.com/v1/reverse'
};

export const DEFAULT_CITY = 'London';
export const DEFAULT_COORDS = {
  lat: 51.5074,
  lon: -0.1278
};

export const SEARCH_DEBOUNCE_MS = 500;
export const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes
export const FORECAST_CACHE_DURATION_MS = 30 * 60 * 1000; // 30 minutes

export const GEOLOCATION_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 300000 // 5 minutes
};

export const MAX_FAVORITES = 10;
export const MAX_RECENT_SEARCHES = 5;

export const TEMPERATURE_UNITS = {
  CELSIUS: 'celsius',
  FAHRENHEIT: 'fahrenheit'
};

export const TIME_FORMATS = {
  TWELVE_HOUR: '12hour',
  TWENTY_FOUR_HOUR: '24hour'
};

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto'
};

export const ERROR_MESSAGES = {
  NETWORK: 'Network error. Please check your internet connection.',
  API_KEY: 'Invalid API key. Please check your configuration.',
  NOT_FOUND: 'Location not found. Please try a different search.',
  RATE_LIMIT: 'Too many requests. Please try again later.',
  GEOLOCATION_DENIED: 'Location permission denied. Please enable location access.',
  GEOLOCATION_UNAVAILABLE: 'Location information unavailable.',
  GEOLOCATION_TIMEOUT: 'Location request timed out.',
  UNKNOWN: 'Something went wrong. Please try again.'
};

export const LOADING_MESSAGES = [
  'Fetching weather data...',
  'Getting your location...',
  'Loading forecast...',
  'Checking conditions...'
];