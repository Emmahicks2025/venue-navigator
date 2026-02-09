import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

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

// ── Global image cache ──────────────────────────────────────────────

const imageCache = new Map<string, string>();
let dbCacheLoaded = false;
let dbCachePromise: Promise<void> | null = null;

// Load ALL cached images from Firestore at once (runs once per session)
async function loadDbCache(): Promise<void> {
  if (dbCacheLoaded) return;
  if (dbCachePromise) return dbCachePromise;

  dbCachePromise = (async () => {
    try {
      const snapshot = await getDocs(collection(db, 'performer_images'));
      for (const doc of snapshot.docs) {
        const data = doc.data();
        imageCache.set(data.performer_name.toLowerCase(), data.image_url);
      }
      console.log(`[ImageCache] Loaded ${snapshot.docs.length} cached performer images from Firestore`);
    } catch (err) {
      console.error('[ImageCache] Failed to load DB cache:', err);
    } finally {
      dbCacheLoaded = true;
      dbCachePromise = null;
    }
  })();

  return dbCachePromise;
}

// ── Hook ────────────────────────────────────────────────────────────

export function useTicketmasterImage(
  performer: string,
  existingImage: string | undefined,
  category: string
): { imageUrl: string; isLoading: boolean } {
  const fallback = existingImage || getDefaultCategoryImage(category);
  const cacheKey = performer?.toLowerCase().trim() || '';

  const cachedUrl = cacheKey ? imageCache.get(cacheKey) : undefined;

  const [imageUrl, setImageUrl] = useState<string>(cachedUrl || fallback);
  const [isLoading, setIsLoading] = useState<boolean>(!!cacheKey && !cachedUrl);

  useEffect(() => {
    if (!cacheKey) {
      setImageUrl(fallback);
      setIsLoading(false);
      return;
    }

    if (imageCache.has(cacheKey)) {
      setImageUrl(imageCache.get(cacheKey)!);
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      await loadDbCache();

      if (cancelled) return;

      if (imageCache.has(cacheKey)) {
        setImageUrl(imageCache.get(cacheKey)!);
      }
      setIsLoading(false);
    })();

    return () => { cancelled = true; };
  }, [performer, cacheKey, fallback]);

  return { imageUrl, isLoading };
}
