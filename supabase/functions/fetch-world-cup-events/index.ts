import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Maps Ticketmaster venue names to our SVG file names
const venueToSvgMap: Record<string, string> = {
  // Official FIFA World Cup 2026 US Venues
  'MetLife Stadium': 'MetLife Stadium',
  'AT&T Stadium': 'AT&T Stadium',
  'Hard Rock Stadium': 'Hard Rock Stadium',
  'SoFi Stadium': 'SoFi Stadium',
  'Levi\'s Stadium': 'Levi\'s Stadium',
  'Mercedes-Benz Stadium': 'Mercedes-Benz Stadium',
  'NRG Stadium': 'NRG Stadium',
  'Arrowhead Stadium': 'Arrowhead Stadium',
  'Lincoln Financial Field': 'Lincoln Financial Field',
  'Lumen Field': 'Lumen Field',
  'Gillette Stadium': 'Gillette Stadium',
  // Additional uploaded venues
  'Amalie Arena': 'Amalie Arena',
  'Madison Square Garden': 'Madison Square Garden',
  'CHI Health Center': 'CHI Health Center',
  'CHI Health Center Omaha': 'CHI Health Center',
  'Baxter Arena': 'Baxter Arena',
  'Pinnacle Bank Arena': 'Pinnacle Bank Arena',
  'Nebraska Memorial Stadium': 'Nebraska Memorial Stadium',
  'Memorial Stadium': 'Nebraska Memorial Stadium',
  'Bourbon Theatre': 'Bourbon Theatre',
};

// Extract team names from event name (e.g., "USA vs Mexico" -> { home: "USA", away: "Mexico" })
function extractTeams(eventName: string): { home: string | null; away: string | null } {
  // Match patterns like "USA vs Mexico", "Argentina v Brazil", "France VS Germany"
  const vsMatch = eventName.match(/^(.+?)\s+(?:vs\.?|v\.?|VS\.?|V\.?)\s+(.+?)(?:\s*[-–—]\s*|\s*$)/i);
  if (vsMatch) {
    return {
      home: vsMatch[1].trim(),
      away: vsMatch[2].trim().replace(/\s*[-–—].*$/, ''),
    };
  }
  
  // Try to extract from "Match X: Team A vs Team B" format
  const matchFormat = eventName.match(/Match\s*\d*:?\s*(.+?)\s+(?:vs\.?|v\.?)\s+(.+)/i);
  if (matchFormat) {
    return {
      home: matchFormat[1].trim(),
      away: matchFormat[2].trim(),
    };
  }
  
  return { home: null, away: null };
}

// Extract match type from event name
function extractMatchType(eventName: string): string {
  const name = eventName.toLowerCase();
  if (name.includes('final') && !name.includes('semi') && !name.includes('quarter')) {
    return 'Final';
  }
  if (name.includes('semi-final') || name.includes('semifinal')) {
    return 'Semi-Final';
  }
  if (name.includes('quarter-final') || name.includes('quarterfinal')) {
    return 'Quarter-Final';
  }
  if (name.includes('round of 16') || name.includes('round-of-16')) {
    return 'Round of 16';
  }
  if (name.includes('group')) {
    const groupMatch = name.match(/group\s*([a-h])/i);
    if (groupMatch) {
      return `Group ${groupMatch[1].toUpperCase()}`;
    }
    return 'Group Stage';
  }
  return 'Group Stage';
}

// Normalize venue name for matching
function normalizeVenueName(name: string): string {
  return name
    .replace(/['']/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

// Find matching SVG map for venue
function findSvgMap(venueName: string): string | null {
  const normalized = normalizeVenueName(venueName);
  
  // Direct match
  if (venueToSvgMap[normalized]) {
    return venueToSvgMap[normalized];
  }
  
  // Partial match
  for (const [key, value] of Object.entries(venueToSvgMap)) {
    if (normalized.toLowerCase().includes(key.toLowerCase()) || 
        key.toLowerCase().includes(normalized.toLowerCase())) {
      return value;
    }
  }
  
  return null;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const TICKETMASTER_API_KEY = Deno.env.get('TICKETMASTER_API_KEY');
    if (!TICKETMASTER_API_KEY) {
      throw new Error('TICKETMASTER_API_KEY is not configured');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Fetch FIFA World Cup 2026 events from Ticketmaster
    const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${TICKETMASTER_API_KEY}&keyword=FIFA%20World%20Cup%202026&size=200&countryCode=US`;

    console.log('Fetching FIFA World Cup 2026 events...');
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Ticketmaster API error: ${response.status}`);
    }

    const data = await response.json();
    const events = data._embedded?.events || [];
    console.log(`Found ${events.length} World Cup events`);

    const results = { success: 0, failed: 0, events: [] as any[] };

    for (const event of events) {
      try {
        const venue = event._embedded?.venues?.[0];
        const priceRange = event.priceRanges?.[0];
        const teams = extractTeams(event.name);
        const matchType = extractMatchType(event.name);
        const venueName = venue?.name || 'TBD';
        const svgMapName = findSvgMap(venueName);

        // Complete match data
        const eventData = {
          ticketmaster_id: event.id,
          name: event.name,
          event_date: event.dates?.start?.dateTime || event.dates?.start?.localDate,
          event_time: event.dates?.start?.localTime || null,
          venue_name: venueName,
          venue_city: venue?.city?.name || '',
          venue_state: venue?.state?.stateCode || null,
          venue_country: venue?.country?.countryCode || 'US',
          venue_lat: venue?.location?.latitude ? parseFloat(venue.location.latitude) : null,
          venue_lon: venue?.location?.longitude ? parseFloat(venue.location.longitude) : null,
          min_price: priceRange?.min || null,
          max_price: priceRange?.max || null,
          available_tickets: event.ticketLimit?.perOrder || (event.accessibility?.ticketLimit || null),
          status: event.dates?.status?.code || 'onsale',
          home_team: teams.home,
          away_team: teams.away,
          match_type: matchType,
          group_name: matchType.startsWith('Group') ? matchType : null,
          image_url: event.images?.[0]?.url || null,
          ticketmaster_url: event.url || null,
        };

        const { error } = await supabase
          .from('world_cup_events')
          .upsert(eventData, { onConflict: 'ticketmaster_id' });

        if (error) {
          console.error(`Error upserting event ${event.id}:`, error);
          results.failed++;
        } else {
          results.success++;
          results.events.push({
            id: event.id,
            name: event.name,
            venue: venueName,
            svgMap: svgMapName,
            teams,
            matchType,
          });
        }
      } catch (err) {
        console.error(`Error processing event:`, err);
        results.failed++;
      }
    }

    console.log(`Successfully synced ${results.success} events, ${results.failed} failed`);

    return new Response(
      JSON.stringify({
        success: true,
        total: events.length,
        synced: results.success,
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
