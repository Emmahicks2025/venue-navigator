import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const TICKETMASTER_API_KEY = Deno.env.get('TICKETMASTER_API_KEY');
    if (!TICKETMASTER_API_KEY) {
      throw new Error('TICKETMASTER_API_KEY is not configured');
    }

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Supabase configuration missing');
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Fetch FIFA World Cup 2026 events from Ticketmaster
    const url = new URL('https://app.ticketmaster.com/discovery/v2/events.json');
    url.searchParams.set('apikey', TICKETMASTER_API_KEY);
    url.searchParams.set('keyword', 'FIFA World Cup 2026');
    url.searchParams.set('size', '200');
    url.searchParams.set('countryCode', 'US');

    console.log('Fetching World Cup events from Ticketmaster...');
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`Ticketmaster API error: ${response.status}`);
    }

    const data = await response.json();
    const events = data._embedded?.events || [];
    console.log(`Found ${events.length} events`);

    const upsertedEvents = [];

    for (const event of events) {
      const venue = event._embedded?.venues?.[0];
      const priceRange = event.priceRanges?.[0];

      // Only fetch essential data: event date, venue name, time, pricing, ticket count
      const eventData = {
        ticketmaster_id: event.id,
        name: event.name,
        event_date: event.dates?.start?.dateTime || event.dates?.start?.localDate,
        event_time: event.dates?.start?.localTime || null,
        venue_name: venue?.name || 'TBD',
        venue_city: venue?.city?.name || '',
        venue_state: venue?.state?.stateCode || null,
        venue_country: venue?.country?.countryCode || 'US',
        min_price: priceRange?.min || null,
        max_price: priceRange?.max || null,
        available_tickets: event.ticketLimit?.perOrder || (event.seatmap ? 1000 : null),
        status: event.dates?.status?.code || 'onsale',
      };

      const { data: upserted, error } = await supabase
        .from('world_cup_events')
        .upsert(eventData, { onConflict: 'ticketmaster_id' })
        .select()
        .single();

      if (error) {
        console.error(`Error upserting event ${event.id}:`, error);
      } else {
        upsertedEvents.push(upserted);
      }
    }

    console.log(`Successfully upserted ${upsertedEvents.length} events`);

    return new Response(
      JSON.stringify({
        success: true,
        count: upsertedEvents.length,
        events: upsertedEvents,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error fetching World Cup events:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
