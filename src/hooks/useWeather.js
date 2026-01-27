import { useState, useEffect, useCallback } from 'react';
import { fetchWeatherByCity, fetchWeatherByCoords, validateApiKey } from '../services/weatherService';
import { getCityFromCoords } from '../services/geocodingService';
import { useGeolocation } from './useGeolocation';
import { getWeatherBackground, isNightTime } from '../utils/weatherUtils';
import { addRecentSearch, saveLastLocation } from '../utils/storageUtils';
import { DEFAULT_CITY } from '../utils/constants';

/**
 * Main weather hook that manages all weather-related state and operations
 */
export const useWeather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [backgroundClass, setBackgroundClass] = useState('clear');
  const [lastSearch, setLastSearch] = useState(null);

  const { getCurrentPosition } = useGeolocation();

  /**
   * Update background based on weather data
   */
  const updateBackground = useCallback((data) => {
    if (!data) return;

    const weatherMain = data.weather[0].main;
    const isNight = isNightTime(data.dt, data.sys.sunrise, data.sys.sunset);
    const bgClass = getWeatherBackground(weatherMain, isNight);
    setBackgroundClass(bgClass);
  }, []);

  /**
   * Load weather by city name
   */
  const loadWeatherByCity = useCallback(async (cityName) => {
    if (!cityName || !cityName.trim()) {
      setError(new Error('Please enter a city name'));
      return;
    }

    setLoading(true);
    setError(null);
    setLastSearch({ type: 'city', value: cityName });

    try {
      const data = await fetchWeatherByCity(cityName);
      setWeatherData(data);
      updateBackground(data);
      
      // Save to recent searches and last location
      addRecentSearch(cityName);
      saveLastLocation({
        type: 'city',
        name: data.name,
        country: data.sys.country,
        coords: {
          lat: data.coord.lat,
          lon: data.coord.lon
        }
      });
    } catch (err) {
      setError(err);
      console.error('Error loading weather by city:', err);
    } finally {
      setLoading(false);
    }
  }, [updateBackground]);

  /**
   * Load weather by coordinates
   */
  const loadWeatherByCoords = useCallback(async (lat, lon) => {
    setLoading(true);
    setError(null);
    setLastSearch({ type: 'coords', value: { lat, lon } });

    try {
      const data = await fetchWeatherByCoords(lat, lon);
      
      // Try to get city name from coordinates
      try {
        const locationInfo = await getCityFromCoords(lat, lon);
        if (locationInfo.city) {
          // Enhance weather data with better location info
          data.name = locationInfo.city;
          data.sys.country = locationInfo.countryCode || data.sys.country;
        }
      } catch (geoError) {
        console.warn('Could not get city name from coordinates:', geoError);
      }

      setWeatherData(data);
      updateBackground(data);
      
      // Save last location
      saveLastLocation({
        type: 'coords',
        name: data.name,
        country: data.sys.country,
        coords: { lat, lon }
      });
    } catch (err) {
      setError(err);
      console.error('Error loading weather by coords:', err);
    } finally {
      setLoading(false);
    }
  }, [updateBackground]);

  /**
   * Load weather for current location
   */
  const loadCurrentLocation = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const position = await getCurrentPosition();
      await loadWeatherByCoords(position.lat, position.lon);
    } catch (err) {
      setError(err);
      console.error('Error getting current location:', err);
    }
  }, [getCurrentPosition, loadWeatherByCoords]);

  /**
   * Retry last search
   */
  const retry = useCallback(() => {
    if (!lastSearch) {
      loadWeatherByCity(DEFAULT_CITY);
      return;
    }

    if (lastSearch.type === 'city') {
      loadWeatherByCity(lastSearch.value);
    } else if (lastSearch.type === 'coords') {
      loadWeatherByCoords(lastSearch.value.lat, lastSearch.value.lon);
    }
  }, [lastSearch, loadWeatherByCity, loadWeatherByCoords]);

  /**
   * Refresh current weather data
   */
  const refresh = useCallback(() => {
    if (weatherData) {
      loadWeatherByCoords(weatherData.coord.lat, weatherData.coord.lon);
    } else {
      retry();
    }
  }, [weatherData, loadWeatherByCoords, retry]);

  /**
   * Load default city on mount
   */
  useEffect(() => {
    // Validate API key first
    if (!validateApiKey()) {
      setError(new Error('API key not configured. Please add VITE_OPENWEATHER_API_KEY to your .env file'));
      return;
    }

    // Load default city
    loadWeatherByCity(DEFAULT_CITY);
  }, [loadWeatherByCity]);

  return {
    weatherData,
    loading,
    error,
    backgroundClass,
    loadWeatherByCity,
    loadWeatherByCoords,
    loadCurrentLocation,
    retry,
    refresh
  };
};