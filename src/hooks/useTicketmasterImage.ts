import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Default category images as final fallback
function getDefaultCategoryImage(category: string): string {
  const defaults: Record<string, string> = {
    concerts: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
    sports: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
    theater: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800',
    comedy: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800',
    festivals: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',
  };
  return defaults[category] || defaults.concerts;
}

// In-memory cache to avoid redundant calls during the session
const imageCache = new Map<string, string>();
// Track in-flight requests to avoid duplicate fetches
const pendingRequests = new Map<string, Promise<string | null>>();

async function fetchFromTicketmaster(performer: string): Promise<string | null> {
  const key = performer.toLowerCase().trim();
  
  // Check in-flight request
  if (pendingRequests.has(key)) {
    return pendingRequests.get(key)!;
  }

  const promise = (async () => {
    try {
      // First check the database cache
      const { data: cached } = await supabase
        .from('performer_images')
        .select('image_url')
        .ilike('performer_name', key)
        .maybeSingle();

      if (cached?.image_url) {
        imageCache.set(key, cached.image_url);
        return cached.image_url;
      }

      // Call the edge function
      const { data, error } = await supabase.functions.invoke('fetch-performer-image', {
        body: { performer },
      });

      if (error) {
        console.error('Edge function error:', error);
        return null;
      }

      if (data?.imageUrl) {
        imageCache.set(key, data.imageUrl);
        return data.imageUrl as string;
      }

      return null;
    } catch (err) {
      console.error('Failed to fetch performer image:', err);
      return null;
    } finally {
      pendingRequests.delete(key);
    }
  })();

  pendingRequests.set(key, promise);
  return promise;
}

export function useTicketmasterImage(
  performer: string,
  existingImage: string | undefined,
  category: string
): { imageUrl: string; isLoading: boolean } {
  const fallback = existingImage || getDefaultCategoryImage(category);
  const cacheKey = performer.toLowerCase().trim();
  
  // If we already have a cached Ticketmaster image, use it immediately
  const cachedUrl = imageCache.get(cacheKey);
  
  const [imageUrl, setImageUrl] = useState<string>(cachedUrl || fallback);
  const [isLoading, setIsLoading] = useState<boolean>(!cachedUrl);

  useEffect(() => {
    if (cachedUrl) {
      setImageUrl(cachedUrl);
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    fetchFromTicketmaster(performer).then((url) => {
      if (!cancelled && url) {
        setImageUrl(url);
      }
      if (!cancelled) {
        setIsLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [performer, cachedUrl]);

  return { imageUrl, isLoading };
}
