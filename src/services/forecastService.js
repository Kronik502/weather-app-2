const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast';

// Simple in-memory cache
const forecastCache = new Map();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes (forecast changes less frequently)

/**
 * Get cached forecast data if available and not expired
 */
const getCachedForecast = (key) => {
  const cached = forecastCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

/**
 * Set forecast data in cache
 */
const setCachedForecast = (key, data) => {
  forecastCache.set(key, {
    data,
    timestamp: Date.now()
  });
};

/**
 * Fetch 5-day forecast by coordinates
 */
export const fetchForecastByCoords = async (lat, lon) => {
  const cacheKey = `forecast_coords_${lat}_${lon}`;
  const cached = getCachedForecast(cacheKey);
  
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(
      `${FORECAST_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Forecast data not available for this location.');
      }
      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your configuration.');
      }
      if (response.status === 429) {
        throw new Error('Too many requests. Please try again later.');
      }
      throw new Error('Failed to fetch forecast data.');
    }

    const data = await response.json();
    setCachedForecast(cacheKey, data);
    return data;
  } catch (error) {
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Network error. Please check your internet connection.');
    }
    throw error;
  }
};

/**
 * Fetch 5-day forecast by city name
 */
export const fetchForecastByCity = async (cityName) => {
  const cacheKey = `forecast_city_${cityName.toLowerCase()}`;
  const cached = getCachedForecast(cacheKey);
  
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(
      `${FORECAST_URL}?q=${encodeURIComponent(cityName)}&units=metric&appid=${API_KEY}`
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Forecast data not available for "${cityName}".`);
      }
      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your configuration.');
      }
      if (response.status === 429) {
        throw new Error('Too many requests. Please try again later.');
      }
      throw new Error('Failed to fetch forecast data.');
    }

    const data = await response.json();
    setCachedForecast(cacheKey, data);
    return data;
  } catch (error) {
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Network error. Please check your internet connection.');
    }
    throw error;
  }
};

/**
 * Process forecast data to get daily summaries
 * Groups 3-hour intervals into daily forecasts
 */
export const processDailyForecast = (forecastData) => {
  if (!forecastData || !forecastData.list) {
    return [];
  }

  const dailyData = {};

  forecastData.list.forEach(item => {
    const date = new Date(item.dt * 1000);
    const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD

    if (!dailyData[dateKey]) {
      dailyData[dateKey] = {
        date: dateKey,
        timestamp: item.dt,
        temps: [],
        conditions: [],
        humidity: [],
        windSpeed: [],
        precipitation: 0,
        items: []
      };
    }

    dailyData[dateKey].temps.push(item.main.temp);
    dailyData[dateKey].conditions.push({
      main: item.weather[0].main,
      description: item.weather[0].description,
      icon: item.weather[0].icon
    });
    dailyData[dateKey].humidity.push(item.main.humidity);
    dailyData[dateKey].windSpeed.push(item.wind.speed);
    
    // Sum up precipitation probability
    if (item.pop) {
      dailyData[dateKey].precipitation = Math.max(
        dailyData[dateKey].precipitation, 
        item.pop * 100
      );
    }

    dailyData[dateKey].items.push(item);
  });

  // Convert to array and calculate daily summaries
  return Object.values(dailyData).map(day => {
    // Get most common weather condition
    const conditionCounts = {};
    day.conditions.forEach(c => {
      conditionCounts[c.main] = (conditionCounts[c.main] || 0) + 1;
    });
    const mostCommonCondition = Object.entries(conditionCounts)
      .sort((a, b) => b[1] - a[1])[0][0];

    // Find the condition object with the most common main weather
    const mainCondition = day.conditions.find(c => c.main === mostCommonCondition);

    return {
      date: day.date,
      timestamp: day.timestamp,
      tempMin: Math.round(Math.min(...day.temps)),
      tempMax: Math.round(Math.max(...day.temps)),
      tempAvg: Math.round(day.temps.reduce((a, b) => a + b, 0) / day.temps.length),
      condition: mostCommonCondition,
      description: mainCondition.description,
      icon: mainCondition.icon,
      humidity: Math.round(day.humidity.reduce((a, b) => a + b, 0) / day.humidity.length),
      windSpeed: Math.round(day.windSpeed.reduce((a, b) => a + b, 0) / day.windSpeed.length),
      precipitation: Math.round(day.precipitation)
    };
  }).slice(0, 7); // Return max 7 days
};

/**
 * Process forecast data to get hourly forecasts (next 24 hours)
 */
export const processHourlyForecast = (forecastData, hours = 8) => {
  if (!forecastData || !forecastData.list) {
    return [];
  }

  return forecastData.list.slice(0, hours).map(item => ({
    timestamp: item.dt,
    time: new Date(item.dt * 1000),
    temp: Math.round(item.main.temp),
    feelsLike: Math.round(item.main.feels_like),
    condition: item.weather[0].main,
    description: item.weather[0].description,
    icon: item.weather[0].icon,
    precipitation: item.pop ? Math.round(item.pop * 100) : 0,
    humidity: item.main.humidity,
    windSpeed: item.wind.speed
  }));
};

/**
 * Clear forecast cache
 */
export const clearForecastCache = () => {
  forecastCache.clear();
};