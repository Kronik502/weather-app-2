import { useState } from 'react';
import '../styles/SearchBar.css';

export default function SearchBar({ onSearch, onLocationRequest, isLoading }) {
  const [city, setCity] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim() && !isLoading) {
      onSearch(city.trim());
    }
  };

  const handleLocationClick = () => {
    if (!isLoading) {
      onLocationRequest();
    }
  };

  return (
    <div className="search-container">
      <form className="search-wrapper" onSubmit={handleSubmit}>
        <input
          type="text"
          className={`search-input ${isLoading ? 'loading' : ''}`}
          placeholder="Search for a city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          disabled={isLoading}
        />
        <span className="search-icon">🔍</span>
      </form>

      <div className="location-button-container">
        <button
          type="button"
          className="location-button"
          onClick={handleLocationClick}
          disabled={isLoading}
        >
          <span className="location-button-icon">📍</span>
          {isLoading ? 'Detecting...' : 'Use my location'}
        </button>
      </div>
    </div>
  );
}