import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// FIFA World Cup 2026 match data from Excel
const worldCupMatches = [
  { match_name: "Mexico vs South Africa - World Cup - Match 1 (Group A)", team1: "Mexico", team2: "South Africa", match_number: 1, round: "Group Stage", group: "A", date: "2026-06-11", time: "20:00", venue_name: "Estadio Azteca", venue_location: "Ciudad de México, CDMX", min_price: 3213.85, max_price: 36112.27 },
  { match_name: "Korea Republic vs Playoff D Winner - World Cup - Match 2 (Group A)", team1: "Korea Republic", team2: "Playoff D Winner", match_number: 2, round: "Group Stage", group: "A", date: "2026-06-12", time: "03:00", venue_name: "Akron Stadium - Mexico", venue_location: "Zapopan, Jal.", min_price: 389.90, max_price: 40104.00 },
  { match_name: "Canada vs Playoff A Winner - World Cup - Match 3 (Group B)", team1: "Canada", team2: "Playoff A Winner", match_number: 3, round: "Group Stage", group: "B", date: "2026-06-12", time: "19:00", venue_name: "BMO Field", venue_location: "Toronto, ON", min_price: 1537.32, max_price: 15829.94 },
  { match_name: "USA vs Paraguay - World Cup - Match 4 (Group D)", team1: "USA", team2: "Paraguay", match_number: 4, round: "Group Stage", group: "D", date: "2026-06-13", time: "01:00", venue_name: "SoFi Stadium", venue_location: "Inglewood, CA", min_price: 1358.99, max_price: 28814.84 },
  { match_name: "Qatar vs Switzerland - World Cup - Match 8 (Group B)", team1: "Qatar", team2: "Switzerland", match_number: 8, round: "Group Stage", group: "B", date: "2026-06-13", time: "19:00", venue_name: "Levi's Stadium", venue_location: "Santa Clara, CA", min_price: 401.44, max_price: 11657.07 },
  { match_name: "Brazil vs Morocco - World Cup - Match 7 (Group C)", team1: "Brazil", team2: "Morocco", match_number: 7, round: "Group Stage", group: "C", date: "2026-06-13", time: "22:00", venue_name: "MetLife Stadium", venue_location: "East Rutherford, NJ", min_price: 885.63, max_price: 11585.60 },
  { match_name: "Australia vs Playoff C Winner - World Cup - Match 6 (Group D)", team1: "Australia", team2: "Playoff C Winner", match_number: 6, round: "Group Stage", group: "D", date: "2026-06-14", time: "04:00", venue_name: "BC Place Stadium", venue_location: "Vancouver, BC", min_price: 350.91, max_price: 7191.72 },
  { match_name: "Haiti vs Scotland - World Cup - Match 5 (Group C)", team1: "Haiti", team2: "Scotland", match_number: 5, round: "Group Stage", group: "C", date: "2026-06-14", time: "01:00", venue_name: "Gillette Stadium", venue_location: "Foxborough, MA", min_price: 677.76, max_price: 29126.50 },
  { match_name: "Germany vs Curacao - World Cup - Match 10 (Group E)", team1: "Germany", team2: "Curacao", match_number: 10, round: "Group Stage", group: "E", date: "2026-06-14", time: "17:00", venue_name: "NRG Stadium", venue_location: "Houston, TX", min_price: 479.64, max_price: 8993.72 },
  { match_name: "Netherlands vs Japan - World Cup - Match 11 (Group F)", team1: "Netherlands", team2: "Japan", match_number: 11, round: "Group Stage", group: "F", date: "2026-06-14", time: "20:00", venue_name: "AT&T Stadium", venue_location: "Arlington, TX", min_price: 613.38, max_price: 29944.32 },
  { match_name: "Ecuador vs Ivory Coast - World Cup - Match 9 (Group E)", team1: "Ecuador", team2: "Ivory Coast", match_number: 9, round: "Group Stage", group: "E", date: "2026-06-14", time: "23:00", venue_name: "Lincoln Financial Field", venue_location: "Philadelphia, PA", min_price: 499.96, max_price: 12319.55 },
  { match_name: "Belgium vs Egypt - World Cup - Match 16 (Group G)", team1: "Belgium", team2: "Egypt", match_number: 16, round: "Group Stage", group: "G", date: "2026-06-15", time: "19:00", venue_name: "Lumen Field", venue_location: "Seattle, WA", min_price: 535.25, max_price: 8993.72 },
  { match_name: "Spain vs Cabo Verde - World Cup - Match 14 (Group H)", team1: "Spain", team2: "Cabo Verde", match_number: 14, round: "Group Stage", group: "H", date: "2026-06-15", time: "16:00", venue_name: "Mercedes-Benz Stadium", venue_location: "Atlanta, GA", min_price: 369.29, max_price: 8993.72 },
  { match_name: "Saudi Arabia vs Uruguay - World Cup - Match 13 (Group H)", team1: "Saudi Arabia", team2: "Uruguay", match_number: 13, round: "Group Stage", group: "H", date: "2026-06-15", time: "22:00", venue_name: "Hard Rock Stadium", venue_location: "Miami Gardens, FL", min_price: 369.59, max_price: 52135.20 },
  { match_name: "Iran vs New Zealand - World Cup - Match 15 (Group G)", team1: "Iran", team2: "New Zealand", match_number: 15, round: "Group Stage", group: "G", date: "2026-06-16", time: "01:00", venue_name: "SoFi Stadium", venue_location: "Inglewood, CA", min_price: 393.91, max_price: 28814.84 },
  { match_name: "France vs Senegal - World Cup - Match 17 (Group I)", team1: "France", team2: "Senegal", match_number: 17, round: "Group Stage", group: "I", date: "2026-06-16", time: "19:00", venue_name: "MetLife Stadium", venue_location: "East Rutherford, NJ", min_price: 566.54, max_price: 24724.65 },
  { match_name: "Playoff 2 Winner vs Norway - World Cup - Match 18 (Group I)", team1: "Playoff 2 Winner", team2: "Norway", match_number: 18, round: "Group Stage", group: "I", date: "2026-06-16", time: "22:00", venue_name: "Gillette Stadium", venue_location: "Foxborough, MA", min_price: 499.96, max_price: 12090.88 },
  { match_name: "Argentina vs Algeria - World Cup - Match 19 (Group J)", team1: "Argentina", team2: "Algeria", match_number: 19, round: "Group Stage", group: "J", date: "2026-06-17", time: "01:00", venue_name: "GEHA Field at Arrowhead Stadium", venue_location: "Kansas City, MO", min_price: 698.81, max_price: 13417.35 },
  { match_name: "Portugal vs Playoff 1 Winner - World Cup - Match 23 (Group K)", team1: "Portugal", team2: "Playoff 1 Winner", match_number: 23, round: "Group Stage", group: "K", date: "2026-06-17", time: "17:00", venue_name: "NRG Stadium", venue_location: "Houston, TX", min_price: 642.00, max_price: 18238.30 },
  { match_name: "England vs Croatia - World Cup - Match 22 (Group L)", team1: "England", team2: "Croatia", match_number: 22, round: "Group Stage", group: "L", date: "2026-06-17", time: "20:00", venue_name: "AT&T Stadium", venue_location: "Arlington, TX", min_price: 829.48, max_price: 123124.95 },
  { match_name: "USA vs Australia - World Cup - Match 32 (Group D)", team1: "USA", team2: "Australia", match_number: 32, round: "Group Stage", group: "D", date: "2026-06-19", time: "19:00", venue_name: "Lumen Field", venue_location: "Seattle, WA", min_price: 973.19, max_price: 11489.42 },
  { match_name: "Scotland vs Morocco - World Cup - Match 30 (Group C)", team1: "Scotland", team2: "Morocco", match_number: 30, round: "Group Stage", group: "C", date: "2026-06-19", time: "22:00", venue_name: "Gillette Stadium", venue_location: "Foxborough, MA", min_price: 636.32, max_price: 24724.65 },
  { match_name: "Brazil vs Haiti - World Cup - Match 29 (Group C)", team1: "Brazil", team2: "Haiti", match_number: 29, round: "Group Stage", group: "C", date: "2026-06-20", time: "01:00", venue_name: "Lincoln Financial Field", venue_location: "Philadelphia, PA", min_price: 692.74, max_price: 8993.72 },
  { match_name: "Germany vs Ivory Coast - World Cup - Match 33 (Group E)", team1: "Germany", team2: "Ivory Coast", match_number: 33, round: "Group Stage", group: "E", date: "2026-06-20", time: "20:00", venue_name: "BMO Field", venue_location: "Toronto, ON", min_price: 695.14, max_price: 8711.48 },
  { match_name: "Belgium vs Iran - World Cup - Match 39 (Group G)", team1: "Belgium", team2: "Iran", match_number: 39, round: "Group Stage", group: "G", date: "2026-06-21", time: "19:00", venue_name: "SoFi Stadium", venue_location: "Inglewood, CA", min_price: 497.10, max_price: 28814.84 },
  { match_name: "Argentina vs Austria - World Cup - Match 43 (Group J)", team1: "Argentina", team2: "Austria", match_number: 43, round: "Group Stage", group: "J", date: "2026-06-22", time: "17:00", venue_name: "AT&T Stadium", venue_location: "Arlington, TX", min_price: 947.70, max_price: 84218.77 },
  { match_name: "France vs Playoff 2 Winner - World Cup - Match 42 (Group I)", team1: "France", team2: "Playoff 2 Winner", match_number: 42, round: "Group Stage", group: "I", date: "2026-06-22", time: "21:00", venue_name: "Lincoln Financial Field", venue_location: "Philadelphia, PA", min_price: 528.37, max_price: 82415.49 },
  { match_name: "England vs Ghana - World Cup - Match 45 (Group L)", team1: "England", team2: "Ghana", match_number: 45, round: "Group Stage", group: "L", date: "2026-06-23", time: "20:00", venue_name: "Gillette Stadium", venue_location: "Foxborough, MA", min_price: 653.36, max_price: 123124.95 },
  { match_name: "Portugal vs Uzbekistan - World Cup - Match 47 (Group K)", team1: "Portugal", team2: "Uzbekistan", match_number: 47, round: "Group Stage", group: "K", date: "2026-06-23", time: "17:00", venue_name: "NRG Stadium", venue_location: "Houston, TX", min_price: 554.38, max_price: 84218.77 },
  { match_name: "Scotland vs Brazil - World Cup - Match 49 (Group C)", team1: "Scotland", team2: "Brazil", match_number: 49, round: "Group Stage", group: "C", date: "2026-06-24", time: "22:00", venue_name: "Hard Rock Stadium", venue_location: "Miami Gardens, FL", min_price: 1051.06, max_price: 36294.37 },
  { match_name: "USA vs Playoff C Winner - World Cup - Match 59 (Group D)", team1: "USA", team2: "Playoff C Winner", match_number: 59, round: "Group Stage", group: "D", date: "2026-06-26", time: "02:00", venue_name: "SoFi Stadium", venue_location: "Inglewood, CA", min_price: 868.92, max_price: 28814.84 },
  { match_name: "Norway vs France - World Cup - Match 61 (Group I)", team1: "Norway", team2: "France", match_number: 61, round: "Group Stage", group: "I", date: "2026-06-26", time: "19:00", venue_name: "Gillette Stadium", venue_location: "Foxborough, MA", min_price: 823.80, max_price: 17378.40 },
  { match_name: "Panama vs England - World Cup - Match 67 (Group L)", team1: "Panama", team2: "England", match_number: 67, round: "Group Stage", group: "L", date: "2026-06-27", time: "21:00", venue_name: "MetLife Stadium", venue_location: "East Rutherford, NJ", min_price: 596.55, max_price: 32966.20 },
  { match_name: "Colombia vs Portugal - World Cup - Match 71 (Group K)", team1: "Colombia", team2: "Portugal", match_number: 71, round: "Group Stage", group: "K", date: "2026-06-27", time: "23:30", venue_name: "Hard Rock Stadium", venue_location: "Miami Gardens, FL", min_price: 1789.98, max_price: 75369.45 },
  { match_name: "W89 vs W90 - World Cup - Match 97 (Quarter-Finals)", team1: "W89", team2: "W90", match_number: 97, round: "Quarter-Finals", group: "", date: "2026-07-09", time: "20:00", venue_name: "Gillette Stadium", venue_location: "Foxborough, MA", min_price: 1158.56, max_price: 108903.55 },
  { match_name: "W93 vs W94 - World Cup - Match 98 (Quarter-Finals)", team1: "W93", team2: "W94", match_number: 98, round: "Quarter-Finals", group: "", date: "2026-07-10", time: "19:00", venue_name: "SoFi Stadium", venue_location: "Inglewood, CA", min_price: 1459.25, max_price: 64363.80 },
  { match_name: "W91 vs W92 - World Cup - Match 99 (Quarter-Finals)", team1: "W91", team2: "W92", match_number: 99, round: "Quarter-Finals", group: "", date: "2026-07-11", time: "21:00", venue_name: "Hard Rock Stadium", venue_location: "Miami Gardens, FL", min_price: 1457.21, max_price: 87791.33 },
  { match_name: "W95 vs W96 - World Cup - Match 100 (Quarter-Finals)", team1: "W95", team2: "W96", match_number: 100, round: "Quarter-Finals", group: "", date: "2026-07-12", time: "01:00", venue_name: "GEHA Field at Arrowhead Stadium", venue_location: "Kansas City, MO", min_price: 1477.16, max_price: 107992.05 },
  { match_name: "W97 vs W98 - World Cup - Match 101 (Semi-Finals)", team1: "W97", team2: "W98", match_number: 101, round: "Semi-Finals", group: "", date: "2026-07-14", time: "19:00", venue_name: "AT&T Stadium", venue_location: "Arlington, TX", min_price: 2244.15, max_price: 54569.29 },
  { match_name: "W99 vs W100 - World Cup - Match 102 (Semi-Finals)", team1: "W99", team2: "W100", match_number: 102, round: "Semi-Finals", group: "", date: "2026-07-15", time: "19:00", venue_name: "Mercedes-Benz Stadium", venue_location: "Atlanta, GA", min_price: 1988.49, max_price: 46788.00 },
  { match_name: "L101 vs L102 - World Cup - Match 103 (Bronze Final)", team1: "L101", team2: "L102", match_number: 103, round: "Final", group: "", date: "2026-07-18", time: "21:00", venue_name: "Hard Rock Stadium", venue_location: "Miami Gardens, FL", min_price: 1036.91, max_price: 32439.68 },
  { match_name: "W101 vs W102 - World Cup - Match 104 (Final)", team1: "W101", team2: "W102", match_number: 104, round: "Final", group: "", date: "2026-07-19", time: "19:00", venue_name: "MetLife Stadium", venue_location: "East Rutherford, NJ", min_price: 8507.45, max_price: 231712.00 },
];

// Venue to SVG map mapping for US venues with SVG files
const venueToSvgMap: Record<string, string> = {
  'SoFi Stadium': 'SoFi Stadium',
  'MetLife Stadium': 'MetLife Stadium',
  'Hard Rock Stadium': 'Hard Rock Stadium',
  'NRG Stadium': 'NRG Stadium',
  'AT&T Stadium': 'AT&T Stadium',
  'Mercedes-Benz Stadium': 'Mercedes-Benz Stadium',
  "Levi's Stadium": "Levi's Stadium",
  'Lincoln Financial Field': 'Lincoln Financial Field',
  'Gillette Stadium': 'Gillette Stadium',
  'Lumen Field': 'Lumen Field',
  'GEHA Field at Arrowhead Stadium': 'Arrowhead Stadium',
};

// Parse venue location into city and state
function parseVenueLocation(location: string): { city: string; state: string } {
  const parts = location.split(',').map(p => p.trim());
  return {
    city: parts[0] || '',
    state: parts[1] || '',
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    console.log(`Seeding ${worldCupMatches.length} World Cup matches...`);

    const results = { success: 0, failed: 0, events: [] as any[] };

    for (const match of worldCupMatches) {
      try {
        const { city, state } = parseVenueLocation(match.venue_location);
        const svgMapName = venueToSvgMap[match.venue_name] || null;

        const eventData = {
          name: match.match_name,
          performer: `${match.team1} vs ${match.team2}`,
          category: 'sports',
          venue_name: match.venue_name,
          venue_city: city,
          venue_state: state,
          date: match.date,
          time: match.time,
          description: `FIFA World Cup 2026 - ${match.round}${match.group ? ` Group ${match.group}` : ''}: ${match.team1} vs ${match.team2}`,
          is_featured: match.round === 'Final' || match.round === 'Semi-Finals' || match.round === 'Quarter-Finals' || ['USA', 'Argentina', 'Brazil', 'France', 'England', 'Germany'].includes(match.team1),
          min_price: match.min_price,
          max_price: match.max_price,
          performer_image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
          svg_map_name: svgMapName,
          match_number: match.match_number,
          round: match.round,
          group_name: match.group || null,
          home_team: match.team1,
          away_team: match.team2,
          source: 'GoTickets',
        };

        const { error } = await supabase
          .from('events')
          .upsert(eventData, { 
            onConflict: 'name',
            ignoreDuplicates: false
          });

        if (error) {
          console.error(`Error upserting match ${match.match_number}:`, error);
          results.failed++;
        } else {
          results.success++;
          results.events.push({
            match_number: match.match_number,
            name: match.match_name,
            venue: match.venue_name,
            svgMap: svgMapName,
          });
        }
      } catch (err) {
        console.error(`Error processing match:`, err);
        results.failed++;
      }
    }

    console.log(`Successfully seeded ${results.success} matches, ${results.failed} failed`);

    return new Response(
      JSON.stringify({
        success: true,
        total: worldCupMatches.length,
        seeded: results.success,
        failed: results.failed,
        events: results.events,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
