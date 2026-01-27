/**
 * React Icons Weather Mapping
 * Using react-icons/wi (Weather Icons)
 */

// Import React Icons with correct names
import { 
  WiDaySunny,
  WiNightClear,
  WiDayCloudy,
  WiNightAltCloudy,
  WiCloud,
  WiCloudy,
  WiRain,
  WiRainMix,
  WiSnow,
  WiThunderstorm,
  WiFog,
  WiHail,
  WiWindy,
  WiDust,
  WiSmoke,
  WiSandstorm,
  WiVolcano,
  WiTornado,
  WiStrongWind,
  WiRaindrops,
  WiSprinkle,
  WiSleet,
  WiSnowWind,
  WiDayRain,
  WiNightAltRain,
  WiDaySnow,
  WiNightAltSnow,
  WiDayThunderstorm,
  WiNightAltThunderstorm,
  WiDayFog,
  WiNightFog,
  WiDayHaze,
  WiDaySprinkle,
  WiNightAltSprinkle,
  WiHumidity,
  WiBarometer,
  WiSunrise,
  WiSunset,
  WiThermometer,
  WiTime3,
  WiNa,
  WiCelsius,
  WiFahrenheit
} from 'react-icons/wi';

/**
 * Map OpenWeather condition code to React Icon component
 */
export const getWeatherIcon = (weatherMain, weatherId, isNight = false) => {
  // Night icons
  if (isNight) {
    const nightIcons = {
      Clear: WiNightClear,
      Clouds: WiNightAltCloudy,
      Rain: WiNightAltRain,
      Drizzle: WiNightAltSprinkle,
      Thunderstorm: WiNightAltThunderstorm,
      Snow: WiNightAltSnow,
      Mist: WiNightFog,
      Smoke: WiNightFog,
      Haze: WiNightFog,
      Dust: WiDust,
      Fog: WiNightFog,
      Sand: WiDust,
      Ash: WiDust,
      Squall: WiStrongWind,
      Tornado: WiTornado
    };
    return nightIcons[weatherMain] || WiNightClear;
  }

  // Day icons based on main weather condition
  const iconMap = {
    Clear: WiDaySunny,
    Clouds: WiDayCloudy,
    Rain: WiDayRain,
    Drizzle: WiDaySprinkle,
    Thunderstorm: WiDayThunderstorm,
    Snow: WiDaySnow,
    Mist: WiDayFog,
    Smoke: WiSmoke,
    Haze: WiDayHaze,
    Dust: WiDust,
    Fog: WiDayFog,
    Sand: WiDust,
    Ash: WiDust,
    Squall: WiStrongWind,
    Tornado: WiTornado
  };

  // Detailed mapping based on weather ID for more accuracy
  if (weatherId) {
    // Thunderstorm (200-232)
    if (weatherId >= 200 && weatherId < 300) {
      return isNight ? WiNightAltThunderstorm : WiDayThunderstorm;
    }
    // Drizzle (300-321)
    if (weatherId >= 300 && weatherId < 400) {
      return isNight ? WiNightAltSprinkle : WiDaySprinkle;
    }
    // Rain (500-531)
    if (weatherId >= 500 && weatherId < 600) {
      if (weatherId === 511) return WiRainMix; // Freezing rain
      if (weatherId === 520 || weatherId === 521 || weatherId === 522) return WiRaindrops; // Shower rain
      return isNight ? WiNightAltRain : WiDayRain;
    }
    // Snow (600-622)
    if (weatherId >= 600 && weatherId < 700) {
      if (weatherId === 611 || weatherId === 612 || weatherId === 613) {
        return WiSleet; // Sleet
      }
      if (weatherId === 621 || weatherId === 622) return WiSnowWind; // Snow shower/heavy snow
      return isNight ? WiNightAltSnow : WiDaySnow;
    }
    // Atmosphere (700-781)
    if (weatherId >= 700 && weatherId < 800) {
      if (weatherId === 701 || weatherId === 741) return isNight ? WiNightFog : WiDayFog;
      if (weatherId === 711) return WiSmoke;
      if (weatherId === 721) return WiDayHaze;
      if (weatherId === 731 || weatherId === 761) return WiDust;
      if (weatherId === 751 || weatherId === 761) return WiSandstorm;
      if (weatherId === 762) return WiVolcano;
      if (weatherId === 771) return WiStrongWind;
      if (weatherId === 781) return WiTornado;
    }
    // Clear (800)
    if (weatherId === 800) {
      return isNight ? WiNightClear : WiDaySunny;
    }
    // Clouds (801-804)
    if (weatherId > 800 && weatherId < 900) {
      if (weatherId === 801) return isNight ? WiNightAltCloudy : WiDayCloudy;
      if (weatherId === 802) return WiCloud;
      if (weatherId === 803 || weatherId === 804) return WiCloudy;
    }
  }

  return iconMap[weatherMain] || WiDaySunny;
};

/**
 * Get weather icon size and color configuration
 */
export const getWeatherIconConfig = (size = 'large') => {
  const sizes = {
    small: { 
      size: 24, 
      color: '#94a3b8' // var(--color-text-muted)
    },
    medium: { 
      size: 36, 
      color: '#cbd5e1' // var(--color-text-secondary)
    },
    large: { 
      size: 96, 
      color: '#38bdf8' // var(--color-primary) - Updated to light blue
    },
    xlarge: { 
      size: 120, 
      color: '#38bdf8' // var(--color-primary) - Updated to light blue
    }
  };
  
  return sizes[size] || sizes.medium;
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
    Thunderstorm: 'thunder', // Updated to match new thunder class
    Snow: 'snow',
    Mist: 'fog', // Updated to match new fog class
    Smoke: 'fog',
    Haze: 'fog',
    Dust: 'cloudy',
    Fog: 'fog',
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
 * Get wind icon based on speed
 */
export const getWindIcon = (speed) => {
  const mps = speed;
  if (mps < 5) return WiWindy;
  return WiStrongWind;
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
  if (uvi <= 2) return { 
    level: 'Low', 
    color: '#10b981' // var(--color-success) - Updated
  };
  if (uvi <= 5) return { 
    level: 'Moderate', 
    color: '#f59e0b' // var(--color-warning) - Updated
  };
  if (uvi <= 7) return { 
    level: 'High', 
    color: '#f97316' // var(--color-temp-warm) - Updated
  };
  if (uvi <= 10) return { 
    level: 'Very High', 
    color: '#ef4444' // var(--color-error) - Updated
  };
  return { 
    level: 'Extreme', 
    color: '#9c27b0' // Updated to purple for extreme
  };
};

/**
 * Get air quality description
 */
export const getAirQualityDescription = (aqi) => {
  if (aqi === 1) return { 
    level: 'Good', 
    color: '#10b981' // var(--color-success)
  };
  if (aqi === 2) return { 
    level: 'Fair', 
    color: '#8bc34a' // Updated to match theme
  };
  if (aqi === 3) return { 
    level: 'Moderate', 
    color: '#f59e0b' // var(--color-warning)
  };
  if (aqi === 4) return { 
    level: 'Poor', 
    color: '#f97316' // var(--color-temp-warm)
  };
  if (aqi === 5) return { 
    level: 'Very Poor', 
    color: '#ef4444' // var(--color-error)
  };
  return { 
    level: 'Unknown', 
    color: '#94a3b8' // var(--color-text-muted)
  };
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
 * Get temperature color based on value
 */
export const getTemperatureColor = (temp) => {
  if (temp >= 35) return '#ef4444'; // var(--color-temp-hot)
  if (temp >= 30) return '#f97316'; // var(--color-temp-warm)
  if (temp >= 25) return '#f59e0b'; // var(--color-temp-mild)
  if (temp >= 20) return '#38bdf8'; // var(--color-primary)
  if (temp >= 15) return '#60a5fa'; // var(--color-temp-cool)
  if (temp >= 10) return '#93c5fd'; // var(--color-temp-cold)
  if (temp >= 0) return '#38bdf8'; // var(--color-primary)
  return '#60a5fa'; // var(--color-temp-cold)
};

/**
 * Get icon for time of day (sunrise/sunset)
 */
export const getTimeIcon = (timeType) => {
  if (timeType === 'sunrise') return WiSunrise;
  if (timeType === 'sunset') return WiSunset;
  return WiDaySunny;
};

/**
 * Get icon for weather details
 */
export const getDetailIcon = (detailType) => {
  const icons = {
    humidity: WiHumidity,
    pressure: WiBarometer,
    visibility: WiDayFog,
    wind: WiStrongWind,
    sunrise: WiSunrise,
    sunset: WiSunset,
    uvi: WiDaySunny,
    feelsLike: WiThermometer,
    clouds: WiCloud,
    dewPoint: WiHumidity,
    rain: WiRain,
    snow: WiSnow
  };
  
  return icons[detailType] || WiDaySunny;
};

/**
 * Get detail icon color based on type
 */
export const getDetailIconColor = (detailType) => {
  const colors = {
    humidity: '#22d3ee', // var(--color-humidity)
    pressure: '#c084fc', // var(--color-pressure)
    visibility: '#94a3b8', // var(--color-text-muted)
    wind: '#a78bfa', // var(--color-wind)
    sunrise: '#f59e0b', // var(--color-temp-mild)
    sunset: '#f97316', // var(--color-temp-warm)
    uvi: '#fbbf24', // var(--color-uv-high)
    feelsLike: '#38bdf8', // var(--color-primary)
    clouds: '#cbd5e1', // var(--color-text-secondary)
    dewPoint: '#22d3ee', // var(--color-humidity)
    rain: '#60a5fa', // var(--color-temp-cool)
    snow: '#93c5fd' // var(--color-temp-cold)
  };
  
  return colors[detailType] || '#38bdf8'; // var(--color-primary)
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

/**
 * Get weather condition color
 */
export const getWeatherConditionColor = (weatherMain, isNight = false) => {
  const colors = {
    Clear: isNight ? '#60a5fa' : '#38bdf8', // Blue tones
    Clouds: '#94a3b8', // Gray
    Rain: '#1e40af', // Dark blue
    Drizzle: '#3b82f6', // Medium blue
    Thunderstorm: '#7c3aed', // Purple
    Snow: '#93c5fd', // Light blue
    Mist: '#64748b', // Slate
    Smoke: '#94a3b8', // Gray
    Haze: '#cbd5e1', // Light gray
    Dust: '#a16207', // Brown
    Fog: '#64748b', // Slate
    Sand: '#a16207', // Brown
    Ash: '#6b7280', // Gray
    Squall: '#1d4ed8', // Dark blue
    Tornado: '#7c3aed' // Purple
  };
  
  return colors[weatherMain] || '#38bdf8'; // Default to primary blue
};