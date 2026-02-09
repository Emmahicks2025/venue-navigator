import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// All events data from the platform
const rawEvents = [
  // ========== CONCERTS ==========
  // Houston
  { name: 'Riff Raff: Houses Way In Tour', performer: 'Riff Raff', category: 'concerts', venue_name: '713 Music Hall', venue_city: 'Houston', venue_state: 'TX', min_price: 35, max_price: 150 },
  { name: 'Maverick City Music', performer: 'Maverick City Music', category: 'concerts', venue_name: '713 Music Hall', venue_city: 'Houston', venue_state: 'TX', min_price: 45, max_price: 175 },
  { name: 'Grupo Frontera', performer: 'Grupo Frontera', category: 'concerts', venue_name: '713 Music Hall', venue_city: 'Houston', venue_state: 'TX', min_price: 55, max_price: 225 },
  { name: 'Los Bukis', performer: 'Los Bukis', category: 'concerts', venue_name: 'NRG Stadium', venue_city: 'Houston', venue_state: 'TX', min_price: 85, max_price: 495, is_featured: true },
  { name: 'Bad Bunny: Most Wanted Tour', performer: 'Bad Bunny', category: 'concerts', venue_name: 'NRG Stadium', venue_city: 'Houston', venue_state: 'TX', min_price: 125, max_price: 695, is_featured: true },
  { name: 'Chris Stapleton', performer: 'Chris Stapleton', category: 'concerts', venue_name: 'Cynthia Woods Mitchell Pavilion', venue_city: 'The Woodlands', venue_state: 'TX', min_price: 65, max_price: 285 },
  { name: 'Morgan Wallen: One Night At A Time', performer: 'Morgan Wallen', category: 'concerts', venue_name: 'NRG Stadium', venue_city: 'Houston', venue_state: 'TX', min_price: 95, max_price: 495, is_featured: true },
  { name: 'Zach Bryan', performer: 'Zach Bryan', category: 'concerts', venue_name: 'NRG Stadium', venue_city: 'Houston', venue_state: 'TX', min_price: 85, max_price: 395, is_featured: true },
  { name: 'Luke Combs World Tour', performer: 'Luke Combs', category: 'concerts', venue_name: 'NRG Stadium', venue_city: 'Houston', venue_state: 'TX', min_price: 75, max_price: 375 },
  { name: 'Beyoncé Renaissance World Tour', performer: 'Beyoncé', category: 'concerts', venue_name: 'NRG Stadium', venue_city: 'Houston', venue_state: 'TX', min_price: 150, max_price: 895, is_featured: true },
  { name: 'Janet Jackson: Together Again Tour', performer: 'Janet Jackson', category: 'concerts', venue_name: 'Smart Financial Centre', venue_city: 'Sugar Land', venue_state: 'TX', min_price: 85, max_price: 395 },
  { name: 'Usher Past Present Future', performer: 'Usher', category: 'concerts', venue_name: 'Smart Financial Centre', venue_city: 'Sugar Land', venue_state: 'TX', min_price: 95, max_price: 445 },
  // Dallas/Fort Worth
  { name: 'Tool Fear Inoculum Tour', performer: 'Tool', category: 'concerts', venue_name: 'American Airlines Center', venue_city: 'Dallas', venue_state: 'TX', min_price: 75, max_price: 295 },
  { name: 'Drake: Its All A Blur Tour', performer: 'Drake', category: 'concerts', venue_name: 'American Airlines Center', venue_city: 'Dallas', venue_state: 'TX', min_price: 125, max_price: 595, is_featured: true },
  { name: 'The Weeknd After Hours Til Dawn', performer: 'The Weeknd', category: 'concerts', venue_name: 'American Airlines Center', venue_city: 'Dallas', venue_state: 'TX', min_price: 95, max_price: 495 },
  { name: 'Bruno Mars Live', performer: 'Bruno Mars', category: 'concerts', venue_name: 'Globe Life Field', venue_city: 'Arlington', venue_state: 'TX', min_price: 125, max_price: 595, is_featured: true },
  { name: 'Post Malone: Twelve Carat Tour', performer: 'Post Malone', category: 'concerts', venue_name: 'American Airlines Center', venue_city: 'Dallas', venue_state: 'TX', min_price: 65, max_price: 295 },
  { name: 'Metallica M72 World Tour', performer: 'Metallica', category: 'concerts', venue_name: 'Globe Life Field', venue_city: 'Arlington', venue_state: 'TX', min_price: 95, max_price: 495, is_featured: true },
  { name: 'Country Fest Texas', performer: 'Various Artists', category: 'concerts', venue_name: 'Dos Equis Pavilion', venue_city: 'Dallas', venue_state: 'TX', min_price: 45, max_price: 195 },
  { name: 'Backstreet Boys DNA World Tour', performer: 'Backstreet Boys', category: 'concerts', venue_name: 'Dos Equis Pavilion', venue_city: 'Dallas', venue_state: 'TX', min_price: 55, max_price: 245 },
  { name: 'Kid Rock', performer: 'Kid Rock', category: 'concerts', venue_name: 'Dos Equis Pavilion', venue_city: 'Dallas', venue_state: 'TX', min_price: 45, max_price: 195 },
  { name: 'Eric Church', performer: 'Eric Church', category: 'concerts', venue_name: 'Dickies Arena', venue_city: 'Fort Worth', venue_state: 'TX', min_price: 65, max_price: 285 },
  { name: 'George Strait', performer: 'George Strait', category: 'concerts', venue_name: 'Dickies Arena', venue_city: 'Fort Worth', venue_state: 'TX', min_price: 95, max_price: 495, is_featured: true },
  { name: 'Cody Johnson', performer: 'Cody Johnson', category: 'concerts', venue_name: 'Dickies Arena', venue_city: 'Fort Worth', venue_state: 'TX', min_price: 55, max_price: 225 },
  { name: 'House of Blues Presents', performer: 'Various Artists', category: 'concerts', venue_name: 'House of Blues Dallas', venue_city: 'Dallas', venue_state: 'TX', min_price: 35, max_price: 125 },
  // Los Angeles
  { name: 'Taylor Swift Eras Tour', performer: 'Taylor Swift', category: 'concerts', venue_name: 'SoFi Stadium', venue_city: 'Inglewood', venue_state: 'CA', min_price: 195, max_price: 1295, is_featured: true },
  { name: 'Coldplay Music of the Spheres', performer: 'Coldplay', category: 'concerts', venue_name: 'SoFi Stadium', venue_city: 'Inglewood', venue_state: 'CA', min_price: 125, max_price: 595, is_featured: true },
  { name: 'Beyoncé Renaissance', performer: 'Beyoncé', category: 'concerts', venue_name: 'SoFi Stadium', venue_city: 'Inglewood', venue_state: 'CA', min_price: 195, max_price: 995, is_featured: true },
  { name: 'Ed Sheeran Mathematics Tour', performer: 'Ed Sheeran', category: 'concerts', venue_name: 'SoFi Stadium', venue_city: 'Inglewood', venue_state: 'CA', min_price: 95, max_price: 495 },
  { name: 'U2 UV Achtung Baby', performer: 'U2', category: 'concerts', venue_name: 'MSG Sphere', venue_city: 'Las Vegas', venue_state: 'NV', min_price: 195, max_price: 895, is_featured: true },
  { name: 'Kendrick Lamar: Big Steppers Tour', performer: 'Kendrick Lamar', category: 'concerts', venue_name: 'Crypto.com Arena', venue_city: 'Los Angeles', venue_state: 'CA', min_price: 95, max_price: 495 },
  { name: 'Billie Eilish Happier Than Ever', performer: 'Billie Eilish', category: 'concerts', venue_name: 'Crypto.com Arena', venue_city: 'Los Angeles', venue_state: 'CA', min_price: 85, max_price: 395 },
  { name: 'Harry Styles Love on Tour', performer: 'Harry Styles', category: 'concerts', venue_name: 'Kia Forum', venue_city: 'Inglewood', venue_state: 'CA', min_price: 95, max_price: 445, is_featured: true },
  { name: 'Adele Weekends with Adele', performer: 'Adele', category: 'concerts', venue_name: 'Dolby Live at Park MGM', venue_city: 'Las Vegas', venue_state: 'NV', min_price: 295, max_price: 1495, is_featured: true },
  { name: 'Hollywood Bowl Summer Series', performer: 'LA Philharmonic', category: 'concerts', venue_name: 'Hollywood Bowl', venue_city: 'Los Angeles', venue_state: 'CA', min_price: 45, max_price: 295 },
  { name: 'Indie Night at Palladium', performer: 'Various Artists', category: 'concerts', venue_name: 'Hollywood Palladium', venue_city: 'Los Angeles', venue_state: 'CA', min_price: 35, max_price: 125 },
  { name: 'Pantages Broadway Series', performer: 'Various Shows', category: 'theater', venue_name: 'Pantages Theatre', venue_city: 'Los Angeles', venue_state: 'CA', min_price: 65, max_price: 295 },
  // San Francisco
  { name: 'Dead & Company Final Tour', performer: 'Dead & Company', category: 'concerts', venue_name: 'Chase Center', venue_city: 'San Francisco', venue_state: 'CA', min_price: 95, max_price: 495 },
  { name: 'Phish Summer Tour', performer: 'Phish', category: 'concerts', venue_name: 'Chase Center', venue_city: 'San Francisco', venue_state: 'CA', min_price: 75, max_price: 295 },
  { name: 'Bad Bunny World Hottest Tour', performer: 'Bad Bunny', category: 'concerts', venue_name: "Levi's Stadium", venue_city: 'Santa Clara', venue_state: 'CA', min_price: 125, max_price: 695, is_featured: true },
  // Las Vegas
  { name: 'Lady Gaga Jazz & Piano', performer: 'Lady Gaga', category: 'concerts', venue_name: 'Dolby Live at Park MGM', venue_city: 'Las Vegas', venue_state: 'NV', min_price: 195, max_price: 895, is_featured: true },
  { name: 'Usher My Way Residency', performer: 'Usher', category: 'concerts', venue_name: 'Dolby Live at Park MGM', venue_city: 'Las Vegas', venue_state: 'NV', min_price: 125, max_price: 595 },
  { name: 'Bruno Mars at Dolby Live', performer: 'Bruno Mars', category: 'concerts', venue_name: 'Dolby Live at Park MGM', venue_city: 'Las Vegas', venue_state: 'NV', min_price: 195, max_price: 795, is_featured: true },
  { name: 'Cirque du Soleil O', performer: 'Cirque du Soleil', category: 'theater', venue_name: 'Bellagio', venue_city: 'Las Vegas', venue_state: 'NV', min_price: 125, max_price: 395 },
  { name: 'Tournament of Kings', performer: 'Tournament of Kings', category: 'theater', venue_name: 'Excalibur', venue_city: 'Las Vegas', venue_state: 'NV', min_price: 65, max_price: 125 },
  { name: 'Katy Perry Play', performer: 'Katy Perry', category: 'concerts', venue_name: 'Fontainebleau Las Vegas', venue_city: 'Las Vegas', venue_state: 'NV', min_price: 145, max_price: 595 },
  { name: 'Garth Brooks Plus One', performer: 'Garth Brooks', category: 'concerts', venue_name: 'MGM Grand Garden Arena', venue_city: 'Las Vegas', venue_state: 'NV', min_price: 95, max_price: 495 },
  { name: 'Keith Urban Vegas Residency', performer: 'Keith Urban', category: 'concerts', venue_name: 'Fontainebleau Las Vegas', venue_city: 'Las Vegas', venue_state: 'NV', min_price: 95, max_price: 395 },
  { name: 'Cirque KA', performer: 'Cirque du Soleil', category: 'theater', venue_name: 'MGM Grand Garden Arena', venue_city: 'Las Vegas', venue_state: 'NV', min_price: 95, max_price: 295 },
  { name: 'Blue Man Group', performer: 'Blue Man Group', category: 'theater', venue_name: 'Mandalay Bay', venue_city: 'Las Vegas', venue_state: 'NV', min_price: 75, max_price: 175 },
  { name: 'Michael Jackson ONE', performer: 'Cirque du Soleil', category: 'theater', venue_name: 'Mandalay Bay', venue_city: 'Las Vegas', venue_state: 'NV', min_price: 95, max_price: 295 },
  { name: 'Penn & Teller', performer: 'Penn & Teller', category: 'comedy', venue_name: 'Rio Las Vegas', venue_city: 'Las Vegas', venue_state: 'NV', min_price: 85, max_price: 195 },
  { name: 'Carrot Top Live', performer: 'Carrot Top', category: 'comedy', venue_name: 'Mirage', venue_city: 'Las Vegas', venue_state: 'NV', min_price: 55, max_price: 125 },
  { name: 'David Copperfield', performer: 'David Copperfield', category: 'theater', venue_name: 'MGM Grand Garden Arena', venue_city: 'Las Vegas', venue_state: 'NV', min_price: 95, max_price: 295 },
  { name: 'Phish Dead Air', performer: 'Phish', category: 'concerts', venue_name: 'MSG Sphere', venue_city: 'Las Vegas', venue_state: 'NV', min_price: 125, max_price: 495 },
  { name: 'Eagles Hotel California Tour', performer: 'Eagles', category: 'concerts', venue_name: 'MSG Sphere', venue_city: 'Las Vegas', venue_state: 'NV', min_price: 195, max_price: 895, is_featured: true },
  // New York
  { name: 'Billy Joel MSG Residency', performer: 'Billy Joel', category: 'concerts', venue_name: 'Madison Square Garden', venue_city: 'New York', venue_state: 'NY', min_price: 125, max_price: 695, is_featured: true },
  { name: 'Bruce Springsteen and E Street Band', performer: 'Bruce Springsteen', category: 'concerts', venue_name: 'Madison Square Garden', venue_city: 'New York', venue_state: 'NY', min_price: 145, max_price: 795, is_featured: true },
  { name: 'Phish MSG Run', performer: 'Phish', category: 'concerts', venue_name: 'Madison Square Garden', venue_city: 'New York', venue_state: 'NY', min_price: 95, max_price: 395 },
  { name: 'Foo Fighters Everything or Nothing', performer: 'Foo Fighters', category: 'concerts', venue_name: 'Madison Square Garden', venue_city: 'New York', venue_state: 'NY', min_price: 85, max_price: 395 },
  { name: 'Jay-Z 4:44 Tour', performer: 'Jay-Z', category: 'concerts', venue_name: 'Barclays Center', venue_city: 'Brooklyn', venue_state: 'NY', min_price: 125, max_price: 595 },
  { name: 'Kendrick Lamar Mr Morale Tour', performer: 'Kendrick Lamar', category: 'concerts', venue_name: 'Barclays Center', venue_city: 'Brooklyn', venue_state: 'NY', min_price: 95, max_price: 445 },
  { name: 'Radio City Christmas Spectacular', performer: 'The Rockettes', category: 'theater', venue_name: 'Radio City Music Hall', venue_city: 'New York', venue_state: 'NY', min_price: 65, max_price: 295 },
  { name: 'Tony Bennett Tribute', performer: 'Various Artists', category: 'concerts', venue_name: 'Radio City Music Hall', venue_city: 'New York', venue_state: 'NY', min_price: 85, max_price: 395 },
  { name: 'Beacon Theatre Jazz Series', performer: 'Various Artists', category: 'concerts', venue_name: 'Beacon Theatre', venue_city: 'New York', venue_state: 'NY', min_price: 55, max_price: 195 },
  { name: 'Forest Hills Stadium Summer', performer: 'Various Artists', category: 'concerts', venue_name: 'Forest Hills Stadium', venue_city: 'Queens', venue_state: 'NY', min_price: 65, max_price: 295 },
  // Broadway
  { name: 'Wicked', performer: 'Wicked Cast', category: 'theater', venue_name: 'Gershwin Theatre', venue_city: 'New York', venue_state: 'NY', min_price: 95, max_price: 395, is_featured: true },
  { name: 'Hamilton', performer: 'Hamilton Cast', category: 'theater', venue_name: 'Imperial Theatre', venue_city: 'New York', venue_state: 'NY', min_price: 125, max_price: 495, is_featured: true },
  { name: 'The Lion King', performer: 'Lion King Cast', category: 'theater', venue_name: 'Minskoff Theatre', venue_city: 'New York', venue_state: 'NY', min_price: 95, max_price: 395 },
  { name: 'Aladdin', performer: 'Aladdin Cast', category: 'theater', venue_name: 'New Amsterdam Theatre', venue_city: 'New York', venue_state: 'NY', min_price: 75, max_price: 295 },
  { name: 'Harry Potter and the Cursed Child', performer: 'Harry Potter Cast', category: 'theater', venue_name: 'Lyric Theatre', venue_city: 'New York', venue_state: 'NY', min_price: 95, max_price: 395 },
  // New Jersey
  { name: 'Dead & Company', performer: 'Dead & Company', category: 'concerts', venue_name: 'MetLife Stadium', venue_city: 'East Rutherford', venue_state: 'NJ', min_price: 95, max_price: 495 },
  { name: 'Taylor Swift Eras Tour East', performer: 'Taylor Swift', category: 'concerts', venue_name: 'MetLife Stadium', venue_city: 'East Rutherford', venue_state: 'NJ', min_price: 195, max_price: 1295, is_featured: true },
  { name: 'Guns N Roses', performer: 'Guns N Roses', category: 'concerts', venue_name: 'MetLife Stadium', venue_city: 'East Rutherford', venue_state: 'NJ', min_price: 85, max_price: 395 },
  { name: 'Bon Jovi Forever Tour', performer: 'Bon Jovi', category: 'concerts', venue_name: 'Prudential Center', venue_city: 'Newark', venue_state: 'NJ', min_price: 85, max_price: 395 },
  { name: 'Rock the Runway', performer: 'Various Artists', category: 'concerts', venue_name: 'PNC Bank Arts Center', venue_city: 'Holmdel', venue_state: 'NJ', min_price: 45, max_price: 195 },
  { name: 'Dave Matthews Band', performer: 'Dave Matthews Band', category: 'concerts', venue_name: 'PNC Bank Arts Center', venue_city: 'Holmdel', venue_state: 'NJ', min_price: 65, max_price: 295 },
  { name: 'Jimmy Buffett Tribute', performer: 'Various Artists', category: 'concerts', venue_name: 'Freedom Mortgage Pavilion', venue_city: 'Camden', venue_state: 'NJ', min_price: 45, max_price: 175 },
  // Chicago
  { name: 'Red Hot Chili Peppers', performer: 'Red Hot Chili Peppers', category: 'concerts', venue_name: 'Soldier Field', venue_city: 'Chicago', venue_state: 'IL', min_price: 85, max_price: 395 },
  { name: 'Taylor Swift Eras Chicago', performer: 'Taylor Swift', category: 'concerts', venue_name: 'Soldier Field', venue_city: 'Chicago', venue_state: 'IL', min_price: 195, max_price: 1295, is_featured: true },
  { name: 'Pearl Jam Dark Matter Tour', performer: 'Pearl Jam', category: 'concerts', venue_name: 'Soldier Field', venue_city: 'Chicago', venue_state: 'IL', min_price: 95, max_price: 495 },
  { name: 'Elton John Farewell', performer: 'Elton John', category: 'concerts', venue_name: 'Soldier Field', venue_city: 'Chicago', venue_state: 'IL', min_price: 125, max_price: 595, is_featured: true },
  { name: 'Foo Fighters Soldier Field', performer: 'Foo Fighters', category: 'concerts', venue_name: 'Soldier Field', venue_city: 'Chicago', venue_state: 'IL', min_price: 85, max_price: 395 },
  { name: 'Imagine Dragons Mercury Tour', performer: 'Imagine Dragons', category: 'concerts', venue_name: 'Allstate Arena', venue_city: 'Rosemont', venue_state: 'IL', min_price: 65, max_price: 295 },
  { name: 'Summer Smash Festival', performer: 'Various Artists', category: 'festivals', venue_name: 'Credit Union 1 Amphitheatre', venue_city: 'Tinley Park', venue_state: 'IL', min_price: 75, max_price: 295 },
  { name: 'Chicago Broadway Show', performer: 'Chicago Cast', category: 'theater', venue_name: 'CIBC Theatre', venue_city: 'Chicago', venue_state: 'IL', min_price: 65, max_price: 245 },
  { name: 'Moulin Rouge Chicago', performer: 'Moulin Rouge Cast', category: 'theater', venue_name: 'Cadillac Palace Theatre', venue_city: 'Chicago', venue_state: 'IL', min_price: 75, max_price: 295 },
  { name: 'Hamilton Chicago', performer: 'Hamilton Cast', category: 'theater', venue_name: 'CIBC Theatre', venue_city: 'Chicago', venue_state: 'IL', min_price: 95, max_price: 395 },
  { name: 'Rosemont Theatre Presents', performer: 'Various Shows', category: 'theater', venue_name: 'Rosemont Theatre', venue_city: 'Rosemont', venue_state: 'IL', min_price: 55, max_price: 195 },
  // Denver
  { name: 'Dead & Company at Red Rocks', performer: 'Dead & Company', category: 'concerts', venue_name: 'Fiddlers Green Amphitheatre', venue_city: 'Greenwood Village', venue_state: 'CO', min_price: 95, max_price: 395 },
  { name: 'Widespread Panic Red Rocks', performer: 'Widespread Panic', category: 'concerts', venue_name: 'Fiddlers Green Amphitheatre', venue_city: 'Greenwood Village', venue_state: 'CO', min_price: 75, max_price: 295 },
  { name: 'Green Day Saviors Tour', performer: 'Green Day', category: 'concerts', venue_name: 'Ball Arena', venue_city: 'Denver', venue_state: 'CO', min_price: 75, max_price: 295 },
  { name: 'Blink-182 Reunion Tour', performer: 'Blink-182', category: 'concerts', venue_name: 'Ball Arena', venue_city: 'Denver', venue_state: 'CO', min_price: 85, max_price: 395 },
  { name: 'Luke Bryan Country On Tour', performer: 'Luke Bryan', category: 'concerts', venue_name: 'Empower Field at Mile High', venue_city: 'Denver', venue_state: 'CO', min_price: 65, max_price: 295 },
  { name: 'The Lumineers Brightside Tour', performer: 'The Lumineers', category: 'concerts', venue_name: 'Fillmore Auditorium Denver', venue_city: 'Denver', venue_state: 'CO', min_price: 55, max_price: 195 },
  { name: 'STS9 at Fillmore', performer: 'STS9', category: 'concerts', venue_name: 'Fillmore Auditorium Denver', venue_city: 'Denver', venue_state: 'CO', min_price: 45, max_price: 145 },
  { name: 'Hamilton Denver', performer: 'Hamilton Cast', category: 'theater', venue_name: 'Buell Theatre', venue_city: 'Denver', venue_state: 'CO', min_price: 85, max_price: 345 },
  { name: 'Broadway Series Denver', performer: 'Various Shows', category: 'theater', venue_name: 'Bellco Theatre', venue_city: 'Denver', venue_state: 'CO', min_price: 55, max_price: 195 },
  // Atlanta
  { name: 'Beyoncé Renaissance Atlanta', performer: 'Beyoncé', category: 'concerts', venue_name: 'Mercedes-Benz Stadium', venue_city: 'Atlanta', venue_state: 'GA', min_price: 175, max_price: 895, is_featured: true },
  { name: 'Taylor Swift Eras Atlanta', performer: 'Taylor Swift', category: 'concerts', venue_name: 'Mercedes-Benz Stadium', venue_city: 'Atlanta', venue_state: 'GA', min_price: 195, max_price: 1295, is_featured: true },
  { name: 'Morgan Wallen Atlanta', performer: 'Morgan Wallen', category: 'concerts', venue_name: 'Mercedes-Benz Stadium', venue_city: 'Atlanta', venue_state: 'GA', min_price: 95, max_price: 495 },
  { name: 'OutKast Reunion Show', performer: 'OutKast', category: 'concerts', venue_name: 'Mercedes-Benz Stadium', venue_city: 'Atlanta', venue_state: 'GA', min_price: 125, max_price: 595, is_featured: true },
  { name: 'Atlanta Symphony Orchestra', performer: 'Atlanta Symphony', category: 'concerts', venue_name: 'Atlanta Symphony Hall', venue_city: 'Atlanta', venue_state: 'GA', min_price: 45, max_price: 195 },
  { name: 'Fox Theatre Broadway Series', performer: 'Various Shows', category: 'theater', venue_name: 'Fox Theatre', venue_city: 'Atlanta', venue_state: 'GA', min_price: 65, max_price: 245 },
  { name: 'Summer Concerts at Cellairis', performer: 'Various Artists', category: 'concerts', venue_name: 'Cellairis Amphitheatre', venue_city: 'Atlanta', venue_state: 'GA', min_price: 45, max_price: 175 },
  { name: 'Country Thunder Georgia', performer: 'Various Artists', category: 'concerts', venue_name: 'Ameris Bank Amphitheatre', venue_city: 'Alpharetta', venue_state: 'GA', min_price: 55, max_price: 225 },
  { name: 'Rock Fest Atlanta', performer: 'Various Artists', category: 'concerts', venue_name: 'Gas South Arena', venue_city: 'Duluth', venue_state: 'GA', min_price: 45, max_price: 175 },
  { name: 'Georgia Tech Football', performer: 'Georgia Tech Yellow Jackets', category: 'sports', venue_name: 'Bobby Dodd Stadium', venue_city: 'Atlanta', venue_state: 'GA', min_price: 35, max_price: 195 },
  // Florida
  { name: 'Rolling Stones Hackney Diamonds', performer: 'The Rolling Stones', category: 'concerts', venue_name: 'Hard Rock Stadium', venue_city: 'Miami Gardens', venue_state: 'FL', min_price: 145, max_price: 695, is_featured: true },
  { name: 'Bad Bunny Miami', performer: 'Bad Bunny', category: 'concerts', venue_name: 'Hard Rock Stadium', venue_city: 'Miami Gardens', venue_state: 'FL', min_price: 125, max_price: 695, is_featured: true },
  { name: 'Super Bowl Experience', performer: 'Various Artists', category: 'sports', venue_name: 'Hard Rock Stadium', venue_city: 'Miami Gardens', venue_state: 'FL', min_price: 195, max_price: 1495 },
  { name: 'Pitbull Party After Dark', performer: 'Pitbull', category: 'concerts', venue_name: 'Kaseya Center', venue_city: 'Miami', venue_state: 'FL', min_price: 75, max_price: 295 },
  { name: 'Marc Anthony Viviendo Tour', performer: 'Marc Anthony', category: 'concerts', venue_name: 'Kaseya Center', venue_city: 'Miami', venue_state: 'FL', min_price: 85, max_price: 395 },
  { name: 'J Balvin Mi Gente Tour', performer: 'J Balvin', category: 'concerts', venue_name: 'Kaseya Center', venue_city: 'Miami', venue_state: 'FL', min_price: 75, max_price: 345 },
  { name: 'Miami Heat vs Lakers', performer: 'Miami Heat', category: 'sports', venue_name: 'Kaseya Center', venue_city: 'Miami', venue_state: 'FL', min_price: 85, max_price: 595 },
  { name: 'Florida Panthers Hockey', performer: 'Florida Panthers', category: 'sports', venue_name: 'Amerant Bank Arena', venue_city: 'Sunrise', venue_state: 'FL', min_price: 55, max_price: 295 },
  { name: 'Hozier Unreal Unearth Tour', performer: 'Hozier', category: 'concerts', venue_name: 'Hard Rock Live', venue_city: 'Hollywood', venue_state: 'FL', min_price: 65, max_price: 245 },
  { name: 'John Legend Live', performer: 'John Legend', category: 'concerts', venue_name: 'Hard Rock Live', venue_city: 'Hollywood', venue_state: 'FL', min_price: 85, max_price: 345 },
  { name: 'Miami Marlins vs Braves', performer: 'Miami Marlins', category: 'sports', venue_name: 'loanDepot Park', venue_city: 'Miami', venue_state: 'FL', min_price: 25, max_price: 195 },
  { name: 'Palm Beach Summer Pops', performer: 'Various Artists', category: 'concerts', venue_name: 'Dreyfoos Hall at Kravis Center', venue_city: 'West Palm Beach', venue_state: 'FL', min_price: 55, max_price: 195 },
  { name: 'Summer Concert Series', performer: 'Various Artists', category: 'concerts', venue_name: 'iTHINK Financial Amphitheatre', venue_city: 'West Palm Beach', venue_state: 'FL', min_price: 45, max_price: 175 },
  // Boston
  { name: 'Morgan Wallen at Fenway', performer: 'Morgan Wallen', category: 'concerts', venue_name: 'Fenway Park', venue_city: 'Boston', venue_state: 'MA', min_price: 95, max_price: 495, is_featured: true },
  { name: 'Zach Bryan at Fenway', performer: 'Zach Bryan', category: 'concerts', venue_name: 'Fenway Park', venue_city: 'Boston', venue_state: 'MA', min_price: 85, max_price: 395 },
  { name: 'Pearl Jam Fenway Park', performer: 'Pearl Jam', category: 'concerts', venue_name: 'Fenway Park', venue_city: 'Boston', venue_state: 'MA', min_price: 95, max_price: 495 },
  { name: 'Dead & Company Fenway', performer: 'Dead & Company', category: 'concerts', venue_name: 'Fenway Park', venue_city: 'Boston', venue_state: 'MA', min_price: 95, max_price: 445 },
  { name: 'New England Patriots', performer: 'New England Patriots', category: 'sports', venue_name: 'Gillette Stadium', venue_city: 'Foxborough', venue_state: 'MA', min_price: 85, max_price: 495 },
  { name: 'Ed Sheeran Gillette Stadium', performer: 'Ed Sheeran', category: 'concerts', venue_name: 'Gillette Stadium', venue_city: 'Foxborough', venue_state: 'MA', min_price: 95, max_price: 445 },
  { name: 'Beyoncé Gillette Stadium', performer: 'Beyoncé', category: 'concerts', venue_name: 'Gillette Stadium', venue_city: 'Foxborough', venue_state: 'MA', min_price: 175, max_price: 895, is_featured: true },
  { name: 'Hozier at MGM Fenway', performer: 'Hozier', category: 'concerts', venue_name: 'MGM Music Hall at Fenway', venue_city: 'Boston', venue_state: 'MA', min_price: 65, max_price: 245 },
  { name: 'Phoebe Bridgers', performer: 'Phoebe Bridgers', category: 'concerts', venue_name: 'MGM Music Hall at Fenway', venue_city: 'Boston', venue_state: 'MA', min_price: 55, max_price: 195 },
  { name: 'Roadrunner Indie Series', performer: 'Various Artists', category: 'concerts', venue_name: 'Roadrunner', venue_city: 'Boston', venue_state: 'MA', min_price: 35, max_price: 125 },
  { name: 'Boston Calling', performer: 'Various Artists', category: 'festivals', venue_name: 'Leader Bank Pavilion', venue_city: 'Boston', venue_state: 'MA', min_price: 95, max_price: 395 },
  // Philadelphia
  { name: 'Eagles Super Bowl', performer: 'Philadelphia Eagles', category: 'sports', venue_name: 'Lincoln Financial Field', venue_city: 'Philadelphia', venue_state: 'PA', min_price: 95, max_price: 595 },
  { name: 'Taylor Swift Eras Philly', performer: 'Taylor Swift', category: 'concerts', venue_name: 'Lincoln Financial Field', venue_city: 'Philadelphia', venue_state: 'PA', min_price: 195, max_price: 1295, is_featured: true },
  { name: 'Kenny Chesney Sun Goes Down', performer: 'Kenny Chesney', category: 'concerts', venue_name: 'Lincoln Financial Field', venue_city: 'Philadelphia', venue_state: 'PA', min_price: 65, max_price: 295 },
  { name: 'Monster Jam Philly', performer: 'Monster Jam', category: 'sports', venue_name: 'Lincoln Financial Field', venue_city: 'Philadelphia', venue_state: 'PA', min_price: 35, max_price: 145 },
  // DC
  { name: 'Dave Matthews Band Jiffy Lube', performer: 'Dave Matthews Band', category: 'concerts', venue_name: 'Jiffy Lube Live', venue_city: 'Bristow', venue_state: 'VA', min_price: 65, max_price: 295 },
  { name: 'Hootie & The Blowfish', performer: 'Hootie & The Blowfish', category: 'concerts', venue_name: 'Jiffy Lube Live', venue_city: 'Bristow', venue_state: 'VA', min_price: 55, max_price: 225 },
  { name: 'Thomas Rhett Country Summer', performer: 'Thomas Rhett', category: 'concerts', venue_name: 'Jiffy Lube Live', venue_city: 'Bristow', venue_state: 'VA', min_price: 45, max_price: 195 },
  // Seattle
  { name: 'Pearl Jam Home Shows', performer: 'Pearl Jam', category: 'concerts', venue_name: 'Climate Pledge Arena', venue_city: 'Seattle', venue_state: 'WA', min_price: 95, max_price: 495, is_featured: true },
  { name: 'Seattle Kraken Hockey', performer: 'Seattle Kraken', category: 'sports', venue_name: 'Climate Pledge Arena', venue_city: 'Seattle', venue_state: 'WA', min_price: 55, max_price: 295 },
  { name: 'Foo Fighters Seattle', performer: 'Foo Fighters', category: 'concerts', venue_name: 'Climate Pledge Arena', venue_city: 'Seattle', venue_state: 'WA', min_price: 85, max_price: 395 },
  { name: 'Macklemore Homecoming', performer: 'Macklemore', category: 'concerts', venue_name: 'Climate Pledge Arena', venue_city: 'Seattle', venue_state: 'WA', min_price: 65, max_price: 245 },
  { name: 'Seattle Seahawks', performer: 'Seattle Seahawks', category: 'sports', venue_name: 'Lumen Field', venue_city: 'Seattle', venue_state: 'WA', min_price: 75, max_price: 445 },
  { name: 'Taylor Swift Eras Seattle', performer: 'Taylor Swift', category: 'concerts', venue_name: 'Lumen Field', venue_city: 'Seattle', venue_state: 'WA', min_price: 195, max_price: 1295, is_featured: true },
  { name: 'Paramount Theatre Shows', performer: 'Various Shows', category: 'theater', venue_name: 'Paramount Theatre Seattle', venue_city: 'Seattle', venue_state: 'WA', min_price: 55, max_price: 195 },
  { name: 'Silversun Pickups', performer: 'Silversun Pickups', category: 'concerts', venue_name: 'Paramount Theatre Seattle', venue_city: 'Seattle', venue_state: 'WA', min_price: 45, max_price: 145 },
  { name: 'Everett Events', performer: 'Various Artists', category: 'concerts', venue_name: 'Angel of the Winds Arena', venue_city: 'Everett', venue_state: 'WA', min_price: 35, max_price: 125 },
  { name: 'ShoWare Center Events', performer: 'Various Artists', category: 'concerts', venue_name: 'ShoWare Center', venue_city: 'Kent', venue_state: 'WA', min_price: 35, max_price: 125 },
  // Phoenix
  { name: 'Taylor Swift Eras Phoenix', performer: 'Taylor Swift', category: 'concerts', venue_name: 'Desert Diamond Arena', venue_city: 'Glendale', venue_state: 'AZ', min_price: 175, max_price: 1195 },
  { name: 'Phoenix Coyotes Hockey', performer: 'Arizona Coyotes', category: 'sports', venue_name: 'Desert Diamond Arena', venue_city: 'Glendale', venue_state: 'AZ', min_price: 45, max_price: 245 },
  { name: 'Phoenix Shows', performer: 'Various Artists', category: 'concerts', venue_name: 'Arizona Financial Theatre', venue_city: 'Phoenix', venue_state: 'AZ', min_price: 45, max_price: 175 },
  // Nebraska
  { name: 'Nebraska Cornhuskers Football', performer: 'Nebraska Cornhuskers', category: 'sports', venue_name: 'Nebraska Memorial Stadium', venue_city: 'Lincoln', venue_state: 'NE', min_price: 85, max_price: 495, is_featured: true },
  { name: 'Garth Brooks Nebraska', performer: 'Garth Brooks', category: 'concerts', venue_name: 'Nebraska Memorial Stadium', venue_city: 'Lincoln', venue_state: 'NE', min_price: 95, max_price: 395 },
  { name: 'Eric Church Nebraska', performer: 'Eric Church', category: 'concerts', venue_name: 'Pinnacle Bank Arena', venue_city: 'Lincoln', venue_state: 'NE', min_price: 65, max_price: 245 },
  { name: 'Nebraska Basketball', performer: 'Nebraska Huskers', category: 'sports', venue_name: 'Pinnacle Bank Arena', venue_city: 'Lincoln', venue_state: 'NE', min_price: 35, max_price: 175 },
  { name: 'Bourbon Theatre Shows', performer: 'Various Artists', category: 'concerts', venue_name: 'Bourbon Theatre', venue_city: 'Lincoln', venue_state: 'NE', min_price: 25, max_price: 75 },
  { name: 'State Fair Events', performer: 'Various Artists', category: 'concerts', venue_name: 'Heartland Events Center at the Nebraska State Fair', venue_city: 'Grand Island', venue_state: 'NE', min_price: 35, max_price: 125 },
  { name: 'Pinewood Bowl Summer Series', performer: 'Various Artists', category: 'concerts', venue_name: 'Pinewood Bowl Theater', venue_city: 'Lincoln', venue_state: 'NE', min_price: 35, max_price: 125 },
  { name: 'Nebraska Volleyball', performer: 'Nebraska Huskers', category: 'sports', venue_name: 'Mortgage Matchup Center', venue_city: 'Lincoln', venue_state: 'NE', min_price: 25, max_price: 125 },
  // Colorado Springs
  { name: 'Broadmoor Arena Events', performer: 'Various Artists', category: 'concerts', venue_name: 'Broadmoor World Arena', venue_city: 'Colorado Springs', venue_state: 'CO', min_price: 45, max_price: 175 },
  { name: 'Colorado College Hockey', performer: 'Colorado College Tigers', category: 'sports', venue_name: 'Broadmoor World Arena', venue_city: 'Colorado Springs', venue_state: 'CO', min_price: 25, max_price: 95 },
  // Pennsylvania
  { name: 'Santander Arena Events', performer: 'Various Artists', category: 'concerts', venue_name: 'Santander Arena', venue_city: 'Reading', venue_state: 'PA', min_price: 35, max_price: 145 },
  { name: 'Reading Royals Hockey', performer: 'Reading Royals', category: 'sports', venue_name: 'Santander Arena', venue_city: 'Reading', venue_state: 'PA', min_price: 25, max_price: 95 },
  { name: 'Cure Insurance Arena Events', performer: 'Various Artists', category: 'concerts', venue_name: 'Cure Insurance Arena', venue_city: 'Trenton', venue_state: 'NJ', min_price: 35, max_price: 125 },
  // UK
  { name: 'U2 O2 Arena', performer: 'U2', category: 'concerts', venue_name: 'O2 Arena', venue_city: 'London', venue_state: '', min_price: 125, max_price: 495 },
  { name: 'Adele London Residency', performer: 'Adele', category: 'concerts', venue_name: 'O2 Arena', venue_city: 'London', venue_state: '', min_price: 145, max_price: 595, is_featured: true },
  { name: 'BBC Proms', performer: 'BBC Symphony Orchestra', category: 'concerts', venue_name: 'Royal Albert Hall', venue_city: 'London', venue_state: '', min_price: 65, max_price: 245 },
  { name: 'Eric Clapton at Royal Albert Hall', performer: 'Eric Clapton', category: 'concerts', venue_name: 'Royal Albert Hall', venue_city: 'London', venue_state: '', min_price: 95, max_price: 395 },
  // ========== SPORTS ==========
  { name: 'LA Clippers vs Warriors', performer: 'LA Clippers', category: 'sports', venue_name: 'Intuit Dome', venue_city: 'Inglewood', venue_state: 'CA', min_price: 85, max_price: 495 },
  { name: 'LA Clippers vs Lakers', performer: 'LA Clippers', category: 'sports', venue_name: 'Intuit Dome', venue_city: 'Inglewood', venue_state: 'CA', min_price: 125, max_price: 695, is_featured: true },
  { name: 'Golden State Warriors vs Celtics', performer: 'Golden State Warriors', category: 'sports', venue_name: 'Chase Center', venue_city: 'San Francisco', venue_state: 'CA', min_price: 95, max_price: 595 },
  { name: 'Brooklyn Nets vs Knicks', performer: 'Brooklyn Nets', category: 'sports', venue_name: 'Barclays Center', venue_city: 'Brooklyn', venue_state: 'NY', min_price: 85, max_price: 495 },
  { name: 'New York Knicks vs Heat', performer: 'New York Knicks', category: 'sports', venue_name: 'Madison Square Garden', venue_city: 'New York', venue_state: 'NY', min_price: 95, max_price: 595 },
  { name: 'Boston Celtics Playoff', performer: 'Boston Celtics', category: 'sports', venue_name: 'Madison Square Garden', venue_city: 'New York', venue_state: 'NY', min_price: 125, max_price: 795 },
  { name: 'Miami Heat vs Celtics', performer: 'Miami Heat', category: 'sports', venue_name: 'Kaseya Center', venue_city: 'Miami', venue_state: 'FL', min_price: 75, max_price: 395 },
  { name: 'Dallas Mavericks vs Lakers', performer: 'Dallas Mavericks', category: 'sports', venue_name: 'American Airlines Center', venue_city: 'Dallas', venue_state: 'TX', min_price: 85, max_price: 495 },
  { name: 'Denver Nuggets Championship', performer: 'Denver Nuggets', category: 'sports', venue_name: 'Ball Arena', venue_city: 'Denver', venue_state: 'CO', min_price: 95, max_price: 595 },
  { name: 'New York Rangers Playoffs', performer: 'New York Rangers', category: 'sports', venue_name: 'Madison Square Garden', venue_city: 'New York', venue_state: 'NY', min_price: 95, max_price: 595 },
  { name: 'Colorado Avalanche vs Knights', performer: 'Colorado Avalanche', category: 'sports', venue_name: 'Ball Arena', venue_city: 'Denver', venue_state: 'CO', min_price: 65, max_price: 345 },
  { name: 'Vegas Golden Knights vs Kings', performer: 'Vegas Golden Knights', category: 'sports', venue_name: 'Michelob Ultra Arena', venue_city: 'Las Vegas', venue_state: 'NV', min_price: 75, max_price: 395 },
  { name: 'LA Kings vs Ducks', performer: 'LA Kings', category: 'sports', venue_name: 'Crypto.com Arena', venue_city: 'Los Angeles', venue_state: 'CA', min_price: 55, max_price: 295 },
  { name: 'Dallas Stars Playoffs', performer: 'Dallas Stars', category: 'sports', venue_name: 'American Airlines Center', venue_city: 'Dallas', venue_state: 'TX', min_price: 75, max_price: 395 },
  { name: 'New Jersey Devils vs Rangers', performer: 'New Jersey Devils', category: 'sports', venue_name: 'Prudential Center', venue_city: 'Newark', venue_state: 'NJ', min_price: 65, max_price: 345 },
  { name: 'Philadelphia Flyers vs Penguins', performer: 'Philadelphia Flyers', category: 'sports', venue_name: 'Prudential Center', venue_city: 'Newark', venue_state: 'NJ', min_price: 55, max_price: 295 },
  { name: 'Denver Broncos vs Chiefs', performer: 'Denver Broncos', category: 'sports', venue_name: 'Empower Field at Mile High', venue_city: 'Denver', venue_state: 'CO', min_price: 95, max_price: 595 },
  { name: 'Dallas Cowboys vs Eagles', performer: 'Dallas Cowboys', category: 'sports', venue_name: 'Globe Life Field', venue_city: 'Arlington', venue_state: 'TX', min_price: 125, max_price: 695 },
  { name: 'LA Rams vs 49ers', performer: 'LA Rams', category: 'sports', venue_name: 'SoFi Stadium', venue_city: 'Inglewood', venue_state: 'CA', min_price: 125, max_price: 695 },
  { name: 'Chicago Bears vs Packers', performer: 'Chicago Bears', category: 'sports', venue_name: 'Soldier Field', venue_city: 'Chicago', venue_state: 'IL', min_price: 95, max_price: 595 },
  { name: 'New York Giants vs Cowboys', performer: 'New York Giants', category: 'sports', venue_name: 'MetLife Stadium', venue_city: 'East Rutherford', venue_state: 'NJ', min_price: 95, max_price: 495 },
  { name: 'Atlanta Falcons vs Saints', performer: 'Atlanta Falcons', category: 'sports', venue_name: 'Mercedes-Benz Stadium', venue_city: 'Atlanta', venue_state: 'GA', min_price: 85, max_price: 445 },
  { name: 'Houston Texans vs Cowboys', performer: 'Houston Texans', category: 'sports', venue_name: 'NRG Stadium', venue_city: 'Houston', venue_state: 'TX', min_price: 75, max_price: 395 },
  { name: 'Fort Worth Stock Show & Rodeo', performer: 'Fort Worth Stock Show & Rodeo', category: 'sports', venue_name: 'Dickies Arena', venue_city: 'Fort Worth', venue_state: 'TX', min_price: 35, max_price: 175, is_featured: true },
  { name: 'WWE Monday Night Raw', performer: 'WWE', category: 'sports', venue_name: 'Allstate Arena', venue_city: 'Rosemont', venue_state: 'IL', min_price: 45, max_price: 295 },
  { name: 'WWE SmackDown', performer: 'WWE', category: 'sports', venue_name: 'Madison Square Garden', venue_city: 'New York', venue_state: 'NY', min_price: 55, max_price: 345 },
  { name: 'Monster Jam', performer: 'Monster Jam', category: 'sports', venue_name: 'SoFi Stadium', venue_city: 'Inglewood', venue_state: 'CA', min_price: 35, max_price: 145 },
  { name: 'UFC 300', performer: 'UFC', category: 'sports', venue_name: 'MGM Grand Garden Arena', venue_city: 'Las Vegas', venue_state: 'NV', min_price: 295, max_price: 1495, is_featured: true },
  { name: 'NASCAR Cup Series', performer: 'NASCAR', category: 'sports', venue_name: 'Las Vegas Motor Speedway', venue_city: 'Las Vegas', venue_state: 'NV', min_price: 65, max_price: 295 },
  { name: 'F1 Las Vegas Grand Prix', performer: 'Formula 1', category: 'sports', venue_name: 'Las Vegas Motor Speedway', venue_city: 'Las Vegas', venue_state: 'NV', min_price: 295, max_price: 2495, is_featured: true },
  { name: 'EchoPark Racing', performer: 'NASCAR', category: 'sports', venue_name: 'EchoPark Speedway', venue_city: 'Austin', venue_state: 'TX', min_price: 55, max_price: 245 },
  // ========== COMEDY ==========
  { name: 'Kevin Hart Reality Check', performer: 'Kevin Hart', category: 'comedy', venue_name: 'Madison Square Garden', venue_city: 'New York', venue_state: 'NY', min_price: 85, max_price: 395 },
  { name: 'Dave Chappelle Live', performer: 'Dave Chappelle', category: 'comedy', venue_name: 'Radio City Music Hall', venue_city: 'New York', venue_state: 'NY', min_price: 95, max_price: 445 },
  { name: 'Chris Rock Ego Death Tour', performer: 'Chris Rock', category: 'comedy', venue_name: 'Hollywood Bowl', venue_city: 'Los Angeles', venue_state: 'CA', min_price: 75, max_price: 295 },
  { name: 'Sebastian Maniscalco', performer: 'Sebastian Maniscalco', category: 'comedy', venue_name: 'Kia Forum', venue_city: 'Inglewood', venue_state: 'CA', min_price: 65, max_price: 245 },
  { name: 'Jim Gaffigan Dark Pale Tour', performer: 'Jim Gaffigan', category: 'comedy', venue_name: 'Beacon Theatre', venue_city: 'New York', venue_state: 'NY', min_price: 55, max_price: 175 },
  { name: 'Bert Kreischer Tops Off Tour', performer: 'Bert Kreischer', category: 'comedy', venue_name: 'Allstate Arena', venue_city: 'Rosemont', venue_state: 'IL', min_price: 55, max_price: 195 },
  { name: 'Tom Segura I Am the Machine', performer: 'Tom Segura', category: 'comedy', venue_name: 'Climate Pledge Arena', venue_city: 'Seattle', venue_state: 'WA', min_price: 55, max_price: 195 },
  { name: 'John Mulaney From Scratch', performer: 'John Mulaney', category: 'comedy', venue_name: 'Chase Center', venue_city: 'San Francisco', venue_state: 'CA', min_price: 75, max_price: 295 },
  { name: 'Bill Burr Live', performer: 'Bill Burr', category: 'comedy', venue_name: 'Dolby Live at Park MGM', venue_city: 'Las Vegas', venue_state: 'NV', min_price: 65, max_price: 245 },
  { name: 'Trevor Noah Back to Abnormal', performer: 'Trevor Noah', category: 'comedy', venue_name: 'MGM Grand Garden Arena', venue_city: 'Las Vegas', venue_state: 'NV', min_price: 65, max_price: 245 },
  // ========== FESTIVALS ==========
  { name: 'Coachella Music Festival', performer: 'Various Artists', category: 'festivals', venue_name: 'Hard Rock Stadium', venue_city: 'Miami Gardens', venue_state: 'FL', min_price: 395, max_price: 1295, is_featured: true },
  { name: 'Rolling Loud Miami', performer: 'Various Artists', category: 'festivals', venue_name: 'Hard Rock Stadium', venue_city: 'Miami Gardens', venue_state: 'FL', min_price: 295, max_price: 995 },
  { name: 'Lollapalooza Chicago', performer: 'Various Artists', category: 'festivals', venue_name: 'Soldier Field', venue_city: 'Chicago', venue_state: 'IL', min_price: 295, max_price: 895 },
  { name: 'Austin City Limits', performer: 'Various Artists', category: 'festivals', venue_name: 'EchoPark Speedway', venue_city: 'Austin', venue_state: 'TX', min_price: 295, max_price: 895, is_featured: true },
  { name: 'Outside Lands', performer: 'Various Artists', category: 'festivals', venue_name: 'Chase Center', venue_city: 'San Francisco', venue_state: 'CA', min_price: 295, max_price: 895 },
  { name: 'Electric Daisy Carnival', performer: 'Various Artists', category: 'festivals', venue_name: 'Las Vegas Motor Speedway', venue_city: 'Las Vegas', venue_state: 'NV', min_price: 395, max_price: 1495, is_featured: true },
  { name: 'Ultra Music Festival', performer: 'Various Artists', category: 'festivals', venue_name: 'Kaseya Center', venue_city: 'Miami', venue_state: 'FL', min_price: 395, max_price: 1295 },
  { name: 'Country Thunder Arizona', performer: 'Various Artists', category: 'festivals', venue_name: 'Desert Diamond Arena', venue_city: 'Glendale', venue_state: 'AZ', min_price: 195, max_price: 595 },
  { name: 'Stagecoach Festival', performer: 'Various Artists', category: 'festivals', venue_name: 'SoFi Stadium', venue_city: 'Inglewood', venue_state: 'CA', min_price: 295, max_price: 895 },
];

// Generate a date spread across next 12 months from a base date
function generateDate(index: number, total: number): string {
  const base = new Date('2026-03-01');
  const daysSpread = Math.floor((index / total) * 365) + Math.floor(Math.random() * 14);
  const d = new Date(base.getTime() + daysSpread * 86400000);
  return d.toISOString().split('T')[0];
}

function generateTime(index: number): string {
  const hours = [14, 15, 18, 19, 19, 20, 20, 21];
  return `${hours[index % hours.length].toString().padStart(2, '0')}:00`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Check how many non-World Cup events already exist
    const { count } = await supabase
      .from('events')
      .select('*', { count: 'exact', head: true })
      .not('name', 'ilike', '%World Cup%');

    if (count && count > 10) {
      return new Response(
        JSON.stringify({ message: `Already have ${count} non-World Cup events. Delete them first to re-seed.`, seeded: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const total = rawEvents.length;
    const eventsToInsert = rawEvents.map((raw, i) => ({
      name: raw.name,
      performer: raw.performer,
      category: raw.category,
      venue_name: raw.venue_name,
      venue_city: raw.venue_city,
      venue_state: raw.venue_state || null,
      date: generateDate(i, total),
      time: generateTime(i),
      description: `Experience ${raw.performer} live at ${raw.venue_name} in ${raw.venue_city}${raw.venue_state ? `, ${raw.venue_state}` : ''}.`,
      is_featured: raw.is_featured || false,
      min_price: raw.min_price,
      max_price: raw.max_price,
      svg_map_name: raw.venue_name,
      source: 'seed',
    }));

    // Insert in batches of 50
    let seeded = 0;
    for (let i = 0; i < eventsToInsert.length; i += 50) {
      const batch = eventsToInsert.slice(i, i + 50);
      const { error } = await supabase.from('events').insert(batch);
      if (error) {
        console.error(`Batch insert error at ${i}:`, error);
        throw error;
      }
      seeded += batch.length;
    }

    return new Response(
      JSON.stringify({ message: `Successfully seeded ${seeded} events!`, seeded }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error seeding events:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
