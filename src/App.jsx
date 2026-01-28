import { useState, useEffect } from 'react';
import { useWeather } from './hooks/useWeather';
import { useForecast } from './hooks/useForecast';
import ErrorBoundary from './components/ErrorBoundary';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import HourlyForecast from './components/Hourlyforecast';
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

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Handle network status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Auto-retry if there was an error when coming back online
      if (error) {
        retry();
      }
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [error, retry]);

  // Auto-hide welcome message after 5 seconds
  useEffect(() => {
    if (showWelcome && !weatherData && !loading && !error) {
      const timer = setTimeout(() => {
        setShowWelcome(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [showWelcome, weatherData, loading, error]);

  // Get appropriate weather particles based on current conditions
  const getWeatherParticles = () => {
    if (!weatherData) return null;
    
    const weatherMain = weatherData.weather[0]?.main?.toLowerCase();
    
    switch (weatherMain) {
      case 'rain':
      case 'drizzle':
        return Array.from({ length: 25 }).map((_, i) => (
          <div 
            key={`rain-${i}`}
            className="weather-particle rain-drop"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${0.8 + Math.random() * 1.2}s`
            }}
          />
        ));
      case 'snow':
        return Array.from({ length: 35 }).map((_, i) => (
          <div 
            key={`snow-${i}`}
            className="weather-particle snowflake"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 5}s`,
              fontSize: `${8 + Math.random() * 8}px`
            }}
          >
            ❄
          </div>
        ));
      case 'thunderstorm':
        return (
          <>
            {Array.from({ length: 20 }).map((_, i) => (
              <div 
                key={`thunder-rain-${i}`}
                className="weather-particle rain-drop"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${0.6 + Math.random() * 1}s`
                }}
              />
            ))}
          </>
        );
      default:
        return null;
    }
  };

  const handleSearch = async (city) => {
    setShowWelcome(false);
    await loadWeatherByCity(city);
  };

  const handleLocationRequest = async () => {
    setShowWelcome(false);
    await loadCurrentLocation();
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refresh();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <ErrorBoundary>
      <div className={`app ${backgroundClass}`}>
        {/* Weather Particles Effect */}
        <div className="weather-particles" aria-hidden="true">
          {getWeatherParticles()}
        </div>

        {/* Network Status Indicator */}
        {!isOnline && (
          <div className="network-status offline" role="alert">
            <i className="wi wi-cloud-down" aria-hidden="true"></i>
            <span>You're offline. Some features may be limited.</span>
          </div>
        )}

        <div className="container">
          {/* Welcome Message */}
          {showWelcome && !weatherData && !loading && !error && (
            <div className="welcome-message fade-in" role="dialog" aria-labelledby="welcome-title">
              <div className="welcome-content">
                <i className="wi wi-day-sunny welcome-icon" aria-hidden="true"></i>
                <h2 id="welcome-title" className="welcome-title">Welcome to WeatherNow</h2>
                <p className="welcome-text">
                  Search for a city or use your current location to get started
                </p>
                <button 
                  className="welcome-action-btn"
                  onClick={handleLocationRequest}
                  disabled={loading}
                  aria-label="Use current location"
                >
                  <i className="wi wi-map-marker" aria-hidden="true"></i>
                  Use My Location
                </button>
              </div>
            </div>
          )}

          {/* Header */}
          <header className="app-header">
            <div className="app-logo" aria-hidden="true">
              <i className="wi wi-day-sunny logo-icon"></i>
              <div className="logo-glow"></div>
            </div>
            <h1 className="app-title">WeatherNow</h1>
            <p className="app-tagline">Your daily weather companion</p>
          </header>

          {/* Search Bar */}
          <SearchBar 
            onSearch={handleSearch}
            onLocationRequest={handleLocationRequest}
            isLoading={loading}
          />

          {/* Main Content */}
          <main>
            {/* Loading State */}
            {loading && (
              <LoadingState 
                type="spinner" 
                message="Fetching weather data..." 
              />
            )}
            
            {/* Error State */}
            {error && !loading && (
              <ErrorState 
                error={error} 
                onRetry={retry}
                showAction={true}
              />
            )}
            
            {/* Empty State - No Data Yet */}
            {!loading && !error && !weatherData && !showWelcome && (
              <div className="empty-state">
                <div className="empty-content">
                  <i className="wi wi-day-cloudy-gusts empty-icon" aria-hidden="true"></i>
                  <h3 className="empty-title">Ready for Weather?</h3>
                  <p className="empty-text">
                    Search for a city above or use your current location to see detailed weather information.
                  </p>
                  <button 
                    className="empty-action-btn"
                    onClick={handleLocationRequest}
                    disabled={loading}
                    aria-label="Use current location"
                  >
                    <i className="wi wi-map-marker" aria-hidden="true"></i>
                    Use My Location
                  </button>
                </div>
              </div>
            )}
            
            {/* Weather Data Display */}
            {!loading && !error && weatherData && (
              <div className="weather-sections">
                {/* Current Weather */}
                <section className="current-weather-section" aria-labelledby="current-weather-title">
                  <h2 id="current-weather-title" className="sr-only">Current Weather</h2>
                  <WeatherCard data={weatherData} />
                </section>

                {/* Hourly Forecast */}
                {hourlyForecast && hourlyForecast.length > 0 && (
                  <section className="hourly-forecast-section" aria-labelledby="hourly-forecast-title">
                    <div className="section-header">
                      <i className="wi wi-time-3 section-icon" aria-hidden="true"></i>
                      <h2 id="hourly-forecast-title" className="section-title">Hourly Forecast</h2>
                      <span className="section-subtitle">Next 24 hours</span>
                    </div>
                    <HourlyForecast 
                      hourlyForecast={hourlyForecast}
                      loading={forecastLoading}
                    />
                  </section>
                )}

                {/* Weekly Forecast */}
                {dailyForecast && dailyForecast.length > 0 && (
                  <section className="weekly-forecast-section" aria-labelledby="weekly-forecast-title">
                    <div className="section-header">
                      <i className="wi wi-calendar section-icon" aria-hidden="true"></i>
                      <h2 id="weekly-forecast-title" className="section-title">7-Day Forecast</h2>
                      <span className="section-subtitle">Daily overview</span>
                    </div>
                    <WeeklyForecast 
                      dailyForecast={dailyForecast}
                      loading={forecastLoading}
                    />
                  </section>
                )}
              </div>
            )}
          </main>

          {/* Footer */}
          {(weatherData || error) && !loading && (
            <footer className="app-footer">
              <div className="footer-content">
                <div className="footer-info">
                  {weatherData && (
                    <>
                      <p className="last-updated">
                        <i className="wi wi-time-3" aria-hidden="true"></i>
                        <span>Last updated: {formatRelativeTime(Date.now() / 1000)}</span>
                      </p>
                      <button 
                        className={`refresh-button ${isRefreshing ? 'refreshing' : ''}`}
                        onClick={handleRefresh}
                        title="Refresh weather data"
                        disabled={loading || isRefreshing}
                        aria-label="Refresh weather data"
                      >
                        <i className="wi wi-refresh" aria-hidden="true"></i>
                        <span className="refresh-tooltip">Refresh</span>
                      </button>
                    </>
                  )}
                </div>
                <div className="footer-meta">
                  <p className="data-source">
                    Data provided by{' '}
                    <a 
                      href="https://openweathermap.org/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="data-link"
                    >
                      OpenWeatherMap
                    </a>
                  </p>
                  <p className="app-version">
                    WeatherNow v1.0 • Made with <i className="wi wi-thermometer heart-icon" aria-hidden="true"></i>
                  </p>
                </div>
              </div>
            </footer>
          )}
        </div>

        {/* Bottom Gradient */}
        <div className="bottom-gradient" aria-hidden="true"></div>
      </div>
    </ErrorBoundary>
  );
}

export default App;