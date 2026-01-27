import PropTypes from 'prop-types';
import { 
  getWeatherIconClass, 
  getWeatherMessage, 
  convertWindSpeed, 
  getWindDirection,
  isNightTime
} from '../utils/weatherUtils';
import { formatTime } from '../utils/dateUtils';
import '../styles/WeatherCard.css';

export default function WeatherCard({ data }) {
  const temp = Math.round(data.main.temp);
  const feelsLike = Math.round(data.main.feels_like);
  const weatherMain = data.weather[0].main;
  const weatherDescription = data.weather[0].description;
  const weatherId = data.weather[0].id;
  const isNight = isNightTime(data.dt, data.sys.sunrise, data.sys.sunset);

  const weatherMessage = getWeatherMessage(temp, weatherMain, weatherDescription);
  const weatherIconClass = getWeatherIconClass(weatherMain, weatherId, isNight);

  return (
    <div className="weather-card glass-card fade-in">
      {/* Location */}
      <div className="location">
        <h2 className="location-name">
          <i className="wi wi-map-marker location-icon-weather"></i>
          {data.name}
        </h2>
        <span className="location-country">{data.sys.country}</span>
      </div>

      {/* Temperature Section */}
      <div className="temperature-section">
        <div className="weather-icon-large">
          <i className={weatherIconClass}></i>
        </div>
        
        <div className="temperature-main">
          <span className="temperature-value">{temp}</span>
          <span className="temperature-unit">°C</span>
        </div>

        <p className="weather-description">{weatherDescription}</p>
        
        <div className="weather-message">{weatherMessage}</div>

        <div className="feels-like">
          Feels like <strong>{feelsLike}°C</strong>
        </div>
      </div>

      {/* Weather Details Grid */}
      <div className="weather-details">
        {/* Humidity */}
        <div className="detail-item">
          <div className="detail-icon">
            <i className="wi wi-humidity"></i>
          </div>
          <div className="detail-label">Humidity</div>
          <div className="detail-value">
            {data.main.humidity}
            <span className="detail-unit">%</span>
          </div>
        </div>

        {/* Wind Speed */}
        <div className="detail-item">
          <div className="detail-icon">
            <i className="wi wi-strong-wind"></i>
          </div>
          <div className="detail-label">Wind</div>
          <div className="detail-value">
            {convertWindSpeed(data.wind.speed)}
            <span className="detail-unit">km/h</span>
          </div>
          <div className="detail-direction">
            {getWindDirection(data.wind.deg)}
          </div>
        </div>

        {/* Pressure */}
        <div className="detail-item">
          <div className="detail-icon">
            <i className="wi wi-barometer"></i>
          </div>
          <div className="detail-label">Pressure</div>
          <div className="detail-value">
            {data.main.pressure}
            <span className="detail-unit">hPa</span>
          </div>
        </div>

        {/* Visibility */}
        <div className="detail-item">
          <div className="detail-icon">
            <i className="wi wi-day-fog"></i>
          </div>
          <div className="detail-label">Visibility</div>
          <div className="detail-value">
            {(data.visibility / 1000).toFixed(1)}
            <span className="detail-unit">km</span>
          </div>
        </div>

        {/* Sunrise */}
        <div className="detail-item">
          <div className="detail-icon">
            <i className="wi wi-sunrise"></i>
          </div>
          <div className="detail-label">Sunrise</div>
          <div className="detail-value detail-time">
            {formatTime(data.sys.sunrise)}
          </div>
        </div>

        {/* Sunset */}
        <div className="detail-item">
          <div className="detail-icon">
            <i className="wi wi-sunset"></i>
          </div>
          <div className="detail-label">Sunset</div>
          <div className="detail-value detail-time">
            {formatTime(data.sys.sunset)}
          </div>
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
      pressure: PropTypes.number.isRequired
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