import React, { useState, useRef } from 'react';
import { MapPin, Search } from 'lucide-react';

interface LocationResult {
  display_name: string;
  lat: string;
  lon: string;
}

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string, coordinates?: { lat: number; lng: number }) => void;
  placeholder: string;
  className?: string;
}

const GoogleMapsAutocomplete: React.FC<LocationAutocompleteProps> = ({
  value,
  onChange,
  placeholder,
  className = ''
}) => {
  const [suggestions, setSuggestions] = useState<LocationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout>();
  const inputRef = useRef<HTMLInputElement>(null);

  const searchLocations = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/autocomplete?query=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const mappedSuggestions = data.map((item: any) => ({
        display_name: item.name,
        lat: item.lat,
        lon: item.lng,
      }));
      setSuggestions(mappedSuggestions);
    } catch (error) {
      console.error('Error fetching locations from Google Places:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setShowSuggestions(true);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      searchLocations(newValue);
    }, 300);
  };

  const handleSuggestionClick = (suggestion: LocationResult) => {
    onChange(suggestion.display_name, {
      lat: parseFloat(suggestion.lat),
      lng: parseFloat(suggestion.lon)
    });
    setSuggestions([]);
    setShowSuggestions(false);
    if (inputRef.current) {
        inputRef.current.focus();
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser');
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Try OpenStreetMap Nominatim first (free, no API key required)
          let address = '';
          let reverseGeocodingSuccess = false;
          
          try {
            const nominatimResponse = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`
            );
            
            if (nominatimResponse.ok) {
              const nominatimData = await nominatimResponse.json();
              if (nominatimData && nominatimData.display_name) {
                address = nominatimData.display_name;
                reverseGeocodingSuccess = true;
              }
            }
          } catch (nominatimError) {
            console.warn('Nominatim reverse geocoding failed:', nominatimError);
          }
          
          // Fallback to Google Geocoding API if Nominatim fails
          if (!reverseGeocodingSuccess && import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
            try {
              const googleResponse = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
              );
              
              if (googleResponse.ok) {
                const googleData = await googleResponse.json();
                if (googleData.results && googleData.results.length > 0) {
                  address = googleData.results[0].formatted_address;
                  reverseGeocodingSuccess = true;
                }
              }
            } catch (googleError) {
              console.warn('Google reverse geocoding failed:', googleError);
            }
          }
          
          // If both reverse geocoding attempts fail, use coordinates as fallback
          if (!reverseGeocodingSuccess) {
            address = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
            console.warn('Reverse geocoding failed, using coordinates as fallback');
          }

          // Always pass the coordinates along with the address for route calculation
          onChange(address, { lat: latitude, lng: longitude });
          
        } catch (error) {
          console.error('Error during reverse geocoding:', error);
          // Fallback to coordinates if all geocoding fails
          const fallbackAddress = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
          onChange(fallbackAddress, { lat: latitude, lng: longitude });
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        console.error('Error getting location:', error);
        let errorMessage = 'Unable to get your current location';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location permissions and try again.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable. Please try again.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out. Please try again.';
            break;
          default:
            errorMessage = 'An unknown error occurred while getting your location.';
            break;
        }
        
        alert(errorMessage);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          className={`w-full pl-10 pr-12 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white ${className}`}
          placeholder={placeholder}
          required
        />
        <button
          type="button"
          onClick={getCurrentLocation}
          disabled={isLoading}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-blue-600 hover:text-blue-700 disabled:opacity-50"
          title="Use current location"
        >
          <MapPin className="w-5 h-5" />
        </button>
      </div>

      {isLoading && (
        <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onMouseDown={() => handleSuggestionClick(s)}
              className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-600 border-b border-gray-200 dark:border-gray-600 last:border-b-0"
            >
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                <span className="text-sm text-gray-800 dark:text-white line-clamp-2">
                  {s.display_name}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default GoogleMapsAutocomplete;