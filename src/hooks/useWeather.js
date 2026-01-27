import { useState, useEffect, useCallback } from 'react';
import { fetchWeatherByCoords, fetchWeatherByCity } from '../services/weatherService';
import { getCurrentPosition } from '../services/locationService';
import { getWeatherBackground, isNightTime } from '../utils/weatherUtils';

export const useWeather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [backgroundClass, setBackgroundClass] = useState('clear');

  /**
   * Update background based on weather conditions
   */
  const updateBackground = useCallback((data) => {
    const isNight = isNightTime(data.dt, data.sys.sunrise, data.sys.sunset);
    const bgClass = getWeatherBackground(data.weather[0].main, isNight);
    setBackgroundClass(bgClass);
  }, []);

  /**
   * Load weather by coordinates
   */
  const loadWeatherByCoords = useCallback(async (lat, lon) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await fetchWeatherByCoords(lat, lon);
      setWeatherData(data);
      updateBackground(data);
    } catch (err) {
      setError(err.message || 'Failed to load weather data');
      console.error('Error loading weather:', err);
    } finally {
      setLoading(false);
    }
  }, [updateBackground]);

  /**
   * Load weather by city name
   */
  const loadWeatherByCity = useCallback(async (cityName) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await fetchWeatherByCity(cityName);
      setWeatherData(data);
      updateBackground(data);
    } catch (err) {
      setError(err.message || 'Failed to load weather data');
      console.error('Error loading weather:', err);
    } finally {
      setLoading(false);
    }
  }, [updateBackground]);

  /**
   * Load weather using current location
   */
  const loadCurrentLocation = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { lat, lon } = await getCurrentPosition();
      await loadWeatherByCoords(lat, lon);
    } catch (err) {
      console.error('Location error:', err);
      // Fallback to default city
      setError('Unable to get your location. Showing default city.');
      await loadWeatherByCity('London');
    }
  }, [loadWeatherByCoords, loadWeatherByCity]);

  /**
   * Retry last action
   */
  const retry = useCallback(() => {
    if (weatherData) {
      // Retry with last known location
      loadWeatherByCoords(weatherData.coord.lat, weatherData.coord.lon);
    } else {
      // Try current location
      loadCurrentLocation();
    }
  }, [weatherData, loadWeatherByCoords, loadCurrentLocation]);

  /**
   * Initial load on mount
   */
  useEffect(() => {
    loadCurrentLocation();
  }, [loadCurrentLocation]);

  return {
    weatherData,
    loading,
    error,
    backgroundClass,
    loadWeatherByCity,
    loadCurrentLocation,
    retry
  };
};