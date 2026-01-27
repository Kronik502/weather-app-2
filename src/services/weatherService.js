const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

/**
 * Fetch weather data by coordinates
 */
export const fetchWeatherByCoords = async (lat, lon) => {
  try {
    const response = await fetch(
      `${BASE_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Location not found');
      }
      if (response.status === 401) {
        throw new Error('Invalid API key');
      }
      throw new Error('Failed to fetch weather data');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Weather service error:', error);
    throw error;
  }
};

/**
 * Fetch weather data by city name
 */
export const fetchWeatherByCity = async (cityName) => {
  try {
    const response = await fetch(
      `${BASE_URL}?q=${encodeURIComponent(cityName)}&units=metric&appid=${API_KEY}`
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('City not found');
      }
      if (response.status === 401) {
        throw new Error('Invalid API key');
      }
      throw new Error('Failed to fetch weather data');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Weather service error:', error);
    throw error;
  }
};

/**
 * Validate API key (optional check)
 */
export const validateApiKey = () => {
  if (!API_KEY || API_KEY === 'your_openweather_api_key') {
    console.error('⚠️ OpenWeather API key is not configured!');
    console.log('Please add VITE_OPENWEATHER_API_KEY to your .env file');
    return false;
  }
  return true;
};