import PropTypes from 'prop-types';
import { useState } from 'react';
import { getWeatherIcon, getTemperatureColor } from '../utils/weatherUtils';
import { formatHour } from '../utils/dateUtils';
import '../styles/HourlyForecast.css';

// Import React Icons for UI elements
import { 
  WiTime3, 
  WiRaindrop, 
  WiThermometer,
  WiStrongWind,
  WiHumidity,
  WiBarometer,
  WiWindDeg
} from 'react-icons/wi';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

export default function HourlyForecast({ hourlyForecast, loading }) {
  const [selectedHour, setSelectedHour] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  // Get min and max temps for temperature graph visualization
  const temps = hourlyForecast?.map(h => h.temp) || [];
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);
  const tempRange = maxTemp - minTemp || 1;

  // Calculate temperature position for visual graph
  const getTempPosition = (temp) => {
    return ((temp - minTemp) / tempRange) * 100;
  };

  // Scroll functions
  const scroll = (direction) => {
    const container = document.querySelector('.hourly-scroll');
    if (container) {
      const scrollAmount = 300;
      const newPosition = direction === 'left' 
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;
      
      container.scrollTo({ left: newPosition, behavior: 'smooth' });
      setScrollPosition(newPosition);
    }
  };

  if (loading) {
    return (
      <div className="hourly-forecast glass-card">
        <div className="forecast-header">
          <h3 className="forecast-title">
            <WiTime3 className="forecast-title-icon" />
            <span>Hourly Forecast</span>
          </h3>
        </div>
        <div className="forecast-loading">
          <div className="loading-spinner"></div>
          <p>Loading hourly data...</p>
        </div>
      </div>
    );
  }

  if (!hourlyForecast || hourlyForecast.length === 0) {
    return null;
  }

  return (
    <div className="hourly-forecast glass-card fade-in">
      {/* Header Section */}
      <div className="forecast-header">
        <div className="forecast-title-wrapper">
          <h3 className="forecast-title">
            <WiTime3 className="forecast-title-icon" />
            <span>Hourly Forecast</span>
          </h3>
          <span className="forecast-subtitle">Next {hourlyForecast.length} hours</span>
        </div>

        {/* Temperature Range Summary */}
        <div className="temp-range-summary">
          <div className="temp-range-item">
            <WiThermometer className="temp-range-icon hot" />
            <span className="temp-range-label">High</span>
            <span className="temp-range-value" style={{ color: getTemperatureColor(maxTemp) }}>
              {Math.round(maxTemp)}°
            </span>
          </div>
          <div className="temp-range-divider"></div>
          <div className="temp-range-item">
            <WiThermometer className="temp-range-icon cold" />
            <span className="temp-range-label">Low</span>
            <span className="temp-range-value" style={{ color: getTemperatureColor(minTemp) }}>
              {Math.round(minTemp)}°
            </span>
          </div>
        </div>
      </div>

      {/* Scroll Controls */}
      <div className="scroll-controls">
        <button 
          className="scroll-btn scroll-btn-left"
          onClick={() => scroll('left')}
          aria-label="Scroll left"
        >
          <MdChevronLeft size={24} />
        </button>
        <button 
          className="scroll-btn scroll-btn-right"
          onClick={() => scroll('right')}
          aria-label="Scroll right"
        >
          <MdChevronRight size={24} />
        </button>
      </div>

      {/* Hourly Items Container */}
      <div className="hourly-scroll">
        <div className="hourly-grid">
          {hourlyForecast.map((hour, index) => {
            const WeatherIcon = getWeatherIcon(hour.condition, null, false);
            const timeStr = formatHour(hour.timestamp);
            const isSelected = selectedHour === index;
            const tempPosition = getTempPosition(hour.temp);
            const tempColor = getTemperatureColor(hour.temp);

            return (
              <div 
                key={hour.timestamp} 
                className={`hourly-item ${isSelected ? 'selected' : ''} ${index === 0 ? 'current' : ''}`}
                onClick={() => setSelectedHour(isSelected ? null : index)}
                role="button"
                tabIndex={0}
                aria-label={`Weather for ${index === 0 ? 'now' : timeStr}`}
              >
                {/* Time Badge */}
                <div className="hourly-time">
                  {index === 0 ? (
                    <span className="time-now">Now</span>
                  ) : (
                    <span className="time-label">{timeStr}</span>
                  )}
                </div>

                {/* Weather Icon */}
                <div className="hourly-icon-wrapper">
                  <div className="hourly-icon">
                    {WeatherIcon && <WeatherIcon size={48} />}
                  </div>
                  <span className="hourly-condition">{hour.condition}</span>
                </div>

                {/* Temperature Graph Line */}
                <div className="temp-graph">
                  <div 
                    className="temp-graph-point"
                    style={{ 
                      bottom: `${tempPosition}%`,
                      background: tempColor,
                      boxShadow: `0 0 12px ${tempColor}`
                    }}
                  ></div>
                  {index < hourlyForecast.length - 1 && (
                    <div 
                      className="temp-graph-line"
                      style={{
                        background: `linear-gradient(to bottom, ${tempColor}, ${getTemperatureColor(hourlyForecast[index + 1].temp)})`
                      }}
                    ></div>
                  )}
                </div>

                {/* Temperature */}
                <div className="hourly-temp">
                  <WiThermometer className="hourly-temp-icon" size={20} />
                  <span 
                    className="hourly-temp-value"
                    style={{ color: tempColor }}
                  >
                    {Math.round(hour.temp)}°
                  </span>
                </div>

                {/* Precipitation */}
                {hour.precipitation > 0 && (
                  <div className="hourly-precipitation">
                    <WiRaindrop className="precipitation-icon" />
                    <span className="precipitation-value">
                      {hour.precipitation}%
                    </span>
                  </div>
                )}

                {/* Expanded Details (shown when selected) */}
                {isSelected && (
                  <div className="hourly-details">
                    <div className="hourly-details-grid">
                      {/* Feels Like */}
                      {hour.feels_like && (
                        <div className="detail-mini">
                          <WiThermometer size={20} />
                          <span className="detail-mini-label">Feels</span>
                          <span className="detail-mini-value">{Math.round(hour.feels_like)}°</span>
                        </div>
                      )}

                      {/* Humidity */}
                      {hour.humidity && (
                        <div className="detail-mini">
                          <WiHumidity size={20} />
                          <span className="detail-mini-label">Humidity</span>
                          <span className="detail-mini-value">{hour.humidity}%</span>
                        </div>
                      )}

                      {/* Wind Speed */}
                      {hour.wind_speed && (
                        <div className="detail-mini">
                          <WiStrongWind size={20} />
                          <span className="detail-mini-label">Wind</span>
                          <span className="detail-mini-value">{Math.round(hour.wind_speed)} km/h</span>
                        </div>
                      )}

                      {/* Wind Direction */}
                      {hour.wind_deg !== undefined && (
                        <div className="detail-mini">
                          <WiWindDeg size={20} style={{ transform: `rotate(${hour.wind_deg}deg)` }} />
                          <span className="detail-mini-label">Direction</span>
                          <span className="detail-mini-value">{hour.wind_deg}°</span>
                        </div>
                      )}

                      {/* Pressure */}
                      {hour.pressure && (
                        <div className="detail-mini">
                          <WiBarometer size={20} />
                          <span className="detail-mini-label">Pressure</span>
                          <span className="detail-mini-value">{hour.pressure} hPa</span>
                        </div>
                      )}

                      {/* Cloud Cover */}
                      {hour.clouds !== undefined && (
                        <div className="detail-mini">
                          <span className="detail-mini-emoji">☁️</span>
                          <span className="detail-mini-label">Clouds</span>
                          <span className="detail-mini-value">{hour.clouds}%</span>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    {hour.description && (
                      <div className="hourly-description">
                        {hour.description}
                      </div>
                    )}
                  </div>
                )}

                {/* Quick Stats Bar */}
                <div className="quick-stats">
                  {hour.wind_speed && (
                    <div className="quick-stat">
                      <WiStrongWind size={16} />
                      <span>{Math.round(hour.wind_speed)}</span>
                    </div>
                  )}
                  {hour.humidity && (
                    <div className="quick-stat">
                      <WiHumidity size={16} />
                      <span>{hour.humidity}%</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Hour Info Bar */}
      {selectedHour !== null && (
        <div className="selected-info-bar">
          <span className="info-text">
            Tap again to close details
          </span>
          <button 
            className="close-details-btn"
            onClick={() => setSelectedHour(null)}
            aria-label="Close details"
          >
            ✕
          </button>
        </div>
      )}

      {/* Legend */}
      <div className="forecast-legend">
        <div className="legend-item">
          <WiRaindrop size={18} />
          <span>Precipitation chance</span>
        </div>
        <div className="legend-item">
          <WiStrongWind size={18} />
          <span>Wind speed</span>
        </div>
        <div className="legend-item">
          <div className="legend-graph-indicator"></div>
          <span>Temperature trend</span>
        </div>
      </div>
    </div>
  );
}

HourlyForecast.propTypes = {
  hourlyForecast: PropTypes.arrayOf(
    PropTypes.shape({
      timestamp: PropTypes.number.isRequired,
      temp: PropTypes.number.isRequired,
      condition: PropTypes.string.isRequired,
      description: PropTypes.string,
      precipitation: PropTypes.number,
      feels_like: PropTypes.number,
      humidity: PropTypes.number,
      wind_speed: PropTypes.number,
      wind_deg: PropTypes.number,
      pressure: PropTypes.number,
      clouds: PropTypes.number
    })
  ),
  loading: PropTypes.bool
};

HourlyForecast.defaultProps = {
  hourlyForecast: [],
  loading: false
};