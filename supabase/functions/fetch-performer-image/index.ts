import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Pick the best image from Ticketmaster images array
function getBestImage(images: any[]): { url: string; width: number; height: number } | null {
  if (!images || images.length === 0) return null;

  // Prefer 16_9 ratio, then 3_2, then any — sorted by width descending
  const sorted = [...images].sort((a, b) => {
    const ratioOrder: Record<string, number> = { '16_9': 0, '3_2': 1, '4_3': 2, '1_1': 3 };
    const ra = ratioOrder[a.ratio] ?? 5;
    const rb = ratioOrder[b.ratio] ?? 5;
    if (ra !== rb) return ra - rb;
    return (b.width || 0) - (a.width || 0);
  });

  // Pick the first with width >= 500, or just the first
  const best = sorted.find(img => (img.width || 0) >= 500) || sorted[0];
  return {
    url: best.url,
    width: best.width || null,
    height: best.height || null,
  };
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

    const { performer } = await req.json();
    if (!performer || typeof performer !== 'string') {
      throw new Error('Missing "performer" in request body');
    }

    const performerTrimmed = performer.trim();

    // 1. Check cache first
    const { data: cached } = await supabase
      .from('performer_images')
      .select('image_url')
      .ilike('performer_name', performerTrimmed)
      .maybeSingle();

    if (cached) {
      return new Response(
        JSON.stringify({ imageUrl: cached.image_url, source: 'cache' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 2. Search Ticketmaster Attractions API (best for artist/performer images)
    let imageResult: { url: string; width: number; height: number } | null = null;

    const attractionUrl = `https://app.ticketmaster.com/discovery/v2/attractions.json?apikey=${TICKETMASTER_API_KEY}&keyword=${encodeURIComponent(performerTrimmed)}&size=5&locale=*`;
    console.log(`Searching Ticketmaster attractions for: ${performerTrimmed}`);
    
    const attractionRes = await fetch(attractionUrl);
    if (attractionRes.ok) {
      const attractionData = await attractionRes.json();
      const attractions = attractionData._embedded?.attractions || [];
      
      const performerLower = performerTrimmed.toLowerCase();
      // Find best match by name
      const exactMatch = attractions.find(
        (a: any) => a.name.toLowerCase() === performerLower
      );
      const partialMatch = attractions.find(
        (a: any) => a.name.toLowerCase().includes(performerLower) || performerLower.includes(a.name.toLowerCase())
      );
      const bestAttraction = exactMatch || partialMatch || attractions[0];
      
      if (bestAttraction?.images) {
        imageResult = getBestImage(bestAttraction.images);
      }
    }

    // 3. Fallback: Search events if no attraction image found
    if (!imageResult) {
      const eventUrl = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${TICKETMASTER_API_KEY}&keyword=${encodeURIComponent(performerTrimmed)}&size=3&countryCode=US`;
      console.log(`Falling back to event search for: ${performerTrimmed}`);
      
      const eventRes = await fetch(eventUrl);
      if (eventRes.ok) {
        const eventData = await eventRes.json();
        const events = eventData._embedded?.events || [];
        if (events[0]?.images) {
          imageResult = getBestImage(events[0].images);
        }
      }
    }

    if (!imageResult) {
      return new Response(
        JSON.stringify({ imageUrl: null, source: 'not_found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 4. Cache the result
    const { error: upsertError } = await supabase
      .from('performer_images')
      .upsert({
        performer_name: performerTrimmed,
        image_url: imageResult.url,
        image_width: imageResult.width,
        image_height: imageResult.height,
        source: 'ticketmaster',
      }, { 
        onConflict: 'performer_name',
        ignoreDuplicates: false
      });

    if (upsertError) {
      console.error('Cache upsert error:', upsertError);
      // Still return the image even if caching fails
    }

    return new Response(
      JSON.stringify({ imageUrl: imageResult.url, source: 'ticketmaster' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ imageUrl: null, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
