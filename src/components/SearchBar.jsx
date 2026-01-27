import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { getRecentSearches } from '../utils/storageUtils';
import '../styles/SearchBar.css';

export default function SearchBar({ onSearch, onLocationRequest, isLoading }) {
  const [city, setCity] = useState('');
  const [showRecent, setShowRecent] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const searchRef = useRef(null);

  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowRecent(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim() && !isLoading) {
      onSearch(city.trim());
      setCity('');
      setShowRecent(false);
      setRecentSearches(getRecentSearches());
    }
  };

  const handleRecentClick = (search) => {
    setCity(search);
    setShowRecent(false);
    onSearch(search);
  };

  const handleFocus = () => {
    if (recentSearches.length > 0) {
      setShowRecent(true);
    }
  };

  const handleLocationClick = () => {
    if (!isLoading) {
      onLocationRequest();
      setCity('');
      setShowRecent(false);
    }
  };

  return (
    <div className="search-container" ref={searchRef}>
      <form className="search-wrapper" onSubmit={handleSubmit}>
        <input
          type="text"
          className={`search-input ${isLoading ? 'loading' : ''}`}
          placeholder="Search for a city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onFocus={handleFocus}
          disabled={isLoading}
        />
        <button 
          type="submit" 
          className="search-button"
          disabled={isLoading || !city.trim()}
        >
          <i className="wi wi-day-sunny search-icon"></i>
        </button>

        {/* Recent Searches Dropdown */}
        {showRecent && recentSearches.length > 0 && (
          <div className="recent-searches">
            <div className="recent-header">Recent Searches</div>
            {recentSearches.map((search, index) => (
              <button
                key={index}
                type="button"
                className="recent-item"
                onClick={() => handleRecentClick(search)}
              >
                <i className="wi wi-time-3"></i>
                <span>{search}</span>
              </button>
            ))}
          </div>
        )}
      </form>

      <div className="location-button-container">
        <button
          type="button"
          className="location-button"
          onClick={handleLocationClick}
          disabled={isLoading}
        >
          <i className="wi wi-map-marker location-button-icon"></i>
          <span>{isLoading ? 'Detecting...' : 'Use my location'}</span>
        </button>
      </div>
    </div>
  );
}

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
  onLocationRequest: PropTypes.func.isRequired,
  isLoading: PropTypes.bool
};

SearchBar.defaultProps = {
  isLoading: false
};