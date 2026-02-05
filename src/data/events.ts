import { Venue, Event } from '@/types';
import { venueNames, getVenueData, hasVenueMap, venueMetadata, generateVenueId, getAllVenues } from './venues';
import { allEvents, getEventsByCategory, getEventsByVenue, getFeaturedEvents, getEventById, searchEvents } from './eventsData';

// Re-export everything for backwards compatibility
export { venueNames, getVenueData, hasVenueMap };
export { allEvents as events, getEventsByCategory, getEventsByVenue, getFeaturedEvents, getEventById, searchEvents };

// Venue map file mappings - auto-generated from venue names
export const venueMapFiles: Record<string, string> = Object.fromEntries(
  venueNames.map(name => [name, name])
);

// Generate venues array from venue metadata
export const venues: Venue[] = getAllVenues().map(venueData => ({
  id: venueData.id,
  name: venueData.name,
  city: venueData.city,
  state: venueData.state,
  address: `${venueData.city}, ${venueData.state}`,
  capacity: venueData.capacity,
  imageUrl: getVenueImageUrl(venueData.type),
  svgMapId: venueData.name,
  sections: [],
}));

// Get venue image based on type
function getVenueImageUrl(type: string): string {
  const images: Record<string, string> = {
    'arena': 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800',
    'stadium': 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=800',
    'theater': 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800',
    'amphitheater': 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
    'music-hall': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
    'casino': 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
    'other': 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800',
  };
  return images[type] || images['other'];
}

// Helper functions
export const getCategoryLabel = (category: string): string => {
  const labels: Record<string, string> = {
    concerts: 'Concerts',
    sports: 'Sports',
    theater: 'Theater',
    comedy: 'Comedy',
    festivals: 'Festivals',
  };
  return labels[category] || category;
};

export const getCategoryIcon = (category: string): string => {
  const icons: Record<string, string> = {
    concerts: '🎵',
    sports: '🏀',
    theater: '🎭',
    comedy: '😂',
    festivals: '🎪',
  };
  return icons[category] || '🎫';
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatShortDate = (dateString: string): { month: string; day: string } => {
  const date = new Date(dateString);
  return {
    month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    day: date.getDate().toString().padStart(2, '0'),
  };
};

export const formatTime = (timeString: string): string => {
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(price);
};

export const getVenueById = (venueId: string): Venue | undefined => {
  return venues.find(v => v.id === venueId);
};

export const getVenueByName = (venueName: string): Venue | undefined => {
  return venues.find(v => v.name === venueName);
};
