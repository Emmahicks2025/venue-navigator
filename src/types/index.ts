// Types for the ticket booking platform

export interface Venue {
  id: string;
  name: string;
  city: string;
  state: string;
  address: string;
  capacity: number;
  imageUrl: string;
  sections: VenueSection[];
  svgMapId: string;
}

export interface VenueSection {
  id: string;
  name: string;
  rows: number;
  seatsPerRow: number;
  priceCategory: 'premium' | 'standard' | 'value';
  basePrice: number;
}

export interface Seat {
  id: string;
  sectionId: string;
  row: string;
  number: number;
  status: 'available' | 'selected' | 'sold';
  price: number;
}

export interface Event {
  id: string;
  name: string;
  performer: string;
  performerImage: string;
  category: EventCategory;
  venueId: string;
  venueName: string;
  date: string;
  time: string;
  description: string;
  isFeatured: boolean;
  minPrice: number;
  maxPrice: number;
}

export type EventCategory = 'concerts' | 'sports' | 'theater' | 'comedy' | 'festivals';

export interface CartItem {
  eventId: string;
  eventName: string;
  eventDate: string;
  venueName: string;
  seats: SelectedSeat[];
}

export interface SelectedSeat {
  sectionName: string;
  row: string;
  seatNumber: number;
  price: number;
}

export interface SearchFilters {
  query: string;
  category: EventCategory | 'all';
  city: string;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  priceRange: {
    min: number;
    max: number;
  };
}
