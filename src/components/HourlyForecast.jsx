import PropTypes from 'prop-types';
import { getWeatherIconClass } from '../utils/weatherUtils';
import { formatHour } from '../utils/dateUtils';
import '../styles/HourlyForecast.css';

export default function HourlyForecast({ hourlyForecast, loading }) {
  if (loading) {
    return (
      <div className="hourly-forecast glass-card">
        <h3 className="forecast-title">
          <i className="wi wi-time-3"></i>
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
        <i className="wi wi-time-3"></i>
        Hourly Forecast
      </h3>

      <div className="hourly-scroll">
        <div className="hourly-grid">
          {hourlyForecast.map((hour, index) => {
            const iconClass = getWeatherIconClass(hour.condition, null, false);
            const timeStr = formatHour(hour.timestamp);

            return (
              <div key={hour.timestamp} className="hourly-item">
                <div className="hourly-time">
                  {index === 0 ? 'Now' : timeStr}
                </div>

                <div className="hourly-icon">
                  <i className={iconClass}></i>
                </div>

                <div className="hourly-temp">{hour.temp}°</div>

                {hour.precipitation > 0 && (
                  <div className="hourly-precipitation">
                    <i className="wi wi-raindrop"></i>
                    <span>{hour.precipitation}%</span>
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