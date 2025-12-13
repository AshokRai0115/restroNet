/**
 * Calculate the great-circle distance between two points on Earth
 * using the Haversine formula
 * 
 * @param {number} lat1 - Latitude of first point (in decimal degrees)
 * @param {number} lon1 - Longitude of first point (in decimal degrees)
 * @param {number} lat2 - Latitude of second point (in decimal degrees)
 * @param {number} lon2 - Longitude of second point (in decimal degrees)
 * @param {string} unit - Unit of distance ('K' for km, 'M' for miles, 'N' for nautical miles)
 * @returns {number} - Distance between the two points
 */
const haversine = (lat1, lon1, lat2, lon2, unit = 'K') => {
  // Earth's radius in different units
  const R = {
    K: 6371,    // Kilometers
    M: 3959,    // Miles
    N: 3440     // Nautical miles
  };

  // Convert degrees to radians
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const lat1Rad = toRad(lat1);
  const lat2Rad = toRad(lat2);

  // Haversine formula
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * 
            Math.cos(lat1Rad) * Math.cos(lat2Rad);

  const c = 2 * Math.asin(Math.sqrt(a));
  const distance = R[unit] * c;

  return distance;
};

/**
 * Convert degrees to radians
 * @param {number} degrees - Angle in degrees
 * @returns {number} - Angle in radians
 */
const toRad = (degrees) => {
  return degrees * (Math.PI / 180);
};

module.exports = { haversine, toRad };
