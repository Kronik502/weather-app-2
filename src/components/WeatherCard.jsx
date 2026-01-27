import { getWeatherMessage, getWeatherEmoji, convertWindSpeed, getWindDirection } from '../utils/weatherUtils';
import '../styles/WeatherCard.css';

export default function WeatherCard({ data }) {
  const temp = Math.round(data.main.temp);
  const feelsLike = Math.round(data.main.feels_like);
  const weatherMain = data.weather[0].main;
  const weatherDescription = data.weather[0].description;
  const isNight = data.dt < data.sys.sunrise || data.dt > data.sys.sunset;

  const weatherMessage = getWeatherMessage(temp, weatherMain, weatherDescription);
  const weatherEmoji = getWeatherEmoji(weatherMain, isNight);

  return (
    <div className="weather-card glass-card fade-in">
      {/* Location */}
      <div className="location">
        <h2 className="location-name">
          <span className="location-icon">📍</span>
          {data.name}
        </h2>
        <span className="location-country">{data.sys.country}</span>
      </div>

      {/* Temperature Section */}
      <div className="temperature-section">
        <div className="weather-icon-large">{weatherEmoji}</div>
        
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
          <div className="detail-icon">💧</div>
          <div className="detail-label">Humidity</div>
          <div className="detail-value">
            {data.main.humidity}
            <span className="detail-unit">%</span>
          </div>
        </div>

        {/* Wind Speed */}
        <div className="detail-item">
          <div className="detail-icon">💨</div>
          <div className="detail-label">Wind</div>
          <div className="detail-value">
            {convertWindSpeed(data.wind.speed)}
            <span className="detail-unit">km/h</span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            {getWindDirection(data.wind.deg)}
          </div>
        </div>

        {/* Pressure */}
        <div className="detail-item">
          <div className="detail-icon">🌡️</div>
          <div className="detail-label">Pressure</div>
          <div className="detail-value">
            {data.main.pressure}
            <span className="detail-unit">hPa</span>
          </div>
        </div>

        {/* Visibility */}
        <div className="detail-item">
          <div className="detail-icon">👁️</div>
          <div className="detail-label">Visibility</div>
          <div className="detail-value">
            {(data.visibility / 1000).toFixed(1)}
            <span className="detail-unit">km</span>
          </div>
        </div>
      </div>
    </div>
  );
}