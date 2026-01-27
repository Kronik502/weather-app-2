import PropTypes from 'prop-types';
import '../styles/LoadingState.css';

export default function LoadingState({ type = 'spinner', message = 'Loading...' }) {
  if (type === 'skeleton') {
    return (
      <div className="loading-skeleton fade-in">
        <div className="skeleton-card glass-card">
          <div className="skeleton-header">
            <div className="skeleton-line skeleton-title"></div>
            <div className="skeleton-line skeleton-subtitle"></div>
          </div>
          <div className="skeleton-main">
            <div className="skeleton-circle"></div>
            <div className="skeleton-line skeleton-temp"></div>
          </div>
          <div className="skeleton-details">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="skeleton-detail">
                <div className="skeleton-icon"></div>
                <div className="skeleton-line"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="loading-state fade-in">
      <div className="loading-spinner"></div>
      <p className="loading-message">{message}</p>
    </div>
  );
}

LoadingState.propTypes = {
  type: PropTypes.oneOf(['spinner', 'skeleton']),
  message: PropTypes.string
};