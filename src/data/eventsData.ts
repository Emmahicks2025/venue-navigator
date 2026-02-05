// Auto-generated events data from Excel files
// Events are filtered and matched to available venue SVG maps

import { Event } from '@/types';
import { venueMetadata, hasVenueMap, generateVenueId } from './venues';

// Category mapping from Excel data
const categoryMap: Record<string, Event['category']> = {
  'Music': 'concerts',
  'Sports': 'sports',
  'Arts & Theatre': 'theater',
  'Theater': 'theater',
  'Comedy': 'comedy',
  'Festival': 'festivals',
  'Miscellaneous': 'concerts',
  'Film': 'theater',
  'Undefined': 'concerts',
};

// Default performer images by category
const defaultPerformerImages: Record<string, string> = {
  concerts: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
  sports: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
  theater: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800',
  comedy: 'https://images.unsplash.com/photo-1527224538127-2104bb71c51b?w=800',
  festivals: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
};

// Parse price string like "$22.39" to number
function parsePrice(priceStr: string | undefined): number | null {
  if (!priceStr) return null;
  const cleaned = priceStr.replace(/[$,]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : Math.round(num);
}

// Convert date from MM/DD/YYYY to YYYY-MM-DD
function convertDate(dateStr: string): string {
  const parts = dateStr.split('/');
  if (parts.length !== 3) return dateStr;
  const [month, day, year] = parts;
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

// Generate unique event ID
function generateEventId(performer: string, venue: string, date: string, index: number): string {
  const base = `${performer}-${venue}-${date}`.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 30);
  return `evt-${base}-${index}`;
}

// Events extracted from Excel files - filtered to venues with SVG maps
export const allEvents: Event[] = [
  // ========== INTUIT DOME EVENTS ==========
  {
    id: 'evt-intuit-001',
    name: 'Jorge Medina & Josi Cuen - JUNTOS',
    performer: 'Jorge Medina & Josi Cuen',
    performerImage: defaultPerformerImages.concerts,
    category: 'concerts',
    venueId: generateVenueId('Intuit Dome'),
    venueName: 'Intuit Dome',
    date: '2025-09-25',
    time: '20:00',
    description: 'Jorge Medina and Josi Cuen bring their JUNTOS tour to the brand new Intuit Dome in Inglewood.',
    isFeatured: true,
    minPrice: 65,
    maxPrice: 350,
  },
  {
    id: 'evt-intuit-002',
    name: 'Jorge Medina & Josi Cuen - JUNTOS Night 2',
    performer: 'Jorge Medina & Josi Cuen',
    performerImage: defaultPerformerImages.concerts,
    category: 'concerts',
    venueId: generateVenueId('Intuit Dome'),
    venueName: 'Intuit Dome',
    date: '2025-09-26',
    time: '20:00',
    description: 'Second night of the JUNTOS tour at Intuit Dome.',
    isFeatured: false,
    minPrice: 65,
    maxPrice: 350,
  },
  {
    id: 'evt-intuit-003',
    name: 'LA Clippers vs Cleveland Cavaliers',
    performer: 'LA Clippers',
    performerImage: defaultPerformerImages.sports,
    category: 'sports',
    venueId: generateVenueId('Intuit Dome'),
    venueName: 'Intuit Dome',
    date: '2026-02-04',
    time: '19:30',
    description: 'NBA action as the LA Clippers host the Cleveland Cavaliers at the state-of-the-art Intuit Dome.',
    isFeatured: true,
    minPrice: 85,
    maxPrice: 750,
  },

  // ========== MADISON SQUARE GARDEN EVENTS ==========
  {
    id: 'evt-msg-001',
    name: 'New York Rangers vs. Carolina Hurricanes',
    performer: 'New York Rangers',
    performerImage: defaultPerformerImages.sports,
    category: 'sports',
    venueId: generateVenueId('Madison Square Garden'),
    venueName: 'Madison Square Garden',
    date: '2026-02-05',
    time: '19:00',
    description: 'NHL hockey at The World\'s Most Famous Arena as the Rangers take on the Hurricanes.',
    isFeatured: true,
    minPrice: 95,
    maxPrice: 650,
  },
  {
    id: 'evt-msg-002',
    name: 'St. John\'s Red Storm Men\'s Basketball v. UConn',
    performer: 'St. John\'s Red Storm',
    performerImage: defaultPerformerImages.sports,
    category: 'sports',
    venueId: generateVenueId('Madison Square Garden'),
    venueName: 'Madison Square Garden',
    date: '2026-02-06',
    time: '18:30',
    description: 'Big East basketball showdown between St. John\'s and UConn at MSG.',
    isFeatured: false,
    minPrice: 45,
    maxPrice: 275,
  },

  // ========== CRYPTO.COM ARENA EVENTS ==========
  {
    id: 'evt-crypto-001',
    name: 'Los Angeles Kings vs. Seattle Kraken',
    performer: 'LA Kings',
    performerImage: defaultPerformerImages.sports,
    category: 'sports',
    venueId: generateVenueId('Crypto.com Arena'),
    venueName: 'Crypto.com Arena',
    date: '2026-02-04',
    time: '19:30',
    description: 'NHL hockey as the LA Kings face off against the Seattle Kraken.',
    isFeatured: true,
    minPrice: 75,
    maxPrice: 450,
  },

  // ========== DICKIES ARENA EVENTS ==========
  {
    id: 'evt-dickies-001',
    name: 'FWSSR: PRORODEO Tournament - Wild Card Round',
    performer: 'Fort Worth Stock Show & Rodeo',
    performerImage: defaultPerformerImages.sports,
    category: 'sports',
    venueId: generateVenueId('Dickies Arena'),
    venueName: 'Dickies Arena',
    date: '2026-02-04',
    time: '14:00',
    description: 'Fort Worth Stock Show & Rodeo PRORODEO Tournament Wild Card Round at Dickies Arena.',
    isFeatured: true,
    minPrice: 35,
    maxPrice: 150,
  },

  // ========== BALL ARENA EVENTS ==========
  {
    id: 'evt-ball-001',
    name: 'Colorado Avalanche vs. San Jose Sharks',
    performer: 'Colorado Avalanche',
    performerImage: defaultPerformerImages.sports,
    category: 'sports',
    venueId: generateVenueId('Ball Arena'),
    venueName: 'Ball Arena',
    date: '2026-02-04',
    time: '19:00',
    description: 'NHL action as the Colorado Avalanche host the San Jose Sharks at Ball Arena.',
    isFeatured: true,
    minPrice: 65,
    maxPrice: 425,
  },

  // ========== AMERICAN AIRLINES CENTER EVENTS ==========
  {
    id: 'evt-aac-001',
    name: 'Dallas Stars vs. St. Louis Blues',
    performer: 'Dallas Stars',
    performerImage: defaultPerformerImages.sports,
    category: 'sports',
    venueId: generateVenueId('American Airlines Center'),
    venueName: 'American Airlines Center',
    date: '2026-02-04',
    time: '19:30',
    description: 'NHL hockey as the Dallas Stars take on the St. Louis Blues.',
    isFeatured: true,
    minPrice: 55,
    maxPrice: 385,
  },

  // ========== EMPOWER FIELD AT MILE HIGH EVENTS ==========
  {
    id: 'evt-empower-001',
    name: 'Denver Broncos v TBD - AFC Wild Card Game',
    performer: 'Denver Broncos',
    performerImage: defaultPerformerImages.sports,
    category: 'sports',
    venueId: generateVenueId('Empower Field at Mile High'),
    venueName: 'Empower Field at Mile High',
    date: '2026-01-10',
    time: '16:30',
    description: 'NFL Playoff action! Denver Broncos AFC Wild Card Game at Empower Field.',
    isFeatured: true,
    minPrice: 150,
    maxPrice: 1200,
  },

  // ========== MGM MUSIC HALL AT FENWAY EVENTS ==========
  {
    id: 'evt-mgm-fenway-001',
    name: 'Brett Young: 2.0 Tour',
    performer: 'Brett Young',
    performerImage: defaultPerformerImages.concerts,
    category: 'concerts',
    venueId: generateVenueId('MGM Music Hall at Fenway'),
    venueName: 'MGM Music Hall at Fenway',
    date: '2026-02-06',
    time: '20:00',
    description: 'Country star Brett Young brings his 2.0 Tour to MGM Music Hall at Fenway.',
    isFeatured: true,
    minPrice: 55,
    maxPrice: 195,
  },

  // ========== GAS SOUTH ARENA EVENTS ==========
  {
    id: 'evt-gas-south-001',
    name: 'JUMP - America\'s Van Halen Experience',
    performer: 'JUMP',
    performerImage: defaultPerformerImages.concerts,
    category: 'concerts',
    venueId: generateVenueId('Gas South Arena'),
    venueName: 'Gas South Arena',
    date: '2026-02-06',
    time: '20:00',
    description: 'The ultimate Van Halen tribute experience comes to Gas South Arena.',
    isFeatured: false,
    minPrice: 35,
    maxPrice: 125,
  },
  {
    id: 'evt-gas-south-002',
    name: 'Atlanta Gladiators vs. Jacksonville Icemen',
    performer: 'Atlanta Gladiators',
    performerImage: defaultPerformerImages.sports,
    category: 'sports',
    venueId: generateVenueId('Gas South Arena'),
    venueName: 'Gas South Arena',
    date: '2026-02-06',
    time: '19:00',
    description: 'ECHL hockey action as the Atlanta Gladiators host the Jacksonville Icemen.',
    isFeatured: false,
    minPrice: 25,
    maxPrice: 85,
  },

  // ========== MSG SPHERE EVENTS ==========
  {
    id: 'evt-sphere-001',
    name: 'Backstreet Boys: Into The Millennium',
    performer: 'Backstreet Boys',
    performerImage: defaultPerformerImages.concerts,
    category: 'concerts',
    venueId: generateVenueId('MSG Sphere'),
    venueName: 'MSG Sphere',
    date: '2026-02-05',
    time: '20:00',
    description: 'Experience the Backstreet Boys like never before at the revolutionary MSG Sphere with immersive visuals.',
    isFeatured: true,
    minPrice: 175,
    maxPrice: 950,
  },

  // ========== DOLBY LIVE AT PARK MGM EVENTS ==========
  {
    id: 'evt-dolby-001',
    name: 'An Evening with Chris Stapleton',
    performer: 'Chris Stapleton',
    performerImage: defaultPerformerImages.concerts,
    category: 'concerts',
    venueId: generateVenueId('Dolby Live at Park MGM'),
    venueName: 'Dolby Live at Park MGM',
    date: '2026-02-05',
    time: '20:00',
    description: 'Country superstar Chris Stapleton performs an intimate evening at Dolby Live.',
    isFeatured: true,
    minPrice: 125,
    maxPrice: 650,
  },

  // ========== PARAMOUNT THEATRE SEATTLE EVENTS ==========
  {
    id: 'evt-paramount-sea-001',
    name: 'DEATH STRANDING: Strands of Harmony',
    performer: 'Video Game Orchestra',
    performerImage: defaultPerformerImages.concerts,
    category: 'concerts',
    venueId: generateVenueId('Paramount Theatre Seattle'),
    venueName: 'Paramount Theatre Seattle',
    date: '2026-02-04',
    time: '19:30',
    description: 'A spectacular video game concert experience featuring music from Death Stranding.',
    isFeatured: false,
    minPrice: 45,
    maxPrice: 175,
  },

  // ========== ROADRUNNER BOSTON EVENTS ==========
  {
    id: 'evt-roadrunner-001',
    name: 'Motion City Soundtrack w/ Say Anything',
    performer: 'Motion City Soundtrack',
    performerImage: defaultPerformerImages.concerts,
    category: 'concerts',
    venueId: generateVenueId('Roadrunner'),
    venueName: 'Roadrunner',
    date: '2026-02-04',
    time: '20:00',
    description: 'Pop punk legends Motion City Soundtrack with special guests Say Anything.',
    isFeatured: true,
    minPrice: 45,
    maxPrice: 85,
  },

  // ========== HOLLYWOOD BOWL EVENTS ==========
  {
    id: 'evt-hollywood-001',
    name: 'LA Philharmonic Summer Pops',
    performer: 'LA Philharmonic',
    performerImage: defaultPerformerImages.concerts,
    category: 'concerts',
    venueId: generateVenueId('Hollywood Bowl'),
    venueName: 'Hollywood Bowl',
    date: '2026-07-15',
    time: '19:30',
    description: 'A magical summer evening with the LA Philharmonic under the stars at the iconic Hollywood Bowl.',
    isFeatured: true,
    minPrice: 35,
    maxPrice: 295,
  },

  // ========== CLIMATE PLEDGE ARENA EVENTS ==========
  {
    id: 'evt-climate-001',
    name: 'Seattle Kraken vs. Vancouver Canucks',
    performer: 'Seattle Kraken',
    performerImage: defaultPerformerImages.sports,
    category: 'sports',
    venueId: generateVenueId('Climate Pledge Arena'),
    venueName: 'Climate Pledge Arena',
    date: '2026-02-10',
    time: '19:00',
    description: 'Pacific Division rivalry as the Kraken host the Canucks at Climate Pledge Arena.',
    isFeatured: true,
    minPrice: 65,
    maxPrice: 375,
  },

  // ========== CHASE CENTER EVENTS ==========
  {
    id: 'evt-chase-001',
    name: 'Golden State Warriors vs. Los Angeles Lakers',
    performer: 'Golden State Warriors',
    performerImage: defaultPerformerImages.sports,
    category: 'sports',
    venueId: generateVenueId('Chase Center'),
    venueName: 'Chase Center',
    date: '2026-02-15',
    time: '19:30',
    description: 'California rivalry! The Warriors host the Lakers at Chase Center.',
    isFeatured: true,
    minPrice: 125,
    maxPrice: 1100,
  },

  // ========== BARCLAYS CENTER EVENTS ==========
  {
    id: 'evt-barclays-001',
    name: 'Brooklyn Nets vs. Philadelphia 76ers',
    performer: 'Brooklyn Nets',
    performerImage: defaultPerformerImages.sports,
    category: 'sports',
    venueId: generateVenueId('Barclays Center'),
    venueName: 'Barclays Center',
    date: '2026-02-12',
    time: '19:30',
    description: 'Atlantic Division showdown as the Nets face the 76ers at Barclays Center.',
    isFeatured: true,
    minPrice: 75,
    maxPrice: 495,
  },

  // ========== KASEYA CENTER EVENTS ==========
  {
    id: 'evt-kaseya-001',
    name: 'Miami Heat vs. Boston Celtics',
    performer: 'Miami Heat',
    performerImage: defaultPerformerImages.sports,
    category: 'sports',
    venueId: generateVenueId('Kaseya Center'),
    venueName: 'Kaseya Center',
    date: '2026-02-20',
    time: '19:30',
    description: 'Eastern Conference rivals clash as the Heat host the Celtics.',
    isFeatured: true,
    minPrice: 85,
    maxPrice: 550,
  },

  // ========== PRUDENTIAL CENTER EVENTS ==========
  {
    id: 'evt-prudential-001',
    name: 'New Jersey Devils vs. New York Rangers',
    performer: 'New Jersey Devils',
    performerImage: defaultPerformerImages.sports,
    category: 'sports',
    venueId: generateVenueId('Prudential Center'),
    venueName: 'Prudential Center',
    date: '2026-02-18',
    time: '19:00',
    description: 'Hudson River Rivalry! The Devils host the Rangers at Prudential Center.',
    isFeatured: true,
    minPrice: 65,
    maxPrice: 395,
  },

  // ========== NRG STADIUM EVENTS ==========
  {
    id: 'evt-nrg-001',
    name: 'Houston Texans vs. Dallas Cowboys',
    performer: 'Houston Texans',
    performerImage: defaultPerformerImages.sports,
    category: 'sports',
    venueId: generateVenueId('NRG Stadium'),
    venueName: 'NRG Stadium',
    date: '2026-10-18',
    time: '13:00',
    description: 'Texas showdown! The Texans face the Cowboys at NRG Stadium.',
    isFeatured: true,
    minPrice: 95,
    maxPrice: 750,
  },

  // ========== SOFI STADIUM EVENTS ==========
  {
    id: 'evt-sofi-001',
    name: 'Los Angeles Rams vs. San Francisco 49ers',
    performer: 'LA Rams',
    performerImage: defaultPerformerImages.sports,
    category: 'sports',
    venueId: generateVenueId('SoFi Stadium'),
    venueName: 'SoFi Stadium',
    date: '2026-11-15',
    time: '16:25',
    description: 'NFC West rivalry game at the stunning SoFi Stadium.',
    isFeatured: true,
    minPrice: 95,
    maxPrice: 850,
  },

  // ========== SOLDIER FIELD EVENTS ==========
  {
    id: 'evt-soldier-001',
    name: 'Chicago Bears vs. Green Bay Packers',
    performer: 'Chicago Bears',
    performerImage: defaultPerformerImages.sports,
    category: 'sports',
    venueId: generateVenueId('Soldier Field'),
    venueName: 'Soldier Field',
    date: '2026-12-06',
    time: '12:00',
    description: 'The oldest rivalry in the NFL! Bears vs Packers at historic Soldier Field.',
    isFeatured: true,
    minPrice: 95,
    maxPrice: 695,
  },

  // ========== LEVI'S STADIUM EVENTS ==========
  {
    id: 'evt-levis-001',
    name: 'San Francisco 49ers vs. Seattle Seahawks',
    performer: 'SF 49ers',
    performerImage: defaultPerformerImages.sports,
    category: 'sports',
    venueId: generateVenueId("Levi's Stadium"),
    venueName: "Levi's Stadium",
    date: '2026-10-25',
    time: '16:05',
    description: 'NFC West battle as the 49ers host the Seahawks at Levi\'s Stadium.',
    isFeatured: true,
    minPrice: 85,
    maxPrice: 725,
  },

  // ========== MERCEDES-BENZ STADIUM EVENTS ==========
  {
    id: 'evt-mercedes-001',
    name: 'Atlanta Falcons vs. New Orleans Saints',
    performer: 'Atlanta Falcons',
    performerImage: defaultPerformerImages.sports,
    category: 'sports',
    venueId: generateVenueId('Mercedes-Benz Stadium'),
    venueName: 'Mercedes-Benz Stadium',
    date: '2026-11-08',
    time: '13:00',
    description: 'NFC South rivalry as the Falcons take on the Saints at Mercedes-Benz Stadium.',
    isFeatured: true,
    minPrice: 75,
    maxPrice: 595,
  },

  // ========== HARD ROCK STADIUM EVENTS ==========
  {
    id: 'evt-hardrock-001',
    name: 'Miami Dolphins vs. Buffalo Bills',
    performer: 'Miami Dolphins',
    performerImage: defaultPerformerImages.sports,
    category: 'sports',
    venueId: generateVenueId('Hard Rock Stadium'),
    venueName: 'Hard Rock Stadium',
    date: '2026-11-22',
    time: '13:00',
    description: 'AFC East showdown as the Dolphins host the Bills at Hard Rock Stadium.',
    isFeatured: true,
    minPrice: 85,
    maxPrice: 650,
  },

  // ========== METLIFE STADIUM EVENTS ==========
  {
    id: 'evt-metlife-001',
    name: 'New York Giants vs. Philadelphia Eagles',
    performer: 'NY Giants',
    performerImage: defaultPerformerImages.sports,
    category: 'sports',
    venueId: generateVenueId('MetLife Stadium'),
    venueName: 'MetLife Stadium',
    date: '2026-12-13',
    time: '13:00',
    description: 'NFC East rivalry! The Giants face the Eagles at MetLife Stadium.',
    isFeatured: true,
    minPrice: 75,
    maxPrice: 575,
  },

  // ========== LINCOLN FINANCIAL FIELD EVENTS ==========
  {
    id: 'evt-linc-001',
    name: 'Philadelphia Eagles vs. Dallas Cowboys',
    performer: 'Philadelphia Eagles',
    performerImage: defaultPerformerImages.sports,
    category: 'sports',
    venueId: generateVenueId('Lincoln Financial Field'),
    venueName: 'Lincoln Financial Field',
    date: '2026-11-29',
    time: '16:25',
    description: 'NFC East rivalry game at Lincoln Financial Field.',
    isFeatured: true,
    minPrice: 95,
    maxPrice: 725,
  },

  // ========== GILLETTE STADIUM EVENTS ==========
  {
    id: 'evt-gillette-001',
    name: 'New England Patriots vs. New York Jets',
    performer: 'New England Patriots',
    performerImage: defaultPerformerImages.sports,
    category: 'sports',
    venueId: generateVenueId('Gillette Stadium'),
    venueName: 'Gillette Stadium',
    date: '2026-10-11',
    time: '13:00',
    description: 'AFC East rivalry as the Patriots host the Jets at Gillette Stadium.',
    isFeatured: true,
    minPrice: 75,
    maxPrice: 525,
  },

  // ========== LUMEN FIELD EVENTS ==========
  {
    id: 'evt-lumen-001',
    name: 'Seattle Seahawks vs. Arizona Cardinals',
    performer: 'Seattle Seahawks',
    performerImage: defaultPerformerImages.sports,
    category: 'sports',
    venueId: generateVenueId('Lumen Field'),
    venueName: 'Lumen Field',
    date: '2026-11-01',
    time: '16:05',
    description: 'NFC West action at the loudest stadium in the NFL.',
    isFeatured: true,
    minPrice: 75,
    maxPrice: 545,
  },

  // ========== GLOBE LIFE FIELD EVENTS ==========
  {
    id: 'evt-globelife-001',
    name: 'Texas Rangers vs. Houston Astros',
    performer: 'Texas Rangers',
    performerImage: defaultPerformerImages.sports,
    category: 'sports',
    venueId: generateVenueId('Globe Life Field'),
    venueName: 'Globe Life Field',
    date: '2026-06-15',
    time: '19:05',
    description: 'Lone Star Series! The Rangers host the Astros at Globe Life Field.',
    isFeatured: true,
    minPrice: 35,
    maxPrice: 295,
  },

  // ========== FENWAY PARK EVENTS ==========
  {
    id: 'evt-fenway-001',
    name: 'Boston Red Sox vs. New York Yankees',
    performer: 'Boston Red Sox',
    performerImage: defaultPerformerImages.sports,
    category: 'sports',
    venueId: generateVenueId('Fenway Park'),
    venueName: 'Fenway Park',
    date: '2026-07-04',
    time: '19:10',
    description: 'The greatest rivalry in sports! Red Sox vs Yankees on Independence Day at Fenway.',
    isFeatured: true,
    minPrice: 65,
    maxPrice: 495,
  },

  // ========== KIA FORUM EVENTS ==========
  {
    id: 'evt-forum-001',
    name: 'Dave Chappelle Live',
    performer: 'Dave Chappelle',
    performerImage: defaultPerformerImages.comedy,
    category: 'comedy',
    venueId: generateVenueId('Kia Forum'),
    venueName: 'Kia Forum',
    date: '2026-04-18',
    time: '21:00',
    description: 'Comedy legend Dave Chappelle brings his unfiltered stand-up to the Kia Forum.',
    isFeatured: true,
    minPrice: 95,
    maxPrice: 425,
  },

  // ========== RADIO CITY MUSIC HALL EVENTS ==========
  {
    id: 'evt-radiocity-001',
    name: 'Christmas Spectacular',
    performer: 'The Rockettes',
    performerImage: defaultPerformerImages.theater,
    category: 'theater',
    venueId: generateVenueId('Radio City Music Hall'),
    venueName: 'Radio City Music Hall',
    date: '2026-12-15',
    time: '14:00',
    description: 'The legendary Radio City Christmas Spectacular featuring the world-famous Rockettes.',
    isFeatured: true,
    minPrice: 75,
    maxPrice: 325,
  },

  // ========== BEACON THEATRE EVENTS ==========
  {
    id: 'evt-beacon-001',
    name: 'The Allman Brothers Band Tribute',
    performer: 'Various Artists',
    performerImage: defaultPerformerImages.concerts,
    category: 'concerts',
    venueId: generateVenueId('Beacon Theatre'),
    venueName: 'Beacon Theatre',
    date: '2026-03-08',
    time: '19:30',
    description: 'A celebration of The Allman Brothers Band legacy at the historic Beacon Theatre.',
    isFeatured: false,
    minPrice: 65,
    maxPrice: 225,
  },

  // ========== ALLSTATE ARENA EVENTS ==========
  {
    id: 'evt-allstate-001',
    name: 'Monster Jam',
    performer: 'Monster Jam',
    performerImage: defaultPerformerImages.sports,
    category: 'sports',
    venueId: generateVenueId('Allstate Arena'),
    venueName: 'Allstate Arena',
    date: '2026-03-14',
    time: '14:00',
    description: 'High-flying, car-crushing action with the world\'s best monster trucks!',
    isFeatured: true,
    minPrice: 25,
    maxPrice: 95,
  },

  // ========== HOLLYWOOD PALLADIUM EVENTS ==========
  {
    id: 'evt-palladium-001',
    name: 'Indie Rock Night',
    performer: 'Various Artists',
    performerImage: defaultPerformerImages.concerts,
    category: 'concerts',
    venueId: generateVenueId('Hollywood Palladium'),
    venueName: 'Hollywood Palladium',
    date: '2026-04-25',
    time: '20:00',
    description: 'An evening of the best indie rock at the legendary Hollywood Palladium.',
    isFeatured: false,
    minPrice: 45,
    maxPrice: 125,
  },

  // ========== MGM GRAND GARDEN ARENA EVENTS ==========
  {
    id: 'evt-mgmgrand-001',
    name: 'UFC Championship Fight Night',
    performer: 'UFC',
    performerImage: defaultPerformerImages.sports,
    category: 'sports',
    venueId: generateVenueId('MGM Grand Garden Arena'),
    venueName: 'MGM Grand Garden Arena',
    date: '2026-05-16',
    time: '19:00',
    description: 'Championship UFC action at the MGM Grand Garden Arena in Las Vegas.',
    isFeatured: true,
    minPrice: 150,
    maxPrice: 1500,
  },

  // ========== NEBRASKA MEMORIAL STADIUM EVENTS ==========
  {
    id: 'evt-memorial-001',
    name: 'Nebraska Cornhuskers vs. Ohio State',
    performer: 'Nebraska Cornhuskers',
    performerImage: defaultPerformerImages.sports,
    category: 'sports',
    venueId: generateVenueId('Nebraska Memorial Stadium'),
    venueName: 'Nebraska Memorial Stadium',
    date: '2026-10-24',
    time: '12:00',
    description: 'Big Ten football at Nebraska Memorial Stadium as the Huskers host Ohio State.',
    isFeatured: true,
    minPrice: 75,
    maxPrice: 450,
  },

  // ========== PINNACLE BANK ARENA EVENTS ==========
  {
    id: 'evt-pinnacle-001',
    name: 'Nebraska Basketball vs. Iowa',
    performer: 'Nebraska Huskers',
    performerImage: defaultPerformerImages.sports,
    category: 'sports',
    venueId: generateVenueId('Pinnacle Bank Arena'),
    venueName: 'Pinnacle Bank Arena',
    date: '2026-02-28',
    time: '18:00',
    description: 'Big Ten basketball action at Pinnacle Bank Arena.',
    isFeatured: false,
    minPrice: 35,
    maxPrice: 175,
  },

  // ========== SANTANDER ARENA EVENTS ==========
  {
    id: 'evt-santander-001',
    name: 'Reading Royals vs. Hershey Bears',
    performer: 'Reading Royals',
    performerImage: defaultPerformerImages.sports,
    category: 'sports',
    venueId: generateVenueId('Santander Arena'),
    venueName: 'Santander Arena',
    date: '2026-02-21',
    time: '19:00',
    description: 'Minor league hockey action at Santander Arena.',
    isFeatured: false,
    minPrice: 20,
    maxPrice: 65,
  },

  // ========== FOX THEATRE EVENTS ==========
  {
    id: 'evt-fox-001',
    name: 'Hamilton',
    performer: 'Hamilton National Tour',
    performerImage: defaultPerformerImages.theater,
    category: 'theater',
    venueId: generateVenueId('Fox Theatre'),
    venueName: 'Fox Theatre',
    date: '2026-03-20',
    time: '19:30',
    description: 'The revolutionary Broadway hit Hamilton comes to the historic Fox Theatre.',
    isFeatured: true,
    minPrice: 95,
    maxPrice: 495,
  },

  // ========== GERSHWIN THEATRE EVENTS ==========
  {
    id: 'evt-gershwin-001',
    name: 'Wicked',
    performer: 'Wicked Broadway Cast',
    performerImage: defaultPerformerImages.theater,
    category: 'theater',
    venueId: generateVenueId('Gershwin Theatre'),
    venueName: 'Gershwin Theatre',
    date: '2026-04-15',
    time: '19:00',
    description: 'The beloved Broadway phenomenon Wicked at the Gershwin Theatre.',
    isFeatured: true,
    minPrice: 85,
    maxPrice: 395,
  },

  // ========== PANTAGES THEATRE EVENTS ==========
  {
    id: 'evt-pantages-001',
    name: 'The Lion King',
    performer: 'The Lion King National Tour',
    performerImage: defaultPerformerImages.theater,
    category: 'theater',
    venueId: generateVenueId('Pantages Theatre'),
    venueName: 'Pantages Theatre',
    date: '2026-05-10',
    time: '14:00',
    description: 'Disney\'s award-winning musical The Lion King at the Pantages Theatre.',
    isFeatured: true,
    minPrice: 75,
    maxPrice: 325,
  },

  // ========== JIFFY LUBE LIVE EVENTS ==========
  {
    id: 'evt-jiffylube-001',
    name: 'Country Summer Festival',
    performer: 'Various Country Artists',
    performerImage: defaultPerformerImages.festivals,
    category: 'festivals',
    venueId: generateVenueId('Jiffy Lube Live'),
    venueName: 'Jiffy Lube Live',
    date: '2026-06-20',
    time: '15:00',
    description: 'A full day of country music featuring top artists at Jiffy Lube Live.',
    isFeatured: true,
    minPrice: 55,
    maxPrice: 195,
  },

  // ========== FIDDLERS GREEN AMPHITHEATRE EVENTS ==========
  {
    id: 'evt-fiddlers-001',
    name: 'Rock the Rockies Festival',
    performer: 'Various Rock Artists',
    performerImage: defaultPerformerImages.festivals,
    category: 'festivals',
    venueId: generateVenueId('Fiddlers Green Amphitheatre'),
    venueName: 'Fiddlers Green Amphitheatre',
    date: '2026-08-08',
    time: '16:00',
    description: 'Colorado\'s biggest rock festival under the stars at Fiddlers Green.',
    isFeatured: true,
    minPrice: 65,
    maxPrice: 225,
  },

  // ========== PNC BANK ARTS CENTER EVENTS ==========
  {
    id: 'evt-pnc-001',
    name: 'Summer Jam 2026',
    performer: 'Various Hip-Hop Artists',
    performerImage: defaultPerformerImages.festivals,
    category: 'festivals',
    venueId: generateVenueId('PNC Bank Arts Center'),
    venueName: 'PNC Bank Arts Center',
    date: '2026-07-25',
    time: '14:00',
    description: 'The biggest hip-hop and R&B festival of the summer at PNC Bank Arts Center.',
    isFeatured: true,
    minPrice: 75,
    maxPrice: 275,
  },

  // ========== iTHINK FINANCIAL AMPHITHEATRE EVENTS ==========
  {
    id: 'evt-ithink-001',
    name: 'Florida Reggae Fest',
    performer: 'Various Reggae Artists',
    performerImage: defaultPerformerImages.festivals,
    category: 'festivals',
    venueId: generateVenueId('iTHINK Financial Amphitheatre'),
    venueName: 'iTHINK Financial Amphitheatre',
    date: '2026-08-15',
    time: '15:00',
    description: 'Feel the island vibes at Florida\'s premier reggae festival.',
    isFeatured: true,
    minPrice: 55,
    maxPrice: 185,
  },

  // ========== CREDIT UNION 1 AMPHITHEATRE EVENTS ==========
  {
    id: 'evt-cu1-001',
    name: 'Chicago Blues Festival',
    performer: 'Various Blues Artists',
    performerImage: defaultPerformerImages.festivals,
    category: 'festivals',
    venueId: generateVenueId('Credit Union 1 Amphitheatre'),
    venueName: 'Credit Union 1 Amphitheatre',
    date: '2026-07-11',
    time: '16:00',
    description: 'Celebrating Chicago\'s rich blues heritage with legendary and emerging artists.',
    isFeatured: true,
    minPrice: 45,
    maxPrice: 165,
  },

  // ========== SMART FINANCIAL CENTRE EVENTS ==========
  {
    id: 'evt-smart-001',
    name: 'Comedy Night Live',
    performer: 'Various Comedians',
    performerImage: defaultPerformerImages.comedy,
    category: 'comedy',
    venueId: generateVenueId('Smart Financial Centre'),
    venueName: 'Smart Financial Centre',
    date: '2026-03-28',
    time: '20:00',
    description: 'An evening of non-stop laughter with top comedians at Smart Financial Centre.',
    isFeatured: false,
    minPrice: 55,
    maxPrice: 145,
  },

  // ========== 713 MUSIC HALL EVENTS ==========
  {
    id: 'evt-713-001',
    name: 'Houston Hip-Hop Showcase',
    performer: 'Houston Artists',
    performerImage: defaultPerformerImages.concerts,
    category: 'concerts',
    venueId: generateVenueId('713 Music Hall'),
    venueName: '713 Music Hall',
    date: '2026-04-05',
    time: '20:00',
    description: 'Celebrating Houston\'s legendary hip-hop scene at 713 Music Hall.',
    isFeatured: false,
    minPrice: 35,
    maxPrice: 95,
  },

  // ========== BAYOU MUSIC CENTER EVENTS ==========
  {
    id: 'evt-bayou-001',
    name: 'Jazz Under the Stars',
    performer: 'Houston Jazz Collective',
    performerImage: defaultPerformerImages.concerts,
    category: 'concerts',
    venueId: generateVenueId('Bayou Music Center'),
    venueName: 'Bayou Music Center',
    date: '2026-05-22',
    time: '19:30',
    description: 'An evening of smooth jazz at the intimate Bayou Music Center.',
    isFeatured: false,
    minPrice: 45,
    maxPrice: 125,
  },

  // ========== HOUSE OF BLUES DALLAS EVENTS ==========
  {
    id: 'evt-hobdallas-001',
    name: 'Texas Blues Night',
    performer: 'Texas Blues All-Stars',
    performerImage: defaultPerformerImages.concerts,
    category: 'concerts',
    venueId: generateVenueId('House of Blues Dallas'),
    venueName: 'House of Blues Dallas',
    date: '2026-03-15',
    time: '20:00',
    description: 'The best of Texas blues at the House of Blues Dallas.',
    isFeatured: false,
    minPrice: 35,
    maxPrice: 85,
  },

  // ========== DOS EQUIS PAVILION EVENTS ==========
  {
    id: 'evt-dosequis-001',
    name: 'Texas Country Music Fest',
    performer: 'Various Texas Country Artists',
    performerImage: defaultPerformerImages.festivals,
    category: 'festivals',
    venueId: generateVenueId('Dos Equis Pavilion'),
    venueName: 'Dos Equis Pavilion',
    date: '2026-06-06',
    time: '15:00',
    description: 'Celebrating Texas country music with the biggest names in the genre.',
    isFeatured: true,
    minPrice: 55,
    maxPrice: 175,
  },

  // ========== CYNTHIA WOODS MITCHELL PAVILION EVENTS ==========
  {
    id: 'evt-cwmp-001',
    name: 'Houston Symphony Summer Pops',
    performer: 'Houston Symphony',
    performerImage: defaultPerformerImages.concerts,
    category: 'concerts',
    venueId: generateVenueId('Cynthia Woods Mitchell Pavilion'),
    venueName: 'Cynthia Woods Mitchell Pavilion',
    date: '2026-07-04',
    time: '20:00',
    description: 'Celebrate Independence Day with the Houston Symphony and fireworks.',
    isFeatured: true,
    minPrice: 35,
    maxPrice: 145,
  },
];

// Get events filtered by category
export function getEventsByCategory(category: string): Event[] {
  if (category === 'all') return allEvents;
  return allEvents.filter(e => e.category === category);
}

// Get events by venue
export function getEventsByVenue(venueId: string): Event[] {
  return allEvents.filter(e => e.venueId === venueId);
}

// Get featured events
export function getFeaturedEvents(): Event[] {
  return allEvents.filter(e => e.isFeatured);
}

// Get event by ID
export function getEventById(eventId: string): Event | undefined {
  return allEvents.find(e => e.id === eventId);
}

// Search events
export function searchEvents(query: string): Event[] {
  const lowercaseQuery = query.toLowerCase();
  return allEvents.filter(e =>
    e.name.toLowerCase().includes(lowercaseQuery) ||
    e.performer.toLowerCase().includes(lowercaseQuery) ||
    e.venueName.toLowerCase().includes(lowercaseQuery) ||
    e.category.toLowerCase().includes(lowercaseQuery)
  );
}
