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

  // Handle network status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);


  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Get appropriate background class based on weather and time
  const getWeatherParticles = () => {
    if (!weatherData) return null;
    
    const weatherMain = weatherData.weather[0]?.main;
    
    switch (weatherMain) {
      case 'Rain':
        return Array.from({ length: 20 }).map((_, i) => (
          <div 
            key={i}
            className="weather-particle rain-drop"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1 + Math.random() * 2}s`
            }}
          />
        ));
      case 'Snow':
        return Array.from({ length: 30 }).map((_, i) => (
          <div 
            key={i}
            className="weather-particle snowflake"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 5}s`
            }}
          />
        ));
      default:
        return null;
    }
  };

  const handleSearch = async (city) => {
    await loadWeatherByCity(city);
    setShowWelcome(false);
  };

  const handleLocationRequest = async () => {
    await loadCurrentLocation();
    setShowWelcome(false);
  };

  return (
    <ErrorBoundary>
      <div className={`app ${backgroundClass}`}>
        {/* Weather Particles Effect */}
        <div className="weather-particles">
          {getWeatherParticles()}
        </div>

        {/* Network Status Indicator */}
        {!isOnline && (
          <div className="network-status offline">
            <i className="wi wi-cloud-down"></i>
            <span>You're offline. Some features may be limited.</span>
          </div>
        )}

        <div className="container">
          {/* Welcome Message */}
          {/* {showWelcome && !weatherData && !loading && !error && (
            <div className="welcome-message fade-in">
              <div className="welcome-content">
                <i className="wi wi-day-sunny welcome-icon"></i>
                <h2 className="welcome-title">Welcome to WeatherNow</h2>
                <p className="welcome-text">
                  Search for a city or use your current location to get started
                </p>
              </div>
            </div>
          )} */}

          {/* Header */}
          <header className="app-header">
            <div className="app-logo">
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
            {loading && <LoadingState type="spinner" message="Fetching weather data..." />}
            
            {/* Error State */}
            {error && !loading && (
              <ErrorState 
                error={error} 
                onRetry={retry}
                showAction={true}
              />
            )}
            
            {/* Empty State - No Data Yet */}
            {!loading && !error && !weatherData && (
              <div className="empty-state">
                <div className="empty-content">
                  <i className="wi wi-day-cloudy-gusts empty-icon"></i>
                  <h3 className="empty-title">Ready for Weather?</h3>
                  <p className="empty-text">
                    Search for a city above or use your current location to see detailed weather information.
                  </p>
                  <button 
                    className="empty-action-btn"
                    onClick={handleLocationRequest}
                    disabled={loading}
                  >
                    <i className="wi wi-map-marker"></i>
                    Use My Location
                  </button>
                </div>
              </div>
            )}
            
            {/* Weather Data Display */}
            {!loading && !error && weatherData && (
              <div className="weather-sections">
                {/* Current Weather */}
                <section className="current-weather-section">
                  <WeatherCard data={weatherData} />
                </section>

                {/* Hourly Forecast */}
                <section className="hourly-forecast-section">
                  <div className="section-header">
                    <i className="wi wi-time-3 section-icon"></i>
                    <h2 className="section-title">Hourly Forecast</h2>
                    <span className="section-subtitle">Next 24 hours</span>
                  </div>
                  <HourlyForecast 
                    hourlyForecast={hourlyForecast}
                    loading={forecastLoading}
                  />
                </section>

                {/* Weekly Forecast */}
                <section className="weekly-forecast-section">
                  <div className="section-header">
                    <i className="wi wi-calendar section-icon"></i>
                    <h2 className="section-title">7-Day Forecast</h2>
                    <span className="section-subtitle">Daily overview</span>
                  </div>
                  <WeeklyForecast 
                    dailyForecast={dailyForecast}
                    loading={forecastLoading}
                  />
                </section>
              </div>
            )}
          </main>

          {/* Footer */}
          {(weatherData || error) && !loading && (
            <footer className="app-footer">
              <div className="footer-content">
                <div className="footer-info">
                  {weatherData && (
                    <p className="last-updated">
                      <i className="wi wi-time-3"></i>
                      Last updated: {formatRelativeTime(Date.now() / 1000)}
                    </p>
                  )}
                  {weatherData && (
                    <button 
                      className="refresh-button"
                      onClick={refresh}
                      title="Refresh weather data"
                      disabled={loading}
                      aria-label="Refresh weather data"
                    >
                      <i className="wi wi-refresh"></i>
                      <span className="refresh-tooltip">Refresh</span>
                    </button>
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
                    WeatherNow v1.0 • Made with <i className="wi wi-thermometer heart-icon"></i>
                  </p>
                </div>
              </div>
            </footer>
          )}
        </div>

        {/* Bottom Gradient */}
        <div className="bottom-gradient"></div>
      </div>
    </ErrorBoundary>
  );
}

export default App;