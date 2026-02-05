// Auto-generated venue data from SVG maps
// Each venue name matches the SVG filename in public/venue-maps/

export interface VenueData {
  id: string;
  name: string;
  city: string;
  state: string;
  country: string;
  type: 'arena' | 'stadium' | 'theater' | 'amphitheater' | 'music-hall' | 'casino' | 'other';
  capacity: number;
}

// All venue names that have SVG maps
export const venueNames = [
  '713 Music Hall',
  'Allstate Arena',
  'Amerant Bank Arena',
  'American Airlines Center',
  'Ameris Bank Amphitheatre',
  'Angel of the Winds Arena',
  'Arizona Financial Theatre',
  'Atlanta Symphony Hall',
  'Atrium Health Amphitheater',
  'Ball Arena',
  'Barclays Center',
  'Bayou Music Center',
  'Beacon Theatre',
  'Bellagio',
  'Bellco Theatre',
  'Bobby Dodd Stadium',
  'Bourbon Theatre',
  'Broadmoor World Arena',
  'Buell Theatre',
  'CIBC Theatre',
  'Cadillac Palace Theatre',
  'Cellairis Amphitheatre',
  'Chase Center',
  'Climate Pledge Arena',
  'Credit Union 1 Amphitheatre',
  'Crypto.com Arena',
  'Cure Insurance Arena',
  'Cynthia Woods Mitchell Pavilion',
  'Desert Diamond Arena',
  'Dickies Arena',
  'Dolby Live at Park MGM',
  'Dos Equis Pavilion',
  'Dreyfoos Hall at Kravis Center',
  'EchoPark Speedway',
  'Empower Field at Mile High',
  'Excalibur',
  'Fenway Park',
  'Fiddlers Green Amphitheatre',
  'Fillmore Auditorium Denver',
  'Fontainebleau Las Vegas',
  'Forest Hills Stadium',
  'Fox Theatre',
  'Freedom Mortgage Pavilion',
  'Gas South Arena',
  'Gershwin Theatre',
  'Gillette Stadium',
  'Globe Life Field',
  'Hard Rock Live',
  'Hard Rock Stadium',
  'Heartland Events Center at the Nebraska State Fair',
  'Hollywood Bowl',
  'Hollywood Palladium',
  'House of Blues Dallas',
  'Imperial Theatre',
  'Intuit Dome',
  'Jiffy Lube Live',
  'Kaseya Center',
  'Kia Forum',
  'Las Vegas Motor Speedway',
  'Leader Bank Pavilion',
  "Levi's Stadium",
  'Lincoln Financial Field',
  'Lumen Field',
  'Lyric Theatre',
  'MGM Grand Garden Arena',
  'MGM Music Hall at Fenway',
  'MSG Sphere',
  'Madison Square Garden',
  'Mandalay Bay',
  'Mercedes-Benz Stadium',
  'MetLife Stadium',
  'Michelob Ultra Arena',
  'Minskoff Theatre',
  'Mirage',
  'Mortgage Matchup Center',
  'NRG Stadium',
  'Nebraska Memorial Stadium',
  'New Amsterdam Theatre',
  'New York-New York',
  'O2 Arena',
  'PNC Bank Arts Center',
  'Pantages Theatre',
  'Paramount Theatre Seattle',
  'Park MGM',
  'Pinewood Bowl Theater',
  'Pinnacle Bank Arena',
  'Prudential Center',
  'Radio City Music Hall',
  'Rio Las Vegas',
  'Roadrunner',
  'Rosemont Theatre',
  'Royal Albert Hall',
  'Santander Arena',
  'ShoWare Center',
  'Smart Financial Centre',
  'SoFi Stadium',
  'Soldier Field',
  'iTHINK Financial Amphitheatre',
  'loanDepot Park',
] as const;

export type VenueName = typeof venueNames[number];

// Venue metadata with locations and capacities
export const venueMetadata: Record<string, Omit<VenueData, 'id' | 'name'>> = {
  '713 Music Hall': { city: 'Houston', state: 'TX', country: 'USA', type: 'music-hall', capacity: 2500 },
  'Allstate Arena': { city: 'Rosemont', state: 'IL', country: 'USA', type: 'arena', capacity: 18500 },
  'Amerant Bank Arena': { city: 'Sunrise', state: 'FL', country: 'USA', type: 'arena', capacity: 19250 },
  'American Airlines Center': { city: 'Dallas', state: 'TX', country: 'USA', type: 'arena', capacity: 19200 },
  'Ameris Bank Amphitheatre': { city: 'Alpharetta', state: 'GA', country: 'USA', type: 'amphitheater', capacity: 12000 },
  'Angel of the Winds Arena': { city: 'Everett', state: 'WA', country: 'USA', type: 'arena', capacity: 8100 },
  'Arizona Financial Theatre': { city: 'Phoenix', state: 'AZ', country: 'USA', type: 'theater', capacity: 5000 },
  'Atlanta Symphony Hall': { city: 'Atlanta', state: 'GA', country: 'USA', type: 'music-hall', capacity: 1800 },
  'Atrium Health Amphitheater': { city: 'Macon', state: 'GA', country: 'USA', type: 'amphitheater', capacity: 8000 },
  'Ball Arena': { city: 'Denver', state: 'CO', country: 'USA', type: 'arena', capacity: 19520 },
  'Barclays Center': { city: 'Brooklyn', state: 'NY', country: 'USA', type: 'arena', capacity: 17732 },
  'Bayou Music Center': { city: 'Houston', state: 'TX', country: 'USA', type: 'music-hall', capacity: 2400 },
  'Beacon Theatre': { city: 'New York', state: 'NY', country: 'USA', type: 'theater', capacity: 2894 },
  'Bellagio': { city: 'Las Vegas', state: 'NV', country: 'USA', type: 'casino', capacity: 1800 },
  'Bellco Theatre': { city: 'Denver', state: 'CO', country: 'USA', type: 'theater', capacity: 5000 },
  'Bobby Dodd Stadium': { city: 'Atlanta', state: 'GA', country: 'USA', type: 'stadium', capacity: 55000 },
  'Bourbon Theatre': { city: 'Lincoln', state: 'NE', country: 'USA', type: 'theater', capacity: 700 },
  'Broadmoor World Arena': { city: 'Colorado Springs', state: 'CO', country: 'USA', type: 'arena', capacity: 8000 },
  'Buell Theatre': { city: 'Denver', state: 'CO', country: 'USA', type: 'theater', capacity: 2830 },
  'CIBC Theatre': { city: 'Chicago', state: 'IL', country: 'USA', type: 'theater', capacity: 1800 },
  'Cadillac Palace Theatre': { city: 'Chicago', state: 'IL', country: 'USA', type: 'theater', capacity: 2300 },
  'Cellairis Amphitheatre': { city: 'Atlanta', state: 'GA', country: 'USA', type: 'amphitheater', capacity: 19000 },
  'Chase Center': { city: 'San Francisco', state: 'CA', country: 'USA', type: 'arena', capacity: 18064 },
  'Climate Pledge Arena': { city: 'Seattle', state: 'WA', country: 'USA', type: 'arena', capacity: 17100 },
  'Credit Union 1 Amphitheatre': { city: 'Tinley Park', state: 'IL', country: 'USA', type: 'amphitheater', capacity: 28000 },
  'Crypto.com Arena': { city: 'Los Angeles', state: 'CA', country: 'USA', type: 'arena', capacity: 19068 },
  'Cure Insurance Arena': { city: 'Trenton', state: 'NJ', country: 'USA', type: 'arena', capacity: 8600 },
  'Cynthia Woods Mitchell Pavilion': { city: 'The Woodlands', state: 'TX', country: 'USA', type: 'amphitheater', capacity: 16500 },
  'Desert Diamond Arena': { city: 'Glendale', state: 'AZ', country: 'USA', type: 'arena', capacity: 17000 },
  'Dickies Arena': { city: 'Fort Worth', state: 'TX', country: 'USA', type: 'arena', capacity: 14000 },
  'Dolby Live at Park MGM': { city: 'Las Vegas', state: 'NV', country: 'USA', type: 'theater', capacity: 5200 },
  'Dos Equis Pavilion': { city: 'Dallas', state: 'TX', country: 'USA', type: 'amphitheater', capacity: 20000 },
  'Dreyfoos Hall at Kravis Center': { city: 'West Palm Beach', state: 'FL', country: 'USA', type: 'music-hall', capacity: 2200 },
  'EchoPark Speedway': { city: 'Austin', state: 'TX', country: 'USA', type: 'stadium', capacity: 120000 },
  'Empower Field at Mile High': { city: 'Denver', state: 'CO', country: 'USA', type: 'stadium', capacity: 76125 },
  'Excalibur': { city: 'Las Vegas', state: 'NV', country: 'USA', type: 'casino', capacity: 1000 },
  'Fenway Park': { city: 'Boston', state: 'MA', country: 'USA', type: 'stadium', capacity: 37755 },
  'Fiddlers Green Amphitheatre': { city: 'Greenwood Village', state: 'CO', country: 'USA', type: 'amphitheater', capacity: 18000 },
  'Fillmore Auditorium Denver': { city: 'Denver', state: 'CO', country: 'USA', type: 'music-hall', capacity: 3700 },
  'Fontainebleau Las Vegas': { city: 'Las Vegas', state: 'NV', country: 'USA', type: 'casino', capacity: 3500 },
  'Forest Hills Stadium': { city: 'Queens', state: 'NY', country: 'USA', type: 'stadium', capacity: 13500 },
  'Fox Theatre': { city: 'Atlanta', state: 'GA', country: 'USA', type: 'theater', capacity: 4665 },
  'Freedom Mortgage Pavilion': { city: 'Camden', state: 'NJ', country: 'USA', type: 'amphitheater', capacity: 25000 },
  'Gas South Arena': { city: 'Duluth', state: 'GA', country: 'USA', type: 'arena', capacity: 13000 },
  'Gershwin Theatre': { city: 'New York', state: 'NY', country: 'USA', type: 'theater', capacity: 1933 },
  'Gillette Stadium': { city: 'Foxborough', state: 'MA', country: 'USA', type: 'stadium', capacity: 65878 },
  'Globe Life Field': { city: 'Arlington', state: 'TX', country: 'USA', type: 'stadium', capacity: 40300 },
  'Hard Rock Live': { city: 'Hollywood', state: 'FL', country: 'USA', type: 'arena', capacity: 7000 },
  'Hard Rock Stadium': { city: 'Miami Gardens', state: 'FL', country: 'USA', type: 'stadium', capacity: 65326 },
  'Heartland Events Center at the Nebraska State Fair': { city: 'Grand Island', state: 'NE', country: 'USA', type: 'arena', capacity: 8500 },
  'Hollywood Bowl': { city: 'Los Angeles', state: 'CA', country: 'USA', type: 'amphitheater', capacity: 17500 },
  'Hollywood Palladium': { city: 'Los Angeles', state: 'CA', country: 'USA', type: 'music-hall', capacity: 3700 },
  'House of Blues Dallas': { city: 'Dallas', state: 'TX', country: 'USA', type: 'music-hall', capacity: 2500 },
  'Imperial Theatre': { city: 'New York', state: 'NY', country: 'USA', type: 'theater', capacity: 1417 },
  'Intuit Dome': { city: 'Inglewood', state: 'CA', country: 'USA', type: 'arena', capacity: 18000 },
  'Jiffy Lube Live': { city: 'Bristow', state: 'VA', country: 'USA', type: 'amphitheater', capacity: 25000 },
  'Kaseya Center': { city: 'Miami', state: 'FL', country: 'USA', type: 'arena', capacity: 19600 },
  'Kia Forum': { city: 'Inglewood', state: 'CA', country: 'USA', type: 'arena', capacity: 17505 },
  'Las Vegas Motor Speedway': { city: 'Las Vegas', state: 'NV', country: 'USA', type: 'stadium', capacity: 80000 },
  'Leader Bank Pavilion': { city: 'Boston', state: 'MA', country: 'USA', type: 'amphitheater', capacity: 5000 },
  "Levi's Stadium": { city: 'Santa Clara', state: 'CA', country: 'USA', type: 'stadium', capacity: 68500 },
  'Lincoln Financial Field': { city: 'Philadelphia', state: 'PA', country: 'USA', type: 'stadium', capacity: 67594 },
  'Lumen Field': { city: 'Seattle', state: 'WA', country: 'USA', type: 'stadium', capacity: 68740 },
  'Lyric Theatre': { city: 'New York', state: 'NY', country: 'USA', type: 'theater', capacity: 1900 },
  'MGM Grand Garden Arena': { city: 'Las Vegas', state: 'NV', country: 'USA', type: 'arena', capacity: 17157 },
  'MGM Music Hall at Fenway': { city: 'Boston', state: 'MA', country: 'USA', type: 'music-hall', capacity: 5000 },
  'MSG Sphere': { city: 'Las Vegas', state: 'NV', country: 'USA', type: 'arena', capacity: 18600 },
  'Madison Square Garden': { city: 'New York', state: 'NY', country: 'USA', type: 'arena', capacity: 20789 },
  'Mandalay Bay': { city: 'Las Vegas', state: 'NV', country: 'USA', type: 'arena', capacity: 12000 },
  'Mercedes-Benz Stadium': { city: 'Atlanta', state: 'GA', country: 'USA', type: 'stadium', capacity: 71000 },
  'MetLife Stadium': { city: 'East Rutherford', state: 'NJ', country: 'USA', type: 'stadium', capacity: 82500 },
  'Michelob Ultra Arena': { city: 'Las Vegas', state: 'NV', country: 'USA', type: 'arena', capacity: 12000 },
  'Minskoff Theatre': { city: 'New York', state: 'NY', country: 'USA', type: 'theater', capacity: 1710 },
  'Mirage': { city: 'Las Vegas', state: 'NV', country: 'USA', type: 'casino', capacity: 1250 },
  'Mortgage Matchup Center': { city: 'Lincoln', state: 'NE', country: 'USA', type: 'arena', capacity: 4000 },
  'NRG Stadium': { city: 'Houston', state: 'TX', country: 'USA', type: 'stadium', capacity: 72220 },
  'Nebraska Memorial Stadium': { city: 'Lincoln', state: 'NE', country: 'USA', type: 'stadium', capacity: 86047 },
  'New Amsterdam Theatre': { city: 'New York', state: 'NY', country: 'USA', type: 'theater', capacity: 1747 },
  'New York-New York': { city: 'Las Vegas', state: 'NV', country: 'USA', type: 'casino', capacity: 1500 },
  'O2 Arena': { city: 'London', state: '', country: 'UK', type: 'arena', capacity: 20000 },
  'PNC Bank Arts Center': { city: 'Holmdel', state: 'NJ', country: 'USA', type: 'amphitheater', capacity: 17500 },
  'Pantages Theatre': { city: 'Los Angeles', state: 'CA', country: 'USA', type: 'theater', capacity: 2691 },
  'Paramount Theatre Seattle': { city: 'Seattle', state: 'WA', country: 'USA', type: 'theater', capacity: 2807 },
  'Park MGM': { city: 'Las Vegas', state: 'NV', country: 'USA', type: 'casino', capacity: 5200 },
  'Pinewood Bowl Theater': { city: 'Lincoln', state: 'NE', country: 'USA', type: 'amphitheater', capacity: 5200 },
  'Pinnacle Bank Arena': { city: 'Lincoln', state: 'NE', country: 'USA', type: 'arena', capacity: 15500 },
  'Prudential Center': { city: 'Newark', state: 'NJ', country: 'USA', type: 'arena', capacity: 16500 },
  'Radio City Music Hall': { city: 'New York', state: 'NY', country: 'USA', type: 'music-hall', capacity: 5960 },
  'Rio Las Vegas': { city: 'Las Vegas', state: 'NV', country: 'USA', type: 'casino', capacity: 1200 },
  'Roadrunner': { city: 'Boston', state: 'MA', country: 'USA', type: 'music-hall', capacity: 3500 },
  'Rosemont Theatre': { city: 'Rosemont', state: 'IL', country: 'USA', type: 'theater', capacity: 4400 },
  'Royal Albert Hall': { city: 'London', state: '', country: 'UK', type: 'music-hall', capacity: 5272 },
  'Santander Arena': { city: 'Reading', state: 'PA', country: 'USA', type: 'arena', capacity: 9000 },
  'ShoWare Center': { city: 'Kent', state: 'WA', country: 'USA', type: 'arena', capacity: 6500 },
  'Smart Financial Centre': { city: 'Sugar Land', state: 'TX', country: 'USA', type: 'theater', capacity: 6400 },
  'SoFi Stadium': { city: 'Inglewood', state: 'CA', country: 'USA', type: 'stadium', capacity: 70240 },
  'Soldier Field': { city: 'Chicago', state: 'IL', country: 'USA', type: 'stadium', capacity: 61500 },
  'iTHINK Financial Amphitheatre': { city: 'West Palm Beach', state: 'FL', country: 'USA', type: 'amphitheater', capacity: 20000 },
  'loanDepot Park': { city: 'Miami', state: 'FL', country: 'USA', type: 'stadium', capacity: 37000 },
};

// Generate venue ID from name
export function generateVenueId(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Get full venue data
export function getVenueData(name: string): VenueData | null {
  const metadata = venueMetadata[name];
  if (!metadata) return null;
  
  return {
    id: generateVenueId(name),
    name,
    ...metadata,
  };
}

// Get all venues as array
export function getAllVenues(): VenueData[] {
  return venueNames.map(name => getVenueData(name)!).filter(Boolean);
}

// Check if venue has a specific SVG map (not the general one)
export function hasVenueMap(venueName: string): boolean {
  return venueNames.includes(venueName as VenueName);
}

// Get SVG path for venue - returns general map if no specific map exists
export function getVenueSVGPath(venueName: string): string {
  if (hasVenueMap(venueName)) {
    return `/venue-maps/${venueName}.svg`;
  }
  return '/venue-maps/_general.svg';
}

// Get or create venue data for any venue name (including ones without specific maps)
export function getOrCreateVenueData(name: string, city?: string, state?: string): VenueData {
  // If we have metadata, use it
  const existing = venueMetadata[name];
  if (existing) {
    return {
      id: generateVenueId(name),
      name,
      ...existing,
    };
  }
  
  // Create generic venue data
  return {
    id: generateVenueId(name),
    name,
    city: city || 'Unknown',
    state: state || '',
    country: 'USA',
    type: 'arena',
    capacity: 10000,
  };
}
