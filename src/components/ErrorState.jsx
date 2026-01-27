import PropTypes from 'prop-types';
import '../styles/ErrorState.css';

export default function ErrorState({ error, onRetry }) {
  const getErrorIcon = () => {
    if (!error) return '⚠️';
    
    const message = error.message.toLowerCase();
    if (message.includes('network')) return '📡';
    if (message.includes('not found')) return '🔍';
    if (message.includes('permission')) return '🔒';
    if (message.includes('api key')) return '🔑';
    return '⚠️';
  };

  const getErrorTitle = () => {
    if (!error) return 'Something went wrong';
    
    const message = error.message.toLowerCase();
    if (message.includes('network')) return 'Connection Error';
    if (message.includes('not found')) return 'Location Not Found';
    if (message.includes('permission')) return 'Permission Required';
    if (message.includes('api key')) return 'Configuration Error';
    return 'Error';
  };

  return (
    <div className="error-state glass-card fade-in">
      <div className="error-icon-large">{getErrorIcon()}</div>
      <h3 className="error-title">{getErrorTitle()}</h3>
      <p className="error-message">
        {error ? error.message : 'An unexpected error occurred'}
      </p>
      
      {onRetry && (
        <button 
          className="error-retry-button"
          onClick={onRetry}
        >
          <i className="wi wi-refresh"></i>
          Try Again
        </button>
      )}

      <div className="error-suggestions">
        <p className="suggestions-title">Try these:</p>
        <ul>
          <li>Check your internet connection</li>
          <li>Verify the location name spelling</li>
          <li>Try searching for a different city</li>
        </ul>
      </div>
    </div>
  );
}

ErrorState.propTypes = {
  error: PropTypes.shape({
    message: PropTypes.string.isRequired
  }),
  onRetry: PropTypes.func
};