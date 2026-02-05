import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

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

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${TICKETMASTER_API_KEY}&keyword=FIFA%20World%20Cup%202026&size=200&countryCode=US`;

    console.log('Fetching World Cup events...');
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Ticketmaster API error: ${response.status}`);
    }

    const data = await response.json();
    const events = data._embedded?.events || [];
    console.log(`Found ${events.length} events`);

    let count = 0;
    for (const event of events) {
      const venue = event._embedded?.venues?.[0];
      const priceRange = event.priceRanges?.[0];

      const { error } = await supabase.from('world_cup_events').upsert({
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
        available_tickets: event.ticketLimit?.perOrder || null,
        status: event.dates?.status?.code || 'onsale',
      }, { onConflict: 'ticketmaster_id' });

      if (!error) count++;
    }

    return new Response(JSON.stringify({ success: true, count }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
