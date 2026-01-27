import { useState, useEffect, useCallback } from 'react';
import { 
  fetchForecastByCity, 
  fetchForecastByCoords,
  processDailyForecast,
  processHourlyForecast 
} from '../services/forecastService';

/**
 * Custom hook for managing forecast data
 */
export const useForecast = (weatherData) => {
  const [forecastData, setForecastData] = useState(null);
  const [dailyForecast, setDailyForecast] = useState([]);
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Load forecast by coordinates
   */
  const loadForecastByCoords = useCallback(async (lat, lon) => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchForecastByCoords(lat, lon);
      setForecastData(data);
      
      // Process data
      const daily = processDailyForecast(data);
      const hourly = processHourlyForecast(data, 8);
      
      setDailyForecast(daily);
      setHourlyForecast(hourly);
    } catch (err) {
      setError(err);
      console.error('Error loading forecast:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Load forecast by city name
   */
  const loadForecastByCity = useCallback(async (cityName) => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchForecastByCity(cityName);
      setForecastData(data);
      
      // Process data
      const daily = processDailyForecast(data);
      const hourly = processHourlyForecast(data, 8);
      
      setDailyForecast(daily);
      setHourlyForecast(hourly);
    } catch (err) {
      setError(err);
      console.error('Error loading forecast:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Auto-load forecast when weather data changes
   */
  useEffect(() => {
    if (weatherData && weatherData.coord) {
      loadForecastByCoords(weatherData.coord.lat, weatherData.coord.lon);
    }
  }, [weatherData, loadForecastByCoords]);

  return {
    forecastData,
    dailyForecast,
    hourlyForecast,
    loading,
    error,
    loadForecastByCoords,
    loadForecastByCity
  };
};