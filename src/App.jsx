import { useWeather } from './hooks/useWeather';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import './App.css';
import './styles/WeatherCard.css';
import './styles/SearchBar.css';
import './styles/LoadingState.css';
import './styles/ErrorState.css';

function App() {
  const {
    weatherData,
    loading,
    error,
    backgroundClass,
    loadWeatherByCity,
    loadCurrentLocation,
    retry
  } = useWeather();

  return (
    <div className={`app ${backgroundClass}`}>
      <div className="container">
        {/* Header */}
        <header className="app-header">
          <div className="app-logo">
            <span className="logo-icon">🌤️</span>
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
            <WeatherCard data={weatherData} />
          )}
        </main>

        {/* Footer */}
        {weatherData && !loading && (
          <footer style={{ 
            textAlign: 'center', 
            marginTop: '48px',
            padding: '24px',
            color: 'var(--color-text-muted)',
            fontSize: '14px'
          }}>
            <p>Last updated: {new Date().toLocaleTimeString()}</p>
            <p style={{ marginTop: '8px' }}>
              Data provided by OpenWeatherMap
            </p>
          </footer>
        )}
      </div>
    </div>
  );
}

export default App;