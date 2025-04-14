export const getNearbyAlerts = async (latitude, longitude, radiusInKm = 5, foodType = null) => {
  try {
    const db = getFirestore();
    const alertsRef = collection(db, 'food_alerts');
    
    // Convert radius to meters for Firestore
    const radiusInMeters = radiusInKm * 1000;
    
    // Create a GeoPoint for the center
    const center = new GeoPoint(latitude, longitude);
    
    // Build the query conditions
    const conditions = [
      where('status', '==', 'available'),
      where('location', '>=', new GeoPoint(
        latitude - (radiusInKm / 111.32),
        longitude - (radiusInKm / (111.32 * Math.cos(latitude * Math.PI / 180)))
      )),
      where('location', '<=', new GeoPoint(
        latitude + (radiusInKm / 111.32),
        longitude + (radiusInKm / (111.32 * Math.cos(latitude * Math.PI / 180)))
      ))
    ];

    // Add food type filter if specified
    if (foodType) {
      conditions.push(where('food_type', '==', foodType));
    }

    // Create the query
    const q = query(alertsRef, ...conditions);

    const snapshot = await getDocs(q);
    const alerts = [];

    snapshot.forEach((doc) => {
      const alert = doc.data();
      const alertLocation = alert.location;
      
      // Calculate distance using Haversine formula
      const distance = calculateDistance(
        latitude,
        longitude,
        alertLocation.latitude,
        alertLocation.longitude
      );

      // Only include alerts within the specified radius
      if (distance <= radiusInMeters) {
        alerts.push({
          id: doc.id,
          ...alert,
          distance: distance / 1000 // Convert to kilometers
        });
      }
    });

    // Sort by distance
    alerts.sort((a, b) => a.distance - b.distance);

    return alerts;
  } catch (error) {
    console.error('Error getting nearby alerts:', error);
    throw error;
  }
};

// Helper function to calculate distance between two points using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // Distance in meters
}; 