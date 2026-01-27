import { useWeather } from './hooks/useWeather';
import { useForecast } from './hooks/useForecast';
import ErrorBoundary from './components/ErrorBoundary';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import HourlyForecast from './components/HourlyForecast';
import WeeklyForecast from './components/WeeklyForecast';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import { formatRelativeTime } from './utils/dateUtils';
import './App.css';
import './styles/WeatherCard.css';
import './styles/SearchBar.css';
import './styles/LoadingState.css';
import './styles/ErrorState.css';
import './styles/HourlyForecast.css';
import './styles/WeeklyForecast.css';
import './styles/ErrorBoundary.css';

function App() {
  const {
    weatherData,
    loading,
    error,
    backgroundClass,
    loadWeatherByCity,
    loadCurrentLocation,
    retry,
    refresh
  } = useWeather();

  const {
    dailyForecast,
    hourlyForecast,
    loading: forecastLoading
  } = useForecast(weatherData);

  return (
    <ErrorBoundary>
      <div className={`app ${backgroundClass}`}>
        <div className="container">
          {/* Header */}
          <header className="app-header">
            <div className="app-logo">
              <i className="wi wi-day-sunny logo-icon"></i>
            </div>
            <h1 className="app-title">WeatherNow</h1>
            <p className="app-tagline">Your daily weather companion</p>
          </header>

          {/* Search Bar */}
          <SearchBar 
            onSearch={loadWeatherByCity}
            onLocationRequest={loadCurrentLocation}
            isLoading={loading}
          />

          {/* Main Content */}
          <main>
            {loading && <LoadingState type="spinner" />}
            
            {error && !loading && (
              <ErrorState 
                error={error} 
                onRetry={retry}
              />
            )}
            
            {!loading && !error && weatherData && (
              <>
                {/* Current Weather */}
                <WeatherCard data={weatherData} />

                {/* Hourly Forecast */}
                <HourlyForecast 
                  hourlyForecast={hourlyForecast}
                  loading={forecastLoading}
                />

                {/* Weekly Forecast */}
                <WeeklyForecast 
                  dailyForecast={dailyForecast}
                  loading={forecastLoading}
                />
              </>
            )}
          </main>

          {/* Footer */}
          {weatherData && !loading && (
            <footer className="app-footer">
              <div className="footer-content">
                <div className="footer-info">
                  <p className="last-updated">
                    <i className="wi wi-time-3"></i>
                    Last updated: {formatRelativeTime(Date.now() / 1000)}
                  </p>
                  <button 
                    className="refresh-button"
                    onClick={refresh}
                    title="Refresh weather data"
                  >
                    <i className="wi wi-refresh"></i>
                  </button>
                </div>
                <p className="data-source">
                  Data provided by <a href="https://openweathermap.org/" target="_blank" rel="noopener noreferrer">OpenWeatherMap</a>
                </p>
              </div>
            </footer>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;