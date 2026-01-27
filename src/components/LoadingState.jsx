import { useState, useEffect } from 'react';
import '../styles/LoadingState.css';

export default function LoadingState({ type = 'spinner' }) {
  const [message, setMessage] = useState('Checking the skies...');

  const messages = [
    'Checking the skies...',
    'Fetching weather data...',
    'Almost there...',
    'Reading the clouds...'
  ];

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % messages.length;
      setMessage(messages[index]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  if (type === 'skeleton') {
    return (
      <div className="skeleton-card glass-card">
        <div className="skeleton skeleton-location"></div>
        <div className="skeleton skeleton-temperature"></div>
        <div className="skeleton skeleton-description"></div>
        
        <div className="skeleton-details">
          <div className="skeleton skeleton-detail-item"></div>
          <div className="skeleton skeleton-detail-item"></div>
          <div className="skeleton skeleton-detail-item"></div>
          <div className="skeleton skeleton-detail-item"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="loading-container">
      <div className="spinner">
        <div className="spinner-circle"></div>
      </div>
      
      <p className="loading-text">
        {message}
        <span className="loading-dots">
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </span>
      </p>
      
      <p className="loading-subtext">This won't take long</p>
    </div>
  );
}