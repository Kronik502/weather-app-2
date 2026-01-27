/**
 * Format timestamp to readable time string
 */
export const formatTime = (timestamp, use12Hour = true) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: use12Hour
  });
};

/**
 * Format date to readable string
 */
export const formatDate = (timestamp, format = 'short') => {
  const date = new Date(timestamp * 1000);
  
  switch (format) {
    case 'short':
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    case 'long':
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
      });
    case 'full':
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    default:
      return date.toLocaleDateString();
  }
};

/**
 * Get day name from timestamp
 */
export const getDayName = (timestamp, format = 'short') => {
  const date = new Date(timestamp * 1000);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Check if it's today or tomorrow
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  }
  if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  }

  // Return day name
  return date.toLocaleDateString('en-US', {
    weekday: format === 'short' ? 'short' : 'long'
  });
};

/**
 * Get day name from date string (YYYY-MM-DD)
 */
export const getDayNameFromDateString = (dateString, format = 'short') => {
  const date = new Date(dateString + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);

  // Check if it's today or tomorrow
  if (compareDate.getTime() === today.getTime()) {
    return 'Today';
  }
  if (compareDate.getTime() === tomorrow.getTime()) {
    return 'Tomorrow';
  }

  // Return day name
  return date.toLocaleDateString('en-US', {
    weekday: format === 'short' ? 'short' : 'long'
  });
};

/**
 * Format relative time (e.g., "5 minutes ago")
 */
export const formatRelativeTime = (timestamp) => {
  const now = Date.now();
  const past = typeof timestamp === 'number' ? timestamp * 1000 : timestamp;
  const diffMs = now - past;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);

  if (diffMins < 1) {
    return 'Just now';
  }
  if (diffMins < 60) {
    return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  }
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  }
  
  return formatDate(past / 1000, 'short');
};

/**
 * Check if timestamp is today
 */
export const isToday = (timestamp) => {
  const date = new Date(timestamp * 1000);
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

/**
 * Check if it's nighttime based on sunrise/sunset
 */
export const isNightTime = (currentTime, sunrise, sunset) => {
  return currentTime < sunrise || currentTime > sunset;
};

/**
 * Format hour from timestamp (for hourly forecast)
 */
export const formatHour = (timestamp) => {
  const date = new Date(timestamp * 1000);
  const hour = date.getHours();
  
  if (hour === 0) return '12 AM';
  if (hour < 12) return `${hour} AM`;
  if (hour === 12) return '12 PM';
  return `${hour - 12} PM`;
};

/**
 * Get short day abbreviation (Mon, Tue, etc.)
 */
export const getShortDay = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

/**
 * Get month and day (Jan 15)
 */
export const getMonthDay = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
};