"use client";

import { useState, useEffect, useRef } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

export default function LocationPicker({ onLocationSelect }) {
  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    // Initialize map when component mounts
    if (typeof window !== 'undefined') {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.onload = initializeMap;
      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
    }
  }, []);

  const initializeMap = () => {
    if (!mapRef.current) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: 0, lng: 0 },
      zoom: 2,
    });

    const marker = new window.google.maps.Marker({
      map,
      draggable: true,
    });

    const searchBox = new window.google.maps.places.SearchBox(
      document.getElementById('location-search')
    );

    map.addListener('bounds_changed', () => {
      searchBox.setBounds(map.getBounds());
    });

    searchBox.addListener('places_changed', () => {
      const places = searchBox.getPlaces();
      if (places.length === 0) return;

      const place = places[0];
      const location = {
        latitude: place.geometry.location.lat(),
        longitude: place.geometry.location.lng(),
        address: place.formatted_address,
      };

      setLocation(location);
      onLocationSelect(location);

      map.setCenter(place.geometry.location);
      marker.setPosition(place.geometry.location);
    });

    marker.addListener('dragend', (event) => {
      const position = marker.getPosition();
      const geocoder = new window.google.maps.Geocoder();

      geocoder.geocode({ location: position }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const location = {
            latitude: position.lat(),
            longitude: position.lng(),
            address: results[0].formatted_address,
          };

          setLocation(location);
          onLocationSelect(location);
        }
      });
    });
  };

  const handleGetCurrentLocation = () => {
    setIsLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        // Reverse geocode to get address
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location }, (results, status) => {
          if (status === 'OK' && results[0]) {
            location.address = results[0].formatted_address;
            setLocation(location);
            onLocationSelect(location);
            setIsLoading(false);
          } else {
            setError('Could not get address for this location');
            setIsLoading(false);
          }
        });
      },
      (error) => {
        setError('Unable to retrieve your location');
        setIsLoading(false);
        toast.error('Please enable location access to use this feature');
      }
    );
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          id="location-search"
          type="text"
          placeholder="Search for a location"
          className="w-full pl-12 h-12 text-lg border-gray-200 focus:border-pink-500 focus:ring-pink-500 rounded-md"
        />
        <FaMapMarkerAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleGetCurrentLocation}
          disabled={isLoading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Getting location...
            </>
          ) : (
            'Use Current Location'
          )}
        </button>

        {location && (
          <div className="text-sm text-gray-600">
            Selected: {location.address}
          </div>
        )}
      </div>

      <div
        ref={mapRef}
        className="w-full h-64 rounded-lg border border-gray-200"
      />

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
} 