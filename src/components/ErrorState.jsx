import '../styles/ErrorState.css';

export default function ErrorState({ error, onRetry }) {
  const getErrorContent = () => {
    const errorLower = error?.toLowerCase() || '';

    // City not found
    if (errorLower.includes('city not found') || errorLower.includes('not found')) {
      return {
        icon: '🏙️',
        title: "Hmm, we couldn't find that city",
        message: "Double-check the spelling or try searching for a nearby city.",
        type: 'not-found',
        suggestions: [
          'Check for typos in the city name',
          'Try adding the country (e.g., "Paris, France")',
          'Search for a major city nearby',
          'Use your current location instead'
        ]
      };
    }

    // Network/Connection errors
    if (errorLower.includes('network') || errorLower.includes('internet') || 
        errorLower.includes('connection') || errorLower.includes('fetch')) {
      return {
        icon: '📡',
        title: "No internet connection",
        message: "Please check your connection and try again.",
        type: 'network-error',
        suggestions: [
          'Check your WiFi or mobile data',
          'Try turning airplane mode off',
          'Refresh the page',
          'Check if other websites work'
        ]
      };
    }

    // Location errors
    if (errorLower.includes('location') || errorLower.includes('geolocation') ||
        errorLower.includes('permission')) {
      return {
        icon: '📍',
        title: "Unable to get your location",
        message: "Please allow location access or search for a city manually.",
        type: 'location-error',
        suggestions: [
          'Enable location permissions in your browser',
          'Search for your city manually',
          'Check browser settings',
          'Try a different browser'
        ]
      };
    }

    // API Key errors
    if (errorLower.includes('api key') || errorLower.includes('unauthorized') ||
        errorLower.includes('401')) {
      return {
        icon: '🔑',
        title: "API Configuration Error",
        message: "There's an issue with the weather service configuration.",
        type: 'api-error',
        suggestions: [
          'Check if API key is configured',
          'Verify API key is valid',
          'Wait a moment and try again',
          'Contact support if issue persists'
        ]
      };
    }

    // Generic error
    return {
      icon: '⚠️',
      title: "Something went wrong",
      message: "We're having trouble loading the weather data.",
      type: 'generic-error',
      suggestions: [
        'Try again in a moment',
        'Check your internet connection',
        'Search for a different city',
        'Refresh the page'
      ]
    };
  };

  const errorContent = getErrorContent();

  return (
    <div className={`error-container ${errorContent.type}`}>
      <div className="error-icon">{errorContent.icon}</div>
      
      <h2 className="error-title">{errorContent.title}</h2>
      
      <p className="error-message">{errorContent.message}</p>

      {onRetry && (
        <button className="retry-button" onClick={onRetry}>
          <span className="retry-icon">🔄</span>
          Try Again
        </button>
      )}

      {errorContent.suggestions && errorContent.suggestions.length > 0 && (
        <div className="error-suggestions">
          <p className="error-suggestions-title">Suggestions:</p>
          <ul className="error-suggestions-list">
            {errorContent.suggestions.map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Debug info in development */}
      {import.meta.env.DEV && (
        <div style={{
          marginTop: '24px',
          padding: '12px',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '8px',
          fontSize: '12px',
          color: 'var(--color-text-muted)',
          textAlign: 'left'
        }}>
          <strong>Debug Info:</strong>
          <pre style={{ 
            marginTop: '8px', 
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word'
          }}>
            {error}
          </pre>
        </div>
      )}
    </div>
  );
}