import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { getRecentSearches, addRecentSearch } from '../utils/storageUtils';
 import debounce from 'lodash/debounce';

// Using LocationIQ for geocoding (reverse geocoding)
const fetchCitySuggestions = async (query) => {
  if (!query || query.length < 2) return [];
  
  try {
    const response = await fetch(
      `https://api.locationiq.com/v1/autocomplete?key=${import.meta.env.VITE_LOCATIONIQ_API_KEY}&q=${encodeURIComponent(query)}&limit=5&dedupe=1`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch suggestions');
    }
    
    const data = await response.json();
    return data.map(location => ({
      name: location.display_name.split(',')[0],
      display_name: location.display_name,
      lat: location.lat,
      lon: location.lon,
      importance: location.importance,
      type: location.type
    }));
  } catch (error) {
    console.error('Error fetching suggestions from LocationIQ:', error);
    // Fallback to OpenWeatherMap Geo API
    return fetchOpenWeatherSuggestions(query);
  }
};

// Fallback to OpenWeatherMap
const fetchOpenWeatherSuggestions = async (query) => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`
    );
    
    if (!response.ok) throw new Error('OpenWeatherMap API failed');
    
    const data = await response.json();
    return data.map(city => ({
      name: city.name,
      display_name: `${city.name}, ${city.state || ''}${city.state && city.country ? ', ' : ''}${city.country || ''}`,
      lat: city.lat,
      lon: city.lon,
      country: city.country,
      state: city.state
    }));
  } catch (error) {
    console.error('Error fetching from OpenWeatherMap:', error);
    return mockSuggestions(query);
  }
};

// Mock data as last resort
const mockSuggestions = (query) => {
  const cities = [
    { name: 'London', display_name: 'London, England, United Kingdom', lat: 51.5074, lon: -0.1278 },
    { name: 'New York', display_name: 'New York, NY, United States', lat: 40.7128, lon: -74.0060 },
    { name: 'Tokyo', display_name: 'Tokyo, Japan', lat: 35.6762, lon: 139.6503 },
    { name: 'Paris', display_name: 'Paris, Île-de-France, France', lat: 48.8566, lon: 2.3522 },
    { name: 'Sydney', display_name: 'Sydney, NSW, Australia', lat: -33.8688, lon: 151.2093 },
    { name: 'Berlin', display_name: 'Berlin, Germany', lat: 52.5200, lon: 13.4050 },
    { name: 'Mumbai', display_name: 'Mumbai, Maharashtra, India', lat: 19.0760, lon: 72.8777 },
    { name: 'Toronto', display_name: 'Toronto, Ontario, Canada', lat: 43.6532, lon: -79.3832 },
    { name: 'São Paulo', display_name: 'São Paulo, Brazil', lat: -23.5505, lon: -46.6333 },
    { name: 'Shanghai', display_name: 'Shanghai, China', lat: 31.2304, lon: 121.4737 }
  ];
  
  return cities
    .filter(city => 
      city.name.toLowerCase().includes(query.toLowerCase()) ||
      city.display_name.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, 5);
};

export default function SearchBar({ onSearch, onLocationRequest, isLoading }) {
  const [city, setCity] = useState('');
  const [showRecent, setShowRecent] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState([]);
  const [error, setError] = useState(null);
  
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowRecent(false);
        setShowSuggestions(false);
        setActiveSuggestionIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced function to fetch suggestions
  const fetchSuggestions = useCallback(
    debounce(async (query) => {
      if (query.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        setError(null);
        return;
      }

      setIsFetchingSuggestions(true);
      setError(null);
      
      try {
        const data = await fetchCitySuggestions(query);
        
        setSuggestions(data);
        setShowSuggestions(data.length > 0);
        setShowRecent(false); // Hide recent searches when showing suggestions
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setError('Failed to load suggestions. Please try again.');
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setIsFetchingSuggestions(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    if (city.trim()) {
      fetchSuggestions(city);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setError(null);
    }
    
    return () => {
      fetchSuggestions.cancel();
    };
  }, [city, fetchSuggestions]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim() && !isLoading) {
      executeSearch(city.trim());
    }
  };

  const executeSearch = (searchTerm) => {
    onSearch(searchTerm);
    addRecentSearch(searchTerm);
    setCity('');
    setShowRecent(false);
    setShowSuggestions(false);
    setActiveSuggestionIndex(-1);
    setError(null);
    setRecentSearches(getRecentSearches());
  };

  const handleRecentClick = (search) => {
    setCity(search);
    setShowRecent(false);
    setShowSuggestions(false);
    setActiveSuggestionIndex(-1);
    executeSearch(search);
  };

  const handleSuggestionClick = (suggestion) => {
    const displayName = suggestion.display_name || suggestion.name;
    setCity(displayName);
    setShowSuggestions(false);
    setActiveSuggestionIndex(-1);
    executeSearch(displayName);
    
    // Focus back on input
    inputRef.current?.focus();
  };

  const handleFocus = () => {
    if (recentSearches.length > 0 && !city.trim()) {
      setShowRecent(true);
      setShowSuggestions(false);
    }
  };

  const handleLocationClick = () => {
    if (!isLoading) {
      onLocationRequest();
      setCity('');
      setShowRecent(false);
      setShowSuggestions(false);
      setActiveSuggestionIndex(-1);
      setError(null);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
      setShowRecent(false);
      setActiveSuggestionIndex(-1);
      return;
    }

    if (!showSuggestions && !showRecent) return;

    const currentList = showSuggestions ? suggestions : recentSearches;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const maxIndex = currentList.length - 1;
      setActiveSuggestionIndex(prev => prev < maxIndex ? prev + 1 : 0);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const maxIndex = currentList.length - 1;
      setActiveSuggestionIndex(prev => prev > 0 ? prev - 1 : maxIndex);
    } else if (e.key === 'Enter' && activeSuggestionIndex >= 0) {
      e.preventDefault();
      if (showSuggestions) {
        handleSuggestionClick(suggestions[activeSuggestionIndex]);
      } else if (showRecent) {
        handleRecentClick(recentSearches[activeSuggestionIndex]);
      }
    }
  };

  // Memoized suggestion list
  const suggestionList = useMemo(() => {
    return suggestions.map((suggestion, index) => (
      <button
        key={`${suggestion.lat}-${suggestion.lon}-${index}`}
        type="button"
        className={`suggestion-item ${index === activeSuggestionIndex ? 'active' : ''}`}
        onClick={() => handleSuggestionClick(suggestion)}
        onMouseEnter={() => setActiveSuggestionIndex(index)}
      >
        <i className="wi wi-map-marker suggestion-icon"></i>
        <div className="suggestion-text">
          <span className="suggestion-city">{suggestion.name}</span>
          <span className="suggestion-details">
            {suggestion.display_name.split(',').slice(1).join(',').trim() || suggestion.display_name}
          </span>
        </div>
      </button>
    ));
  }, [suggestions, activeSuggestionIndex, handleSuggestionClick]);

  return (
    <div className="search-container" ref={searchRef}>
      <form className="search-wrapper" onSubmit={handleSubmit}>
        <div className="search-input-container">
          <input
            ref={inputRef}
            type="text"
            className={`search-input ${isLoading || isFetchingSuggestions ? 'loading' : ''}`}
            placeholder="Search for a city..."
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              setActiveSuggestionIndex(-1);
              if (e.target.value.trim()) {
                setShowRecent(false);
              }
            }}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            autoComplete="off"
          />
          
          {/* Loading indicator for suggestions */}
          {isFetchingSuggestions && city.length >= 2 && (
            <div className="suggestions-loading">
              <div className="spinner"></div>
            </div>
          )}
        </div>
        
        <button 
          type="submit" 
          className="search-button"
          disabled={isLoading || !city.trim()}
        >
          <i className="wi wi-day-sunny search-icon"></i>
        </button>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="suggestions-dropdown">
            <div className="suggestions-header">
              <i className="wi wi-thermometer"></i>
              <span>City Suggestions</span>
              <span className="suggestions-count">{suggestions.length} found</span>
            </div>
            {suggestionList}
          </div>
        )}

        {/* Recent Searches Dropdown */}
        {showRecent && recentSearches.length > 0 && !city.trim() && (
          <div className="recent-searches">
            <div className="recent-header">
              <i className="wi wi-time-3"></i>
              <span>Recent Searches</span>
            </div>
            {recentSearches.map((search, index) => (
              <button
                key={`${search}-${index}`}
                type="button"
                className={`recent-item ${index === activeSuggestionIndex ? 'active' : ''}`}
                onClick={() => handleRecentClick(search)}
                onMouseEnter={() => setActiveSuggestionIndex(index)}
              >
                <i className="wi wi-time-3"></i>
                <span>{search}</span>
              </button>
            ))}
          </div>
        )}
        
        {/* Error message */}
        {error && city.length >= 2 && (
          <div className="suggestions-error">
            <i className="wi wi-alert"></i>
            <span>{error}</span>
          </div>
        )}
        
        {/* No results message */}
        {showSuggestions && city.length >= 2 && suggestions.length === 0 && !isFetchingSuggestions && !error && (
          <div className="no-suggestions">
            <i className="wi wi-na"></i>
            <span>No cities found for "{city}"</span>
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