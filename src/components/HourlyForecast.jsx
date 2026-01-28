import PropTypes from 'prop-types';
import { getWeatherIcon } from '../utils/weatherUtils';
import { formatHour } from '../utils/dateUtils';
import '../styles/Hourlyforecast.css';

// Import React Icons for UI elements
import { WiTime3, WiRaindrop, WiThermometer } from 'react-icons/wi';

export default function HourlyForecast({ hourlyForecast, loading }) {
  if (loading) {
    return (
      <div className="hourly-forecast glass-card">
        <h3 className="forecast-title">
          <span className="forecast-title-icon">
            <WiTime3 size={24} />
          </span>
          Hourly Forecast
        </h3>
        <div className="forecast-loading">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (!hourlyForecast || hourlyForecast.length === 0) {
    return null;
  }

  return (
    <div className="hourly-forecast glass-card fade-in">
      <h3 className="forecast-title">
        <span className="forecast-title-icon">
          <WiTime3 size={24} />
        </span>
        Hourly Forecast
      </h3>

      <div className="hourly-scroll">
        <div className="hourly-grid">
          {hourlyForecast.map((hour, index) => {
            const WeatherIcon = getWeatherIcon(hour.condition, null, false);
            const timeStr = formatHour(hour.timestamp);

            return (
              <div key={hour.timestamp} className="hourly-item">
                <div className="hourly-time">
                  {index === 0 ? 'Now' : timeStr}
                </div>

                <div className="hourly-icon">
                  {WeatherIcon && <WeatherIcon size={32} />}
                </div>

                <div className="hourly-temp">
                  <span className="hourly-temp-value">{hour.temp}°</span>
                </div>

                {hour.precipitation > 0 && (
                  <div className="hourly-precipitation">
                    <span className="hourly-precipitation-icon">
                      <WiRaindrop size={16} />
                    </span>
                    <span className="hourly-precipitation-value">
                      {hour.precipitation}%
                    </span>
                  </div>
                )}
              </div>
            );
          })}
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
      description: PropTypes.string.isRequired,
      precipitation: PropTypes.number
    })
  ),
  loading: PropTypes.bool
};

HourlyForecast.defaultProps = {
  hourlyForecast: [],
  loading: false
};