import PropTypes from 'prop-types';
import { getWeatherIconClass } from '../utils/weatherUtils';
import { getDayNameFromDateString, getMonthDay } from '../utils/dateUtils';
import '../styles/WeeklyForecast.css';

export default function WeeklyForecast({ dailyForecast, loading }) {
  if (loading) {
    return (
      <div className="weekly-forecast glass-card">
        <h3 className="forecast-title">
          <i className="wi wi-time-4"></i>
          7-Day Forecast
        </h3>
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
      <h3 className="forecast-title">
        <i className="wi wi-time-4"></i>
        7-Day Forecast
      </h3>

      <div className="forecast-grid">
        {dailyForecast.map((day, index) => {
          const iconClass = getWeatherIconClass(day.condition, null, false);
          const dayName = getDayNameFromDateString(day.date);
          const monthDay = getMonthDay(day.timestamp);

          return (
            <div key={day.date} className="forecast-day">
              <div className="forecast-day-name">
                {dayName}
              </div>
              <div className="forecast-date">{monthDay}</div>
              
              <div className="forecast-icon">
                <i className={iconClass}></i>
              </div>

              <div className="forecast-condition">{day.condition}</div>

              <div className="forecast-temps">
                <span className="temp-high">{day.tempMax}°</span>
                <span className="temp-divider">/</span>
                <span className="temp-low">{day.tempMin}°</span>
              </div>

              {day.precipitation > 0 && (
                <div className="forecast-precipitation">
                  <i className="wi wi-raindrop"></i>
                  {day.precipitation}%
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

WeeklyForecast.propTypes = {
  dailyForecast: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      timestamp: PropTypes.number.isRequired,
      tempMin: PropTypes.number.isRequired,
      tempMax: PropTypes.number.isRequired,
      condition: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      precipitation: PropTypes.number
    })
  ),
  loading: PropTypes.bool
};

WeeklyForecast.defaultProps = {
  dailyForecast: [],
  loading: false
};