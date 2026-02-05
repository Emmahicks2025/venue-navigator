// Comprehensive events data - ALL events including venues without specific SVG maps
// Events matched to venues with SVG maps use specific maps, others use general map

import { Event } from '@/types';
import { generateVenueId, hasVenueMap, getOrCreateVenueData, venueMetadata } from './venues';

// Performer images by artist/team name (well-known performers)
const performerImages: Record<string, string> = {
  // Music artists
  'Backstreet Boys': 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800',
  'Chris Stapleton': 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
  'Brett Young': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
  'Tool': 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
  'GHOST': 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800',
  'Rascal Flatts': 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
  'Nick Jonas': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
  'Atmosphere': 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800',
  'Dancing With The Stars': 'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=800',
  'TobyMac': 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
  'Ricardo Arjona': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
  'Taylor Swift': 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800',
  'Ed Sheeran': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
  'Beyoncé': 'https://images.unsplash.com/photo-1499364615650-ec38552f4f34?w=800',
  'Drake': 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
  'The Weeknd': 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
  'Bruno Mars': 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800',
  'Post Malone': 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800',
  'Billie Eilish': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
  'Kendrick Lamar': 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
  'Bad Bunny': 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
  'Morgan Wallen': 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
  'Luke Combs': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
  'Zach Bryan': 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
  'Imagine Dragons': 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
  'Coldplay': 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800',
  'U2': 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
  'Foo Fighters': 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800',
  'Red Hot Chili Peppers': 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
  'Pearl Jam': 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800',
  'Green Day': 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
  'Blink-182': 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800',
  'Metallica': 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
  'Iron Maiden': 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800',
  'Aerosmith': 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
  'The Rolling Stones': 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800',
  'Eagles': 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
  'Elton John': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
  'Billy Joel': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
  'Bruce Springsteen': 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
  'Guns N Roses': 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800',
  'Def Leppard': 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
  'Journey': 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800',
  'REO Speedwagon': 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
  'Styx': 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800',
  'Chicago': 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
  'Earth Wind and Fire': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
  'Stevie Wonder': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
  'Janet Jackson': 'https://images.unsplash.com/photo-1499364615650-ec38552f4f34?w=800',
  'Mary J Blige': 'https://images.unsplash.com/photo-1499364615650-ec38552f4f34?w=800',
  'Usher': 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800',
  'Chris Brown': 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800',
  'SZA': 'https://images.unsplash.com/photo-1499364615650-ec38552f4f34?w=800',
  'Doja Cat': 'https://images.unsplash.com/photo-1499364615650-ec38552f4f34?w=800',
  'Megan Thee Stallion': 'https://images.unsplash.com/photo-1499364615650-ec38552f4f34?w=800',
  'Cardi B': 'https://images.unsplash.com/photo-1499364615650-ec38552f4f34?w=800',
  'Nicki Minaj': 'https://images.unsplash.com/photo-1499364615650-ec38552f4f34?w=800',
  'Lil Wayne': 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
  'Travis Scott': 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
  'Future': 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
  'J Cole': 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
  '21 Savage': 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
  
  // Sports teams - NBA
  'LA Clippers': 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
  'Los Angeles Clippers': 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
  'Los Angeles Lakers': 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
  'LA Lakers': 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
  'Golden State Warriors': 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
  'Brooklyn Nets': 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?w=800',
  'New York Knicks': 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?w=800',
  'Miami Heat': 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
  'Boston Celtics': 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?w=800',
  'Detroit Pistons': 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
  'Milwaukee Bucks': 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?w=800',
  'Sacramento Kings': 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
  'Houston Rockets': 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?w=800',
  'San Antonio Spurs': 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
  'Orlando Magic': 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?w=800',
  'Chicago Bulls': 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
  'Dallas Mavericks': 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?w=800',
  'Phoenix Suns': 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
  'Denver Nuggets': 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?w=800',
  'Utah Jazz': 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
  'Portland Trail Blazers': 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?w=800',
  'Seattle SuperSonics': 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
  'Memphis Grizzlies': 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?w=800',
  'Oklahoma City Thunder': 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?w=800',
  'Minnesota Timberwolves': 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?w=800',
  'Philadelphia 76ers': 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
  'Toronto Raptors': 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?w=800',
  'Atlanta Hawks': 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
  'Charlotte Hornets': 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?w=800',
  'Indiana Pacers': 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
  'Cleveland Cavaliers': 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?w=800',
  'Washington Wizards': 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
  'New Orleans Pelicans': 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?w=800',
  
  // Sports teams - NHL
  'New York Rangers': 'https://images.unsplash.com/photo-1515703407324-5f753afd8be8?w=800',
  'LA Kings': 'https://images.unsplash.com/photo-1515703407324-5f753afd8be8?w=800',
  'Los Angeles Kings': 'https://images.unsplash.com/photo-1515703407324-5f753afd8be8?w=800',
  'Colorado Avalanche': 'https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?w=800',
  'Dallas Stars': 'https://images.unsplash.com/photo-1515703407324-5f753afd8be8?w=800',
  'Seattle Kraken': 'https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?w=800',
  'Vegas Golden Knights': 'https://images.unsplash.com/photo-1515703407324-5f753afd8be8?w=800',
  'Philadelphia Flyers': 'https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?w=800',
  'New Jersey Devils': 'https://images.unsplash.com/photo-1515703407324-5f753afd8be8?w=800',
  'Washington Capitals': 'https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?w=800',
  'Pittsburgh Penguins': 'https://images.unsplash.com/photo-1515703407324-5f753afd8be8?w=800',
  'Boston Bruins': 'https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?w=800',
  'Chicago Blackhawks': 'https://images.unsplash.com/photo-1515703407324-5f753afd8be8?w=800',
  'Detroit Red Wings': 'https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?w=800',
  'Toronto Maple Leafs': 'https://images.unsplash.com/photo-1515703407324-5f753afd8be8?w=800',
  'Montreal Canadiens': 'https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?w=800',
  'Florida Panthers': 'https://images.unsplash.com/photo-1515703407324-5f753afd8be8?w=800',
  'Tampa Bay Lightning': 'https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?w=800',
  'Carolina Hurricanes': 'https://images.unsplash.com/photo-1515703407324-5f753afd8be8?w=800',
  'Nashville Predators': 'https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?w=800',
  'St Louis Blues': 'https://images.unsplash.com/photo-1515703407324-5f753afd8be8?w=800',
  'Anaheim Ducks': 'https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?w=800',
  'San Jose Sharks': 'https://images.unsplash.com/photo-1515703407324-5f753afd8be8?w=800',
  'Arizona Coyotes': 'https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?w=800',
  'Edmonton Oilers': 'https://images.unsplash.com/photo-1515703407324-5f753afd8be8?w=800',
  'Calgary Flames': 'https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?w=800',
  'Vancouver Canucks': 'https://images.unsplash.com/photo-1515703407324-5f753afd8be8?w=800',
  'Winnipeg Jets': 'https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?w=800',
  'Minnesota Wild': 'https://images.unsplash.com/photo-1515703407324-5f753afd8be8?w=800',
  'Columbus Blue Jackets': 'https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?w=800',
  'Ottawa Senators': 'https://images.unsplash.com/photo-1515703407324-5f753afd8be8?w=800',
  'Buffalo Sabres': 'https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?w=800',
  'New York Islanders': 'https://images.unsplash.com/photo-1515703407324-5f753afd8be8?w=800',
  
  // Sports teams - NFL
  'Denver Broncos': 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800',
  'Houston Texans': 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800',
  'LA Rams': 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800',
  'Los Angeles Rams': 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800',
  'Los Angeles Chargers': 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800',
  'Chicago Bears': 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800',
  'San Francisco 49ers': 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800',
  'SF 49ers': 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800',
  'Dallas Cowboys': 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800',
  'New York Giants': 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800',
  'New York Jets': 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800',
  'Philadelphia Eagles': 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800',
  'New England Patriots': 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800',
  'Miami Dolphins': 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800',
  'Buffalo Bills': 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800',
  'Pittsburgh Steelers': 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800',
  'Baltimore Ravens': 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800',
  'Cleveland Browns': 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800',
  'Cincinnati Bengals': 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800',
  'Kansas City Chiefs': 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800',
  'Las Vegas Raiders': 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800',
  'Seattle Seahawks': 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800',
  'Arizona Cardinals': 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800',
  'Minnesota Vikings': 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800',
  'Green Bay Packers': 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800',
  'Detroit Lions': 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800',
  'Tampa Bay Buccaneers': 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800',
  'New Orleans Saints': 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800',
  'Atlanta Falcons': 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800',
  'Carolina Panthers': 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800',
  'Tennessee Titans': 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800',
  'Jacksonville Jaguars': 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800',
  'Indianapolis Colts': 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800',
  
  // Sports teams - MLB
  'New York Yankees': 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=800',
  'Boston Red Sox': 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=800',
  'Los Angeles Dodgers': 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=800',
  'Chicago Cubs': 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=800',
  'Chicago White Sox': 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=800',
  'San Francisco Giants': 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=800',
  'Houston Astros': 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=800',
  'Texas Rangers': 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=800',
  'Atlanta Braves': 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=800',
  'Miami Marlins': 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=800',
  'Philadelphia Phillies': 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=800',
  'New York Mets': 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=800',
  'Washington Nationals': 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=800',
  
  // Sports teams - Other
  'Fort Worth Stock Show & Rodeo': 'https://images.unsplash.com/photo-1529686342540-1b43aec0df75?w=800',
  'WWE': 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800',
  'Monster Jam': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
  'UFC': 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800',
  'NASCAR': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
  'Formula 1': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
  'PBR': 'https://images.unsplash.com/photo-1529686342540-1b43aec0df75?w=800',
  'Rodeo': 'https://images.unsplash.com/photo-1529686342540-1b43aec0df75?w=800',
  
  // FIFA World Cup 2026
  'FIFA World Cup 2026': 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
  'World Cup': 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
  
  // Comedians
  'Kevin Hart': 'https://images.unsplash.com/photo-1527224538127-2104bb71c51b?w=800',
  'Dave Chappelle': 'https://images.unsplash.com/photo-1527224538127-2104bb71c51b?w=800',
  'Chris Rock': 'https://images.unsplash.com/photo-1527224538127-2104bb71c51b?w=800',
  'Sebastian Maniscalco': 'https://images.unsplash.com/photo-1527224538127-2104bb71c51b?w=800',
  'Jim Gaffigan': 'https://images.unsplash.com/photo-1527224538127-2104bb71c51b?w=800',
  'Bert Kreischer': 'https://images.unsplash.com/photo-1527224538127-2104bb71c51b?w=800',
  'Tom Segura': 'https://images.unsplash.com/photo-1527224538127-2104bb71c51b?w=800',
  'Joe Rogan': 'https://images.unsplash.com/photo-1527224538127-2104bb71c51b?w=800',
  'Trevor Noah': 'https://images.unsplash.com/photo-1527224538127-2104bb71c51b?w=800',
  'John Mulaney': 'https://images.unsplash.com/photo-1527224538127-2104bb71c51b?w=800',
  'Bill Burr': 'https://images.unsplash.com/photo-1527224538127-2104bb71c51b?w=800',
  
  // Broadway/Theater
  'Wicked': 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800',
  'Hamilton': 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800',
  'The Lion King': 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800',
  'Phantom of the Opera': 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800',
  'Les Misérables': 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800',
  'Chicago Musical': 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800',
  'Moulin Rouge': 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800',
  'Dear Evan Hansen': 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800',
  'Aladdin': 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800',
  'Hadestown': 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800',
};

// Default performer images by category
const defaultPerformerImages: Record<string, string> = {
  concerts: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
  sports: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
  theater: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800',
  comedy: 'https://images.unsplash.com/photo-1527224538127-2104bb71c51b?w=800',
  festivals: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
};

// Get performer image
function getPerformerImage(performer: string, category: Event['category']): string {
  // Check for specific performer image
  for (const [key, url] of Object.entries(performerImages)) {
    if (performer.toLowerCase().includes(key.toLowerCase())) {
      return url;
    }
  }
  // Fall back to category default
  return defaultPerformerImages[category] || defaultPerformerImages.concerts;
}

// Generate unique event ID
let eventCounter = 0;
function generateEventId(venueKey: string): string {
  eventCounter++;
  return `evt-${venueKey.slice(0, 10)}-${String(eventCounter).padStart(4, '0')}`;
}

// Helper to generate random date in next 12 months
function randomFutureDate(): string {
  const now = new Date();
  const daysAhead = Math.floor(Math.random() * 365) + 30;
  const futureDate = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);
  return futureDate.toISOString().split('T')[0];
}

// Helper to generate random time
function randomTime(): string {
  const hours = [19, 20, 14, 15, 18, 21];
  const hour = hours[Math.floor(Math.random() * hours.length)];
  return `${hour.toString().padStart(2, '0')}:00`;
}

// ============ VENUE-EVENT DATA FROM EXCEL FILES ============
// This includes ALL events from the 6 Excel files, matched with their venues

interface RawEventData {
  name: string;
  performer: string;
  category: Event['category'];
  venueName: string;
  city?: string;
  state?: string;
  date?: string;
  time?: string;
  minPrice: number;
  maxPrice: number;
  isFeatured?: boolean;
  description?: string;
}

// All raw events extracted from Excel files
const rawEvents: RawEventData[] = [
  // ========== FIFA WORLD CUP 2026 ========== (now loaded from database, see WorldCupSection)
  // Legacy local stubs removed - real data comes from Supabase events table


  // ========== CONCERTS ==========
  // Houston venues
  { name: 'Riff Raff: Houses Way In Tour', performer: 'Riff Raff', category: 'concerts', venueName: '713 Music Hall', city: 'Houston', state: 'TX', minPrice: 35, maxPrice: 150 },
  { name: 'Maverick City Music', performer: 'Maverick City Music', category: 'concerts', venueName: '713 Music Hall', city: 'Houston', state: 'TX', minPrice: 45, maxPrice: 175 },
  { name: 'Grupo Frontera', performer: 'Grupo Frontera', category: 'concerts', venueName: '713 Music Hall', city: 'Houston', state: 'TX', minPrice: 55, maxPrice: 225 },
  { name: 'Los Bukis', performer: 'Los Bukis', category: 'concerts', venueName: 'NRG Stadium', city: 'Houston', state: 'TX', minPrice: 85, maxPrice: 495, isFeatured: true },
  { name: 'Bad Bunny: Most Wanted Tour', performer: 'Bad Bunny', category: 'concerts', venueName: 'NRG Stadium', city: 'Houston', state: 'TX', minPrice: 125, maxPrice: 695, isFeatured: true },
  { name: 'Chris Stapleton', performer: 'Chris Stapleton', category: 'concerts', venueName: 'Cynthia Woods Mitchell Pavilion', city: 'The Woodlands', state: 'TX', minPrice: 65, maxPrice: 285 },
  { name: 'Morgan Wallen: One Night At A Time', performer: 'Morgan Wallen', category: 'concerts', venueName: 'NRG Stadium', city: 'Houston', state: 'TX', minPrice: 95, maxPrice: 495, isFeatured: true },
  { name: 'Zach Bryan', performer: 'Zach Bryan', category: 'concerts', venueName: 'NRG Stadium', city: 'Houston', state: 'TX', minPrice: 85, maxPrice: 395, isFeatured: true },
  { name: 'Luke Combs World Tour', performer: 'Luke Combs', category: 'concerts', venueName: 'NRG Stadium', city: 'Houston', state: 'TX', minPrice: 75, maxPrice: 375 },
  { name: 'Beyoncé Renaissance World Tour', performer: 'Beyoncé', category: 'concerts', venueName: 'NRG Stadium', city: 'Houston', state: 'TX', minPrice: 150, maxPrice: 895, isFeatured: true },
  { name: 'Janet Jackson: Together Again Tour', performer: 'Janet Jackson', category: 'concerts', venueName: 'Smart Financial Centre', city: 'Sugar Land', state: 'TX', minPrice: 85, maxPrice: 395 },
  { name: 'Usher Past Present Future', performer: 'Usher', category: 'concerts', venueName: 'Smart Financial Centre', city: 'Sugar Land', state: 'TX', minPrice: 95, maxPrice: 445 },
  
  // Dallas/Fort Worth venues
  { name: 'Tool Fear Inoculum Tour', performer: 'Tool', category: 'concerts', venueName: 'American Airlines Center', city: 'Dallas', state: 'TX', minPrice: 75, maxPrice: 295 },
  { name: 'Drake: Its All A Blur Tour', performer: 'Drake', category: 'concerts', venueName: 'American Airlines Center', city: 'Dallas', state: 'TX', minPrice: 125, maxPrice: 595, isFeatured: true },
  { name: 'The Weeknd After Hours Til Dawn', performer: 'The Weeknd', category: 'concerts', venueName: 'American Airlines Center', city: 'Dallas', state: 'TX', minPrice: 95, maxPrice: 495 },
  { name: 'Bruno Mars Live', performer: 'Bruno Mars', category: 'concerts', venueName: 'Globe Life Field', city: 'Arlington', state: 'TX', minPrice: 125, maxPrice: 595, isFeatured: true },
  { name: 'Post Malone: Twelve Carat Tour', performer: 'Post Malone', category: 'concerts', venueName: 'American Airlines Center', city: 'Dallas', state: 'TX', minPrice: 65, maxPrice: 295 },
  { name: 'Metallica M72 World Tour', performer: 'Metallica', category: 'concerts', venueName: 'Globe Life Field', city: 'Arlington', state: 'TX', minPrice: 95, maxPrice: 495, isFeatured: true },
  { name: 'Country Fest Texas', performer: 'Various Artists', category: 'concerts', venueName: 'Dos Equis Pavilion', city: 'Dallas', state: 'TX', minPrice: 45, maxPrice: 195 },
  { name: 'Backstreet Boys DNA World Tour', performer: 'Backstreet Boys', category: 'concerts', venueName: 'Dos Equis Pavilion', city: 'Dallas', state: 'TX', minPrice: 55, maxPrice: 245 },
  { name: 'Kid Rock', performer: 'Kid Rock', category: 'concerts', venueName: 'Dos Equis Pavilion', city: 'Dallas', state: 'TX', minPrice: 45, maxPrice: 195 },
  { name: 'Eric Church', performer: 'Eric Church', category: 'concerts', venueName: 'Dickies Arena', city: 'Fort Worth', state: 'TX', minPrice: 65, maxPrice: 285 },
  { name: 'George Strait', performer: 'George Strait', category: 'concerts', venueName: 'Dickies Arena', city: 'Fort Worth', state: 'TX', minPrice: 95, maxPrice: 495, isFeatured: true },
  { name: 'Cody Johnson', performer: 'Cody Johnson', category: 'concerts', venueName: 'Dickies Arena', city: 'Fort Worth', state: 'TX', minPrice: 55, maxPrice: 225 },
  { name: 'House of Blues Presents', performer: 'Various Artists', category: 'concerts', venueName: 'House of Blues Dallas', city: 'Dallas', state: 'TX', minPrice: 35, maxPrice: 125 },
  
  // Los Angeles venues
  { name: 'Taylor Swift Eras Tour', performer: 'Taylor Swift', category: 'concerts', venueName: 'SoFi Stadium', city: 'Inglewood', state: 'CA', minPrice: 195, maxPrice: 1295, isFeatured: true },
  { name: 'Coldplay Music of the Spheres', performer: 'Coldplay', category: 'concerts', venueName: 'SoFi Stadium', city: 'Inglewood', state: 'CA', minPrice: 125, maxPrice: 595, isFeatured: true },
  { name: 'Beyoncé Renaissance', performer: 'Beyoncé', category: 'concerts', venueName: 'SoFi Stadium', city: 'Inglewood', state: 'CA', minPrice: 195, maxPrice: 995, isFeatured: true },
  { name: 'Ed Sheeran Mathematics Tour', performer: 'Ed Sheeran', category: 'concerts', venueName: 'SoFi Stadium', city: 'Inglewood', state: 'CA', minPrice: 95, maxPrice: 495 },
  { name: 'U2 UV Achtung Baby', performer: 'U2', category: 'concerts', venueName: 'MSG Sphere', city: 'Las Vegas', state: 'NV', minPrice: 195, maxPrice: 895, isFeatured: true },
  { name: 'Kendrick Lamar: Big Steppers Tour', performer: 'Kendrick Lamar', category: 'concerts', venueName: 'Crypto.com Arena', city: 'Los Angeles', state: 'CA', minPrice: 95, maxPrice: 495 },
  { name: 'Billie Eilish Happier Than Ever', performer: 'Billie Eilish', category: 'concerts', venueName: 'Crypto.com Arena', city: 'Los Angeles', state: 'CA', minPrice: 85, maxPrice: 395 },
  { name: 'Harry Styles Love on Tour', performer: 'Harry Styles', category: 'concerts', venueName: 'Kia Forum', city: 'Inglewood', state: 'CA', minPrice: 95, maxPrice: 445, isFeatured: true },
  { name: 'Adele Weekends with Adele', performer: 'Adele', category: 'concerts', venueName: 'Dolby Live at Park MGM', city: 'Las Vegas', state: 'NV', minPrice: 295, maxPrice: 1495, isFeatured: true },
  { name: 'Hollywood Bowl Summer Series', performer: 'LA Philharmonic', category: 'concerts', venueName: 'Hollywood Bowl', city: 'Los Angeles', state: 'CA', minPrice: 45, maxPrice: 295 },
  { name: 'Indie Night at Palladium', performer: 'Various Artists', category: 'concerts', venueName: 'Hollywood Palladium', city: 'Los Angeles', state: 'CA', minPrice: 35, maxPrice: 125 },
  { name: 'Pantages Broadway Series', performer: 'Various Shows', category: 'theater', venueName: 'Pantages Theatre', city: 'Los Angeles', state: 'CA', minPrice: 65, maxPrice: 295 },
  
  // San Francisco / Bay Area
  { name: 'Dead & Company Final Tour', performer: 'Dead & Company', category: 'concerts', venueName: 'Chase Center', city: 'San Francisco', state: 'CA', minPrice: 95, maxPrice: 495 },
  { name: 'Phish Summer Tour', performer: 'Phish', category: 'concerts', venueName: 'Chase Center', city: 'San Francisco', state: 'CA', minPrice: 75, maxPrice: 295 },
  { name: 'Bad Bunny World Hottest Tour', performer: 'Bad Bunny', category: 'concerts', venueName: "Levi's Stadium", city: 'Santa Clara', state: 'CA', minPrice: 125, maxPrice: 695, isFeatured: true },
  
  // Las Vegas venues
  { name: 'Lady Gaga Jazz & Piano', performer: 'Lady Gaga', category: 'concerts', venueName: 'Dolby Live at Park MGM', city: 'Las Vegas', state: 'NV', minPrice: 195, maxPrice: 895, isFeatured: true },
  { name: 'Usher My Way Residency', performer: 'Usher', category: 'concerts', venueName: 'Dolby Live at Park MGM', city: 'Las Vegas', state: 'NV', minPrice: 125, maxPrice: 595 },
  { name: 'Bruno Mars at Dolby Live', performer: 'Bruno Mars', category: 'concerts', venueName: 'Dolby Live at Park MGM', city: 'Las Vegas', state: 'NV', minPrice: 195, maxPrice: 795, isFeatured: true },
  { name: 'Cirque du Soleil O', performer: 'Cirque du Soleil', category: 'theater', venueName: 'Bellagio', city: 'Las Vegas', state: 'NV', minPrice: 125, maxPrice: 395 },
  { name: 'Tournament of Kings', performer: 'Tournament of Kings', category: 'theater', venueName: 'Excalibur', city: 'Las Vegas', state: 'NV', minPrice: 65, maxPrice: 125 },
  { name: 'Katy Perry Play', performer: 'Katy Perry', category: 'concerts', venueName: 'Fontainebleau Las Vegas', city: 'Las Vegas', state: 'NV', minPrice: 145, maxPrice: 595 },
  { name: 'Garth Brooks Plus One', performer: 'Garth Brooks', category: 'concerts', venueName: 'MGM Grand Garden Arena', city: 'Las Vegas', state: 'NV', minPrice: 95, maxPrice: 495 },
  { name: 'Keith Urban Vegas Residency', performer: 'Keith Urban', category: 'concerts', venueName: 'Fontainebleau Las Vegas', city: 'Las Vegas', state: 'NV', minPrice: 95, maxPrice: 395 },
  { name: 'Cirque KA', performer: 'Cirque du Soleil', category: 'theater', venueName: 'MGM Grand Garden Arena', city: 'Las Vegas', state: 'NV', minPrice: 95, maxPrice: 295 },
  { name: 'Blue Man Group', performer: 'Blue Man Group', category: 'theater', venueName: 'Mandalay Bay', city: 'Las Vegas', state: 'NV', minPrice: 75, maxPrice: 175 },
  { name: 'Michael Jackson ONE', performer: 'Cirque du Soleil', category: 'theater', venueName: 'Mandalay Bay', city: 'Las Vegas', state: 'NV', minPrice: 95, maxPrice: 295 },
  { name: 'Penn & Teller', performer: 'Penn & Teller', category: 'comedy', venueName: 'Rio Las Vegas', city: 'Las Vegas', state: 'NV', minPrice: 85, maxPrice: 195 },
  { name: 'Carrot Top Live', performer: 'Carrot Top', category: 'comedy', venueName: 'Mirage', city: 'Las Vegas', state: 'NV', minPrice: 55, maxPrice: 125 },
  { name: 'David Copperfield', performer: 'David Copperfield', category: 'theater', venueName: 'MGM Grand Garden Arena', city: 'Las Vegas', state: 'NV', minPrice: 95, maxPrice: 295 },
  { name: 'Phish Dead Air', performer: 'Phish', category: 'concerts', venueName: 'MSG Sphere', city: 'Las Vegas', state: 'NV', minPrice: 125, maxPrice: 495 },
  { name: 'Eagles Hotel California Tour', performer: 'Eagles', category: 'concerts', venueName: 'MSG Sphere', city: 'Las Vegas', state: 'NV', minPrice: 195, maxPrice: 895, isFeatured: true },
  
  // New York venues
  { name: 'Billy Joel MSG Residency', performer: 'Billy Joel', category: 'concerts', venueName: 'Madison Square Garden', city: 'New York', state: 'NY', minPrice: 125, maxPrice: 695, isFeatured: true },
  { name: 'Bruce Springsteen and E Street Band', performer: 'Bruce Springsteen', category: 'concerts', venueName: 'Madison Square Garden', city: 'New York', state: 'NY', minPrice: 145, maxPrice: 795, isFeatured: true },
  { name: 'Phish MSG Run', performer: 'Phish', category: 'concerts', venueName: 'Madison Square Garden', city: 'New York', state: 'NY', minPrice: 95, maxPrice: 395 },
  { name: 'Foo Fighters Everything or Nothing', performer: 'Foo Fighters', category: 'concerts', venueName: 'Madison Square Garden', city: 'New York', state: 'NY', minPrice: 85, maxPrice: 395 },
  { name: 'Jay-Z 4:44 Tour', performer: 'Jay-Z', category: 'concerts', venueName: 'Barclays Center', city: 'Brooklyn', state: 'NY', minPrice: 125, maxPrice: 595 },
  { name: 'Kendrick Lamar Mr Morale Tour', performer: 'Kendrick Lamar', category: 'concerts', venueName: 'Barclays Center', city: 'Brooklyn', state: 'NY', minPrice: 95, maxPrice: 445 },
  { name: 'Radio City Christmas Spectacular', performer: 'The Rockettes', category: 'theater', venueName: 'Radio City Music Hall', city: 'New York', state: 'NY', minPrice: 65, maxPrice: 295 },
  { name: 'Tony Bennett Tribute', performer: 'Various Artists', category: 'concerts', venueName: 'Radio City Music Hall', city: 'New York', state: 'NY', minPrice: 85, maxPrice: 395 },
  { name: 'Beacon Theatre Jazz Series', performer: 'Various Artists', category: 'concerts', venueName: 'Beacon Theatre', city: 'New York', state: 'NY', minPrice: 55, maxPrice: 195 },
  { name: 'Forest Hills Stadium Summer', performer: 'Various Artists', category: 'concerts', venueName: 'Forest Hills Stadium', city: 'Queens', state: 'NY', minPrice: 65, maxPrice: 295 },
  
  // Broadway
  { name: 'Wicked', performer: 'Wicked Cast', category: 'theater', venueName: 'Gershwin Theatre', city: 'New York', state: 'NY', minPrice: 95, maxPrice: 395, isFeatured: true },
  { name: 'Hamilton', performer: 'Hamilton Cast', category: 'theater', venueName: 'Imperial Theatre', city: 'New York', state: 'NY', minPrice: 125, maxPrice: 495, isFeatured: true },
  { name: 'The Lion King', performer: 'Lion King Cast', category: 'theater', venueName: 'Minskoff Theatre', city: 'New York', state: 'NY', minPrice: 95, maxPrice: 395 },
  { name: 'Aladdin', performer: 'Aladdin Cast', category: 'theater', venueName: 'New Amsterdam Theatre', city: 'New York', state: 'NY', minPrice: 75, maxPrice: 295 },
  { name: 'Harry Potter and the Cursed Child', performer: 'Harry Potter Cast', category: 'theater', venueName: 'Lyric Theatre', city: 'New York', state: 'NY', minPrice: 95, maxPrice: 395 },
  
  // New Jersey venues
  { name: 'Dead & Company', performer: 'Dead & Company', category: 'concerts', venueName: 'MetLife Stadium', city: 'East Rutherford', state: 'NJ', minPrice: 95, maxPrice: 495 },
  { name: 'Taylor Swift Eras Tour East', performer: 'Taylor Swift', category: 'concerts', venueName: 'MetLife Stadium', city: 'East Rutherford', state: 'NJ', minPrice: 195, maxPrice: 1295, isFeatured: true },
  { name: 'Guns N Roses', performer: 'Guns N Roses', category: 'concerts', venueName: 'MetLife Stadium', city: 'East Rutherford', state: 'NJ', minPrice: 85, maxPrice: 395 },
  { name: 'Bon Jovi Forever Tour', performer: 'Bon Jovi', category: 'concerts', venueName: 'Prudential Center', city: 'Newark', state: 'NJ', minPrice: 85, maxPrice: 395 },
  { name: 'Rock the Runway', performer: 'Various Artists', category: 'concerts', venueName: 'PNC Bank Arts Center', city: 'Holmdel', state: 'NJ', minPrice: 45, maxPrice: 195 },
  { name: 'Dave Matthews Band', performer: 'Dave Matthews Band', category: 'concerts', venueName: 'PNC Bank Arts Center', city: 'Holmdel', state: 'NJ', minPrice: 65, maxPrice: 295 },
  { name: 'Jimmy Buffett Tribute', performer: 'Various Artists', category: 'concerts', venueName: 'Freedom Mortgage Pavilion', city: 'Camden', state: 'NJ', minPrice: 45, maxPrice: 175 },
  
  // Chicago area
  { name: 'Red Hot Chili Peppers', performer: 'Red Hot Chili Peppers', category: 'concerts', venueName: 'Soldier Field', city: 'Chicago', state: 'IL', minPrice: 85, maxPrice: 395 },
  { name: 'Taylor Swift Eras Chicago', performer: 'Taylor Swift', category: 'concerts', venueName: 'Soldier Field', city: 'Chicago', state: 'IL', minPrice: 195, maxPrice: 1295, isFeatured: true },
  { name: 'Pearl Jam Dark Matter Tour', performer: 'Pearl Jam', category: 'concerts', venueName: 'Soldier Field', city: 'Chicago', state: 'IL', minPrice: 95, maxPrice: 495 },
  { name: 'Elton John Farewell', performer: 'Elton John', category: 'concerts', venueName: 'Soldier Field', city: 'Chicago', state: 'IL', minPrice: 125, maxPrice: 595, isFeatured: true },
  { name: 'Foo Fighters Soldier Field', performer: 'Foo Fighters', category: 'concerts', venueName: 'Soldier Field', city: 'Chicago', state: 'IL', minPrice: 85, maxPrice: 395 },
  { name: 'Imagine Dragons Mercury Tour', performer: 'Imagine Dragons', category: 'concerts', venueName: 'Allstate Arena', city: 'Rosemont', state: 'IL', minPrice: 65, maxPrice: 295 },
  { name: 'Summer Smash Festival', performer: 'Various Artists', category: 'festivals', venueName: 'Credit Union 1 Amphitheatre', city: 'Tinley Park', state: 'IL', minPrice: 75, maxPrice: 295 },
  { name: 'Chicago Broadway Show', performer: 'Chicago Cast', category: 'theater', venueName: 'CIBC Theatre', city: 'Chicago', state: 'IL', minPrice: 65, maxPrice: 245 },
  { name: 'Moulin Rouge Chicago', performer: 'Moulin Rouge Cast', category: 'theater', venueName: 'Cadillac Palace Theatre', city: 'Chicago', state: 'IL', minPrice: 75, maxPrice: 295 },
  { name: 'Hamilton Chicago', performer: 'Hamilton Cast', category: 'theater', venueName: 'CIBC Theatre', city: 'Chicago', state: 'IL', minPrice: 95, maxPrice: 395 },
  { name: 'Rosemont Theatre Presents', performer: 'Various Shows', category: 'theater', venueName: 'Rosemont Theatre', city: 'Rosemont', state: 'IL', minPrice: 55, maxPrice: 195 },
  
  // Denver area
  { name: 'Dead & Company at Red Rocks', performer: 'Dead & Company', category: 'concerts', venueName: 'Fiddlers Green Amphitheatre', city: 'Greenwood Village', state: 'CO', minPrice: 95, maxPrice: 395 },
  { name: 'Widespread Panic Red Rocks', performer: 'Widespread Panic', category: 'concerts', venueName: 'Fiddlers Green Amphitheatre', city: 'Greenwood Village', state: 'CO', minPrice: 75, maxPrice: 295 },
  { name: 'Green Day Saviors Tour', performer: 'Green Day', category: 'concerts', venueName: 'Ball Arena', city: 'Denver', state: 'CO', minPrice: 75, maxPrice: 295 },
  { name: 'Blink-182 Reunion Tour', performer: 'Blink-182', category: 'concerts', venueName: 'Ball Arena', city: 'Denver', state: 'CO', minPrice: 85, maxPrice: 395 },
  { name: 'Luke Bryan Country On Tour', performer: 'Luke Bryan', category: 'concerts', venueName: 'Empower Field at Mile High', city: 'Denver', state: 'CO', minPrice: 65, maxPrice: 295 },
  { name: 'The Lumineers Brightside Tour', performer: 'The Lumineers', category: 'concerts', venueName: 'Fillmore Auditorium Denver', city: 'Denver', state: 'CO', minPrice: 55, maxPrice: 195 },
  { name: 'STS9 at Fillmore', performer: 'STS9', category: 'concerts', venueName: 'Fillmore Auditorium Denver', city: 'Denver', state: 'CO', minPrice: 45, maxPrice: 145 },
  { name: 'Hamilton Denver', performer: 'Hamilton Cast', category: 'theater', venueName: 'Buell Theatre', city: 'Denver', state: 'CO', minPrice: 85, maxPrice: 345 },
  { name: 'Broadway Series Denver', performer: 'Various Shows', category: 'theater', venueName: 'Bellco Theatre', city: 'Denver', state: 'CO', minPrice: 55, maxPrice: 195 },
  
  // Atlanta area
  { name: 'Beyoncé Renaissance Atlanta', performer: 'Beyoncé', category: 'concerts', venueName: 'Mercedes-Benz Stadium', city: 'Atlanta', state: 'GA', minPrice: 175, maxPrice: 895, isFeatured: true },
  { name: 'Taylor Swift Eras Atlanta', performer: 'Taylor Swift', category: 'concerts', venueName: 'Mercedes-Benz Stadium', city: 'Atlanta', state: 'GA', minPrice: 195, maxPrice: 1295, isFeatured: true },
  { name: 'Morgan Wallen Atlanta', performer: 'Morgan Wallen', category: 'concerts', venueName: 'Mercedes-Benz Stadium', city: 'Atlanta', state: 'GA', minPrice: 95, maxPrice: 495 },
  { name: 'OutKast Reunion Show', performer: 'OutKast', category: 'concerts', venueName: 'Mercedes-Benz Stadium', city: 'Atlanta', state: 'GA', minPrice: 125, maxPrice: 595, isFeatured: true },
  { name: 'Atlanta Symphony Orchestra', performer: 'Atlanta Symphony', category: 'concerts', venueName: 'Atlanta Symphony Hall', city: 'Atlanta', state: 'GA', minPrice: 45, maxPrice: 195 },
  { name: 'Fox Theatre Broadway Series', performer: 'Various Shows', category: 'theater', venueName: 'Fox Theatre', city: 'Atlanta', state: 'GA', minPrice: 65, maxPrice: 245 },
  { name: 'Summer Concerts at Cellairis', performer: 'Various Artists', category: 'concerts', venueName: 'Cellairis Amphitheatre', city: 'Atlanta', state: 'GA', minPrice: 45, maxPrice: 175 },
  { name: 'Country Thunder Georgia', performer: 'Various Artists', category: 'concerts', venueName: 'Ameris Bank Amphitheatre', city: 'Alpharetta', state: 'GA', minPrice: 55, maxPrice: 225 },
  { name: 'Rock Fest Atlanta', performer: 'Various Artists', category: 'concerts', venueName: 'Gas South Arena', city: 'Duluth', state: 'GA', minPrice: 45, maxPrice: 175 },
  { name: 'Georgia Tech Football', performer: 'Georgia Tech Yellow Jackets', category: 'sports', venueName: 'Bobby Dodd Stadium', city: 'Atlanta', state: 'GA', minPrice: 35, maxPrice: 195 },
  
  // Florida venues
  { name: 'Rolling Stones Hackney Diamonds', performer: 'The Rolling Stones', category: 'concerts', venueName: 'Hard Rock Stadium', city: 'Miami Gardens', state: 'FL', minPrice: 145, maxPrice: 695, isFeatured: true },
  { name: 'Bad Bunny Miami', performer: 'Bad Bunny', category: 'concerts', venueName: 'Hard Rock Stadium', city: 'Miami Gardens', state: 'FL', minPrice: 125, maxPrice: 695, isFeatured: true },
  { name: 'Super Bowl Experience', performer: 'Various Artists', category: 'sports', venueName: 'Hard Rock Stadium', city: 'Miami Gardens', state: 'FL', minPrice: 195, maxPrice: 1495 },
  { name: 'Pitbull Party After Dark', performer: 'Pitbull', category: 'concerts', venueName: 'Kaseya Center', city: 'Miami', state: 'FL', minPrice: 75, maxPrice: 295 },
  { name: 'Marc Anthony Viviendo Tour', performer: 'Marc Anthony', category: 'concerts', venueName: 'Kaseya Center', city: 'Miami', state: 'FL', minPrice: 85, maxPrice: 395 },
  { name: 'J Balvin Mi Gente Tour', performer: 'J Balvin', category: 'concerts', venueName: 'Kaseya Center', city: 'Miami', state: 'FL', minPrice: 75, maxPrice: 345 },
  { name: 'Miami Heat vs Lakers', performer: 'Miami Heat', category: 'sports', venueName: 'Kaseya Center', city: 'Miami', state: 'FL', minPrice: 85, maxPrice: 595 },
  { name: 'Florida Panthers Hockey', performer: 'Florida Panthers', category: 'sports', venueName: 'Amerant Bank Arena', city: 'Sunrise', state: 'FL', minPrice: 55, maxPrice: 295 },
  { name: 'Hozier Unreal Unearth Tour', performer: 'Hozier', category: 'concerts', venueName: 'Hard Rock Live', city: 'Hollywood', state: 'FL', minPrice: 65, maxPrice: 245 },
  { name: 'John Legend Live', performer: 'John Legend', category: 'concerts', venueName: 'Hard Rock Live', city: 'Hollywood', state: 'FL', minPrice: 85, maxPrice: 345 },
  { name: 'Miami Marlins vs Braves', performer: 'Miami Marlins', category: 'sports', venueName: 'loanDepot Park', city: 'Miami', state: 'FL', minPrice: 25, maxPrice: 195 },
  { name: 'Palm Beach Summer Pops', performer: 'Various Artists', category: 'concerts', venueName: 'Dreyfoos Hall at Kravis Center', city: 'West Palm Beach', state: 'FL', minPrice: 55, maxPrice: 195 },
  { name: 'Summer Concert Series', performer: 'Various Artists', category: 'concerts', venueName: 'iTHINK Financial Amphitheatre', city: 'West Palm Beach', state: 'FL', minPrice: 45, maxPrice: 175 },
  
  // Boston area
  { name: 'Morgan Wallen at Fenway', performer: 'Morgan Wallen', category: 'concerts', venueName: 'Fenway Park', city: 'Boston', state: 'MA', minPrice: 95, maxPrice: 495, isFeatured: true },
  { name: 'Zach Bryan at Fenway', performer: 'Zach Bryan', category: 'concerts', venueName: 'Fenway Park', city: 'Boston', state: 'MA', minPrice: 85, maxPrice: 395 },
  { name: 'Pearl Jam Fenway Park', performer: 'Pearl Jam', category: 'concerts', venueName: 'Fenway Park', city: 'Boston', state: 'MA', minPrice: 95, maxPrice: 495 },
  { name: 'Dead & Company Fenway', performer: 'Dead & Company', category: 'concerts', venueName: 'Fenway Park', city: 'Boston', state: 'MA', minPrice: 95, maxPrice: 445 },
  { name: 'New England Patriots', performer: 'New England Patriots', category: 'sports', venueName: 'Gillette Stadium', city: 'Foxborough', state: 'MA', minPrice: 85, maxPrice: 495 },
  { name: 'Ed Sheeran Gillette Stadium', performer: 'Ed Sheeran', category: 'concerts', venueName: 'Gillette Stadium', city: 'Foxborough', state: 'MA', minPrice: 95, maxPrice: 445 },
  { name: 'Beyoncé Gillette Stadium', performer: 'Beyoncé', category: 'concerts', venueName: 'Gillette Stadium', city: 'Foxborough', state: 'MA', minPrice: 175, maxPrice: 895, isFeatured: true },
  { name: 'Hozier at MGM Fenway', performer: 'Hozier', category: 'concerts', venueName: 'MGM Music Hall at Fenway', city: 'Boston', state: 'MA', minPrice: 65, maxPrice: 245 },
  { name: 'Phoebe Bridgers', performer: 'Phoebe Bridgers', category: 'concerts', venueName: 'MGM Music Hall at Fenway', city: 'Boston', state: 'MA', minPrice: 55, maxPrice: 195 },
  { name: 'Roadrunner Indie Series', performer: 'Various Artists', category: 'concerts', venueName: 'Roadrunner', city: 'Boston', state: 'MA', minPrice: 35, maxPrice: 125 },
  { name: 'Boston Calling', performer: 'Various Artists', category: 'festivals', venueName: 'Leader Bank Pavilion', city: 'Boston', state: 'MA', minPrice: 95, maxPrice: 395 },
  
  // Philadelphia
  { name: 'Eagles Super Bowl', performer: 'Philadelphia Eagles', category: 'sports', venueName: 'Lincoln Financial Field', city: 'Philadelphia', state: 'PA', minPrice: 95, maxPrice: 595 },
  { name: 'Taylor Swift Eras Philly', performer: 'Taylor Swift', category: 'concerts', venueName: 'Lincoln Financial Field', city: 'Philadelphia', state: 'PA', minPrice: 195, maxPrice: 1295, isFeatured: true },
  { name: 'Kenny Chesney Sun Goes Down', performer: 'Kenny Chesney', category: 'concerts', venueName: 'Lincoln Financial Field', city: 'Philadelphia', state: 'PA', minPrice: 65, maxPrice: 295 },
  { name: 'Monster Jam Philly', performer: 'Monster Jam', category: 'sports', venueName: 'Lincoln Financial Field', city: 'Philadelphia', state: 'PA', minPrice: 35, maxPrice: 145 },
  
  // Washington DC area
  { name: 'Dave Matthews Band Jiffy Lube', performer: 'Dave Matthews Band', category: 'concerts', venueName: 'Jiffy Lube Live', city: 'Bristow', state: 'VA', minPrice: 65, maxPrice: 295 },
  { name: 'Hootie & The Blowfish', performer: 'Hootie & The Blowfish', category: 'concerts', venueName: 'Jiffy Lube Live', city: 'Bristow', state: 'VA', minPrice: 55, maxPrice: 225 },
  { name: 'Thomas Rhett Country Summer', performer: 'Thomas Rhett', category: 'concerts', venueName: 'Jiffy Lube Live', city: 'Bristow', state: 'VA', minPrice: 45, maxPrice: 195 },
  
  // Seattle area
  { name: 'Pearl Jam Home Shows', performer: 'Pearl Jam', category: 'concerts', venueName: 'Climate Pledge Arena', city: 'Seattle', state: 'WA', minPrice: 95, maxPrice: 495, isFeatured: true },
  { name: 'Seattle Kraken Hockey', performer: 'Seattle Kraken', category: 'sports', venueName: 'Climate Pledge Arena', city: 'Seattle', state: 'WA', minPrice: 55, maxPrice: 295 },
  { name: 'Foo Fighters Seattle', performer: 'Foo Fighters', category: 'concerts', venueName: 'Climate Pledge Arena', city: 'Seattle', state: 'WA', minPrice: 85, maxPrice: 395 },
  { name: 'Macklemore Homecoming', performer: 'Macklemore', category: 'concerts', venueName: 'Climate Pledge Arena', city: 'Seattle', state: 'WA', minPrice: 65, maxPrice: 245 },
  { name: 'Seattle Seahawks', performer: 'Seattle Seahawks', category: 'sports', venueName: 'Lumen Field', city: 'Seattle', state: 'WA', minPrice: 75, maxPrice: 445 },
  { name: 'Taylor Swift Eras Seattle', performer: 'Taylor Swift', category: 'concerts', venueName: 'Lumen Field', city: 'Seattle', state: 'WA', minPrice: 195, maxPrice: 1295, isFeatured: true },
  { name: 'Paramount Theatre Shows', performer: 'Various Shows', category: 'theater', venueName: 'Paramount Theatre Seattle', city: 'Seattle', state: 'WA', minPrice: 55, maxPrice: 195 },
  { name: 'Silversun Pickups', performer: 'Silversun Pickups', category: 'concerts', venueName: 'Paramount Theatre Seattle', city: 'Seattle', state: 'WA', minPrice: 45, maxPrice: 145 },
  { name: 'Everett Events', performer: 'Various Artists', category: 'concerts', venueName: 'Angel of the Winds Arena', city: 'Everett', state: 'WA', minPrice: 35, maxPrice: 125 },
  { name: 'ShoWare Center Events', performer: 'Various Artists', category: 'concerts', venueName: 'ShoWare Center', city: 'Kent', state: 'WA', minPrice: 35, maxPrice: 125 },
  
  // Phoenix area
  { name: 'Taylor Swift Eras Phoenix', performer: 'Taylor Swift', category: 'concerts', venueName: 'Desert Diamond Arena', city: 'Glendale', state: 'AZ', minPrice: 175, maxPrice: 1195 },
  { name: 'Phoenix Coyotes Hockey', performer: 'Arizona Coyotes', category: 'sports', venueName: 'Desert Diamond Arena', city: 'Glendale', state: 'AZ', minPrice: 45, maxPrice: 245 },
  { name: 'Phoenix Shows', performer: 'Various Artists', category: 'concerts', venueName: 'Arizona Financial Theatre', city: 'Phoenix', state: 'AZ', minPrice: 45, maxPrice: 175 },
  
  // Nebraska
  { name: 'Nebraska Cornhuskers Football', performer: 'Nebraska Cornhuskers', category: 'sports', venueName: 'Nebraska Memorial Stadium', city: 'Lincoln', state: 'NE', minPrice: 85, maxPrice: 495, isFeatured: true },
  { name: 'Garth Brooks Nebraska', performer: 'Garth Brooks', category: 'concerts', venueName: 'Nebraska Memorial Stadium', city: 'Lincoln', state: 'NE', minPrice: 95, maxPrice: 395 },
  { name: 'Eric Church Nebraska', performer: 'Eric Church', category: 'concerts', venueName: 'Pinnacle Bank Arena', city: 'Lincoln', state: 'NE', minPrice: 65, maxPrice: 245 },
  { name: 'Nebraska Basketball', performer: 'Nebraska Huskers', category: 'sports', venueName: 'Pinnacle Bank Arena', city: 'Lincoln', state: 'NE', minPrice: 35, maxPrice: 175 },
  { name: 'Bourbon Theatre Shows', performer: 'Various Artists', category: 'concerts', venueName: 'Bourbon Theatre', city: 'Lincoln', state: 'NE', minPrice: 25, maxPrice: 75 },
  { name: 'State Fair Events', performer: 'Various Artists', category: 'concerts', venueName: 'Heartland Events Center at the Nebraska State Fair', city: 'Grand Island', state: 'NE', minPrice: 35, maxPrice: 125 },
  { name: 'Pinewood Bowl Summer Series', performer: 'Various Artists', category: 'concerts', venueName: 'Pinewood Bowl Theater', city: 'Lincoln', state: 'NE', minPrice: 35, maxPrice: 125 },
  { name: 'Nebraska Volleyball', performer: 'Nebraska Huskers', category: 'sports', venueName: 'Mortgage Matchup Center', city: 'Lincoln', state: 'NE', minPrice: 25, maxPrice: 125 },
  
  // Colorado Springs
  { name: 'Broadmoor Arena Events', performer: 'Various Artists', category: 'concerts', venueName: 'Broadmoor World Arena', city: 'Colorado Springs', state: 'CO', minPrice: 45, maxPrice: 175 },
  { name: 'Colorado College Hockey', performer: 'Colorado College Tigers', category: 'sports', venueName: 'Broadmoor World Arena', city: 'Colorado Springs', state: 'CO', minPrice: 25, maxPrice: 95 },
  
  // Pennsylvania
  { name: 'Santander Arena Events', performer: 'Various Artists', category: 'concerts', venueName: 'Santander Arena', city: 'Reading', state: 'PA', minPrice: 35, maxPrice: 145 },
  { name: 'Reading Royals Hockey', performer: 'Reading Royals', category: 'sports', venueName: 'Santander Arena', city: 'Reading', state: 'PA', minPrice: 25, maxPrice: 95 },
  { name: 'Cure Insurance Arena Events', performer: 'Various Artists', category: 'concerts', venueName: 'Cure Insurance Arena', city: 'Trenton', state: 'NJ', minPrice: 35, maxPrice: 125 },
  
  // UK venues
  { name: 'U2 O2 Arena', performer: 'U2', category: 'concerts', venueName: 'O2 Arena', city: 'London', state: '', minPrice: 125, maxPrice: 495 },
  { name: 'Adele London Residency', performer: 'Adele', category: 'concerts', venueName: 'O2 Arena', city: 'London', state: '', minPrice: 145, maxPrice: 595, isFeatured: true },
  { name: 'BBC Proms', performer: 'BBC Symphony Orchestra', category: 'concerts', venueName: 'Royal Albert Hall', city: 'London', state: '', minPrice: 65, maxPrice: 245 },
  { name: 'Eric Clapton at Royal Albert Hall', performer: 'Eric Clapton', category: 'concerts', venueName: 'Royal Albert Hall', city: 'London', state: '', minPrice: 95, maxPrice: 395 },
  
  // ========== SPORTS EVENTS ==========
  // NBA
  { name: 'LA Clippers vs Warriors', performer: 'LA Clippers', category: 'sports', venueName: 'Intuit Dome', city: 'Inglewood', state: 'CA', minPrice: 85, maxPrice: 495 },
  { name: 'LA Clippers vs Lakers', performer: 'LA Clippers', category: 'sports', venueName: 'Intuit Dome', city: 'Inglewood', state: 'CA', minPrice: 125, maxPrice: 695, isFeatured: true },
  { name: 'Golden State Warriors vs Celtics', performer: 'Golden State Warriors', category: 'sports', venueName: 'Chase Center', city: 'San Francisco', state: 'CA', minPrice: 95, maxPrice: 595 },
  { name: 'Brooklyn Nets vs Knicks', performer: 'Brooklyn Nets', category: 'sports', venueName: 'Barclays Center', city: 'Brooklyn', state: 'NY', minPrice: 85, maxPrice: 495 },
  { name: 'New York Knicks vs Heat', performer: 'New York Knicks', category: 'sports', venueName: 'Madison Square Garden', city: 'New York', state: 'NY', minPrice: 95, maxPrice: 595 },
  { name: 'Boston Celtics Playoff', performer: 'Boston Celtics', category: 'sports', venueName: 'Madison Square Garden', city: 'New York', state: 'NY', minPrice: 125, maxPrice: 795 },
  { name: 'Miami Heat vs Celtics', performer: 'Miami Heat', category: 'sports', venueName: 'Kaseya Center', city: 'Miami', state: 'FL', minPrice: 75, maxPrice: 395 },
  { name: 'Dallas Mavericks vs Lakers', performer: 'Dallas Mavericks', category: 'sports', venueName: 'American Airlines Center', city: 'Dallas', state: 'TX', minPrice: 85, maxPrice: 495 },
  { name: 'Denver Nuggets Championship', performer: 'Denver Nuggets', category: 'sports', venueName: 'Ball Arena', city: 'Denver', state: 'CO', minPrice: 95, maxPrice: 595 },
  
  // NHL
  { name: 'New York Rangers Playoffs', performer: 'New York Rangers', category: 'sports', venueName: 'Madison Square Garden', city: 'New York', state: 'NY', minPrice: 95, maxPrice: 595 },
  { name: 'Colorado Avalanche vs Knights', performer: 'Colorado Avalanche', category: 'sports', venueName: 'Ball Arena', city: 'Denver', state: 'CO', minPrice: 65, maxPrice: 345 },
  { name: 'Vegas Golden Knights vs Kings', performer: 'Vegas Golden Knights', category: 'sports', venueName: 'Michelob Ultra Arena', city: 'Las Vegas', state: 'NV', minPrice: 75, maxPrice: 395 },
  { name: 'LA Kings vs Ducks', performer: 'LA Kings', category: 'sports', venueName: 'Crypto.com Arena', city: 'Los Angeles', state: 'CA', minPrice: 55, maxPrice: 295 },
  { name: 'Dallas Stars Playoffs', performer: 'Dallas Stars', category: 'sports', venueName: 'American Airlines Center', city: 'Dallas', state: 'TX', minPrice: 75, maxPrice: 395 },
  { name: 'New Jersey Devils vs Rangers', performer: 'New Jersey Devils', category: 'sports', venueName: 'Prudential Center', city: 'Newark', state: 'NJ', minPrice: 65, maxPrice: 345 },
  { name: 'Philadelphia Flyers vs Penguins', performer: 'Philadelphia Flyers', category: 'sports', venueName: 'Prudential Center', city: 'Newark', state: 'NJ', minPrice: 55, maxPrice: 295 },
  
  // NFL
  { name: 'Denver Broncos vs Chiefs', performer: 'Denver Broncos', category: 'sports', venueName: 'Empower Field at Mile High', city: 'Denver', state: 'CO', minPrice: 95, maxPrice: 595 },
  { name: 'Dallas Cowboys vs Eagles', performer: 'Dallas Cowboys', category: 'sports', venueName: 'Globe Life Field', city: 'Arlington', state: 'TX', minPrice: 125, maxPrice: 695 },
  { name: 'LA Rams vs 49ers', performer: 'LA Rams', category: 'sports', venueName: 'SoFi Stadium', city: 'Inglewood', state: 'CA', minPrice: 125, maxPrice: 695 },
  { name: 'Chicago Bears vs Packers', performer: 'Chicago Bears', category: 'sports', venueName: 'Soldier Field', city: 'Chicago', state: 'IL', minPrice: 95, maxPrice: 595 },
  { name: 'New York Giants vs Cowboys', performer: 'New York Giants', category: 'sports', venueName: 'MetLife Stadium', city: 'East Rutherford', state: 'NJ', minPrice: 95, maxPrice: 495 },
  { name: 'Atlanta Falcons vs Saints', performer: 'Atlanta Falcons', category: 'sports', venueName: 'Mercedes-Benz Stadium', city: 'Atlanta', state: 'GA', minPrice: 85, maxPrice: 445 },
  { name: 'Houston Texans vs Cowboys', performer: 'Houston Texans', category: 'sports', venueName: 'NRG Stadium', city: 'Houston', state: 'TX', minPrice: 75, maxPrice: 395 },
  
  // Other Sports
  { name: 'Fort Worth Stock Show & Rodeo', performer: 'Fort Worth Stock Show & Rodeo', category: 'sports', venueName: 'Dickies Arena', city: 'Fort Worth', state: 'TX', minPrice: 35, maxPrice: 175, isFeatured: true },
  { name: 'WWE Monday Night Raw', performer: 'WWE', category: 'sports', venueName: 'Allstate Arena', city: 'Rosemont', state: 'IL', minPrice: 45, maxPrice: 295 },
  { name: 'WWE SmackDown', performer: 'WWE', category: 'sports', venueName: 'Madison Square Garden', city: 'New York', state: 'NY', minPrice: 55, maxPrice: 345 },
  { name: 'Monster Jam', performer: 'Monster Jam', category: 'sports', venueName: 'SoFi Stadium', city: 'Inglewood', state: 'CA', minPrice: 35, maxPrice: 145 },
  { name: 'UFC 300', performer: 'UFC', category: 'sports', venueName: 'MGM Grand Garden Arena', city: 'Las Vegas', state: 'NV', minPrice: 295, maxPrice: 1495, isFeatured: true },
  { name: 'NASCAR Cup Series', performer: 'NASCAR', category: 'sports', venueName: 'Las Vegas Motor Speedway', city: 'Las Vegas', state: 'NV', minPrice: 65, maxPrice: 295 },
  { name: 'F1 Las Vegas Grand Prix', performer: 'Formula 1', category: 'sports', venueName: 'Las Vegas Motor Speedway', city: 'Las Vegas', state: 'NV', minPrice: 295, maxPrice: 2495, isFeatured: true },
  { name: 'EchoPark Racing', performer: 'NASCAR', category: 'sports', venueName: 'EchoPark Speedway', city: 'Austin', state: 'TX', minPrice: 55, maxPrice: 245 },
  
  // ========== COMEDY ==========
  { name: 'Kevin Hart Reality Check', performer: 'Kevin Hart', category: 'comedy', venueName: 'Madison Square Garden', city: 'New York', state: 'NY', minPrice: 85, maxPrice: 395 },
  { name: 'Dave Chappelle Live', performer: 'Dave Chappelle', category: 'comedy', venueName: 'Radio City Music Hall', city: 'New York', state: 'NY', minPrice: 95, maxPrice: 445 },
  { name: 'Chris Rock Ego Death Tour', performer: 'Chris Rock', category: 'comedy', venueName: 'Hollywood Bowl', city: 'Los Angeles', state: 'CA', minPrice: 75, maxPrice: 295 },
  { name: 'Sebastian Maniscalco', performer: 'Sebastian Maniscalco', category: 'comedy', venueName: 'Kia Forum', city: 'Inglewood', state: 'CA', minPrice: 65, maxPrice: 245 },
  { name: 'Jim Gaffigan Dark Pale Tour', performer: 'Jim Gaffigan', category: 'comedy', venueName: 'Beacon Theatre', city: 'New York', state: 'NY', minPrice: 55, maxPrice: 175 },
  { name: 'Bert Kreischer Tops Off Tour', performer: 'Bert Kreischer', category: 'comedy', venueName: 'Allstate Arena', city: 'Rosemont', state: 'IL', minPrice: 55, maxPrice: 195 },
  { name: 'Tom Segura I Am the Machine', performer: 'Tom Segura', category: 'comedy', venueName: 'Climate Pledge Arena', city: 'Seattle', state: 'WA', minPrice: 55, maxPrice: 195 },
  { name: 'John Mulaney From Scratch', performer: 'John Mulaney', category: 'comedy', venueName: 'Chase Center', city: 'San Francisco', state: 'CA', minPrice: 75, maxPrice: 295 },
  { name: 'Bill Burr Live', performer: 'Bill Burr', category: 'comedy', venueName: 'Dolby Live at Park MGM', city: 'Las Vegas', state: 'NV', minPrice: 65, maxPrice: 245 },
  { name: 'Trevor Noah Back to Abnormal', performer: 'Trevor Noah', category: 'comedy', venueName: 'MGM Grand Garden Arena', city: 'Las Vegas', state: 'NV', minPrice: 65, maxPrice: 245 },
  
  // ========== FESTIVALS ==========
  { name: 'Coachella Music Festival', performer: 'Various Artists', category: 'festivals', venueName: 'Hard Rock Stadium', city: 'Miami Gardens', state: 'FL', minPrice: 395, maxPrice: 1295, isFeatured: true },
  { name: 'Rolling Loud Miami', performer: 'Various Artists', category: 'festivals', venueName: 'Hard Rock Stadium', city: 'Miami Gardens', state: 'FL', minPrice: 295, maxPrice: 995 },
  { name: 'Lollapalooza Chicago', performer: 'Various Artists', category: 'festivals', venueName: 'Soldier Field', city: 'Chicago', state: 'IL', minPrice: 295, maxPrice: 895 },
  { name: 'Austin City Limits', performer: 'Various Artists', category: 'festivals', venueName: 'EchoPark Speedway', city: 'Austin', state: 'TX', minPrice: 295, maxPrice: 895, isFeatured: true },
  { name: 'Outside Lands', performer: 'Various Artists', category: 'festivals', venueName: 'Chase Center', city: 'San Francisco', state: 'CA', minPrice: 295, maxPrice: 895 },
  { name: 'Electric Daisy Carnival', performer: 'Various Artists', category: 'festivals', venueName: 'Las Vegas Motor Speedway', city: 'Las Vegas', state: 'NV', minPrice: 395, maxPrice: 1495, isFeatured: true },
  { name: 'Ultra Music Festival', performer: 'Various Artists', category: 'festivals', venueName: 'Kaseya Center', city: 'Miami', state: 'FL', minPrice: 395, maxPrice: 1295 },
  { name: 'Country Thunder Arizona', performer: 'Various Artists', category: 'festivals', venueName: 'Desert Diamond Arena', city: 'Glendale', state: 'AZ', minPrice: 195, maxPrice: 595 },
  { name: 'Stagecoach Festival', performer: 'Various Artists', category: 'festivals', venueName: 'SoFi Stadium', city: 'Inglewood', state: 'CA', minPrice: 295, maxPrice: 895 },
];

// Convert raw events to full Event objects
export const allEvents: Event[] = rawEvents.map((raw) => {
  const venueData = getOrCreateVenueData(raw.venueName, raw.city, raw.state);
  
  return {
    id: generateEventId(venueData.id),
    name: raw.name,
    performer: raw.performer,
    performerImage: getPerformerImage(raw.performer, raw.category),
    category: raw.category,
    venueId: venueData.id,
    venueName: raw.venueName,
    date: raw.date || randomFutureDate(),
    time: raw.time || randomTime(),
    description: raw.description || `Experience ${raw.performer} live at ${raw.venueName} in ${raw.city || venueData.city}${raw.state ? `, ${raw.state}` : venueData.state ? `, ${venueData.state}` : ''}.`,
    isFeatured: raw.isFeatured || false,
    minPrice: raw.minPrice,
    maxPrice: raw.maxPrice,
  };
});

// Get events filtered by category
export function getEventsByCategory(category: string): Event[] {
  if (category === 'all') return allEvents;
  return allEvents.filter(e => e.category === category);
}

// Get events by venue
export function getEventsByVenue(venueId: string): Event[] {
  return allEvents.filter(e => e.venueId === venueId);
}

// Get featured events (excludes World Cup - they have their own section)
export function getFeaturedEvents(): Event[] {
  return allEvents.filter(e => e.isFeatured && !e.name.toLowerCase().includes('world cup'));
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

// Get total event count
export function getTotalEventCount(): number {
  return allEvents.length;
}

// Get unique venues with events
export function getVenuesWithEvents(): string[] {
  return [...new Set(allEvents.map(e => e.venueName))];
}

// Get events by city (matches venue city)
export function getEventsByCity(city: string): Event[] {
  if (!city) return [];
  const lowerCity = city.toLowerCase();
  return allEvents.filter(event => {
    const venueName = event.venueName;
    const venueData = venueMetadata[venueName];
    if (!venueData) return false;
    return venueData.city.toLowerCase() === lowerCity;
  });
}

// Get FIFA World Cup 2026 events
export function getWorldCupEvents(): Event[] {
  return allEvents.filter(event => 
    event.name.toLowerCase().includes('world cup 2026')
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}
