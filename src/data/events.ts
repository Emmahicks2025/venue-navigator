import { Venue, Event } from '@/types';

export const venues: Venue[] = [
  {
    id: 'msg-nyc',
    name: 'Madison Square Garden',
    city: 'New York',
    state: 'NY',
    address: '4 Pennsylvania Plaza, New York, NY 10001',
    capacity: 20789,
    imageUrl: '/venues/msg.jpg',
    svgMapId: 'msg-arena',
    sections: [
      { id: 'floor', name: 'Floor', rows: 20, seatsPerRow: 30, priceCategory: 'premium', basePrice: 450 },
      { id: 'lower-100', name: 'Lower 100s', rows: 15, seatsPerRow: 24, priceCategory: 'premium', basePrice: 350 },
      { id: 'lower-200', name: 'Lower 200s', rows: 12, seatsPerRow: 28, priceCategory: 'standard', basePrice: 225 },
      { id: 'upper-300', name: 'Upper 300s', rows: 10, seatsPerRow: 32, priceCategory: 'value', basePrice: 125 },
      { id: 'upper-400', name: 'Upper 400s', rows: 8, seatsPerRow: 36, priceCategory: 'value', basePrice: 85 },
    ],
  },
  {
    id: 'staples-la',
    name: 'Crypto.com Arena',
    city: 'Los Angeles',
    state: 'CA',
    address: '1111 S Figueroa St, Los Angeles, CA 90015',
    capacity: 19068,
    imageUrl: '/venues/staples.jpg',
    svgMapId: 'staples-arena',
    sections: [
      { id: 'floor', name: 'Floor', rows: 18, seatsPerRow: 28, priceCategory: 'premium', basePrice: 500 },
      { id: 'premier', name: 'Premier', rows: 8, seatsPerRow: 20, priceCategory: 'premium', basePrice: 400 },
      { id: 'lower-100', name: 'Lower 100s', rows: 14, seatsPerRow: 26, priceCategory: 'standard', basePrice: 275 },
      { id: 'upper-200', name: 'Upper 200s', rows: 12, seatsPerRow: 30, priceCategory: 'standard', basePrice: 175 },
      { id: 'upper-300', name: 'Upper 300s', rows: 10, seatsPerRow: 34, priceCategory: 'value', basePrice: 95 },
    ],
  },
  {
    id: 'united-chi',
    name: 'United Center',
    city: 'Chicago',
    state: 'IL',
    address: '1901 W Madison St, Chicago, IL 60612',
    capacity: 20917,
    imageUrl: '/venues/united.jpg',
    svgMapId: 'united-arena',
    sections: [
      { id: 'floor', name: 'Floor', rows: 22, seatsPerRow: 25, priceCategory: 'premium', basePrice: 425 },
      { id: 'lower-100', name: 'Lower 100s', rows: 16, seatsPerRow: 22, priceCategory: 'premium', basePrice: 325 },
      { id: 'club-200', name: 'Club 200s', rows: 10, seatsPerRow: 24, priceCategory: 'standard', basePrice: 250 },
      { id: 'upper-300', name: 'Upper 300s', rows: 14, seatsPerRow: 28, priceCategory: 'value', basePrice: 110 },
    ],
  },
  {
    id: 'capital-dc',
    name: 'Capital One Arena',
    city: 'Washington',
    state: 'DC',
    address: '601 F St NW, Washington, DC 20004',
    capacity: 20356,
    imageUrl: '/venues/capital.jpg',
    svgMapId: 'capital-arena',
    sections: [
      { id: 'floor', name: 'Floor', rows: 20, seatsPerRow: 28, priceCategory: 'premium', basePrice: 375 },
      { id: 'lower-100', name: 'Lower 100s', rows: 14, seatsPerRow: 24, priceCategory: 'premium', basePrice: 285 },
      { id: 'lower-200', name: 'Lower 200s', rows: 12, seatsPerRow: 26, priceCategory: 'standard', basePrice: 195 },
      { id: 'upper-400', name: 'Upper 400s', rows: 10, seatsPerRow: 30, priceCategory: 'value', basePrice: 75 },
    ],
  },
  {
    id: 'chase-sf',
    name: 'Chase Center',
    city: 'San Francisco',
    state: 'CA',
    address: '1 Warriors Way, San Francisco, CA 94158',
    capacity: 18064,
    imageUrl: '/venues/chase.jpg',
    svgMapId: 'chase-arena',
    sections: [
      { id: 'courtside', name: 'Courtside', rows: 3, seatsPerRow: 40, priceCategory: 'premium', basePrice: 1200 },
      { id: 'lower-100', name: 'Lower 100s', rows: 18, seatsPerRow: 22, priceCategory: 'premium', basePrice: 550 },
      { id: 'club-200', name: 'Club 200s', rows: 10, seatsPerRow: 24, priceCategory: 'standard', basePrice: 350 },
      { id: 'upper-200', name: 'Upper 200s', rows: 12, seatsPerRow: 28, priceCategory: 'value', basePrice: 150 },
    ],
  },
];

export const events: Event[] = [
  {
    id: 'evt-001',
    name: 'Bruno Mars - 24K Magic World Tour',
    performer: 'Bruno Mars',
    performerImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
    category: 'concerts',
    venueId: 'msg-nyc',
    venueName: 'Madison Square Garden',
    date: '2026-03-15',
    time: '20:00',
    description: 'Experience the magic of Bruno Mars live at Madison Square Garden. The 24K Magic World Tour brings electrifying performances and chart-topping hits.',
    isFeatured: true,
    minPrice: 85,
    maxPrice: 450,
  },
  {
    id: 'evt-002',
    name: 'Taylor Swift - The Eras Tour',
    performer: 'Taylor Swift',
    performerImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
    category: 'concerts',
    venueId: 'staples-la',
    venueName: 'Crypto.com Arena',
    date: '2026-04-22',
    time: '19:30',
    description: 'Taylor Swift brings The Eras Tour to Los Angeles. A spectacular journey through her entire musical catalog.',
    isFeatured: true,
    minPrice: 95,
    maxPrice: 500,
  },
  {
    id: 'evt-003',
    name: 'Lakers vs Warriors',
    performer: 'LA Lakers',
    performerImage: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
    category: 'sports',
    venueId: 'staples-la',
    venueName: 'Crypto.com Arena',
    date: '2026-02-28',
    time: '19:00',
    description: 'The ultimate rivalry continues! Watch the Lakers take on the Warriors in this must-see NBA matchup.',
    isFeatured: true,
    minPrice: 95,
    maxPrice: 1200,
  },
  {
    id: 'evt-004',
    name: 'Hamilton',
    performer: 'Hamilton Broadway Cast',
    performerImage: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800',
    category: 'theater',
    venueId: 'capital-dc',
    venueName: 'Capital One Arena',
    date: '2026-05-10',
    time: '14:00',
    description: 'The revolutionary Broadway musical comes to DC. Experience the story of Alexander Hamilton like never before.',
    isFeatured: false,
    minPrice: 75,
    maxPrice: 375,
  },
  {
    id: 'evt-005',
    name: 'Kevin Hart - Reality Check Tour',
    performer: 'Kevin Hart',
    performerImage: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800',
    category: 'comedy',
    venueId: 'united-chi',
    venueName: 'United Center',
    date: '2026-03-08',
    time: '20:00',
    description: 'Kevin Hart brings his Reality Check Tour to Chicago. Get ready for a night of non-stop laughter.',
    isFeatured: true,
    minPrice: 110,
    maxPrice: 425,
  },
  {
    id: 'evt-006',
    name: 'The Weeknd - After Hours Til Dawn',
    performer: 'The Weeknd',
    performerImage: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
    category: 'concerts',
    venueId: 'chase-sf',
    venueName: 'Chase Center',
    date: '2026-04-05',
    time: '21:00',
    description: 'The Weeknd takes over Chase Center with the After Hours Til Dawn Tour. An immersive visual and musical experience.',
    isFeatured: true,
    minPrice: 150,
    maxPrice: 1200,
  },
  {
    id: 'evt-007',
    name: 'Bulls vs Celtics',
    performer: 'Chicago Bulls',
    performerImage: 'https://images.unsplash.com/photo-1504450758481-7338bbe75c8e?w=800',
    category: 'sports',
    venueId: 'united-chi',
    venueName: 'United Center',
    date: '2026-03-20',
    time: '19:30',
    description: 'Classic Eastern Conference matchup as the Bulls host the Celtics at the United Center.',
    isFeatured: false,
    minPrice: 110,
    maxPrice: 425,
  },
  {
    id: 'evt-008',
    name: 'Billie Eilish - Hit Me Hard and Soft Tour',
    performer: 'Billie Eilish',
    performerImage: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800',
    category: 'concerts',
    venueId: 'msg-nyc',
    venueName: 'Madison Square Garden',
    date: '2026-05-18',
    time: '20:00',
    description: 'Billie Eilish brings her unique sound and visuals to MSG for an unforgettable night.',
    isFeatured: false,
    minPrice: 85,
    maxPrice: 450,
  },
  {
    id: 'evt-009',
    name: 'Coachella Music Festival',
    performer: 'Various Artists',
    performerImage: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',
    category: 'festivals',
    venueId: 'staples-la',
    venueName: 'Empire Polo Club',
    date: '2026-04-10',
    time: '12:00',
    description: 'The ultimate music festival experience featuring the biggest names in music across multiple stages.',
    isFeatured: true,
    minPrice: 499,
    maxPrice: 1500,
  },
  {
    id: 'evt-010',
    name: 'Dave Chappelle Live',
    performer: 'Dave Chappelle',
    performerImage: 'https://images.unsplash.com/photo-1527224538127-2104bb71c51b?w=800',
    category: 'comedy',
    venueId: 'capital-dc',
    venueName: 'Capital One Arena',
    date: '2026-06-15',
    time: '21:00',
    description: 'Comedy legend Dave Chappelle brings his unfiltered stand-up to Washington DC.',
    isFeatured: false,
    minPrice: 75,
    maxPrice: 375,
  },
  {
    id: 'evt-011',
    name: 'Knicks vs Nets',
    performer: 'NY Knicks',
    performerImage: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?w=800',
    category: 'sports',
    venueId: 'msg-nyc',
    venueName: 'Madison Square Garden',
    date: '2026-02-14',
    time: '19:00',
    description: 'The battle of New York! Knicks vs Nets at the World\'s Most Famous Arena.',
    isFeatured: true,
    minPrice: 85,
    maxPrice: 450,
  },
  {
    id: 'evt-012',
    name: 'Adele - Weekends with Adele',
    performer: 'Adele',
    performerImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
    category: 'concerts',
    venueId: 'staples-la',
    venueName: 'Crypto.com Arena',
    date: '2026-03-28',
    time: '20:00',
    description: 'Adele\'s exclusive residency continues with intimate performances and powerful vocals.',
    isFeatured: true,
    minPrice: 95,
    maxPrice: 500,
  },
];

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

export const getEventById = (eventId: string): Event | undefined => {
  return events.find(e => e.id === eventId);
};

export const getEventsByCategory = (category: string): Event[] => {
  if (category === 'all') return events;
  return events.filter(e => e.category === category);
};

export const getFeaturedEvents = (): Event[] => {
  return events.filter(e => e.isFeatured);
};

export const searchEvents = (query: string): Event[] => {
  const lowercaseQuery = query.toLowerCase();
  return events.filter(e => 
    e.name.toLowerCase().includes(lowercaseQuery) ||
    e.performer.toLowerCase().includes(lowercaseQuery) ||
    e.venueName.toLowerCase().includes(lowercaseQuery) ||
    e.category.toLowerCase().includes(lowercaseQuery)
  );
};
