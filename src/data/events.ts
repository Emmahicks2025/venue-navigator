import { Venue, Event } from '@/types';

// Venue map file mappings - map venue name to the SVG filename
export const venueMapFiles: Record<string, string> = {
  'Madison Square Garden': 'Madison Square Garden',
  'Crypto.com Arena': 'Crypto.com Arena',
  'Barclays Center': 'Barclays Center',
  'Chase Center': 'Chase Center',
  'Hollywood Bowl': 'Hollywood Bowl',
  'Radio City Music Hall': 'Radio City Music Hall',
  'Beacon Theatre': 'Beacon Theatre',
  'NRG Stadium': 'NRG Stadium',
  'SoFi Stadium': 'SoFi Stadium',
  'Kia Forum': 'Kia Forum',
  'MSG Sphere': 'MSG Sphere',
  'Soldier Field': 'Soldier Field',
  'Fox Theatre': 'Fox Theatre',
  'Gershwin Theatre': 'Gershwin Theatre',
};

export const venues: Venue[] = [
  {
    id: 'msg-nyc',
    name: 'Madison Square Garden',
    city: 'New York',
    state: 'NY',
    address: '4 Pennsylvania Plaza, New York, NY 10001',
    capacity: 20789,
    imageUrl: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800',
    svgMapId: 'Madison Square Garden',
    sections: [],
  },
  {
    id: 'crypto-la',
    name: 'Crypto.com Arena',
    city: 'Los Angeles',
    state: 'CA',
    address: '1111 S Figueroa St, Los Angeles, CA 90015',
    capacity: 19068,
    imageUrl: 'https://images.unsplash.com/photo-1544006659-f0b21884ce1d?w=800',
    svgMapId: 'Crypto.com Arena',
    sections: [],
  },
  {
    id: 'barclays-bk',
    name: 'Barclays Center',
    city: 'Brooklyn',
    state: 'NY',
    address: '620 Atlantic Ave, Brooklyn, NY 11217',
    capacity: 17732,
    imageUrl: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800',
    svgMapId: 'Barclays Center',
    sections: [],
  },
  {
    id: 'chase-sf',
    name: 'Chase Center',
    city: 'San Francisco',
    state: 'CA',
    address: '1 Warriors Way, San Francisco, CA 94158',
    capacity: 18064,
    imageUrl: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?w=800',
    svgMapId: 'Chase Center',
    sections: [],
  },
  {
    id: 'hollywood-bowl',
    name: 'Hollywood Bowl',
    city: 'Los Angeles',
    state: 'CA',
    address: '2301 N Highland Ave, Los Angeles, CA 90068',
    capacity: 17500,
    imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
    svgMapId: 'Hollywood Bowl',
    sections: [],
  },
  {
    id: 'radio-city',
    name: 'Radio City Music Hall',
    city: 'New York',
    state: 'NY',
    address: '1260 6th Ave, New York, NY 10020',
    capacity: 5960,
    imageUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800',
    svgMapId: 'Radio City Music Hall',
    sections: [],
  },
  {
    id: 'beacon-theatre',
    name: 'Beacon Theatre',
    city: 'New York',
    state: 'NY',
    address: '2124 Broadway, New York, NY 10023',
    capacity: 2894,
    imageUrl: 'https://images.unsplash.com/photo-1499364615650-ec38552f4f34?w=800',
    svgMapId: 'Beacon Theatre',
    sections: [],
  },
  {
    id: 'nrg-houston',
    name: 'NRG Stadium',
    city: 'Houston',
    state: 'TX',
    address: '1 NRG Park, Houston, TX 77054',
    capacity: 72220,
    imageUrl: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800',
    svgMapId: 'NRG Stadium',
    sections: [],
  },
  {
    id: 'sofi-la',
    name: 'SoFi Stadium',
    city: 'Los Angeles',
    state: 'CA',
    address: '1001 Stadium Dr, Inglewood, CA 90301',
    capacity: 70240,
    imageUrl: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=800',
    svgMapId: 'SoFi Stadium',
    sections: [],
  },
  {
    id: 'kia-forum',
    name: 'Kia Forum',
    city: 'Inglewood',
    state: 'CA',
    address: '3900 W Manchester Blvd, Inglewood, CA 90305',
    capacity: 17505,
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
    svgMapId: 'Kia Forum',
    sections: [],
  },
  {
    id: 'msg-sphere',
    name: 'MSG Sphere',
    city: 'Las Vegas',
    state: 'NV',
    address: '255 Sands Ave, Las Vegas, NV 89169',
    capacity: 18600,
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
    svgMapId: 'MSG Sphere',
    sections: [],
  },
  {
    id: 'soldier-field',
    name: 'Soldier Field',
    city: 'Chicago',
    state: 'IL',
    address: '1410 Special Olympics Dr, Chicago, IL 60605',
    capacity: 61500,
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
    svgMapId: 'Soldier Field',
    sections: [],
  },
];

export const events: Event[] = [
  // Madison Square Garden Events
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
    description: 'Experience the magic of Bruno Mars live at Madison Square Garden. The 24K Magic World Tour brings electrifying performances and chart-topping hits to the world\'s most famous arena.',
    isFeatured: true,
    minPrice: 85,
    maxPrice: 450,
  },
  {
    id: 'evt-002',
    name: 'Billie Eilish - Hit Me Hard and Soft Tour',
    performer: 'Billie Eilish',
    performerImage: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800',
    category: 'concerts',
    venueId: 'msg-nyc',
    venueName: 'Madison Square Garden',
    date: '2026-05-18',
    time: '20:00',
    description: 'Billie Eilish brings her unique sound and stunning visuals to MSG for an unforgettable night of music and artistry.',
    isFeatured: true,
    minPrice: 95,
    maxPrice: 475,
  },
  {
    id: 'evt-003',
    name: 'Knicks vs Nets - Battle of NYC',
    performer: 'NY Knicks',
    performerImage: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
    category: 'sports',
    venueId: 'msg-nyc',
    venueName: 'Madison Square Garden',
    date: '2026-02-14',
    time: '19:30',
    description: 'The ultimate NYC rivalry! Watch the Knicks take on the Nets at the World\'s Most Famous Arena.',
    isFeatured: true,
    minPrice: 75,
    maxPrice: 850,
  },
  
  // Crypto.com Arena Events
  {
    id: 'evt-004',
    name: 'Taylor Swift - The Eras Tour',
    performer: 'Taylor Swift',
    performerImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
    category: 'concerts',
    venueId: 'crypto-la',
    venueName: 'Crypto.com Arena',
    date: '2026-04-22',
    time: '19:30',
    description: 'Taylor Swift brings The Eras Tour to Los Angeles. A spectacular journey through her entire musical catalog spanning all eras.',
    isFeatured: true,
    minPrice: 125,
    maxPrice: 650,
  },
  {
    id: 'evt-005',
    name: 'Lakers vs Warriors',
    performer: 'LA Lakers',
    performerImage: 'https://images.unsplash.com/photo-1504450758481-7338bbe75c8e?w=800',
    category: 'sports',
    venueId: 'crypto-la',
    venueName: 'Crypto.com Arena',
    date: '2026-02-28',
    time: '19:00',
    description: 'The ultimate rivalry continues! Watch the Lakers take on the Warriors in this must-see NBA Western Conference matchup.',
    isFeatured: true,
    minPrice: 95,
    maxPrice: 1200,
  },
  {
    id: 'evt-006',
    name: 'Adele - Weekends with Adele',
    performer: 'Adele',
    performerImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
    category: 'concerts',
    venueId: 'crypto-la',
    venueName: 'Crypto.com Arena',
    date: '2026-03-28',
    time: '20:00',
    description: 'Adele\'s exclusive residency continues with intimate performances, powerful vocals, and unforgettable moments.',
    isFeatured: true,
    minPrice: 150,
    maxPrice: 750,
  },
  
  // Barclays Center Events
  {
    id: 'evt-007',
    name: 'Drake - For All The Dogs Tour',
    performer: 'Drake',
    performerImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
    category: 'concerts',
    venueId: 'barclays-bk',
    venueName: 'Barclays Center',
    date: '2026-04-10',
    time: '20:30',
    description: 'Drake brings his latest tour to Brooklyn. Experience hip-hop royalty live at Barclays Center.',
    isFeatured: true,
    minPrice: 85,
    maxPrice: 525,
  },
  {
    id: 'evt-008',
    name: 'Nets vs Celtics',
    performer: 'Brooklyn Nets',
    performerImage: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?w=800',
    category: 'sports',
    venueId: 'barclays-bk',
    venueName: 'Barclays Center',
    date: '2026-03-05',
    time: '19:00',
    description: 'Eastern Conference battle as the Nets host the Celtics in this exciting NBA matchup.',
    isFeatured: false,
    minPrice: 65,
    maxPrice: 450,
  },

  // Hollywood Bowl Events
  {
    id: 'evt-009',
    name: 'John Williams & LA Phil',
    performer: 'John Williams',
    performerImage: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800',
    category: 'concerts',
    venueId: 'hollywood-bowl',
    venueName: 'Hollywood Bowl',
    date: '2026-07-20',
    time: '19:30',
    description: 'Legendary composer John Williams conducts the LA Philharmonic in a night of iconic film scores under the stars.',
    isFeatured: true,
    minPrice: 45,
    maxPrice: 350,
  },
  
  // Chase Center Events
  {
    id: 'evt-010',
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
    minPrice: 125,
    maxPrice: 550,
  },
  {
    id: 'evt-011',
    name: 'Warriors vs Lakers',
    performer: 'Golden State Warriors',
    performerImage: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?w=800',
    category: 'sports',
    venueId: 'chase-sf',
    venueName: 'Chase Center',
    date: '2026-03-15',
    time: '19:30',
    description: 'California clash! Watch the Warriors host the Lakers at Chase Center.',
    isFeatured: true,
    minPrice: 110,
    maxPrice: 1100,
  },

  // Radio City Music Hall Events
  {
    id: 'evt-012',
    name: 'Christmas Spectacular',
    performer: 'The Rockettes',
    performerImage: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800',
    category: 'theater',
    venueId: 'radio-city',
    venueName: 'Radio City Music Hall',
    date: '2026-12-15',
    time: '14:00',
    description: 'The legendary Radio City Christmas Spectacular featuring the world-famous Rockettes.',
    isFeatured: false,
    minPrice: 75,
    maxPrice: 325,
  },
  {
    id: 'evt-013',
    name: 'Kevin Hart - Reality Check Tour',
    performer: 'Kevin Hart',
    performerImage: 'https://images.unsplash.com/photo-1527224538127-2104bb71c51b?w=800',
    category: 'comedy',
    venueId: 'radio-city',
    venueName: 'Radio City Music Hall',
    date: '2026-05-10',
    time: '20:00',
    description: 'Kevin Hart brings his Reality Check Tour to the iconic Radio City Music Hall. Get ready for non-stop laughter.',
    isFeatured: true,
    minPrice: 85,
    maxPrice: 275,
  },

  // MSG Sphere Events
  {
    id: 'evt-014',
    name: 'U2:UV Achtung Baby Live',
    performer: 'U2',
    performerImage: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800',
    category: 'concerts',
    venueId: 'msg-sphere',
    venueName: 'MSG Sphere',
    date: '2026-06-15',
    time: '20:00',
    description: 'Experience U2 like never before at the revolutionary MSG Sphere. Immersive visuals meet legendary rock.',
    isFeatured: true,
    minPrice: 175,
    maxPrice: 850,
  },

  // Soldier Field Events
  {
    id: 'evt-015',
    name: 'Bears vs Packers',
    performer: 'Chicago Bears',
    performerImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
    category: 'sports',
    venueId: 'soldier-field',
    venueName: 'Soldier Field',
    date: '2026-11-22',
    time: '12:00',
    description: 'The oldest rivalry in the NFL! Bears vs Packers at historic Soldier Field.',
    isFeatured: true,
    minPrice: 95,
    maxPrice: 650,
  },

  // SoFi Stadium Events  
  {
    id: 'evt-016',
    name: 'Beyoncé - Renaissance World Tour',
    performer: 'Beyoncé',
    performerImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
    category: 'concerts',
    venueId: 'sofi-la',
    venueName: 'SoFi Stadium',
    date: '2026-08-10',
    time: '20:00',
    description: 'Queen Bey takes over SoFi Stadium for an epic Renaissance World Tour performance.',
    isFeatured: true,
    minPrice: 150,
    maxPrice: 1200,
  },
  {
    id: 'evt-017',
    name: 'Rams vs 49ers',
    performer: 'LA Rams',
    performerImage: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=800',
    category: 'sports',
    venueId: 'sofi-la',
    venueName: 'SoFi Stadium',
    date: '2026-10-15',
    time: '16:25',
    description: 'NFC West rivalry game! Watch the Rams take on the 49ers at SoFi Stadium.',
    isFeatured: false,
    minPrice: 85,
    maxPrice: 750,
  },

  // Kia Forum Events
  {
    id: 'evt-018',
    name: 'Dave Chappelle Live',
    performer: 'Dave Chappelle',
    performerImage: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800',
    category: 'comedy',
    venueId: 'kia-forum',
    venueName: 'Kia Forum',
    date: '2026-04-18',
    time: '21:00',
    description: 'Comedy legend Dave Chappelle brings his unfiltered stand-up to the Kia Forum.',
    isFeatured: true,
    minPrice: 95,
    maxPrice: 425,
  },

  // Beacon Theatre Events
  {
    id: 'evt-019',
    name: 'The Allman Brothers Band Tribute',
    performer: 'Various Artists',
    performerImage: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=800',
    category: 'concerts',
    venueId: 'beacon-theatre',
    venueName: 'Beacon Theatre',
    date: '2026-03-08',
    time: '19:30',
    description: 'A celebration of The Allman Brothers Band legacy at the historic Beacon Theatre.',
    isFeatured: false,
    minPrice: 65,
    maxPrice: 225,
  },
];

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

export const getEventById = (eventId: string): Event | undefined => {
  return events.find(e => e.id === eventId);
};

export const getEventsByCategory = (category: string): Event[] => {
  if (category === 'all') return events;
  return events.filter(e => e.category === category);
};

export const getEventsByVenue = (venueId: string): Event[] => {
  return events.filter(e => e.venueId === venueId);
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
