import { useState, useEffect } from 'react';

interface LocationData {
  city: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
}

export const useUserLocation = () => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await fetch('https://ip-api.com/json/?fields=city,region,country,lat,lon');
        if (!response.ok) throw new Error('Failed to fetch location');
        const data = await response.json();
        setLocation({
          city: data.city,
          region: data.region,
          country: data.country,
          lat: data.lat,
          lon: data.lon,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, []);

  return { location, loading, error };
};
