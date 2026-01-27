/**
 * Get user's current position using browser geolocation
 */
export const getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    // Get current position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
      },
      (error) => {
        // Handle different error types
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject(new Error('Location permission denied'));
            break;
          case error.POSITION_UNAVAILABLE:
            reject(new Error('Location information unavailable'));
            break;
          case error.TIMEOUT:
            reject(new Error('Location request timed out'));
            break;
          default:
            reject(new Error('Unable to get your location'));
        }
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000 // Cache for 5 minutes
      }
    );
  });
};

/**
 * Check if geolocation is available
 */
export const isGeolocationAvailable = () => {
  return 'geolocation' in navigator;
};

/**
 * Request location permission (if needed)
 */
export const requestLocationPermission = async () => {
  try {
    if ('permissions' in navigator) {
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      return permission.state; // 'granted', 'denied', or 'prompt'
    }
    return 'unknown';
  } catch (error) {
    console.error('Error checking location permission:', error);
    return 'unknown';
  }
};