import PropTypes from 'prop-types';
import { 
  getWeatherMessage, 
  convertWindSpeed, 
  getWindDirection,
  isNightTime,
  getTemperatureColor
} from '../utils/weatherUtils';
import { formatTime } from '../utils/dateUtils';
import '../styles/WeatherCard.css';

// Separate imports for different icon packages
import { MdLocationOn, MdVisibility } from "react-icons/md";
import { 
  WiHumidity, 
  WiStrongWind,
  WiBarometer,
  WiHorizonAlt,
  WiSunrise,
  WiSunset,
  WiThermometer,
  WiRaindrop,
  WiCloud
} from "react-icons/wi";

// Weather image mapping based on OpenWeatherMap condition codes
const getWeatherImage = (weatherId, weatherMain, isNight) => {
  // Thunderstorm (200-232)
  if (weatherId >= 200 && weatherId < 300) {
    return 'https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?w=800&q=80';
  }
  
  // Drizzle (300-321)
  if (weatherId >= 300 && weatherId < 400) {
    return 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=800&q=80';
  }
  
  // Rain (500-531)
  if (weatherId >= 500 && weatherId < 600) {
    if (weatherId === 511) { // Freezing rain
      return 'https://images.unsplash.com/photo-1547754980-3df97fed72a8?w=800&q=80';
    }
    return 'https://images.unsplash.com/photo-1428592953211-077101b2021b?w=800&q=80';
  }
  
  // Snow (600-622)
  if (weatherId >= 600 && weatherId < 700) {
    return 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=800&q=80';
  }
  
  // Atmosphere (701-781) - Mist, Fog, Haze, etc.
  if (weatherId >= 700 && weatherId < 800) {
    return 'https://images.unsplash.com/photo-1487621167305-5d248087c724?w=800&q=80';
  }
  
  // Clear (800)
  if (weatherId === 800) {
    if (isNight) {
      return 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80';
    }
    return 'https://images.unsplash.com/photo-1601297183305-6df142704ea2?w=800&q=80';
  }
  
  // Clouds (801-804)
  if (weatherId > 800 && weatherId < 900) {
    if (weatherId === 801 || weatherId === 802) { // Few/scattered clouds
      return isNight 
        ? 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80'
        : 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800&q=80';
    }
    // Broken/overcast clouds
    return 'https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?w=800&q=80';
  }
  
  // Default fallback
  return 'https://images.unsplash.com/photo-1561553543-785d71daa847?w=800&q=80';
};

// Get weather condition emoji for visual enhancement
const getWeatherEmoji = (weatherId, isNight) => {
  if (weatherId >= 200 && weatherId < 300) return '⚡';
  if (weatherId >= 300 && weatherId < 400) return '🌧️';
  if (weatherId >= 500 && weatherId < 600) return '🌧️';
  if (weatherId >= 600 && weatherId < 700) return '❄️';
  if (weatherId >= 700 && weatherId < 800) return '🌫️';
  if (weatherId === 800) return isNight ? '🌙' : '☀️';
  if (weatherId > 800) return '☁️';
  return '🌤️';
};

export default function WeatherCard({ data }) {
  const temp = Math.round(data.main.temp);
  const feelsLike = Math.round(data.main.feels_like);
  const weatherMain = data.weather[0].main;
  const weatherDescription = data.weather[0].description;
  const weatherId = data.weather[0].id;
  const isNight = isNightTime(data.dt, data.sys.sunrise, data.sys.sunset);

  const weatherMessage = getWeatherMessage(temp, weatherMain, weatherDescription);
  const weatherImage = getWeatherImage(weatherId, weatherMain, isNight);
  const weatherEmoji = getWeatherEmoji(weatherId, isNight);
  const tempColor = getTemperatureColor(temp);

  // Calculate min/max if available
  const tempMin = data.main.temp_min ? Math.round(data.main.temp_min) : null;
  const tempMax = data.main.temp_max ? Math.round(data.main.temp_max) : null;

  return (
    <div className="weather-card-modern">
      {/* Hero Section with Background Image */}
      <div className="weather-hero">
        <div 
          className="weather-hero-image"
          style={{ backgroundImage: `url(${weatherImage})` }}
          role="img"
          aria-label={`${weatherDescription} weather background`}
        >
          <div className="weather-hero-overlay"></div>
        </div>
        
        <div className="weather-hero-content">
          {/* Location */}
          <div className="weather-location">
            <MdLocationOn className="location-pin" />
            <div className="location-details">
              <h2 className="location-city">{data.name}</h2>
              <span className="location-country">{data.sys.country}</span>
            </div>
          </div>

          {/* Main Temperature Display */}
          <div className="weather-main-temp">
            <div className="temp-display">
              <span className="weather-emoji">{weatherEmoji}</span>
              <span className="temp-value" style={{ color: tempColor }}>
                {temp}
              </span>
              <span className="temp-unit">°C</span>
            </div>
            
            <div className="weather-condition">
              <p className="condition-text">{weatherDescription}</p>
              {(tempMin !== null && tempMax !== null) && (
                <p className="temp-range">
                  <span className="temp-high">{tempMax}°</span>
                  <span className="temp-separator">/</span>
                  <span className="temp-low">{tempMin}°</span>
                </p>
              )}
            </div>
          </div>

          {/* Feels Like */}
          <div className="feels-like-badge">
            <WiThermometer size={20} />
            <span>Feels like <strong style={{ color: getTemperatureColor(feelsLike) }}>{feelsLike}°C</strong></span>
          </div>

          {/* Weather Message */}
          <div className="weather-insight">
            <WiCloud size={20} />
            <p>{weatherMessage}</p>
          </div>
        </div>
      </div>

      {/* Details Grid - Two Column Layout */}
      <div className="weather-details-grid">
        <h3 className="details-heading">Weather Details</h3>
        
        <div className="details-container">
          {/* Left Column */}
          <div className="details-column">
            {/* Humidity */}
            <div className="detail-card">
              <div className="detail-header">
                <WiHumidity className="detail-icon humidity-icon" />
                <span className="detail-label">Humidity</span>
              </div>
              <div className="detail-content">
                <span className="detail-value">{data.main.humidity}</span>
                <span className="detail-unit">%</span>
              </div>
              <div className="detail-bar">
                <div 
                  className="detail-bar-fill humidity-bar"
                  style={{ width: `${Math.min(data.main.humidity, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Wind */}
            <div className="detail-card">
              <div className="detail-header">
                <WiStrongWind className="detail-icon wind-icon" />
                <span className="detail-label">Wind Speed</span>
              </div>
              <div className="detail-content">
                <span className="detail-value">{convertWindSpeed(data.wind.speed)}</span>
                <span className="detail-unit">km/h</span>
              </div>
              <div className="detail-subtitle">
                <span className="wind-direction">{getWindDirection(data.wind.deg)}</span>
                <span className="wind-degrees">({data.wind.deg}°)</span>
              </div>
            </div>

            {/* Pressure */}
            <div className="detail-card">
              <div className="detail-header">
                <WiBarometer className="detail-icon pressure-icon" />
                <span className="detail-label">Pressure</span>
              </div>
              <div className="detail-content">
                <span className="detail-value">{data.main.pressure}</span>
                <span className="detail-unit">hPa</span>
              </div>
              <div className="detail-subtitle">
                <span className="pressure-status">
                  {data.main.pressure > 1013 ? 'High' : data.main.pressure < 1013 ? 'Low' : 'Normal'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="details-column">
            {/* Visibility */}
            <div className="detail-card">
              <div className="detail-header">
                <MdVisibility className="detail-icon visibility-icon" />
                <span className="detail-label">Visibility</span>
              </div>
              <div className="detail-content">
                <span className="detail-value">{(data.visibility / 1000).toFixed(1)}</span>
                <span className="detail-unit">km</span>
              </div>
              <div className="detail-subtitle">
                <span className="visibility-status">
                  {data.visibility >= 10000 ? 'Excellent' : 
                   data.visibility >= 5000 ? 'Good' : 
                   data.visibility >= 2000 ? 'Moderate' : 'Poor'}
                </span>
              </div>
            </div>

            {/* Sunrise */}
            <div className="detail-card">
              <div className="detail-header">
                <WiSunrise className="detail-icon sunrise-icon" />
                <span className="detail-label">Sunrise</span>
              </div>
              <div className="detail-content detail-time-content">
                <span className="detail-value detail-time-value">
                  {formatTime(data.sys.sunrise)}
                </span>
              </div>
              <div className="detail-subtitle">
                <span className="sun-status">Dawn</span>
              </div>
            </div>

            {/* Sunset */}
            <div className="detail-card">
              <div className="detail-header">
                <WiSunset className="detail-icon sunset-icon" />
                <span className="detail-label">Sunset</span>
              </div>
              <div className="detail-content detail-time-content">
                <span className="detail-value detail-time-value">
                  {formatTime(data.sys.sunset)}
                </span>
              </div>
              <div className="detail-subtitle">
                <span className="sun-status">Dusk</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info Section */}
      <div className="weather-meta">
        <div className="meta-item">
          <WiRaindrop size={16} />
          <span>Dew Point: {Math.round(data.main.temp - ((100 - data.main.humidity) / 5))}°C</span>
        </div>
        <div className="meta-item">
          <WiHorizonAlt size={16} />
          <span>Sea Level: {data.main.sea_level || data.main.pressure} hPa</span>
        </div>
      </div>
    </div>
  );
}

WeatherCard.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string.isRequired,
    sys: PropTypes.shape({
      country: PropTypes.string.isRequired,
      sunrise: PropTypes.number.isRequired,
      sunset: PropTypes.number.isRequired
    }).isRequired,
    main: PropTypes.shape({
      temp: PropTypes.number.isRequired,
      feels_like: PropTypes.number.isRequired,
      humidity: PropTypes.number.isRequired,
      pressure: PropTypes.number.isRequired,
      temp_min: PropTypes.number,
      temp_max: PropTypes.number,
      sea_level: PropTypes.number
    }).isRequired,
    weather: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        main: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired
      })
    ).isRequired,
    wind: PropTypes.shape({
      speed: PropTypes.number.isRequired,
      deg: PropTypes.number.isRequired
    }).isRequired,
    visibility: PropTypes.number.isRequired,
    dt: PropTypes.number.isRequired,
    coord: PropTypes.shape({
      lat: PropTypes.number.isRequired,
      lon: PropTypes.number.isRequired
    }).isRequired
  }).isRequired
};