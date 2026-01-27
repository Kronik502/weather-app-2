const LOCATIONIQ_API_KEY = import.meta.env.VITE_LOCATIONIQ_API_KEY;
const REVERSE_GEOCODE_URL = 'https://us1.locationiq.com/v1/reverse';

/**
 * Get city name from coordinates using reverse geocoding
 */
export const getCityFromCoords = async (lat, lon) => {
  try {
    const response = await fetch(
      `${REVERSE_GEOCODE_URL}?key=${LOCATIONIQ_API_KEY}&lat=${lat}&lon=${lon}&format=json`
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid LocationIQ API key');
      }
      if (response.status === 404) {
        throw new Error('Location not found');
      }
      throw new Error('Failed to get location name');
    }

    const data = await response.json();
    
    // Extract city name from address
    const address = data.address;
    const cityName = address.city || 
                     address.town || 
                     address.village || 
                     address.municipality ||
                     address.county ||
                     'Unknown Location';

    return {
      city: cityName,
      state: address.state || '',
      country: address.country || '',
      countryCode: address.country_code?.toUpperCase() || '',
      displayName: data.display_name
    };
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    // Return basic info on error
    return {
      city: 'Current Location',
      state: '',
      country: '',
      countryCode: '',
      displayName: `${lat.toFixed(2)}, ${lon.toFixed(2)}`
    };
  }
};

/**
 * Validate LocationIQ API key
 */
export const validateLocationIQKey = () => {
  if (!LOCATIONIQ_API_KEY || LOCATIONIQ_API_KEY === 'your_locationiq_api_key') {
    console.warn('⚠️ LocationIQ API key is not configured. Reverse geocoding will be limited.');
    return false;
  }
  return true;
};