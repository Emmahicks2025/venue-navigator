import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Pick the best image from Ticketmaster images array
function getBestImage(images: any[]): { url: string; width: number; height: number } | null {
  if (!images || images.length === 0) return null;

  // Prefer 16_9 ratio with good resolution
  const sorted = [...images].sort((a, b) => {
    const ratioOrder: Record<string, number> = { '16_9': 0, '3_2': 1, '4_3': 2, '1_1': 3 };
    const ra = ratioOrder[a.ratio] ?? 5;
    const rb = ratioOrder[b.ratio] ?? 5;
    if (ra !== rb) return ra - rb;
    return (b.width || 0) - (a.width || 0);
  });

  const best = sorted.find(img => (img.width || 0) >= 500) || sorted[0];
  return {
    url: best.url,
    width: best.width || null,
    height: best.height || null,
  };
}

// Delay helper to avoid rate limiting
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Fetch a single performer image from Ticketmaster with retries
async function fetchSinglePerformerImage(
  performer: string,
  apiKey: string
): Promise<{ url: string; width: number; height: number } | null> {
  const performerEncoded = encodeURIComponent(performer);

  // Try attractions API first (best for artist images)
  try {
    const attractionUrl = `https://app.ticketmaster.com/discovery/v2/attractions.json?apikey=${apiKey}&keyword=${performerEncoded}&size=5&locale=*`;
    const attractionRes = await fetch(attractionUrl);

    if (attractionRes.status === 429) {
      // Rate limited - wait and retry once
      const retryAfter = parseInt(attractionRes.headers.get('Retry-After') || '2');
      console.log(`Rate limited for ${performer}, waiting ${retryAfter}s...`);
      await delay(retryAfter * 1000);
      const retryRes = await fetch(attractionUrl);
      if (retryRes.ok) {
        const data = await retryRes.json();
        const attractions = data._embedded?.attractions || [];
        const performerLower = performer.toLowerCase();
        const best = attractions.find((a: any) => a.name.toLowerCase() === performerLower)
          || attractions.find((a: any) => a.name.toLowerCase().includes(performerLower) || performerLower.includes(a.name.toLowerCase()))
          || attractions[0];
        if (best?.images) return getBestImage(best.images);
      }
    } else if (attractionRes.ok) {
      const data = await attractionRes.json();
      const attractions = data._embedded?.attractions || [];
      const performerLower = performer.toLowerCase();
      const best = attractions.find((a: any) => a.name.toLowerCase() === performerLower)
        || attractions.find((a: any) => a.name.toLowerCase().includes(performerLower) || performerLower.includes(a.name.toLowerCase()))
        || attractions[0];
      if (best?.images) return getBestImage(best.images);
    }
  } catch (err) {
    console.error(`Attraction search failed for ${performer}:`, err);
  }

  // Fallback: events search
  try {
    await delay(200); // Small delay between API calls
    const eventUrl = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}&keyword=${performerEncoded}&size=3&countryCode=US`;
    const eventRes = await fetch(eventUrl);
    if (eventRes.ok) {
      const data = await eventRes.json();
      const events = data._embedded?.events || [];
      if (events[0]?.images) return getBestImage(events[0].images);
    }
  } catch (err) {
    console.error(`Event search failed for ${performer}:`, err);
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

    const body = await req.json().catch(() => ({}));
    
    // Support both single performer and batch performers
    const performers: string[] = body.performers
      ? (body.performers as string[]).map((p: string) => (p || '').trim()).filter(Boolean)
      : body.performer
        ? [body.performer.trim()]
        : [];

    if (performers.length === 0) {
      return new Response(
        JSON.stringify({ images: {}, cached: 0, fetched: 0, message: 'No performers provided' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing ${performers.length} performer(s)...`);

    // 1. Check cache for all performers at once
    const { data: cachedRows } = await supabase
      .from('performer_images')
      .select('performer_name, image_url')
      .in('performer_name', performers);

    const cachedMap = new Map<string, string>();
    for (const row of cachedRows || []) {
      cachedMap.set(row.performer_name.toLowerCase(), row.image_url);
    }

    // Build results with cached data
    const results: Record<string, string | null> = {};
    const uncached: string[] = [];

    for (const performer of performers) {
      const cached = cachedMap.get(performer.toLowerCase());
      if (cached) {
        results[performer] = cached;
      } else {
        uncached.push(performer);
      }
    }

    console.log(`Cache hits: ${performers.length - uncached.length}, need to fetch: ${uncached.length}`);

    // 2. Fetch uncached performers from Ticketmaster with delays
    const toUpsert: any[] = [];

    for (let i = 0; i < uncached.length; i++) {
      const performer = uncached[i];
      
      // Add delay between requests (200ms) to avoid rate limiting
      if (i > 0) {
        await delay(200);
      }

      console.log(`[${i + 1}/${uncached.length}] Fetching: ${performer}`);
      const imageResult = await fetchSinglePerformerImage(performer, TICKETMASTER_API_KEY);

      if (imageResult) {
        results[performer] = imageResult.url;
        toUpsert.push({
          performer_name: performer,
          image_url: imageResult.url,
          image_width: imageResult.width,
          image_height: imageResult.height,
          source: 'ticketmaster',
        });
      } else {
        results[performer] = null;
        console.log(`No image found for: ${performer}`);
      }
    }

    // 3. Batch upsert all new images to cache
    if (toUpsert.length > 0) {
      const { error: upsertError } = await supabase
        .from('performer_images')
        .upsert(toUpsert, { onConflict: 'performer_name', ignoreDuplicates: false });

      if (upsertError) {
        console.error('Batch cache upsert error:', upsertError);
      } else {
        console.log(`Cached ${toUpsert.length} new performer images`);
      }
    }

    return new Response(
      JSON.stringify({ images: results, cached: performers.length - uncached.length, fetched: toUpsert.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ images: {}, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
