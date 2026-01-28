import PropTypes from 'prop-types';
import { useState } from 'react';
import { getWeatherIcon, getTemperatureColor } from '../utils/weatherUtils';
import { getDayNameFromDateString, getMonthDay } from '../utils/dateUtils';
import '../styles/WeeklyForecast.css';

// Import React Icons
import { 
  WiTime4, 
  WiRaindrop,
  WiHumidity,
  WiStrongWind,
  WiSunrise,
  WiSunset,
  WiBarometer,
  WiWindDeg
} from 'react-icons/wi';
import { MdExpandMore, MdExpandLess } from 'react-icons/md';

export default function WeeklyForecast({ dailyForecast, loading }) {
  const [expandedDay, setExpandedDay] = useState(null);

  // Calculate temperature range for visualization
  const allTemps = dailyForecast?.flatMap(day => [day.tempMin, day.tempMax]) || [];
  const minTemp = Math.min(...allTemps);
  const maxTemp = Math.max(...allTemps);
  const tempRange = maxTemp - minTemp || 1;

  // Get temperature bar width percentage
  const getTempBarWidth = (min, max) => {
    const range = max - min;
    return (range / tempRange) * 100;
  };

  // Get temperature bar position
  const getTempBarPosition = (min) => {
    return ((min - minTemp) / tempRange) * 100;
  };

  if (loading) {
    return (
      <div className="weekly-forecast glass-card">
        <div className="weekly-header">
          <h3 className="forecast-title">
            <WiTime4 className="forecast-title-icon" />
            <span>7-Day Forecast</span>
          </h3>
        </div>
        <div className="forecast-loading">
          <div className="loading-spinner"></div>
          <p>Loading forecast...</p>
        </div>
      </div>
    );
  }

  if (!dailyForecast || dailyForecast.length === 0) {
    return null;
  }

  return (
    <div className="weekly-forecast glass-card fade-in">
      {/* Header */}
      <div className="weekly-header">
        <div className="weekly-title-wrapper">
          <h3 className="forecast-title">
            <WiTime4 className="forecast-title-icon" />
            <span>7-Day Forecast</span>
          </h3>
          <span className="forecast-subtitle">
            Extended weather outlook
          </span>
        </div>

        {/* Temperature Range Summary */}
        <div className="weekly-temp-range">
          <div className="temp-range-display">
            <span className="range-label">Week Range:</span>
            <div className="range-values">
              <span 
                className="range-max" 
                style={{ color: getTemperatureColor(maxTemp) }}
              >
                {Math.round(maxTemp)}°
              </span>
              <span className="range-separator">to</span>
              <span 
                className="range-min"
                style={{ color: getTemperatureColor(minTemp) }}
              >
                {Math.round(minTemp)}°
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Forecast Grid */}
      <div className="forecast-grid">
        {dailyForecast.map((day, index) => {
          const WeatherIcon = getWeatherIcon(day.condition, null, false);
          const dayName = getDayNameFromDateString(day.date);
          const monthDay = getMonthDay(day.timestamp);
          const isExpanded = expandedDay === index;
          const isToday = index === 0;
          
          const tempBarWidth = getTempBarWidth(day.tempMin, day.tempMax);
          const tempBarPosition = getTempBarPosition(day.tempMin);

          return (
            <div 
              key={day.date} 
              className={`forecast-day ${isExpanded ? 'expanded' : ''} ${isToday ? 'today' : ''}`}
              onClick={() => setExpandedDay(isExpanded ? null : index)}
              role="button"
              tabIndex={0}
              aria-expanded={isExpanded}
              aria-label={`Weather forecast for ${dayName}`}
            >
              {/* Main Day Content */}
              <div className="day-main-content">
                {/* Date Section */}
                <div className="day-date-section">
                  <div className="day-name-wrapper">
                    <span className="day-name">
                      {isToday ? 'Today' : dayName}
                    </span>
                    {isToday && <span className="today-badge">●</span>}
                  </div>
                  <div className="day-date">{monthDay}</div>
                </div>

                {/* Weather Icon & Condition */}
                <div className="day-weather-section">
                  <div className="day-icon">
                    {WeatherIcon && <WeatherIcon size={48} />}
                  </div>
                  <div className="day-condition">{day.condition}</div>
                </div>

                {/* Temperature Bar Visualization */}
                <div className="temp-bar-container">
                  <div className="temp-bar-wrapper">
                    <span 
                      className="temp-label temp-low-label"
                      style={{ color: getTemperatureColor(day.tempMin) }}
                    >
                      {Math.round(day.tempMin)}°
                    </span>
                    
                    <div className="temp-bar-track">
                      <div 
                        className="temp-bar-fill"
                        style={{ 
                          width: `${tempBarWidth}%`,
                          left: `${tempBarPosition}%`,
                          background: `linear-gradient(90deg, 
                            ${getTemperatureColor(day.tempMin)}, 
                            ${getTemperatureColor(day.tempMax)})`,
                        }}
                      >
                        <div className="temp-bar-dot temp-bar-dot-start"></div>
                        <div className="temp-bar-dot temp-bar-dot-end"></div>
                      </div>
                    </div>

                    <span 
                      className="temp-label temp-high-label"
                      style={{ color: getTemperatureColor(day.tempMax) }}
                    >
                      {Math.round(day.tempMax)}°
                    </span>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="day-quick-stats">
                  {day.precipitation > 0 && (
                    <div className="quick-stat precipitation-stat">
                      <WiRaindrop size={20} />
                      <span>{day.precipitation}%</span>
                    </div>
                  )}
                  
                  {day.wind_speed && (
                    <div className="quick-stat wind-stat">
                      <WiStrongWind size={20} />
                      <span>{Math.round(day.wind_speed)} km/h</span>
                    </div>
                  )}

                  {day.humidity && (
                    <div className="quick-stat humidity-stat">
                      <WiHumidity size={20} />
                      <span>{day.humidity}%</span>
                    </div>
                  )}
                </div>

                {/* Expand Button */}
                <button 
                  className="expand-button"
                  aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
                >
                  {isExpanded ? <MdExpandLess size={24} /> : <MdExpandMore size={24} />}
                </button>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="day-expanded-content">
                  <div className="expanded-divider"></div>
                  
                  <div className="expanded-details-grid">
                    {/* Description */}
                    <div className="detail-full-width">
                      <div className="detail-description">
                        <span className="description-icon">💭</span>
                        <p>{day.description}</p>
                      </div>
                    </div>

                    {/* Feels Like */}
                    {day.feels_like && (
                      <div className="detail-item">
                        <div className="detail-item-header">
                          <WiThermometer size={24} className="detail-icon" />
                          <span className="detail-label">Feels Like</span>
                        </div>
                        <div className="detail-value">
                          <span style={{ color: getTemperatureColor(day.feels_like) }}>
                            {Math.round(day.feels_like)}°C
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Humidity */}
                    {day.humidity && (
                      <div className="detail-item">
                        <div className="detail-item-header">
                          <WiHumidity size={24} className="detail-icon humidity-color" />
                          <span className="detail-label">Humidity</span>
                        </div>
                        <div className="detail-value">{day.humidity}%</div>
                        <div className="detail-bar">
                          <div 
                            className="detail-bar-fill humidity-bar"
                            style={{ width: `${day.humidity}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Wind Speed */}
                    {day.wind_speed && (
                      <div className="detail-item">
                        <div className="detail-item-header">
                          <WiStrongWind size={24} className="detail-icon wind-color" />
                          <span className="detail-label">Wind Speed</span>
                        </div>
                        <div className="detail-value">{Math.round(day.wind_speed)} km/h</div>
                        {day.wind_deg !== undefined && (
                          <div className="detail-subtitle">
                            <WiWindDeg 
                              size={16} 
                              style={{ transform: `rotate(${day.wind_deg}deg)` }} 
                            />
                            <span>{day.wind_deg}°</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Pressure */}
                    {day.pressure && (
                      <div className="detail-item">
                        <div className="detail-item-header">
                          <WiBarometer size={24} className="detail-icon pressure-color" />
                          <span className="detail-label">Pressure</span>
                        </div>
                        <div className="detail-value">{day.pressure} hPa</div>
                      </div>
                    )}

                    {/* UV Index */}
                    {day.uv_index !== undefined && (
                      <div className="detail-item">
                        <div className="detail-item-header">
                          <span className="detail-icon uv-icon">☀️</span>
                          <span className="detail-label">UV Index</span>
                        </div>
                        <div className="detail-value">
                          {day.uv_index}
                          <span className={`uv-badge uv-${getUVLevel(day.uv_index)}`}>
                            {getUVLevel(day.uv_index)}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Cloud Cover */}
                    {day.clouds !== undefined && (
                      <div className="detail-item">
                        <div className="detail-item-header">
                          <span className="detail-icon">☁️</span>
                          <span className="detail-label">Cloud Cover</span>
                        </div>
                        <div className="detail-value">{day.clouds}%</div>
                        <div className="detail-bar">
                          <div 
                            className="detail-bar-fill cloud-bar"
                            style={{ width: `${day.clouds}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Sunrise */}
                    {day.sunrise && (
                      <div className="detail-item">
                        <div className="detail-item-header">
                          <WiSunrise size={24} className="detail-icon sunrise-color" />
                          <span className="detail-label">Sunrise</span>
                        </div>
                        <div className="detail-value detail-time">
                          {new Date(day.sunrise * 1000).toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </div>
                    )}

                    {/* Sunset */}
                    {day.sunset && (
                      <div className="detail-item">
                        <div className="detail-item-header">
                          <WiSunset size={24} className="detail-icon sunset-color" />
                          <span className="detail-label">Sunset</span>
                        </div>
                        <div className="detail-value detail-time">
                          {new Date(day.sunset * 1000).toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Helper function to get UV level
function getUVLevel(uvIndex) {
  if (uvIndex <= 2) return 'Low';
  if (uvIndex <= 5) return 'Moderate';
  if (uvIndex <= 7) return 'High';
  if (uvIndex <= 10) return 'Very High';
  return 'Extreme';
}

WeeklyForecast.propTypes = {
  dailyForecast: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      timestamp: PropTypes.number.isRequired,
      tempMin: PropTypes.number.isRequired,
      tempMax: PropTypes.number.isRequired,
      condition: PropTypes.string.isRequired,
      description: PropTypes.string,
      precipitation: PropTypes.number,
      feels_like: PropTypes.number,
      humidity: PropTypes.number,
      wind_speed: PropTypes.number,
      wind_deg: PropTypes.number,
      pressure: PropTypes.number,
      uv_index: PropTypes.number,
      clouds: PropTypes.number,
      sunrise: PropTypes.number,
      sunset: PropTypes.number
    })
  ),
  loading: PropTypes.bool
};

WeeklyForecast.defaultProps = {
  dailyForecast: [],
  loading: false
};