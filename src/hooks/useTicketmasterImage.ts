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

// ── Global image cache & batch fetcher ──────────────────────────────

// Session-level cache: performer name (lowercase) → image URL
const imageCache = new Map<string, string>();

// Tracks whether we've loaded the DB cache already
let dbCacheLoaded = false;
let dbCachePromise: Promise<void> | null = null;

// Pending batch: performers waiting to be fetched from Ticketmaster
let pendingPerformers = new Set<string>();
let batchTimer: ReturnType<typeof setTimeout> | null = null;
let batchPromise: Promise<void> | null = null;
const batchListeners = new Map<string, Array<(url: string | null) => void>>();

// Load ALL cached images from the database at once (runs once per session)
async function loadDbCache(): Promise<void> {
  if (dbCacheLoaded) return;
  if (dbCachePromise) return dbCachePromise;

  dbCachePromise = (async () => {
    try {
      const { data, error } = await supabase
        .from('performer_images')
        .select('performer_name, image_url');

      if (!error && data) {
        for (const row of data) {
          imageCache.set(row.performer_name.toLowerCase(), row.image_url);
        }
        console.log(`[ImageCache] Loaded ${data.length} cached performer images from DB`);
      }
    } catch (err) {
      console.error('[ImageCache] Failed to load DB cache:', err);
    } finally {
      dbCacheLoaded = true;
      dbCachePromise = null;
    }
  })();

  return dbCachePromise;
}

// Schedule a batch fetch for all pending performers
function scheduleBatchFetch(performer: string): Promise<string | null> {
  return new Promise((resolve) => {
    const key = performer.toLowerCase();

    // Register listener
    if (!batchListeners.has(key)) {
      batchListeners.set(key, []);
    }
    batchListeners.get(key)!.push(resolve);

    pendingPerformers.add(performer);

    // Debounce: wait 100ms to collect all performers from the render cycle
    if (batchTimer) clearTimeout(batchTimer);
    batchTimer = setTimeout(() => {
      executeBatchFetch();
    }, 100);
  });
}

async function executeBatchFetch(): Promise<void> {
  // If already running, the new performers will be picked up in the next batch
  if (batchPromise) return;

  const performers = Array.from(pendingPerformers);
  pendingPerformers.clear();
  batchTimer = null;

  if (performers.length === 0) return;

  console.log(`[ImageCache] Batch fetching ${performers.length} performers from Ticketmaster...`);

  batchPromise = (async () => {
    try {
      const { data, error } = await supabase.functions.invoke('fetch-performer-image', {
        body: { performers },
      });

      if (error) {
        console.error('[ImageCache] Batch fetch error:', error);
        // Resolve all listeners with null
        for (const performer of performers) {
          const key = performer.toLowerCase();
          const listeners = batchListeners.get(key) || [];
          listeners.forEach(cb => cb(null));
          batchListeners.delete(key);
        }
        return;
      }

      const images = data?.images || {};

      for (const performer of performers) {
        const key = performer.toLowerCase();
        const imageUrl = images[performer] || null;

        if (imageUrl) {
          imageCache.set(key, imageUrl);
        }

        const listeners = batchListeners.get(key) || [];
        listeners.forEach(cb => cb(imageUrl));
        batchListeners.delete(key);
      }

      console.log(`[ImageCache] Batch complete: ${Object.values(images).filter(Boolean).length} images found`);
    } catch (err) {
      console.error('[ImageCache] Batch fetch failed:', err);
      for (const performer of performers) {
        const key = performer.toLowerCase();
        const listeners = batchListeners.get(key) || [];
        listeners.forEach(cb => cb(null));
        batchListeners.delete(key);
      }
    } finally {
      batchPromise = null;

      // If more performers were added while we were fetching, process them
      if (pendingPerformers.size > 0) {
        executeBatchFetch();
      }
    }
  })();

  return batchPromise;
}

// ── Hook ────────────────────────────────────────────────────────────

export function useTicketmasterImage(
  performer: string,
  existingImage: string | undefined,
  category: string
): { imageUrl: string; isLoading: boolean } {
  const fallback = existingImage || getDefaultCategoryImage(category);
  const cacheKey = performer.toLowerCase().trim();

  // Synchronous cache check
  const cachedUrl = imageCache.get(cacheKey);

  const [imageUrl, setImageUrl] = useState<string>(cachedUrl || fallback);
  const [isLoading, setIsLoading] = useState<boolean>(!cachedUrl);

  useEffect(() => {
    // If already cached, use it
    if (imageCache.has(cacheKey)) {
      setImageUrl(imageCache.get(cacheKey)!);
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      // Wait for DB cache to load first
      await loadDbCache();

      if (cancelled) return;

      // Check again after DB cache loaded
      if (imageCache.has(cacheKey)) {
        setImageUrl(imageCache.get(cacheKey)!);
        setIsLoading(false);
        return;
      }

      // Schedule batch fetch from Ticketmaster
      const url = await scheduleBatchFetch(performer);
      if (!cancelled) {
        if (url) setImageUrl(url);
        setIsLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [performer, cacheKey]);

  return { imageUrl, isLoading };
}
