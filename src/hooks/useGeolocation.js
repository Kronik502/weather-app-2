import { useState, useCallback } from 'react';

/**
 * Custom hook for handling geolocation
 */
export const useGeolocation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getCurrentPosition = useCallback(() => {
    return new Promise((resolve, reject) => {
      setLoading(true);
      setError(null);

      // Check if geolocation is supported
      if (!navigator.geolocation) {
        const err = new Error('Geolocation is not supported by your browser');
        setError(err);
        setLoading(false);
        reject(err);
        return;
      }

      // Get current position
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLoading(false);
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (error) => {
          setLoading(false);
          let errorMessage;

          // Handle different error types
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location permission denied. Please enable location access in your browser settings.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable. Please try again.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out. Please try again.';
              break;
            default:
              errorMessage = 'Unable to get your location. Please try searching for a city.';
          }

          const err = new Error(errorMessage);
          setError(err);
          reject(err);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // Cache for 5 minutes
        }
      );
    });
  }, []);

  const checkPermission = useCallback(async () => {
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
  }, []);

  const isAvailable = useCallback(() => {
    return 'geolocation' in navigator;
  }, []);

  return {
    getCurrentPosition,
    checkPermission,
    isAvailable,
    loading,
    error
  };
};