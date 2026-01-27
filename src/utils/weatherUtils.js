/**
 * Get background class based on weather condition and time
 */
export const getWeatherBackground = (weatherMain, isNight) => {
  if (isNight) return 'night';
  
  const weatherMap = {
    Clear: 'clear',
    Clouds: 'cloudy',
    Rain: 'rainy',
    Drizzle: 'rainy',
    Thunderstorm: 'rainy',
    Snow: 'snow',
    Mist: 'cloudy',
    Smoke: 'cloudy',
    Haze: 'cloudy',
    Dust: 'cloudy',
    Fog: 'cloudy',
    Sand: 'cloudy',
    Ash: 'cloudy',
    Squall: 'rainy',
    Tornado: 'rainy'
  };
  
  return weatherMap[weatherMain] || 'clear';
};

/**
 * Check if it's nighttime based on sunrise/sunset
 */
export const isNightTime = (currentTime, sunrise, sunset) => {
  return currentTime < sunrise || currentTime > sunset;
};

/**
 * Get contextual weather message based on conditions
 */
export const getWeatherMessage = (temp, weatherMain, weatherDescription) => {
  // Temperature-based messages
  if (temp >= 30) {
    return "It's scorching out there! 🌡️ Stay hydrated";
  } else if (temp >= 25) {
    return "Perfect weather for being outside ☀️";
  } else if (temp >= 20) {
    return "Lovely and comfortable today";
  } else if (temp >= 15) {
    return "Perfect hoodie weather 🧥";
  } else if (temp >= 10) {
    return "A bit chilly, layer up!";
  } else if (temp >= 0) {
    return "Bundle up, it's cold out there! 🧣";
  } else {
    return "Freezing temps! Stay warm ❄️";
  }
};

/**
 * Get weather emoji based on condition
 */
export const getWeatherEmoji = (weatherMain, isNight) => {
  if (isNight) {
    return weatherMain === 'Clear' ? '🌙' : '☁️';
  }
  
  const emojiMap = {
    Clear: '☀️',
    Clouds: '☁️',
    Rain: '🌧️',
    Drizzle: '🌦️',
    Thunderstorm: '⛈️',
    Snow: '❄️',
    Mist: '🌫️',
    Smoke: '🌫️',
    Haze: '🌫️',
    Dust: '🌫️',
    Fog: '🌫️',
    Sand: '🌫️',
    Ash: '🌫️',
    Squall: '💨',
    Tornado: '🌪️'
  };
  
  return emojiMap[weatherMain] || '🌤️';
};

/**
 * Get wind direction from degrees
 */
export const getWindDirection = (degrees) => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
};

/**
 * Format timestamp to time string
 */
export const formatTime = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
};

/**
 * Get UV Index description
 */
export const getUVIndexDescription = (uvi) => {
  if (uvi <= 2) return 'Low';
  if (uvi <= 5) return 'Moderate';
  if (uvi <= 7) return 'High';
  if (uvi <= 10) return 'Very High';
  return 'Extreme';
};

/**
 * Convert meters per second to km/h
 */
export const convertWindSpeed = (mps) => {
  return Math.round(mps * 3.6);
};

/**
 * Debounce function for search input
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};