/**
 * Weather Icons Mapping
 * Using weather-icons library by Erik Flowers
 * Documentation: https://erikflowers.github.io/weather-icons/
 */

/**
 * Map OpenWeather condition code to weather-icons class
 */
export const getWeatherIconClass = (weatherMain, weatherId, isNight = false) => {
  // Night icons
  if (isNight) {
    const nightIcons = {
      Clear: 'wi-night-clear',
      Clouds: 'wi-night-alt-cloudy',
      Rain: 'wi-night-alt-rain',
      Drizzle: 'wi-night-alt-sprinkle',
      Thunderstorm: 'wi-night-alt-thunderstorm',
      Snow: 'wi-night-alt-snow',
      Mist: 'wi-night-fog',
      Smoke: 'wi-night-fog',
      Haze: 'wi-night-fog',
      Dust: 'wi-dust',
      Fog: 'wi-night-fog',
      Sand: 'wi-dust',
      Ash: 'wi-dust',
      Squall: 'wi-strong-wind',
      Tornado: 'wi-tornado'
    };
    return `wi ${nightIcons[weatherMain] || 'wi-night-clear'}`;
  }

  // Day icons based on main weather condition
  const iconMap = {
    Clear: 'wi-day-sunny',
    Clouds: 'wi-day-cloudy',
    Rain: 'wi-day-rain',
    Drizzle: 'wi-day-sprinkle',
    Thunderstorm: 'wi-day-thunderstorm',
    Snow: 'wi-day-snow',
    Mist: 'wi-day-fog',
    Smoke: 'wi-smoke',
    Haze: 'wi-day-haze',
    Dust: 'wi-dust',
    Fog: 'wi-day-fog',
    Sand: 'wi-dust',
    Ash: 'wi-dust',
    Squall: 'wi-strong-wind',
    Tornado: 'wi-tornado'
  };

  // Detailed mapping based on weather ID for more accuracy
  if (weatherId) {
    // Thunderstorm (200-232)
    if (weatherId >= 200 && weatherId < 300) {
      return `wi ${isNight ? 'wi-night-alt-thunderstorm' : 'wi-day-thunderstorm'}`;
    }
    // Drizzle (300-321)
    if (weatherId >= 300 && weatherId < 400) {
      return `wi ${isNight ? 'wi-night-alt-sprinkle' : 'wi-day-sprinkle'}`;
    }
    // Rain (500-531)
    if (weatherId >= 500 && weatherId < 600) {
      if (weatherId === 511) return 'wi wi-rain-mix'; // Freezing rain
      return `wi ${isNight ? 'wi-night-alt-rain' : 'wi-day-rain'}`;
    }
    // Snow (600-622)
    if (weatherId >= 600 && weatherId < 700) {
      if (weatherId === 611 || weatherId === 612 || weatherId === 613) {
        return 'wi wi-sleet'; // Sleet
      }
      return `wi ${isNight ? 'wi-night-alt-snow' : 'wi-day-snow'}`;
    }
    // Atmosphere (700-781)
    if (weatherId >= 700 && weatherId < 800) {
      if (weatherId === 701 || weatherId === 741) return `wi ${isNight ? 'wi-night-fog' : 'wi-day-fog'}`;
      if (weatherId === 711) return 'wi wi-smoke';
      if (weatherId === 731 || weatherId === 761) return 'wi wi-dust';
      if (weatherId === 751) return 'wi wi-sandstorm';
      if (weatherId === 762) return 'wi wi-volcano';
      if (weatherId === 771) return 'wi wi-strong-wind';
      if (weatherId === 781) return 'wi wi-tornado';
    }
    // Clear (800)
    if (weatherId === 800) {
      return `wi ${isNight ? 'wi-night-clear' : 'wi-day-sunny'}`;
    }
    // Clouds (801-804)
    if (weatherId > 800 && weatherId < 900) {
      if (weatherId === 801) return `wi ${isNight ? 'wi-night-alt-cloudy' : 'wi-day-cloudy'}`;
      if (weatherId === 802) return `wi ${isNight ? 'wi-night-alt-cloudy' : 'wi-day-cloudy'}`;
      if (weatherId === 803 || weatherId === 804) return 'wi wi-cloudy';
    }
  }

  return `wi ${iconMap[weatherMain] || 'wi-day-sunny'}`;
};

/**
 * Get simple emoji fallback (for places where icons aren't loaded)
 */
export const getWeatherEmoji = (weatherMain, isNight = false) => {
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
  // Weather-specific messages
  if (weatherMain === 'Rain' || weatherMain === 'Drizzle') {
    return "Don't forget your umbrella! ☔";
  }
  if (weatherMain === 'Thunderstorm') {
    return "Stay safe indoors! ⚡";
  }
  if (weatherMain === 'Snow') {
    return "Winter wonderland outside! ⛄";
  }
  if (weatherMain === 'Mist' || weatherMain === 'Fog') {
    return "Drive carefully, limited visibility 🌫️";
  }

  // Temperature-based messages
  if (temp >= 35) {
    return "Extreme heat! Stay hydrated 🌡️";
  } else if (temp >= 30) {
    return "It's scorching out there! Stay cool 🥵";
  } else if (temp >= 25) {
    return "Perfect weather for being outside ☀️";
  } else if (temp >= 20) {
    return "Lovely and comfortable today 😊";
  } else if (temp >= 15) {
    return "Perfect hoodie weather 🧥";
  } else if (temp >= 10) {
    return "A bit chilly, layer up! 🧣";
  } else if (temp >= 0) {
    return "Bundle up, it's cold out there! 🥶";
  } else {
    return "Freezing temps! Stay warm ❄️";
  }
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
 * Get wind direction icon class
 */
export const getWindDirectionIcon = (degrees) => {
  return `wi wi-wind towards-${degrees}-deg`;
};

/**
 * Convert meters per second to km/h
 */
export const convertWindSpeed = (mps) => {
  return Math.round(mps * 3.6);
};

/**
 * Get UV Index description
 */
export const getUVIndexDescription = (uvi) => {
  if (uvi <= 2) return { level: 'Low', color: '#4CAF50' };
  if (uvi <= 5) return { level: 'Moderate', color: '#FFEB3B' };
  if (uvi <= 7) return { level: 'High', color: '#FF9800' };
  if (uvi <= 10) return { level: 'Very High', color: '#F44336' };
  return { level: 'Extreme', color: '#9C27B0' };
};

/**
 * Get air quality description
 */
export const getAirQualityDescription = (aqi) => {
  if (aqi === 1) return { level: 'Good', color: '#4CAF50' };
  if (aqi === 2) return { level: 'Fair', color: '#8BC34A' };
  if (aqi === 3) return { level: 'Moderate', color: '#FFEB3B' };
  if (aqi === 4) return { level: 'Poor', color: '#FF9800' };
  if (aqi === 5) return { level: 'Very Poor', color: '#F44336' };
  return { level: 'Unknown', color: '#9E9E9E' };
};

/**
 * Get precipitation probability description
 */
export const getPrecipitationDescription = (pop) => {
  if (pop < 20) return 'Unlikely';
  if (pop < 50) return 'Possible';
  if (pop < 70) return 'Likely';
  return 'Very Likely';
};

/**
 * Format temperature with unit
 */
export const formatTemperature = (temp, unit = 'C') => {
  return `${Math.round(temp)}°${unit}`;
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